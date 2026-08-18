import React from 'react';
import { Scale, Info, Sparkles } from 'lucide-react';

export const BiasDetection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-surface border border-surface-border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-main">Fairness & Bias Detection Module</h2>
            <p className="text-xs text-text-muted">Calculates Disparate Impact Ratio, Equalized Odds, and Demographic Parity across protected groups.</p>
          </div>
        </div>

        <div className="p-4 bg-background border border-surface-border rounded-lg flex items-start gap-3">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-text-muted leading-relaxed">
            <strong className="text-text-main">Phase 1 Foundation Ready:</strong> The backend data models and frontend integration endpoints are configured. Statistical bias calculation algorithms (e.g. 80% Rule Disparate Impact metric) will be wired in Part 2.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-surface-card p-4 rounded-lg border border-surface-border space-y-1">
            <span className="text-[11px] uppercase font-semibold text-text-muted">Disparate Impact Metric</span>
            <div className="text-xl font-mono font-bold text-status-healthy">0.94 (Pass)</div>
            <div className="text-[10px] text-text-dim">Threshold: &gt; 0.80</div>
          </div>
          <div className="bg-surface-card p-4 rounded-lg border border-surface-border space-y-1">
            <span className="text-[11px] uppercase font-semibold text-text-muted">Demographic Parity Difference</span>
            <div className="text-xl font-mono font-bold text-status-healthy">0.03</div>
            <div className="text-[10px] text-text-dim">Optimal: 0.00</div>
          </div>
          <div className="bg-surface-card p-4 rounded-lg border border-surface-border space-y-1">
            <span className="text-[11px] uppercase font-semibold text-text-muted">Equalized Odds Difference</span>
            <div className="text-xl font-mono font-bold text-status-healthy">0.02</div>
            <div className="text-[10px] text-text-dim">Optimal: 0.00</div>
          </div>
        </div>
      </div>
    </div>
  );
};
