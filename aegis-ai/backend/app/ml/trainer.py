import os
import datetime
import joblib
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

from app.ml.dataset_generator import generate_loan_dataset, save_demo_dataset

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data"))
MODEL_PATH = os.path.join(DATA_DIR, "models", "loan_approval_model.joblib")
DATASET_PATH = os.path.join(DATA_DIR, "datasets", "loan_approval_dataset.csv")

NUMERICAL_FEATURES = ["age", "income", "credit_score", "loan_amount", "previous_defaults"]
CATEGORICAL_FEATURES = ["gender", "employment_status", "education"]
ALL_FEATURES = NUMERICAL_FEATURES + CATEGORICAL_FEATURES
TARGET = "loan_approved"


def train_loan_approval_model():
    """
    Trains the scikit-learn LogisticRegression model for Loan Approval.
    Calculates dynamic metrics (Accuracy, Precision, Recall, F1, ROC-AUC) without hardcoding.
    Saves trained pipeline safely.
    """
    os.makedirs(os.path.join(DATA_DIR, "models"), exist_ok=True)
    os.makedirs(os.path.join(DATA_DIR, "datasets"), exist_ok=True)

    if not os.path.exists(DATASET_PATH):
        df = generate_loan_dataset(n_samples=7500, random_state=42)
        save_demo_dataset(df, DATASET_PATH)
    else:
        df = pd.read_csv(DATASET_PATH)

    X = df[ALL_FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), NUMERICAL_FEATURES),
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), CATEGORICAL_FEATURES),
        ]
    )

    pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("classifier", LogisticRegression(random_state=42, max_iter=1000, C=1.0)),
        ]
    )

    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)
    y_proba = pipeline.predict_proba(X_test)[:, 1]

    metrics = {
        "accuracy": round(float(accuracy_score(y_test, y_pred)), 4),
        "precision": round(float(precision_score(y_test, y_pred)), 4),
        "recall": round(float(recall_score(y_test, y_pred)), 4),
        "f1": round(float(f1_score(y_test, y_pred)), 4),
        "roc_auc": round(float(roc_auc_score(y_test, y_proba)), 4),
        "dataset_size": len(df),
        "test_size": len(y_test),
        "training_timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "model_type": "LogisticRegression",
        "features": ALL_FEATURES,
        "target": TARGET
    }

    joblib.dump({"pipeline": pipeline, "metrics": metrics, "dataset_path": DATASET_PATH}, MODEL_PATH)

    return metrics, pipeline, df


def load_trained_model():
    """
    Loads the trained model pipeline and metrics from disk.
    If model file does not exist, triggers training automatically.
    """
    if not os.path.exists(MODEL_PATH):
        metrics, pipeline, _ = train_loan_approval_model()
        return pipeline, metrics
    
    saved_data = joblib.load(MODEL_PATH)
    return saved_data["pipeline"], saved_data["metrics"]
