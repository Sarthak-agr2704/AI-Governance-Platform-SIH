import numpy as np
import pandas as pd
from typing import Dict, Any, List
from app.ml.trainer import load_trained_model, DATASET_PATH, NUMERICAL_FEATURES, CATEGORICAL_FEATURES

def get_global_explainability() -> List[Dict[str, Any]]:
    """
    Calculates global feature importance rankings from actual model coefficients.
    Returns ranked features: Credit Score, Income, Loan Amount, Previous Defaults, Age, Employment, Education.
    """
    pipeline, _ = load_trained_model()
    classifier = pipeline.named_steps["classifier"]
    preprocessor = pipeline.named_steps["preprocessor"]

    # Get feature names from OneHotEncoder transformer
    cat_encoder = preprocessor.named_transformers_["cat"]
    cat_feature_names = list(cat_encoder.get_feature_names_out(CATEGORICAL_FEATURES))
    all_feature_names = NUMERICAL_FEATURES + cat_feature_names

    coefficients = classifier.coef_[0]

    # Aggregate one-hot encoded categories back to original base features
    feature_weights = {
        "Credit Score": abs(float(coefficients[NUMERICAL_FEATURES.index("credit_score")])),
        "Income": abs(float(coefficients[NUMERICAL_FEATURES.index("income")])),
        "Loan Amount": abs(float(coefficients[NUMERICAL_FEATURES.index("loan_amount")])),
        "Previous Defaults": abs(float(coefficients[NUMERICAL_FEATURES.index("previous_defaults")])),
        "Age": abs(float(coefficients[NUMERICAL_FEATURES.index("age")])),
    }

    # Aggregate employment features
    emp_indices = [i for i, name in enumerate(cat_feature_names) if name.startswith("employment_status")]
    emp_weight = np.mean([abs(coefficients[len(NUMERICAL_FEATURES) + i]) for i in emp_indices]) if emp_indices else 0.5
    feature_weights["Employment"] = float(emp_weight)

    # Aggregate education features
    edu_indices = [i for i, name in enumerate(cat_feature_names) if name.startswith("education")]
    edu_weight = np.mean([abs(coefficients[len(NUMERICAL_FEATURES) + i]) for i in edu_indices]) if edu_indices else 0.3
    feature_weights["Education"] = float(edu_weight)

    # Sort descending by importance score
    sorted_features = sorted(feature_weights.items(), key=lambda x: x[1], reverse=True)

    max_weight = sorted_features[0][1] if sorted_features else 1.0
    result = []
    for rank, (name, weight) in enumerate(sorted_features, 1):
        relative_importance = round((weight / max_weight) * 100, 1)
        result.append({
            "rank": rank,
            "feature": name,
            "importance_score": round(weight, 4),
            "relative_importance": relative_importance,
        })

    return result


def predict_and_explain_sample(sample_input: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generates local feature attribution & confidence percentage for an individual applicant.
    Calculates exact mathematical contribution scores (coef * z_score).
    Generates plain-language summary strictly from top calculated contributions.
    """
    pipeline, _ = load_trained_model()
    classifier = pipeline.named_steps["classifier"]
    preprocessor = pipeline.named_steps["preprocessor"]

    sample_df = pd.DataFrame([sample_input])
    
    # Predict probabilities
    probabilities = pipeline.predict_proba(sample_df)[0]
    approved_prob = float(probabilities[1])
    rejected_prob = float(probabilities[0])

    prediction_label = "Approved" if approved_prob >= 0.5 else "Rejected"
    confidence = round((approved_prob if approved_prob >= 0.5 else rejected_prob) * 100, 1)

    # Calculate transformed feature vector z
    X_transformed = preprocessor.transform(sample_df)[0]
    coefficients = classifier.coef_[0]

    # Contributions = coefficient * transformed feature value
    contributions = X_transformed * coefficients

    cat_encoder = preprocessor.named_transformers_["cat"]
    cat_feature_names = list(cat_encoder.get_feature_names_out(CATEGORICAL_FEATURES))
    
    # Aggregate into human-readable feature groups
    group_contributions = {}
    
    # Numeric
    group_contributions["Credit Score"] = float(contributions[NUMERICAL_FEATURES.index("credit_score")])
    group_contributions["Income"] = float(contributions[NUMERICAL_FEATURES.index("income")])
    group_contributions["Loan Amount"] = float(contributions[NUMERICAL_FEATURES.index("loan_amount")])
    group_contributions["Previous Defaults"] = float(contributions[NUMERICAL_FEATURES.index("previous_defaults")])
    group_contributions["Age"] = float(contributions[NUMERICAL_FEATURES.index("age")])

    # Employment
    emp_indices = [i for i, name in enumerate(cat_feature_names) if name.startswith("employment_status")]
    group_contributions["Employment"] = sum([float(contributions[len(NUMERICAL_FEATURES) + i]) for i in emp_indices])

    # Education
    edu_indices = [i for i, name in enumerate(cat_feature_names) if name.startswith("education")]
    group_contributions["Education"] = sum([float(contributions[len(NUMERICAL_FEATURES) + i]) for i in edu_indices])

    formatted_factors = []
    for feat_name, contrib in group_contributions.items():
        formatted_factors.append({
            "feature": feat_name,
            "contribution": round(contrib, 2),
            "direction": "Positive" if contrib >= 0 else "Negative",
            "impact": "Increases Approval" if contrib >= 0 else "Decreases Approval"
        })

    # Sort factors by magnitude
    formatted_factors.sort(key=lambda x: abs(x["contribution"]), reverse=True)

    # Plain-language explanation generator strictly from top factors
    top_positives = [f["feature"].lower() for f in formatted_factors if f["contribution"] > 0][:2]
    top_negatives = [f["feature"].lower() for f in formatted_factors if f["contribution"] < 0][:2]

    if prediction_label == "Approved":
        pos_str = " and ".join(top_positives) if top_positives else "overall credit profile"
        explanation = f"The prediction was primarily influenced by the applicant's favorable {pos_str}."
    else:
        neg_str = " and ".join(top_negatives) if top_negatives else "loan application risk factors"
        explanation = f"The prediction was primarily influenced by the applicant's {neg_str}."

    return {
        "prediction": prediction_label,
        "confidence": confidence,
        "approval_probability": round(approved_prob, 4),
        "rejection_probability": round(rejected_prob, 4),
        "factors": formatted_factors,
        "explanation": explanation,
        "input_sample": sample_input
    }
