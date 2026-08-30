import pandas as pd
import numpy as np
from typing import Dict, Any
from sklearn.metrics import confusion_matrix
from app.ml.trainer import load_trained_model, DATASET_PATH

def compute_fairness_analysis(sensitive_attribute: str = "Gender", warning_threshold: float = 0.10, critical_threshold: float = 0.20) -> Dict[str, Any]:
    """
    Computes real bias and fairness metrics for the Loan Approval Model using actual dataset predictions.
    Supported sensitive attributes: Gender, Age Group.
    """
    pipeline, _ = load_trained_model()
    df = pd.read_csv(DATASET_PATH)

    # Derive Age Group column if analyzing Age Group
    if sensitive_attribute == "Age Group":
        df["group"] = pd.cut(df["age"], bins=[0, 30, 50, 100], labels=["Under 30", "30-50", "Over 50"])
    else:
        df["group"] = df["gender"]

    X = df[["age", "gender", "income", "employment_status", "credit_score", "loan_amount", "previous_defaults", "education"]]
    y_true = df["loan_approved"].values
    y_pred = pipeline.predict(X)

    df["y_pred"] = y_pred

    groups = df["group"].dropna().unique().tolist()
    groups.sort()

    group_metrics = {}
    selection_rates = {}
    tprs = {}
    fprs = {}
    fnrs = {}

    for g in groups:
        sub_df = df[df["group"] == g]
        if len(sub_df) == 0:
            continue
        
        g_y_true = sub_df["loan_approved"].values
        g_y_pred = sub_df["y_pred"].values

        total_count = len(sub_df)
        approved_count = int(np.sum(g_y_pred == 1))
        selection_rate = approved_count / total_count if total_count > 0 else 0.0

        tn, fp, fn, tp = confusion_matrix(g_y_true, g_y_pred, labels=[0, 1]).ravel()

        tpr = tp / (tp + fn) if (tp + fn) > 0 else 0.0
        fpr = fp / (fp + tn) if (fp + tn) > 0 else 0.0
        fnr = fn / (fn + tp) if (fn + tp) > 0 else 0.0

        selection_rates[str(g)] = round(float(selection_rate), 4)
        tprs[str(g)] = round(float(tpr), 4)
        fprs[str(g)] = round(float(fpr), 4)
        fnrs[str(g)] = round(float(fnr), 4)

        group_metrics[str(g)] = {
            "total_count": total_count,
            "approved_count": approved_count,
            "selection_rate": round(float(selection_rate), 4),
            "selection_rate_pct": f"{round(selection_rate * 100, 1)}%",
            "true_positive_rate": round(float(tpr), 4),
            "false_positive_rate": round(float(fpr), 4),
            "false_negative_rate": round(float(fnr), 4),
        }

    rates_list = list(selection_rates.values())
    tpr_list = list(tprs.values())
    fpr_list = list(fprs.values())

    max_sel = max(rates_list) if rates_list else 1.0
    min_sel = min(rates_list) if rates_list else 0.0
    demographic_parity_diff = max_sel - min_sel
    disparate_impact_ratio = (min_sel / max_sel) if max_sel > 0 else 1.0

    max_tpr = max(tpr_list) if tpr_list else 1.0
    min_tpr = min(tpr_list) if tpr_list else 0.0
    equal_opportunity_diff = max_tpr - min_tpr

    max_fpr = max(fpr_list) if fpr_list else 0.0
    min_fpr = min(fpr_list) if fpr_list else 0.0
    fpr_diff = max_fpr - min_fpr

    # Transparent 0 - 100 Fairness Score formula:
    # Baseline = 100 - (DemographicParityDiff * 50 + EqualOpportunityDiff * 50) * 100
    raw_penalty = (demographic_parity_diff * 0.55 + equal_opportunity_diff * 0.45) * 100.0
    overall_fairness_score = round(max(0.0, min(100.0, 100.0 - raw_penalty)), 1)

    # Status Determination
    if demographic_parity_diff >= critical_threshold or overall_fairness_score < 70:
        status = "FAIL"
    elif demographic_parity_diff >= warning_threshold or overall_fairness_score < 85:
        status = "WARNING"
    else:
        status = "PASS"

    # Rule-Based Recommendation Engine based on actual calculations
    recommendations = []
    
    if demographic_parity_diff >= critical_threshold:
        recommendations.append(
            f"CRITICAL DISPARITY: Demographic Parity Difference is {round(demographic_parity_diff * 100, 1)}%, exceeding the configurable governance threshold ({round(critical_threshold * 100)}%). Investigate demographic imbalance and evaluate fairness mitigation techniques such as threshold optimization or reweighting."
        )
    elif demographic_parity_diff >= warning_threshold:
        recommendations.append(
            f"MODERATE DISPARITY: Demographic Parity Difference is {round(demographic_parity_diff * 100, 1)}%, approaching the warning threshold ({round(warning_threshold * 100)}%). Monitor demographic representation in retraining datasets."
        )
    else:
        recommendations.append("Demographic selection rates are balanced within acceptable platform thresholds.")

    if fpr_diff >= 0.08:
        recommendations.append(
            f"FALSE POSITIVE DISPARITY: False Positive Rate differs by {round(fpr_diff * 100, 1)}% across groups. Investigate whether one group is disproportionately receiving false positive predictions."
        )

    if equal_opportunity_diff >= 0.10:
        recommendations.append(
            f"EQUAL OPPORTUNITY GAP: True Positive Rate gap is {round(equal_opportunity_diff * 100, 1)}%. Qualified applicants from lower-performing subgroups face lower approval odds."
        )

    explanation = (
        f"Fairness evaluation conducted on attribute '{sensitive_attribute}' across {len(groups)} subgroups. "
        f"Overall Fairness Score is {overall_fairness_score}/100. "
        f"Demographic Parity Difference is {round(demographic_parity_diff * 100, 1)}% and Disparate Impact Ratio is {round(disparate_impact_ratio, 2)}."
    )

    return {
        "sensitive_attribute": sensitive_attribute,
        "overall_fairness_score": overall_fairness_score,
        "status": status,
        "demographic_parity_diff": round(float(demographic_parity_diff), 4),
        "disparate_impact_ratio": round(float(disparate_impact_ratio), 4),
        "equal_opportunity_diff": round(float(equal_opportunity_diff), 4),
        "warning_threshold": warning_threshold,
        "critical_threshold": critical_threshold,
        "group_metrics": group_metrics,
        "selection_rates": selection_rates,
        "true_positive_rates": tprs,
        "false_positive_rates": fprs,
        "false_negative_rates": fnrs,
        "recommendations": recommendations,
        "explanation": explanation,
        "disclaimer": "Configurable platform governance thresholds — not universal legal definitions."
    }
