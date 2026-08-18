# AegisAI — Responsible AI Governance Platform

**AegisAI** is an enterprise-grade Responsible AI Governance Platform designed to provide mechanisms for ensuring transparency, fairness, explainability, risk management, model monitoring, and regulatory compliance across AI deployments.

---

## 🏗 Project Architecture

```text
aegis-ai/
├── frontend/        # React + TypeScript + Vite + Tailwind CSS + Recharts
├── backend/         # Python + FastAPI + SQLAlchemy ORM + Pydantic
├── data/            # Datasets & upload directory
│   ├── sample/
│   └── uploads/
├── reports/         # Generated audit and compliance reports
├── docs/            # Platform documentation
├── .env.example     # Environment template
├── docker-compose.yml # Container orchestration (PostgreSQL + Backend + Frontend)
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ & npm
- PostgreSQL (Optional, SQLite is used by default for local development)

### 2. Backend Setup
```bash
cd aegis-ai/backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows (PowerShell):
.\.venv\Scripts\Activate.ps1
# Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI dev server
uvicorn app.main:app --reload --port 8000
```
Backend API will be live at: `http://localhost:8000`  
Interactive API Docs (Swagger): `http://localhost:8000/docs`  
Health Check: `http://localhost:8000/api/health`

### 3. Frontend Setup
```bash
cd aegis-ai/frontend

# Install node dependencies
npm install

# Start Vite dev server
npm run dev
```
Frontend UI will be live at: `http://localhost:5173`

---

## 🐳 Docker Deployment

To launch PostgreSQL, FastAPI Backend, and React Frontend using Docker Compose:

```bash
docker-compose up --build
```

---

## 📋 Features Overview (Target Matrix)

| Module | Status | Description |
| :--- | :---: | :--- |
| **Backend Health Check** | ✅ Active | FastAPI status and database ping |
| **Enterprise Dark Dashboard** | ✅ Active | Cybersecurity aesthetic, metrics, navigation |
| **Model Registry** | 🔄 Skeleton | Inventory of registered AI models |
| **Bias & Fairness Detection** | 🔄 Pending Part 2 | Disparate impact, demographic parity |
| **Explainability (SHAP/LIME)** | 🔄 Pending Part 2 | Feature importance & local explanations |
| **Performance Monitoring** | 🔄 Pending Part 2 | Drift detection, latency, accuracy tracking |
| **Compliance Engine** | 🔄 Pending Part 2 | EU AI Act, NIST AI RMF assessment checklists |
| **Audit Trail & Reports** | 🔄 Pending Part 2 | PDF/JSON compliance reporting |

---

## 📄 License
Smart India Hackathon (SIH) Project - Confidential & Proprietary.
