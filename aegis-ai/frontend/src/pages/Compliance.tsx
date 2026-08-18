import React from 'react';
import { FileCheck, CheckCircle2, ShieldCheck } from 'lucide-react';

export const Compliance: React.FC = () => {
  const frameworks = [
    { name: 'EU AI Act (2024)', status: '92% Compliant', icon: ShieldCheck, color: 'text-status-healthy' },
    { name: 'NIST AI RMF 1.0', status: '95% Compliant', icon: CheckCircle2, color: 'text-status-healthy' },
    { name: 'ISO/IEC 42001 (AIMS)', status: '88% Compliant', icon: FileCheck, color: 'text-status-info' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-surface-border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-main">Regulatory Compliance Engine</h2>
            <p className="text-xs text-text-muted">Map model deployments directly to international AI compliance frameworks.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {frameworks.map((fw, idx) => (
            <div key={idx} className="bg-surface-card p-4 rounded-lg border border-surface-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-main">{fw.name}</span>
                <fw.icon className={`w-4 h-4 ${fw.color}`} />
              </div>
              <div className="text-xl font-mono font-bold text-text-main">{fw.status}</div>
              <div className="text-[10px] text-text-muted">Automated verification mapped</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
