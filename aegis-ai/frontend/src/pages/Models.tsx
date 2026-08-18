import React from 'react';
import { Boxes, Plus, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const Models: React.FC = () => {
  const sampleModels = [
    { id: 'MOD-001', name: 'Credit Scoring AI', version: 'v2.4.1', type: 'XGBoost Classifier', framework: 'Scikit-Learn', status: 'Production', riskTier: 'High Risk', fairness: '0.94' },
    { id: 'MOD-002', name: 'Loan Approval Model', version: 'v1.8.0', type: 'LightGBM', framework: 'PyTorch', status: 'Production', riskTier: 'High Risk', fairness: '0.91' },
    { id: 'MOD-003', name: 'Fraud Detection Engine', version: 'v3.1.0', type: 'Random Forest', framework: 'Scikit-Learn', status: 'Production', riskTier: 'Medium Risk', fairness: '0.98' },
    { id: 'MOD-004', name: 'Customer Churn Predictor', version: 'v1.0.2', type: 'Logistic Regression', framework: 'Scikit-Learn', status: 'Staging', riskTier: 'Low Risk', fairness: '0.96' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
            <Boxes className="w-5 h-5 text-primary" /> Model Inventory & Registry
          </h2>
          <p className="text-xs text-text-muted">Registered AI/ML models currently monitored for governance & compliance.</p>
        </div>
        <button className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors">
          <Plus className="w-4 h-4" /> Register New Model
        </button>
      </div>

      {/* Model Inventory Table */}
      <div className="bg-surface border border-surface-border rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs text-text-main">
          <thead className="bg-surface-card border-b border-surface-border text-text-muted uppercase text-[11px]">
            <tr>
              <th className="p-4 font-semibold">Model ID & Name</th>
              <th className="p-4 font-semibold">Version & Framework</th>
              <th className="p-4 font-semibold">Risk Tier</th>
              <th className="p-4 font-semibold">Fairness Score</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {sampleModels.map((model) => (
              <tr key={model.id} className="hover:bg-surface-card/50 transition-colors">
                <td className="p-4">
                  <div className="font-semibold text-text-main">{model.name}</div>
                  <div className="text-[11px] font-mono text-text-muted">{model.id}</div>
                </td>
                <td className="p-4">
                  <div>{model.type}</div>
                  <div className="text-[11px] text-text-muted">{model.version} ({model.framework})</div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    model.riskTier === 'High Risk' ? 'bg-status-critical/10 text-status-critical border border-status-critical/20' : 'bg-status-warning/10 text-status-warning'
                  }`}>
                    {model.riskTier}
                  </span>
                </td>
                <td className="p-4 font-mono font-semibold text-status-healthy">
                  {model.fairness} / 1.0
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-status-healthy/10 text-status-healthy">
                    <CheckCircle2 className="w-3 h-3" /> {model.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-primary hover:underline font-semibold text-xs">Configure Governance</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
