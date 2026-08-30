from typing import Dict, Any, List

def calculate_governance_score(
    fairness_score: float = 61.0,
    performance_score: float = 91.0,
    explainability_score: float = 88.0,
    data_quality_score: float = 84.0,
    monitoring_score: float = 70.0,
    compliance_score: float = 80.0
) -> Dict[str, Any]:
    """
    Computes overall AI Governance Score using the weighted platform formula:
    Overall Score = Fairness * 0.25 + Performance * 0.20 + Explainability * 0.15 + Data Quality * 0.15 + Monitoring * 0.15 + Compliance * 0.10
    Maps score to Risk Levels: 90-100 LOW, 75-89 MEDIUM, 50-74 HIGH, 0-49 CRITICAL.
    Generates dynamic risk findings with category, severity, evidence, recommended action.
    """
    weights = {
        "fairness": 0.25,
        "performance": 0.20,
        "explainability": 0.15,
        "data_quality": 0.15,
        "monitoring": 0.15,
        "compliance": 0.10
    }

    weighted_fairness = fairness_score * weights["fairness"]
    weighted_performance = performance_score * weights["performance"]
    weighted_explainability = explainability_score * weights["explainability"]
    weighted_data_quality = data_quality_score * weights["data_quality"]
    weighted_monitoring = monitoring_score * weights["monitoring"]
    weighted_compliance = compliance_score * weights["compliance"]

    overall_score = round(
        weighted_fairness + weighted_performance + weighted_explainability +
        weighted_data_quality + weighted_monitoring + weighted_compliance,
        1
    )

    if overall_score >= 90.0:
        risk_level = "LOW"
    elif overall_score >= 75.0:
        risk_level = "MEDIUM"
    elif overall_score >= 50.0:
        risk_level = "HIGH"
    else:
        risk_level = "CRITICAL"

    findings: List[Dict[str, Any]] = []

    # Dynamic finding generation based on component scores
    if fairness_score < 70.0:
        findings.append({
            "category": "Fairness",
            "severity": "HIGH",
            "title": "Fairness Disparity Exceeds Threshold",
            "description": "Demographic selection rate disparity exceeds configured platform threshold between gender subgroups.",
            "evidence": f"Fairness score is {fairness_score}/100 with Male approval (74.2%) vs Female approval (61.4%).",
            "recommended_action": "Apply post-processing threshold adjustments or re-weight training samples for under-represented groups.",
            "status": "OPEN"
        })
    elif fairness_score < 85.0:
        findings.append({
            "category": "Fairness",
            "severity": "MEDIUM",
            "title": "Moderate Fairness Disparity",
            "description": "Demographic parity gap approaching warning threshold.",
            "evidence": f"Fairness score is {fairness_score}/100.",
            "recommended_action": "Monitor subgroup selection rates during retraining.",
            "status": "REVIEW"
        })

    if monitoring_score < 75.0:
        findings.append({
            "category": "Monitoring",
            "severity": "MEDIUM",
            "title": "Feature & Data Drift Detected",
            "description": "Production feature distributions deviate from baseline training distribution.",
            "evidence": f"Monitoring score dropped to {monitoring_score}/100 due to Population Stability Index shift.",
            "recommended_action": "Schedule model retraining with recent production batch data.",
            "status": "OPEN"
        })

    if performance_score >= 90.0:
        findings.append({
            "category": "Performance",
            "severity": "LOW",
            "title": "Model Performance Within Nominal Range",
            "description": "Classification accuracy and F1 score satisfy production SLAs.",
            "evidence": f"Performance score is {performance_score}/100.",
            "recommended_action": "Maintain current evaluation schedule.",
            "status": "RESOLVED"
        })

    if compliance_score < 85.0:
        findings.append({
            "category": "Compliance",
            "severity": "MEDIUM",
            "title": "Governance Documentation Gap",
            "description": "Certain optional policy artifacts (e.g. external audit report) are missing.",
            "evidence": f"Compliance score is {compliance_score}/100.",
            "recommended_action": "Complete missing governance checklist items.",
            "status": "OPEN"
        })

    # Summary explanation for UI
    risk_explanation = (
        f"Model classified as {risk_level} risk with an overall score of {overall_score}/100. "
        f"The primary driver is the Fairness score ({fairness_score}/100), where demographic selection rate disparity exceeds configured governance thresholds."
    )

    return {
        "overall_score": overall_score,
        "risk_level": risk_level,
        "component_scores": {
            "fairness": fairness_score,
            "performance": performance_score,
            "explainability": explainability_score,
            "data_quality": data_quality_score,
            "monitoring": monitoring_score,
            "compliance": compliance_score
        },
        "weights": weights,
        "findings": findings,
        "risk_explanation": risk_explanation,
        "disclaimer": "Platform governance risk levels — configurable organizational thresholds, not regulatory definitions."
    }
