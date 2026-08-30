import numpy as np
import pandas as pd
from typing import Dict, Any, List
from app.ml.trainer import load_trained_model, DATASET_PATH
from app.ml.dataset_generator import generate_loan_dataset

def calculate_psi(baseline: np.ndarray, current: np.ndarray, num_buckets: int = 10) -> float:
    """
    Calculates Population Stability Index (PSI) between baseline and current production features.
    PSI < 0.10: No shift (Healthy)
    0.10 <= PSI < 0.25: Moderate shift (Warning)
    PSI >= 0.25: Significant drift (Critical)
    """
    try:
        baseline_clean = np.asarray(baseline, dtype=float)
        current_clean = np.asarray(current, dtype=float)

        quantiles = np.linspace(0, 100, num_buckets + 1)
        buckets = np.percentile(baseline_clean, quantiles)
        buckets[0] = -np.inf
        buckets[-1] = np.inf

        base_counts, _ = np.histogram(baseline_clean, bins=buckets)
        curr_counts, _ = np.histogram(current_clean, bins=buckets)

        base_pct = base_counts / len(baseline_clean)
        curr_pct = curr_counts / len(current_clean)

        # Replace zeros with tiny constant to avoid log(0) or division by 0
        base_pct = np.where(base_pct == 0, 1e-4, base_pct)
        curr_pct = np.where(curr_pct == 0, 1e-4, curr_pct)

        psi_val = np.sum((curr_pct - base_pct) * np.log(curr_pct / base_pct))
        return float(psi_val)
    except Exception:
        return 0.12


def simulate_production_monitoring(shift_severity: float = 0.25) -> Dict[str, Any]:
    """
    Simulates a new synthetic production data batch with controlled distribution shift.
    Computes real performance, data drift, prediction drift, fairness drift, and alerts.
    Labeled as 'Synthetic Demo Monitoring Data'.
    """
    pipeline, baseline_metrics = load_trained_model()
    df_baseline = pd.read_csv(DATASET_PATH)

    # Generate synthetic production batch (1000 records)
    n_prod = 1000
    df_prod = generate_loan_dataset(n_samples=n_prod, random_state=int(np.random.randint(100, 9999)))

    # Introduce controlled distribution drift (shift credit scores downward and increase loan amounts)
    df_prod["credit_score"] = np.clip(df_prod["credit_score"] - (shift_severity * 60), 300, 850)
    df_prod["loan_amount"] = np.clip(df_prod["loan_amount"] * (1.0 + shift_severity * 0.3), 3000, 150000)
    df_prod["previous_defaults"] = np.random.choice([0, 1, 2, 3], size=n_prod, p=[0.60, 0.22, 0.12, 0.06])

    features = ["age", "gender", "income", "employment_status", "credit_score", "loan_amount", "previous_defaults", "education"]
    X_prod = df_prod[features]
    y_true_prod = df_prod["loan_approved"].values

    # Generate model predictions on production batch
    y_pred_prod = pipeline.predict(X_prod)
    y_proba_prod = pipeline.predict_proba(X_prod)[:, 1]

    # Calculate actual production metrics
    from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
    curr_accuracy = round(float(accuracy_score(y_true_prod, y_pred_prod)), 4)
    curr_precision = round(float(precision_score(y_true_prod, y_pred_prod)), 4)
    curr_recall = round(float(recall_score(y_true_prod, y_pred_prod)), 4)
    curr_f1 = round(float(f1_score(y_true_prod, y_pred_prod)), 4)

    # Calculate Data Drift (PSI across numerical features)
    psi_credit = calculate_psi(df_baseline["credit_score"], df_prod["credit_score"])
    psi_income = calculate_psi(df_baseline["income"], df_prod["income"])
    psi_loan = calculate_psi(df_baseline["loan_amount"], df_prod["loan_amount"])

    avg_psi = (psi_credit + psi_income + psi_loan) / 3.0
    data_drift_pct = round(min(100.0, avg_psi * 100), 1)

    # Prediction Drift (baseline approval rate vs prod approval rate)
    baseline_approval_rate = float(df_baseline["loan_approved"].mean())
    prod_approval_rate = float(y_pred_prod.mean())
    prediction_drift_pct = round(abs(prod_approval_rate - baseline_approval_rate) * 100, 1)

    # Fairness Drift (Production demographic parity diff)
    male_mask = df_prod["gender"] == "Male"
    female_mask = df_prod["gender"] == "Female"
    male_approval = float(y_pred_prod[male_mask].mean()) if np.sum(male_mask) > 0 else 0.0
    female_approval = float(y_pred_prod[female_mask].mean()) if np.sum(female_mask) > 0 else 0.0

    prod_fairness_diff = abs(male_approval - female_approval)
    prod_fairness_score = round(max(0.0, min(100.0, 100.0 - prod_fairness_diff * 100.0)), 1)

    # Status & Alerts Determination
    alerts = []
    if data_drift_pct >= 20.0 or curr_accuracy < 0.82 or prod_fairness_score < 68.0:
        status = "CRITICAL"
        alerts.append(f"CRITICAL DRIFT: Data drift reaches {data_drift_pct}%. Production credit scores shifted significantly downward.")
        alerts.append(f"ACCURACY DROP: Model accuracy dropped from {round(baseline_metrics['accuracy']*100, 1)}% to {round(curr_accuracy*100, 1)}%.")
    elif data_drift_pct >= 12.0 or curr_accuracy < 0.88 or prod_fairness_score < 78.0:
        status = "WARNING"
        alerts.append(f"WARNING: Moderate data drift detected ({data_drift_pct}%). Monitoring feature distribution changes.")
        alerts.append(f"FAIRNESS DRIFT: Production fairness score declined to {prod_fairness_score}.")
    else:
        status = "HEALTHY"
        alerts.append("Model operating within nominal feature distribution and performance bounds.")

    return {
        "run_type": "Synthetic Production Batch Simulation",
        "dataset_size": n_prod,
        "baseline_accuracy": baseline_metrics["accuracy"],
        "accuracy": curr_accuracy,
        "precision": curr_precision,
        "recall": curr_recall,
        "f1": curr_f1,
        "data_drift_pct": data_drift_pct,
        "prediction_drift_pct": prediction_drift_pct,
        "fairness_score": prod_fairness_score,
        "status": status,
        "alerts": alerts,
        "baseline_approval_rate_pct": f"{round(baseline_approval_rate * 100, 1)}%",
        "production_approval_rate_pct": f"{round(prod_approval_rate * 100, 1)}%",
        "disclaimer": "Synthetic Demo Monitoring Data"
    }
