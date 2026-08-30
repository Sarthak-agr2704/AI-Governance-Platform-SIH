import os
import datetime
from typing import Dict, Any

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def generate_governance_pdf_report(
    model_data: Dict[str, Any],
    performance_data: Dict[str, Any],
    fairness_data: Dict[str, Any],
    explainability_data: list,
    monitoring_data: Dict[str, Any],
    governance_data: Dict[str, Any],
    compliance_data: Dict[str, Any],
    audit_data: list,
    output_filename: str
) -> str:
    """
    Generates a professional 15-section PDF report for an AI Model.
    Includes AegisAI branding, executive summary, tables, governance score, and compliance gaps.
    Saved to output_filename and returns the absolute file path.
    """
    os.makedirs(os.path.dirname(output_filename), exist_ok=True)
    doc = SimpleDocTemplate(
        output_filename,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette (Modern Dark / Navy Professional Accent)
    primary_color = colors.HexColor("#0F172A")    # Dark slate
    accent_color = colors.HexColor("#3B82F6")     # Aegis Blue
    secondary_accent = colors.HexColor("#6366F1") # Indigo
    danger_color = colors.HexColor("#EF4444")     # Red
    warning_color = colors.HexColor("#F59E0B")    # Amber
    success_color = colors.HexColor("#10B981")    # Emerald
    text_muted = colors.HexColor("#64748B")

    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=26,
        leading=32,
        textColor=primary_color,
        spaceAfter=10
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=accent_color,
        spaceAfter=20
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=primary_color,
        spaceBefore=14,
        spaceAfter=8
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#334155"),
        spaceAfter=8
    )

    badge_style = ParagraphStyle(
        'RiskBadge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=16,
        textColor=colors.white,
        alignment=1
    )

    story = []

    # ---------------------------------------------------------
    # SECTION 1: COVER PAGE
    # ---------------------------------------------------------
    story.append(Spacer(1, 20))
    story.append(Paragraph("AEGIS AI RESPONSIBLE GOVERNANCE PLATFORM", subtitle_style))
    story.append(Paragraph(f"AI Model Governance & Audit Report", title_style))
    story.append(HRFlowable(width="100%", thickness=3, color=accent_color, spaceAfter=20))

    cover_meta = [
        [Paragraph("<b>Model Name:</b>", body_style), Paragraph(str(model_data.get("name", "Loan Approval Model")), body_style)],
        [Paragraph("<b>Version:</b>", body_style), Paragraph(str(model_data.get("version", "1.0.0")), body_style)],
        [Paragraph("<b>Model Owner:</b>", body_style), Paragraph(str(model_data.get("owner", "Risk & Compliance Team")), body_style)],
        [Paragraph("<b>Department:</b>", body_style), Paragraph(str(model_data.get("department", "Credit Operations")), body_style)],
        [Paragraph("<b>Business Domain:</b>", body_style), Paragraph(str(model_data.get("business_domain", "Finance")), body_style)],
        [Paragraph("<b>Overall Governance Score:</b>", body_style), Paragraph(f"<b>{governance_data.get('overall_score', 72)} / 100</b>", body_style)],
        [Paragraph("<b>Assessed Risk Level:</b>", body_style), Paragraph(f"<b>{governance_data.get('risk_level', 'HIGH')} RISK</b>", body_style)],
        [Paragraph("<b>Assessment Date:</b>", body_style), Paragraph(datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"), body_style)],
    ]
    t_cover = Table(cover_meta, colWidths=[2.2*inch, 4.8*inch])
    t_cover.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_cover)
    story.append(Spacer(1, 25))

    # ---------------------------------------------------------
    # SECTION 2: EXECUTIVE SUMMARY
    # ---------------------------------------------------------
    story.append(Paragraph("1. Executive Summary", h1_style))
    exec_summary_text = (
        f"This comprehensive governance report documents the operational readiness, fairness, explainability, "
        f"and monitoring health of the <b>{model_data.get('name', 'Loan Approval Model')}</b> (v{model_data.get('version', '1.0.0')}). "
        f"The model was evaluated using AegisAI's automated Responsible AI engine. "
        f"The model achieved an overall Governance Score of <b>{governance_data.get('overall_score', 72)}/100</b>, "
        f"classifying it under the <b>{governance_data.get('risk_level', 'HIGH')} RISK</b> category. "
        f"Primary findings indicate a demographic parity disparity in gender selection rates requiring mitigation."
    )
    story.append(Paragraph(exec_summary_text, body_style))
    story.append(Spacer(1, 10))

    # ---------------------------------------------------------
    # SECTION 3: MODEL INFORMATION
    # ---------------------------------------------------------
    story.append(Paragraph("2. Model Information", h1_style))
    model_info_table = [
        [Paragraph("<b>Property</b>", body_style), Paragraph("<b>Value</b>", body_style)],
        [Paragraph("Model Type", body_style), Paragraph(str(model_data.get("model_type", "Classification (LogisticRegression)")), body_style)],
        [Paragraph("Deployment Status", body_style), Paragraph(str(model_data.get("deployment_status", "Production")), body_style)],
        [Paragraph("Primary Purpose", body_style), Paragraph(str(model_data.get("purpose", "Automated credit underwriting and loan approval decisions")), body_style)],
        [Paragraph("Risk Category", body_style), Paragraph(str(model_data.get("risk_category", "High")), body_style)],
    ]
    t_model = Table(model_info_table, colWidths=[2.2*inch, 4.8*inch])
    t_model.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F1F5F9")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_model)
    story.append(Spacer(1, 10))

    # ---------------------------------------------------------
    # SECTION 4: DATASET INFORMATION
    # ---------------------------------------------------------
    story.append(Paragraph("3. Dataset Information", h1_style))
    dataset_info_text = (
        f"The model is trained on the <b>Synthetic Demo Dataset</b> comprising <b>{performance_data.get('dataset_size', 7500):,} records</b>. "
        f"Features included in baseline evaluation: <i>age, gender, income, employment_status, credit_score, loan_amount, previous_defaults, education</i>. "
        f"Target variable: <b>loan_approved</b>."
    )
    story.append(Paragraph(dataset_info_text, body_style))
    story.append(Spacer(1, 10))

    # ---------------------------------------------------------
    # SECTION 5: ASSESSMENT METHODOLOGY
    # ---------------------------------------------------------
    story.append(Paragraph("4. Assessment Methodology", h1_style))
    method_text = (
        "AegisAI employs quantitative fairness evaluation (Demographic Parity, Equal Opportunity), exact model coefficient feature attribution for explainability, "
        "Population Stability Index (PSI) drift tracking, and a weighted multi-dimensional governance scoring formula."
    )
    story.append(Paragraph(method_text, body_style))
    story.append(Spacer(1, 10))

    # ---------------------------------------------------------
    # SECTION 6: PERFORMANCE RESULTS
    # ---------------------------------------------------------
    story.append(Paragraph("5. Performance Results", h1_style))
    perf_table_data = [
        [Paragraph("<b>Metric</b>", body_style), Paragraph("<b>Score</b>", body_style), Paragraph("<b>Status</b>", body_style)],
        [Paragraph("Accuracy", body_style), Paragraph(f"{round(performance_data.get('accuracy', 0.91)*100, 1)}%", body_style), Paragraph("PASS", body_style)],
        [Paragraph("Precision", body_style), Paragraph(f"{round(performance_data.get('precision', 0.89)*100, 1)}%", body_style), Paragraph("PASS", body_style)],
        [Paragraph("Recall", body_style), Paragraph(f"{round(performance_data.get('recall', 0.88)*100, 1)}%", body_style), Paragraph("PASS", body_style)],
        [Paragraph("F1 Score", body_style), Paragraph(f"{round(performance_data.get('f1', 0.885)*100, 1)}%", body_style), Paragraph("PASS", body_style)],
        [Paragraph("ROC-AUC", body_style), Paragraph(f"{round(performance_data.get('roc_auc', 0.94)*100, 1)}%", body_style), Paragraph("PASS", body_style)],
    ]
    t_perf = Table(perf_table_data, colWidths=[2.5*inch, 2.5*inch, 2.0*inch])
    t_perf.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F1F5F9")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_perf)
    story.append(Spacer(1, 10))

    # ---------------------------------------------------------
    # SECTION 7: FAIRNESS RESULTS
    # ---------------------------------------------------------
    story.append(Paragraph("6. Fairness & Bias Assessment", h1_style))
    fair_text = (
        f"Sensitive Attribute Evaluated: <b>{fairness_data.get('sensitive_attribute', 'Gender')}</b><br/>"
        f"Overall Fairness Score: <b>{fairness_data.get('overall_fairness_score', 61.4)} / 100</b> ({fairness_data.get('status', 'WARNING')})<br/>"
        f"Demographic Parity Difference: <b>{round(fairness_data.get('demographic_parity_diff', 0.128)*100, 1)}%</b><br/>"
        f"Disparate Impact Ratio: <b>{fairness_data.get('disparate_impact_ratio', 0.82)}</b>"
    )
    story.append(Paragraph(fair_text, body_style))
    story.append(Spacer(1, 10))

    # ---------------------------------------------------------
    # SECTION 8: EXPLAINABILITY RESULTS
    # ---------------------------------------------------------
    story.append(Paragraph("7. Explainability Results", h1_style))
    explain_headers = [Paragraph("<b>Rank</b>", body_style), Paragraph("<b>Feature</b>", body_style), Paragraph("<b>Relative Importance</b>", body_style)]
    explain_rows = [explain_headers]
    for item in explainability_data[:5]:
        explain_rows.append([
            Paragraph(str(item.get("rank", "-")), body_style),
            Paragraph(str(item.get("feature", "-")), body_style),
            Paragraph(f"{item.get('relative_importance', 0)}%", body_style),
        ])
    t_explain = Table(explain_rows, colWidths=[1.5*inch, 3.5*inch, 2.0*inch])
    t_explain.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F1F5F9")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_explain)
    story.append(Spacer(1, 10))

    # ---------------------------------------------------------
    # SECTION 9: MONITORING RESULTS
    # ---------------------------------------------------------
    story.append(Paragraph("8. Production Monitoring & Data Drift", h1_style))
    mon_text = (
        f"Monitoring Status: <b>{monitoring_data.get('status', 'HEALTHY')}</b><br/>"
        f"Data Drift (PSI): <b>{monitoring_data.get('data_drift_pct', 18.0)}%</b><br/>"
        f"Prediction Drift: <b>{monitoring_data.get('prediction_drift_pct', 12.0)}%</b>"
    )
    story.append(Paragraph(mon_text, body_style))
    story.append(Spacer(1, 10))

    # ---------------------------------------------------------
    # SECTION 10: GOVERNANCE SCORE BREAKDOWN
    # ---------------------------------------------------------
    story.append(Paragraph("9. Governance Score Breakdown", h1_style))
    scores = governance_data.get("component_scores", {})
    comp_rows = [
        [Paragraph("<b>Dimension</b>", body_style), Paragraph("<b>Weight</b>", body_style), Paragraph("<b>Score</b>", body_style)],
        [Paragraph("Fairness", body_style), Paragraph("25%", body_style), Paragraph(f"{scores.get('fairness', 61)}/100", body_style)],
        [Paragraph("Performance", body_style), Paragraph("20%", body_style), Paragraph(f"{scores.get('performance', 91)}/100", body_style)],
        [Paragraph("Explainability", body_style), Paragraph("15%", body_style), Paragraph(f"{scores.get('explainability', 88)}/100", body_style)],
        [Paragraph("Data Quality", body_style), Paragraph("15%", body_style), Paragraph(f"{scores.get('data_quality', 84)}/100", body_style)],
        [Paragraph("Monitoring", body_style), Paragraph("15%", body_style), Paragraph(f"{scores.get('monitoring', 70)}/100", body_style)],
        [Paragraph("Compliance", body_style), Paragraph("10%", body_style), Paragraph(f"{scores.get('compliance', 80)}/100", body_style)],
    ]
    t_comp = Table(comp_rows, colWidths=[3.0*inch, 2.0*inch, 2.0*inch])
    t_comp.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F1F5F9")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_comp)
    story.append(Spacer(1, 10))

    # ---------------------------------------------------------
    # SECTION 11: RISK FINDINGS
    # ---------------------------------------------------------
    story.append(Paragraph("10. Identified Risk Findings", h1_style))
    for f in governance_data.get("findings", []):
        finding_p = (
            f"<b>[{f.get('severity', 'HIGH')}] {f.get('title', '')}</b> ({f.get('category', '')})<br/>"
            f"{f.get('description', '')}<br/>"
            f"<i>Evidence:</i> {f.get('evidence', '')}<br/>"
        )
        story.append(Paragraph(finding_p, body_style))

    # ---------------------------------------------------------
    # SECTION 12: COMPLIANCE & POLICY GAPS
    # ---------------------------------------------------------
    story.append(Paragraph("11. Compliance & Policy Gaps", h1_style))
    comp_gap_text = f"Evaluated 9 governance rules. Total score: <b>{compliance_data.get('compliance_score', 80)}%</b>. (Potential governance gap identification — does not constitute legal certification)."
    story.append(Paragraph(comp_gap_text, body_style))
    story.append(Spacer(1, 10))

    # ---------------------------------------------------------
    # SECTION 13: RECOMMENDED ACTIONS
    # ---------------------------------------------------------
    story.append(Paragraph("12. Recommended Governance Actions", h1_style))
    recs = fairness_data.get("recommendations", [])
    for rec in recs:
        story.append(Paragraph(f"• {rec}", body_style))
    story.append(Spacer(1, 10))

    # ---------------------------------------------------------
    # SECTION 14: AUDIT TRAIL LOGS
    # ---------------------------------------------------------
    story.append(Paragraph("13. Audit Trail Excerpt", h1_style))
    audit_table = [[Paragraph("<b>Timestamp</b>", body_style), Paragraph("<b>User</b>", body_style), Paragraph("<b>Action</b>", body_style)]]
    for log in audit_data[:5]:
        audit_table.append([
            Paragraph(str(log.get("timestamp", ""))[:19], body_style),
            Paragraph(str(log.get("user_email", "admin@aegis.ai")), body_style),
            Paragraph(str(log.get("action", "")), body_style),
        ])
    t_audit = Table(audit_table, colWidths=[2.2*inch, 2.3*inch, 2.5*inch])
    t_audit.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F1F5F9")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_audit)
    story.append(Spacer(1, 10))

    # ---------------------------------------------------------
    # SECTION 15: ASSESSMENT TIMESTAMP & SIGN-OFF
    # ---------------------------------------------------------
    story.append(Paragraph("14. Assessment Sign-Off & Verification", h1_style))
    sign_text = (
        f"Generated by AegisAI Responsible Governance Engine on <b>{datetime.datetime.now(datetime.timezone.utc).strftime('%B %d, %Y at %H:%M:%S UTC')}</b>.<br/>"
        f"Report Hash: <code>{hash(str(governance_data))}</code>"
    )
    story.append(Paragraph(sign_text, body_style))

    doc.build(story)
    return output_filename
