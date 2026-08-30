# AegisAI — SIH Live Demonstration Guide

This guide provides an exact 3–5 minute step-by-step presentation script and technical architecture rationale for presenting **AegisAI** to Smart India Hackathon (SIH) judges and evaluation stakeholders.

---

## ⏱️ 3–5 Minute Judge Presentation Script

### Step 1: Problem Introduction (30 seconds)
> **Presenter:** "Respected Judges, as AI models automate high-stakes decisions like credit underwriting, healthcare, and hiring, organizations face critical risks regarding hidden demographic bias, unexpected data drift, and lack of transparency. AegisAI is an end-to-end Responsible AI Governance Platform that automates model risk management, quantitative fairness testing, explainability, drift detection, and compliance auditing."

---

### Step 2: Open Dashboard & Model Inventory (30 seconds)
1. Log into AegisAI using `admin@aegis.ai` / `DemoPass123!`.
2. Show the Executive Dashboard displaying:
   - Total Registered Models
   - Monitored Models
   - High Risk Models
   - Average Governance Score (72/100)
3. Navigate to **Model Registry** (`/models`) and highlight the built-in **Loan Approval Model** (v1.0.0, Classification, High Risk).

---

### Step 3: Launch Guided Interactive Demo (2–3 minutes)
1. Click the prominent **"Launch Interactive Demo"** button on the Dashboard.
2. Step through the 10 sequential governance steps:
   - **Step 1 (Model Training):** Train/Load scikit-learn `LogisticRegression` pipeline on 7,500 synthetic loan records. Point out calculated Accuracy (91%), F1 (88.5%), and ROC-AUC (94%).
   - **Step 2 (Governance Assessment):** Run algorithmic impact assessment.
   - **Step 3 (Fairness Analysis):** Demonstrate real demographic disparity between Male (74.2% approval) and Female (61.4% approval) subgroups. Show Demographic Parity Difference (12.8%) and Fairness Score (61.4/100). Point out automated governance recommendations.
   - **Step 4 (Explainability):** Open local prediction simulator. Explain an individual applicant decision (+0.42 credit score impact, -0.31 previous defaults impact) and show the generated plain-language narrative.
   - **Step 5 & 6 (Production Simulation & Drift):** Click "Simulate Production Shift". Show Population Stability Index (PSI) drift calculation (18.0% drift), performance drop, and active alert feeds.
   - **Step 7 & 8 (Governance Score & Risk):** Recalculate integrated governance score using the weighted equation. Show Risk Category (**HIGH RISK**) and explain "Why is this model high risk?".
   - **Step 9 (Compliance Check):** Show automated checklist of 9 governance rules mapped to NIST AI RMF, EU AI Act, and ISO/IEC 42001.
   - **Step 10 (PDF Report Generation):** Click "Generate PDF Report". Download and open the publication-ready 15-section PDF report with AegisAI branding.

---

### Step 4: Technical Architecture Rationale (30 seconds)
- **Zero Hardcoded Numbers:** All metrics (Accuracy, F1, Selection Rates, Disparate Impact, Factor Attributions, PSI Drift, Governance Score) are calculated live via Python (`scikit-learn`, `numpy`, `pandas`, `scipy`).
- **Standardized Framework Alignment:** Rules are mapped directly to NIST AI RMF 1.0, EU AI Act High-Risk Requirements, and ISO/IEC 42001 AIMS.
- **Enterprise PDF Export:** Built using Python `reportlab` with 15 structured sections suitable for legal and governance auditing.

---

## 🛠️ Technology Rationale Summary Table

| Technology | Selection Rationale |
| :--- | :--- |
| **Python FastAPI** | Asynchronous high-performance REST API with automatic OpenAPI validation and seamless ML library integration. |
| **Scikit-Learn & Pandas** | Industry-standard reproducible machine learning pipelines, preprocessing transformers, and metric calculation engines. |
| **ReportLab** | Enterprise PDF document generation engine enabling programmatically formatted multi-page governance reports. |
| **React 18 & Vite** | Ultra-fast client rendering with TypeScript type safety and Recharts interactive visualizations. |
| **SQLAlchemy ORM** | Secure database abstraction preventing SQL injection and managing relational governance models. |
