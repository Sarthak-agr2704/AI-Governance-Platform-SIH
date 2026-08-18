import React from 'react';
import { Search, Bell, Server, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { NavPageId } from '../../types';

interface HeaderProps {
  activePage: NavPageId;
  isHealthy: boolean;
  loading: boolean;
  onRefreshHealth: () => void;
}

const pageTitles: Record<NavPageId, { title: string; subtitle: string }> = {
  dashboard: { title: 'AI Governance Dashboard', subtitle: 'Overview of deployed models, risk metrics, and system status.' },
  models: { title: 'Model Registry', subtitle: 'Centralized inventory of registered AI models and versions.' },
  assessments: { title: 'Impact Assessments', subtitle: 'Risk assessments and regulatory evaluation checklists.' },
  fairness: { title: 'Fairness & Bias Analysis', subtitle: 'Demographic parity, equal opportunity, and bias metric monitoring.' },
  explainability: { title: 'Explainability & Interpretability', subtitle: 'Global and local feature importance via SHAP and LIME.' },
  monitoring: { title: 'Model Performance & Drift', subtitle: 'Real-time telemetry, data drift, and concept drift metrics.' },
  governance: { title: 'Risk & Governance', subtitle: 'Governance policies, risk tiers, and mitigation actions.' },
  compliance: { title: 'Regulatory Compliance', subtitle: 'Framework mappings for EU AI Act, NIST AI RMF, and ISO/IEC 42001.' },
  audit: { title: 'Audit Trail', subtitle: 'Immutable logs of model changes, assessments, and policy updates.' },
  reports: { title: 'Governance Reports', subtitle: 'Exportable PDF and JSON audit and compliance reports.' },
  settings: { title: 'System Settings', subtitle: 'Configure platform parameters, database connections, and integrations.' },
};

export const Header: React.FC<HeaderProps> = ({
  activePage,
  isHealthy,
  loading,
  onRefreshHealth
}) => {
  const current = pageTitles[activePage] || { title: 'AegisAI', subtitle: 'Responsible AI Governance' };

  return (
    <header className="h-16 bg-surface border-b border-surface-border px-6 flex items-center justify-between sticky top-0 z-10">
      {/* Page Title & Subtitle */}
      <div>
        <h2 className="text-base font-semibold text-text-main flex items-center gap-2">
          {current.title}
        </h2>
        <p className="text-xs text-text-muted hidden sm:block">{current.subtitle}</p>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-4">
        {/* Quick Search */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
          <input
            type="text"
            placeholder="Search models, policies..."
            className="bg-background border border-surface-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-text-main placeholder-text-dim focus:outline-none focus:border-primary w-56 transition-colors"
          />
        </div>

        {/* Backend Health Badge */}
        <div className="flex items-center gap-2 bg-background border border-surface-border px-3 py-1.5 rounded-lg text-xs">
          <Server className="w-3.5 h-3.5 text-text-muted" />
          <span className="hidden sm:inline text-text-muted">Backend:</span>
          {loading ? (
            <span className="text-text-muted flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin" /> Checking
            </span>
          ) : isHealthy ? (
            <span className="text-status-healthy font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Healthy
            </span>
          ) : (
            <span className="text-status-critical font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Offline
            </span>
          )}
          <button
            onClick={onRefreshHealth}
            title="Refresh status"
            className="text-text-dim hover:text-text-main ml-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        {/* Notifications Icon */}
        <button className="p-2 text-text-muted hover:text-text-main hover:bg-surface-card rounded-lg relative transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
        </button>

        {/* User Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-surface-border">
          <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center font-bold text-xs text-primary">
            AI
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-text-main leading-tight">Admin Officer</div>
            <div className="text-[10px] text-text-muted">Governance Lead</div>
          </div>
        </div>
      </div>
    </header>
  );
};
