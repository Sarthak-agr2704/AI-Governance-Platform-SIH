# AegisAI — Responsible AI Governance & Model Risk Management Platform

![AegisAI Governance Platform](https://img.shields.io/badge/AegisAI-Responsible_AI_Governance-07111A?style=for-the-badge&logoColor=34D399)
![Theme](https://img.shields.io/badge/Theme-Deep_Navy_%2B_Emerald_Teal_%2B_Champagne_Gold-34D399?style=for-the-badge)
![SIH Hackathon](https://img.shields.io/badge/SIH-Demonstration_Ready-E8D5A3?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI_0.109-009688?style=for-the-badge)
![React Vite](https://img.shields.io/badge/Frontend-React_18_TypeScript_Vite-61dafb?style=for-the-badge)

AegisAI is an enterprise-grade Responsible AI Governance & Model Risk Management Command Center designed to enable organizations to register AI models, evaluate demographic bias & fairness, compute exact model explainability (SHAP & feature attribution), monitor production data drift, calculate integrated governance scores, enforce compliance policy checklists, and automatically generate publication-ready PDF audit reports.

---

## 📌 Problem Statement

As AI models are rapidly deployed across financial underwriting, healthcare, recruitment, and public services, organizations face critical risks regarding algorithmic bias, unexpected distribution drift, lack of transparency, and regulatory non-compliance (e.g., EU AI Act, NIST AI RMF). Organizations lack a unified, automated governance framework to continuously measure model risk, compute quantitative fairness metrics, and generate verifiable audit documentation.

---

## 🚀 Solution Overview

AegisAI addresses this challenge by providing a centralized governance command center that combines:
1. **AI Model Management Registry:** Onboarding and lifecycle tracking for enterprise models (Classification & Regression).
2. **Demonstration ML Engine (Loan Approval Model):** Scikit-learn classification pipeline trained reproducibly on 7,500 synthetic loan underwriting records.
3. **Bias & Fairness Evaluation Engine:** Multi-attribute subgroup disparity calculations (Demographic Parity, Disparate Impact Ratio, Equal Opportunity, TPR, FPR, FNR) with configurable platform thresholds.
4. **Model Explainability Engine:** Global feature importance ranking and local prediction factor attribution (`coef * z_score`) generating plain-language narratives.
5. **Production Drift Monitoring:** Population Stability Index (PSI) data drift tracking, prediction drift, and automated alert feeds.
6. **Integrated Governance Score & Risk Engine:** Multi-dimensional weighted score equation (`Fairness*0.25 + Performance*0.20 + Explainability*0.15 + DataQuality*0.15 + Monitoring*0.15 + Compliance*0.10`) mapping to LOW, MEDIUM, HIGH, or CRITICAL risk levels.
7. **Compliance & Audit Trail:** 9 governance policy rules mapped to NIST AI RMF, EU AI Act, and ISO/IEC 42001 with filterable immutable audit logs.
8. **Automated PDF Report Generation:** 15-section publication-ready PDF audit report builder using ReportLab.
9. **Interactive SIH Guided Demo Mode:** A step-by-step 3–5 minute live demonstration workflow runner.

---

## 🎨 Enterprise Command Center Design System

The platform features a modern dark enterprise command-center UI:

| Color Component | Hex Code | Role |
| :--- | :--- | :--- |
| **Main Background** | `#07111A` | Deep Navy Backdrop |
| **Sidebar Navigation** | `#09151E` | Left Command Navigation |
| **Primary Cards** | `#0D1B24` | Executive Analytics Cards |
| **Secondary Cards** | `#101F29` | Inset Metric Containers |
| **Borders & Dividers** | `#1D3440` | Subtle Grid Division |
| **Primary Accent** | `#34D399` | Emerald Teal |
| **Secondary Accent** | `#5EEAD4` | Light Teal Accent |
| **AI Cyan** | `#67E8F9` | Telemetry & Drift Accent |
| **Premium Gold** | `#E8D5A3` | Champagne Gold Accents & Badges |
| **Status Indicators** | `#34D399` (Healthy) • `#FACC15` (Warning) • `#FB923C` (High Risk) • `#F87171` (Critical) | Live Status Feedback |
| **Typography** | `Outfit` (Headlines) • `JetBrains Mono` (Metrics & Endpoints) | Modern Enterprise Hierarchy |

---

## 🛠️ Architecture & Tech Stack

```text
┌─────────────────────────────────────────────────────────┐
│                    AegisAI Frontend                     │
│       React 18 + TypeScript + Vite + TailwindCSS        │
│    Deep Navy (#07111A) + Emerald (#34D399) Theme        │
│          Recharts Data Visualizations + Lucide           │
└────────────────────────────┬────────────────────────────┘
                             │ REST API (JSON / Bearer JWT)
┌────────────────────────────▼────────────────────────────┐
│                    AegisAI Backend                      │
│            Python FastAPI + Pydantic + JWT              │
│ ┌─────────────────────────────────────────────────────┐ │
│ │                  Core ML Engines                    │ │
│ │ • Scikit-Learn LogisticRegression Pipeline          │ │
│ │ • Pandas & NumPy Synthetic Data Generator           │ │
│ │ • Fairness Engine (Selection Rates, Parity, TPR/FPR)│ │
│ │ • Explainability Engine (Feature Contributions)     │ │
│ │ • Monitoring Engine (PSI Drift & Telemetry)        │ │
│ │ • Governance Score & Risk Engine                    │ │
│ │ • ReportLab PDF Report Generator                    │ │
│ └─────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────┘
                             │ SQLAlchemy ORM
┌────────────────────────────▼────────────────────────────┐
│                    SQLite / PostgreSQL                  │
│  Models, Versions, Assessments, Monitoring, Audit, PDF   │
└─────────────────────────────────────────────────────────┘
```

---

## 💻 Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment (Windows):
.\.venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Start backend server
python run.py
```
Backend server runs at `http://127.0.0.1:8000`. Swagger API documentation is available at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install node modules
npm install

# Start Vite development server
npm run dev
```
Frontend application will be accessible at `http://localhost:5173`.

---

## 🔐 Default Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin Officer** | `admin@aegis.ai` | `DemoPass123!` |
| **AI Lead Engineer** | `engineer@aegis.ai` | `DemoPass123!` |

---

## 📊 Governance Formulas & Methodology

### 1. Integrated Governance Score Formula
$$\text{Overall Score} = (\text{Fairness} \times 0.25) + (\text{Performance} \times 0.20) + (\text{Explainability} \times 0.15) + (\text{Data Quality} \times 0.15) + (\text{Monitoring} \times 0.15) + (\text{Compliance} \times 0.10)$$

### 2. Risk Level Thresholds
- **90 – 100:** LOW RISK
- **75 – 89:** MEDIUM RISK
- **50 – 74:** HIGH RISK
- **0 – 49:** CRITICAL RISK

*(Note: Configurable platform governance thresholds — not universal legal definitions).*

### 3. Population Stability Index (PSI) Data Drift
$$\text{PSI} = \sum \left( \text{Actual} \% - \text{Baseline} \% \right) \times \ln\left( \frac{\text{Actual} \%}{\text{Baseline} \%} \right)$$
- **PSI < 0.10:** Healthy (No significant shift)
- **0.10 ≤ PSI < 0.25:** Warning (Moderate shift)
- **PSI ≥ 0.25:** Critical (Significant data drift)

---

## 📄 License & Attribution

Developed for **Smart India Hackathon (SIH 2026)**. All synthetic demo datasets are clearly labeled as synthetic for demonstration purposes.
