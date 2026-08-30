import numpy as np
import pandas as pd
import os

def generate_loan_dataset(n_samples: int = 7500, random_state: int = 42) -> pd.DataFrame:
    """
    Generates a reproducible synthetic dataset for the Loan Approval Model.
    Dataset size: ~5,000–10,000 records.
    Features: age, gender, income, employment_status, credit_score, loan_amount, previous_defaults, education.
    Target: loan_approved (0 or 1).
    Clearly labeled as 'Synthetic Demo Dataset'.
    """
    np.random.seed(random_state)

    gender = np.random.choice(["Male", "Female"], size=n_samples, p=[0.52, 0.48])
    age = np.random.randint(21, 68, size=n_samples)
    
    # Income distribution (skewed right)
    income = np.random.lognormal(mean=10.6, sigma=0.5, size=n_samples)
    income = np.clip(income, 18000, 220000).round(-2)

    employment_status = np.random.choice(
        ["Employed", "Self-Employed", "Unemployed", "Retired"],
        size=n_samples,
        p=[0.70, 0.18, 0.07, 0.05]
    )

    credit_score = np.random.normal(loc=680, scale=85, size=n_samples)
    credit_score = np.clip(credit_score, 300, 850).round()

    loan_amount = np.random.lognormal(mean=9.8, sigma=0.6, size=n_samples)
    loan_amount = np.clip(loan_amount, 3000, 120000).round(-2)

    previous_defaults = np.random.choice(
        [0, 1, 2, 3, 4],
        size=n_samples,
        p=[0.75, 0.15, 0.06, 0.03, 0.01]
    )

    education = np.random.choice(
        ["High School", "Bachelor", "Master", "PhD"],
        size=n_samples,
        p=[0.30, 0.48, 0.17, 0.05]
    )

    # Realistic relationship equation for loan approval
    # Credit score, income, employment, education raise probability
    # Previous defaults, high loan amount relative to income lower probability
    
    norm_credit = (credit_score - 300) / 550.0  # 0 to 1
    norm_income = (income - 18000) / 202000.0   # 0 to 1
    debt_to_income = loan_amount / (income + 1e-5)

    emp_weight = np.where(employment_status == "Employed", 0.6, 
                 np.where(employment_status == "Self-Employed", 0.3,
                 np.where(employment_status == "Retired", 0.1, -0.8)))
    
    edu_weight = np.where(education == "PhD", 0.3,
                 np.where(education == "Master", 0.2,
                 np.where(education == "Bachelor", 0.1, 0.0)))
    
    # Controlled subtle demographic shift for fairness evaluation (Male slightly higher baseline credit/history representation)
    gender_bias = np.where(gender == "Male", 0.25, -0.15)
    
    logits = (
        2.2 * norm_credit +
        1.8 * norm_income -
        1.5 * np.clip(debt_to_income, 0, 3) -
        1.4 * previous_defaults +
        1.0 * emp_weight +
        0.5 * edu_weight +
        gender_bias - 0.4
    )

    prob = 1.0 / (1.0 + np.exp(-logits))
    loan_approved = (prob >= 0.5).astype(int)

    df = pd.DataFrame({
        "age": age,
        "gender": gender,
        "income": income,
        "employment_status": employment_status,
        "credit_score": credit_score,
        "loan_amount": loan_amount,
        "previous_defaults": previous_defaults,
        "education": education,
        "loan_approved": loan_approved
    })

    return df

def save_demo_dataset(df: pd.DataFrame, file_path: str):
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    df.to_csv(file_path, index=False)
