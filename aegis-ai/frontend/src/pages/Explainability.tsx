import React from 'react';
import { Eye, Info, Cpu } from 'lucide-react';

export const Explainability: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-surface border border-surface-border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-main">Explainability & Interpretability (XAI)</h2>
            <p className="text-xs text-text-muted">Global feature importance and local instance-level attributions via SHAP & LIME.</p>
          </div>
        </div>

        <div className="p-4 bg-background border border-surface-border rounded-lg flex items-start gap-3">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-text-muted leading-relaxed">
            <strong className="text-text-main">Phase 1 Foundation Ready:</strong> SHAP (SHapley Additive exPlanations) visualizers and feature importance waterfall charts will be integrated in Part 2.
          </p>
        </div>

        {/* Feature Importance Mock Bar */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-semibold text-text-main uppercase tracking-wider">Sample Global Feature Importance</h4>
          {[
            { feature: 'Credit History Score', importance: 82, color: 'bg-primary' },
            { feature: 'Debt-to-Income Ratio', importance: 64, color: 'bg-primary-indigo' },
            { feature: 'Annual Income', importance: 48, color: 'bg-status-info' },
            { feature: 'Employment Duration', importance: 29, color: 'bg-text-dim' },
          ].map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-text-main">{item.feature}</span>
                <span className="font-mono text-text-muted">{item.importance}%</span>
              </div>
              <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.importance}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
