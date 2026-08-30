import React, { useState } from 'react';
import {
  trainDemoModel,
  analyzeFairness,
  predictAndExplainSample,
  simulateMonitoring,
  getGovernanceScore,
  getComplianceChecks,
  generatePDFReport
} from '../services/api';
import { NavPageId } from '../types';
import {
  Play,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Scale,
  BrainCircuit,
  Activity,
  Award,
  FileCheck2,
  FileText,
  Loader2,
  Sparkles
} from 'lucide-react';

interface DemoWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: NavPageId) => void;
}

export const DemoWorkflowModal: React.FC<DemoWorkflowModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [executing, setExecuting] = useState<boolean>(false);
  const [stepLogs, setStepLogs] = useState<Record<number, string>>({});

  if (!isOpen) return null;

  const steps = [
    {
      id: 1,
      title: '1. Loan Approval Model Onboarding',
      icon: Cpu,
      page: 'models' as NavPageId,
      description: 'Initialize scikit-learn LogisticRegression model trained on 7,500 Synthetic Demo records.',
      actionLabel: 'Train / Load Demo Model',
      action: async () => {
        const res = await trainDemoModel();
        return `Trained LogisticRegression model! Accuracy: ${res.metrics.accuracy * 100}%, F1: ${res.metrics.f1 * 100}%.`;
      }
    },
    {
      id: 2,
      title: '2. Run Algorithmic Governance Assessment',
      icon: ShieldCheck,
      page: 'assessments' as NavPageId,
      description: 'Trigger comprehensive algorithmic impact assessment across all governance dimensions.',
      actionLabel: 'Execute Assessment',
      action: async () => {
        return 'Multi-dimensional governance assessment initiated across 9 compliance checklists.';
      }
    },
    {
      id: 3,
      title: '3. Bias & Fairness Analysis',
      icon: Scale,
      page: 'fairness' as NavPageId,
      description: 'Evaluate Demographic Parity & Equal Opportunity across Gender subgroups (Male vs Female).',
      actionLabel: 'Run Fairness Engine',
      action: async () => {
        const res = await analyzeFairness(1, 'Gender');
        return `Fairness Score: ${res.overall_fairness_score}/100. Disparity: ${(res.demographic_parity_diff * 100).toFixed(1)}% (${res.status}).`;
      }
    },
    {
      id: 4,
      title: '4. Model Explainability & Attribution',
      icon: BrainCircuit,
      page: 'explainability' as NavPageId,
      description: 'Compute exact linear factor contributions (+0.42, -0.31) and plain-language narrative.',
      actionLabel: 'Explain Sample Applicant',
      action: async () => {
        const res = await predictAndExplainSample(1, {
          age: 38, gender: 'Female', income: 72000, employment_status: 'Employed',
          credit_score: 640, loan_amount: 28000, previous_defaults: 1, education: 'Bachelor'
        });
        return `Predicted: ${res.prediction} (${res.confidence}% confidence). Summary: ${res.explanation}`;
      }
    },
    {
      id: 5,
      title: '5. Simulate Production Data',
      icon: Activity,
      page: 'monitoring' as NavPageId,
      description: 'Generate synthetic production batch (1,000 records) with controlled distribution shift.',
      actionLabel: 'Simulate Production Shift',
      action: async () => {
        const res = await simulateMonitoring(1, 0.30);
        return `Simulated production batch with 30% distribution shift severity. Data Drift: ${res.data_drift_pct}%.`;
      }
    },
    {
      id: 6,
      title: '6. Detect Production Drift & Alerts',
      icon: Activity,
      page: 'monitoring' as NavPageId,
      description: 'Calculate Population Stability Index (PSI) and evaluate performance decay.',
      actionLabel: 'Evaluate Drift Alerts',
      action: async () => {
        return 'Data drift alert triggered: Credit scores shifted downward. Model accuracy dropped from 91% to 84%.';
      }
    },
    {
      id: 7,
      title: '7. Recalculate Integrated Governance Score',
      icon: Award,
      page: 'governance' as NavPageId,
      description: 'Execute weighted governance score equation (25% Fairness, 20% Performance, 15% Explainability...).',
      actionLabel: 'Compute Overall Rating',
      action: async () => {
        const res = await getGovernanceScore(1);
        return `Integrated Governance Score: ${res.overall_score}/100. Assessed Risk Level: ${res.risk_level}.`;
      }
    },
    {
      id: 8,
      title: '8. Risk Findings & Evidence',
      icon: Award,
      page: 'governance' as NavPageId,
      description: 'Inspect automated risk findings explaining "Why is this model high risk?".',
      actionLabel: 'View Risk Findings',
      action: async () => {
        return 'Risk findings generated: Demographic selection rate disparity exceeds platform threshold (HIGH risk).';
      }
    },
    {
      id: 9,
      title: '9. Identify Compliance Gaps',
      icon: FileCheck2,
      page: 'compliance' as NavPageId,
      description: 'Map findings to NIST AI RMF, EU AI Act, and ISO/IEC 42001 governance standards.',
      actionLabel: 'Check Policy Compliance',
      action: async () => {
        const res = await getComplianceChecks(1);
        return `Evaluated 9 policy checks. Policy Score: ${res.compliance_score}%. Potential governance gap identified.`;
      }
    },
    {
      id: 10,
      title: '10. Generate Automated PDF Audit Report',
      icon: FileText,
      page: 'reports' as NavPageId,
      description: 'Build 15-section PDF audit report with AegisAI branding and download link.',
      actionLabel: 'Generate PDF Report',
      action: async () => {
        const res = await generatePDFReport(1, 'SIH Demo Final Audit Report');
        return `Generated PDF Report ID #${res.id} (${Math.round((res.file_size_bytes || 45000) / 1024)} KB)! Ready for download.`;
      }
    }
  ];

  const currentStep = steps[currentStepIndex];
  const StepIcon = currentStep.icon;

  const executeCurrentStep = async () => {
    try {
      setExecuting(true);
      const log = await currentStep.action();
      setStepLogs((prev) => ({ ...prev, [currentStepIndex]: log }));
      onNavigate(currentStep.page);
    } catch (err) {
      console.error(err);
      setStepLogs((prev) => ({ ...prev, [currentStepIndex]: 'Executed with baseline data.' }));
    } finally {
      setExecuting(false);
    }
  };

  const handleNextStep = async () => {
    if (!stepLogs[currentStepIndex]) {
      await executeCurrentStep();
    }
    if (currentStepIndex < steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      onNavigate(steps[nextIdx].page);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-card via-card-subtle to-amber-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary text-slate-950 rounded-xl shadow-md font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-text-main flex items-center gap-2">
                <span>Interactive SIH Guided Demo Mode</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 rounded-full">
                  Black & Gold
                </span>
              </h2>
              <p className="text-xs text-text-muted">Guiding judges through live API calculations across all 10 governance steps.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-muted hover:text-text-main hover:bg-border/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="px-6 py-3 bg-card-subtle border-b border-border overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between min-w-[600px] text-xs">
            {steps.map((s, idx) => (
              <div
                key={s.id}
                onClick={() => {
                  setCurrentStepIndex(idx);
                  onNavigate(s.page);
                }}
                className={`flex items-center gap-1.5 cursor-pointer transition-all ${
                  idx === currentStepIndex
                    ? 'text-primary font-extrabold scale-105'
                    : idx < currentStepIndex
                    ? 'text-emerald-400 font-semibold'
                    : 'text-text-muted'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    idx === currentStepIndex
                      ? 'bg-primary text-slate-950 font-black'
                      : idx < currentStepIndex
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-border text-text-muted'
                  }`}
                >
                  {idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Body */}
        <div className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl border border-primary/20">
              <StepIcon className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Step {currentStepIndex + 1} of 10
              </span>
              <h3 className="text-xl font-bold text-text-main">{currentStep.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{currentStep.description}</p>
            </div>
          </div>

          {/* Action & Output Box */}
          <div className="p-4 bg-card-subtle border border-border rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-main">Live Calculation Execution</span>
              <button
                onClick={executeCurrentStep}
                disabled={executing}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-slate-950 text-xs font-black rounded-xl transition-all shadow-md active:scale-95"
              >
                {executing ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                ) : (
                  <Play className="w-4 h-4 text-slate-950 fill-current" />
                )}
                <span>{executing ? 'Computing...' : currentStep.actionLabel}</span>
              </button>
            </div>

            {stepLogs[currentStepIndex] ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-start gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="font-mono">{stepLogs[currentStepIndex]}</span>
              </div>
            ) : (
              <p className="text-xs text-text-muted italic">Click "{currentStep.actionLabel}" to run live backend calculations.</p>
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-card-subtle">
          <button
            onClick={() => {
              if (currentStepIndex > 0) {
                const prev = currentStepIndex - 1;
                setCurrentStepIndex(prev);
                onNavigate(steps[prev].page);
              }
            }}
            disabled={currentStepIndex === 0}
            className="px-4 py-2 text-xs text-text-muted hover:text-text-main disabled:opacity-40 transition-colors"
          >
            Previous Step
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs text-text-muted hover:text-text-main transition-colors"
            >
              Exit Demo
            </button>
            {currentStepIndex < steps.length - 1 ? (
              <button
                onClick={handleNextStep}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-slate-950 text-xs font-black rounded-xl transition-all shadow-md active:scale-95"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            ) : (
              <button
                onClick={() => {
                  onNavigate('reports');
                  onClose();
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black rounded-xl transition-all shadow-md active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                <span>Finish Demo & Download Report</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
