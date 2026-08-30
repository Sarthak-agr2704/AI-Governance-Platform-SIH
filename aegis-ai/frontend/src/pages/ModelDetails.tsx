import React, { useState, useEffect } from 'react';
import { AIModel } from '../types';
import { BiasDetection } from './BiasDetection';
import { Explainability } from './Explainability';
import { Monitoring } from './Monitoring';
import { Governance } from './Governance';
import { Compliance } from './Compliance';
import { AuditTrail } from './AuditTrail';
import { Reports } from './Reports';
import { Assessments } from './Assessments';
import {
  ArrowLeft,
  Cpu,
  ShieldAlert,
  BarChart3,
  Scale,
  BrainCircuit,
  Activity,
  CheckCircle,
  FileText,
  History,
  Info,
  RefreshCw,
  Zap,
  Play
} from 'lucide-react';
import { trainDemoModel, getModelPerformance } from '../services/api';

interface ModelDetailsProps {
  model: AIModel;
  onBack: () => void;
  onRefresh: () => void;
}

export type DetailTab =
  | 'Overview'
  | 'Assessment'
  | 'Fairness'
  | 'Explainability'
  | 'Monitoring'
  | 'Risks'
  | 'Compliance'
  | 'Audit'
  | 'Reports';

export const ModelDetails: React.FC<ModelDetailsProps> = ({ model, onBack, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('Overview');
  const [training, setTraining] = useState(false);
  const [perfData, setPerfData] = useState<any>(null);

  const fetchPerformance = async () => {
    try {
      const res = await getModelPerformance(model.id);
      setPerfData(res.performance);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPerformance();
  }, [model.id]);

  const handleTrainModel = async () => {
    try {
      setTraining(true);
      await trainDemoModel();
      await fetchPerformance();
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setTraining(false);
    }
  };

  const tabs: DetailTab[] = [
    'Overview',
    'Assessment',
    'Fairness',
    'Explainability',
    'Monitoring',
    'Risks',
    'Compliance',
    'Audit',
    'Reports'
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div className="space-y-6">
            {/* Top Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-card border border-border p-4 rounded-xl">
                <span className="text-xs text-text-muted font-medium block">Governance Score</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-extrabold text-primary">{model.governance_score}/100</span>
                  <span className="text-xs text-emerald-400 font-semibold">Evaluated</span>
                </div>
              </div>

              <div className="bg-card border border-border p-4 rounded-xl">
                <span className="text-xs text-text-muted font-medium block">Assessed Risk</span>
                <span className={`text-lg font-bold mt-1 inline-block ${model.risk_category === 'High' ? 'text-amber-500' : 'text-emerald-400'}`}>
                  {model.risk_category} Risk
                </span>
              </div>

              <div className="bg-card border border-border p-4 rounded-xl">
                <span className="text-xs text-text-muted font-medium block">Deployment Status</span>
                <span className="text-lg font-bold text-text-main mt-1 inline-block">
                  {model.deployment_status}
                </span>
              </div>

              <div className="bg-card border border-border p-4 rounded-xl">
                <span className="text-xs text-text-muted font-medium block">Model Type</span>
                <span className="text-lg font-bold text-text-main mt-1 inline-block">
                  {model.model_type}
                </span>
              </div>
            </div>

            {/* Model Metadata Section */}
            <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                <span>Model Specifications & Metadata</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-text-muted block">Primary Purpose</span>
                  <p className="font-semibold text-text-main">{model.purpose || 'Automated credit underwriting and loan approval decisions.'}</p>
                </div>

                <div>
                  <span className="text-xs text-text-muted block">Owner / Department</span>
                  <p className="font-semibold text-text-main">{model.owner} ({model.department})</p>
                </div>

                <div>
                  <span className="text-xs text-text-muted block">Business Domain</span>
                  <p className="font-semibold text-text-main">{model.business_domain}</p>
                </div>

                <div>
                  <span className="text-xs text-text-muted block">Version</span>
                  <p className="font-semibold text-text-main">v{model.version}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <span className="text-xs text-text-muted block mb-1">Description</span>
                <p className="text-sm text-text-main leading-relaxed">
                  {model.description || 'Built-in demonstration scikit-learn classification model evaluating applicant creditworthiness based on financial and demographic variables.'}
                </p>
              </div>
            </div>

            {/* Demonstration ML Performance Section */}
            <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" />
                    <span>Demonstration ML Performance</span>
                  </h3>
                  <p className="text-xs text-text-muted">Scikit-learn LogisticRegression model evaluation metrics calculated on test set.</p>
                </div>
                <button
                  onClick={handleTrainModel}
                  disabled={training}
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-slate-950 font-black text-xs rounded-xl transition-all shadow-sm"
                >
                  <Play className={`w-3.5 h-3.5 fill-current text-slate-950 ${training ? 'animate-spin' : ''}`} />
                  <span>{training ? 'Training Model...' : 'Train / Retrain Model'}</span>
                </button>
              </div>

              {perfData ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="p-3 bg-card-subtle border border-border rounded-xl text-center">
                      <span className="text-[10px] text-text-muted uppercase font-semibold">Accuracy</span>
                      <p className="text-lg font-extrabold text-emerald-400">{roundPct(perfData.accuracy)}%</p>
                    </div>

                    <div className="p-3 bg-card-subtle border border-border rounded-xl text-center">
                      <span className="text-[10px] text-text-muted uppercase font-semibold">Precision</span>
                      <p className="text-lg font-extrabold text-primary">{roundPct(perfData.precision)}%</p>
                    </div>

                    <div className="p-3 bg-card-subtle border border-border rounded-xl text-center">
                      <span className="text-[10px] text-text-muted uppercase font-semibold">Recall</span>
                      <p className="text-lg font-extrabold text-amber-400">{roundPct(perfData.recall)}%</p>
                    </div>

                    <div className="p-3 bg-card-subtle border border-border rounded-xl text-center">
                      <span className="text-[10px] text-text-muted uppercase font-semibold">F1 Score</span>
                      <p className="text-lg font-extrabold text-primary">{roundPct(perfData.f1)}%</p>
                    </div>

                    <div className="p-3 bg-card-subtle border border-border rounded-xl text-center">
                      <span className="text-[10px] text-text-muted uppercase font-semibold">ROC-AUC</span>
                      <p className="text-lg font-extrabold text-amber-400">{roundPct(perfData.roc_auc)}%</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-card-subtle rounded-xl border border-border/50 text-xs">
                    <div>
                      <span className="text-text-muted font-medium">Dataset:</span>
                      <span className="ml-2 font-bold text-primary">Synthetic Demo Dataset ({perfData.dataset_size?.toLocaleString()} records)</span>
                    </div>
                    <div>
                      <span className="text-text-muted font-medium">Features:</span>
                      <span className="ml-2 font-semibold text-text-main">{perfData.features?.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-text-muted font-medium">Target Variable:</span>
                      <span className="ml-2 font-semibold text-text-main">{perfData.target}</span>
                    </div>
                    <div>
                      <span className="text-text-muted font-medium">Training Timestamp:</span>
                      <span className="ml-2 font-mono text-text-muted">{perfData.training_timestamp ? new Date(perfData.training_timestamp).toLocaleString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-text-muted">
                  <p>Loading ML model performance metrics...</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'Assessment':
        return <Assessments modelId={model.id} />;
      case 'Fairness':
        return <BiasDetection modelId={model.id} />;
      case 'Explainability':
        return <Explainability modelId={model.id} />;
      case 'Monitoring':
        return <Monitoring modelId={model.id} />;
      case 'Risks':
      case 'Compliance':
        return <Compliance modelId={model.id} />;
      case 'Audit':
        return <AuditTrail modelId={model.id} />;
      case 'Reports':
        return <Reports modelId={model.id} />;
      default:
        return null;
    }
  };

  const roundPct = (val: number) => (val ? (val * 100).toFixed(1) : '0.0');

  return (
    <div className="space-y-6">
      {/* Top Details Nav Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-text-muted hover:text-text-main bg-card-subtle hover:bg-border/50 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-text-main">{model.name}</h1>
              <span className="px-2 py-0.5 text-xs font-bold bg-primary/15 text-primary rounded-md border border-primary/20">v{model.version}</span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">{model.business_domain} • {model.owner}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-text-muted block uppercase font-semibold">Governance Score</span>
            <span className={`text-lg font-bold ${model.governance_score >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {model.governance_score}/100
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-text-muted block uppercase font-semibold">Risk Level</span>
            <span className="text-xs font-bold px-2.5 py-1 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20">
              {model.risk_category}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Selector Bar */}
      <div className="flex items-center gap-1 overflow-x-auto p-1.5 bg-card border border-border rounded-xl no-scrollbar text-xs font-medium">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'bg-primary text-slate-950 font-black shadow-sm'
                : 'text-text-muted hover:text-text-main hover:bg-border/40'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Active Tab View Content */}
      <div className="mt-4">{renderTabContent()}</div>
    </div>
  );
};
