import React from 'react';
import { Activity, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const Monitoring: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-surface border border-surface-border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-main">Real-time Telemetry & Data Drift Monitoring</h2>
            <p className="text-xs text-text-muted">Tracks Population Stability Index (PSI), Kolmogorov-Smirnov statistics, and accuracy metrics over time.</p>
          </div>
        </div>

        <div className="p-4 bg-background border border-surface-border rounded-lg flex items-start gap-3">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-text-muted leading-relaxed">
            <strong className="text-text-main">Phase 1 Foundation Ready:</strong> Background batch calculation worker and live PSI drift alerting pipeline will be connected in Part 2.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface-card p-4 rounded-lg border border-surface-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-main">Population Stability Index (PSI)</span>
              <span className="text-xs px-2 py-0.5 rounded bg-status-healthy/10 text-status-healthy font-semibold">Normal</span>
            </div>
            <div className="text-2xl font-mono font-bold text-text-main">0.042</div>
            <div className="text-[11px] text-text-muted">No substantial data drift detected (&lt; 0.10 threshold)</div>
          </div>

          <div className="bg-surface-card p-4 rounded-lg border border-surface-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-main">Prediction Drift Status</span>
              <span className="text-xs px-2 py-0.5 rounded bg-status-warning/10 text-status-warning font-semibold">Minor Shift</span>
            </div>
            <div className="text-2xl font-mono font-bold text-text-main">KS-Stat: 0.081</div>
            <div className="text-[11px] text-text-muted">Mild feature distribution shift in income column</div>
          </div>
        </div>
      </div>
    </div>
  );
};
