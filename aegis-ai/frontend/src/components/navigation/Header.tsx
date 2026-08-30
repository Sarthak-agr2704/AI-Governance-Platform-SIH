import React from 'react';
import { Search, Bell, Server, RefreshCw, CheckCircle2, AlertTriangle, LogOut } from 'lucide-react';
import { NavPageId } from '../../types';
import { useAuth } from '../../context/AuthContext';

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
  explainability: { title: 'Explainability & Interpretability', subtitle: 'Global and local feature importance via SHAP and factor attribution.' },
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
  const { user, logout } = useAuth();
  const current = pageTitles[activePage] || { title: 'AI Governance Dashboard', subtitle: 'Overview of deployed models, risk metrics, and system status.' };

  const getInitials = (name?: string) => {
    if (!name) return 'AO';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 bg-[#07111A] border-b border-[#1D3440] px-6 flex items-center justify-between sticky top-0 z-10">
      {/* Page Title & Subtitle */}
      <div>
        <h2 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
          {current.title}
        </h2>
        <p className="text-xs text-[#94A3B8] hidden sm:block">{current.subtitle}</p>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-4">
        {/* Quick Search Box */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            placeholder="Search models, policies, assessments..."
            className="bg-[#0A1620] border border-[#1D3440] rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#34D399] w-64 transition-colors font-medium"
          />
        </div>

        {/* Backend Status Badge */}
        <div className="flex items-center gap-2 bg-[#0D1B24] border border-[#1D3440] px-3 py-1.5 rounded-xl text-xs font-semibold">
          <Server className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span className="hidden sm:inline text-[#94A3B8]">Backend:</span>
          {loading ? (
            <span className="text-[#94A3B8] flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin text-[#34D399]" /> Checking
            </span>
          ) : isHealthy ? (
            <span className="text-[#34D399] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Healthy
            </span>
          ) : (
            <span className="text-[#F87171] font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Offline
            </span>
          )}
          <button
            onClick={onRefreshHealth}
            title="Refresh status"
            className="text-[#64748B] hover:text-[#F8FAFC] ml-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        {/* Notifications Icon */}
        <button className="p-2 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101F29] rounded-xl relative transition-colors border border-[#1D3440]">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#34D399] rounded-full"></span>
        </button>

        {/* Admin Officer Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-[#1D3440]">
          <div className="w-8 h-8 rounded-full bg-[#34D399]/15 border border-[#34D399]/40 flex items-center justify-center font-bold text-xs text-[#34D399]">
            {getInitials(user?.name)}
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-[#F8FAFC] leading-tight">
              {user?.name || 'Admin Officer'}
            </div>
            <div className="text-[10px] font-semibold text-[#5EEAD4]">
              {user?.role || 'Admin'}
            </div>
          </div>

          {/* Header Logout Button */}
          <button
            onClick={logout}
            title="Sign Out"
            className="p-1.5 text-[#64748B] hover:text-[#F87171] hover:bg-[#F87171]/10 rounded-lg transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
