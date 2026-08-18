import React from 'react';
import { Shield, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const Governance: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-surface border border-surface-border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-main">Risk & Governance Registry</h2>
            <p className="text-xs text-text-muted">Define organizational AI policies, risk tiers, and approval workflows.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-surface-card p-4 rounded-lg border border-surface-border space-y-1">
            <div className="text-xs font-semibold text-text-muted uppercase">High Risk Models</div>
            <div className="text-xl font-bold text-status-critical">2 Models</div>
            <div className="text-[11px] text-text-muted">Require quarterly AIA review</div>
          </div>
          <div className="bg-surface-card p-4 rounded-lg border border-surface-border space-y-1">
            <div className="text-xs font-semibold text-text-muted uppercase">Medium Risk Models</div>
            <div className="text-xl font-bold text-status-warning">1 Model</div>
            <div className="text-[11px] text-text-muted">Bi-annual validation required</div>
          </div>
          <div className="bg-surface-card p-4 rounded-lg border border-surface-border space-y-1">
            <div className="text-xs font-semibold text-text-muted uppercase">Low Risk Models</div>
            <div className="text-xl font-bold text-status-healthy">1 Model</div>
            <div className="text-[11px] text-text-muted">Standard monitoring</div>
          </div>
        </div>
      </div>
    </div>
  );
};
