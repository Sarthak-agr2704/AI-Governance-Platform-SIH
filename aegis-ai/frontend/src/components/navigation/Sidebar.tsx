import React from 'react';
import {
  LayoutDashboard,
  Boxes,
  ClipboardCheck,
  Scale,
  Eye,
  Activity,
  Shield,
  FileCheck,
  History,
  FileSpreadsheet,
  Settings,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { NavPageId } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activePage: NavPageId;
  onSelectPage: (page: NavPageId) => void;
}

interface NavMenuItem {
  id: NavPageId;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const navItems: NavMenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'models', label: 'Models', icon: Boxes },
  { id: 'assessments', label: 'Assessments', icon: ClipboardCheck },
  { id: 'fairness', label: 'Fairness & Bias', icon: Scale },
  { id: 'explainability', label: 'Explainability', icon: Eye },
  { id: 'monitoring', label: 'Monitoring', icon: Activity },
  { id: 'governance', label: 'Risk & Governance', icon: Shield },
  { id: 'compliance', label: 'Compliance', icon: FileCheck },
  { id: 'audit', label: 'Audit Trail', icon: History },
  { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onSelectPage }) => {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-[#09151E] flex flex-col border-r border-[#1D3440] h-screen sticky top-0 select-none z-20">
      {/* Brand Logo Header */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-[#1D3440] bg-[#09151E]">
        <div className="p-2 bg-[#34D399]/10 rounded-xl text-[#34D399] border border-[#34D399]/30 shadow-[0_0_10px_rgba(52,211,153,0.15)]">
          <ShieldCheck className="w-5 h-5 text-[#34D399]" />
        </div>
        <div>
          <h1 className="font-extrabold text-lg tracking-tight text-[#F8FAFC]">
            AegisAI
          </h1>
          <span className="text-[9px] font-mono tracking-widest text-[#5EEAD4] uppercase block">GOVERNANCE COMMAND</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 no-scrollbar bg-[#09151E]">
        <div className="px-3 pb-2 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
          Platform Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectPage(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all duration-150 ${
                isActive
                  ? 'bg-[#34D399]/15 text-white font-bold border border-[#34D399]/40 shadow-[0_0_12px_rgba(52,211,153,0.15)]'
                  : 'text-[#94A3B8] font-medium hover:text-[#F8FAFC] hover:bg-[#0D1B24]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#34D399]' : 'text-[#94A3B8]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] px-1.5 py-0.5 rounded font-mono bg-[#101F29] text-[#5EEAD4] border border-[#1D3440]">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / User Profile & Logout */}
      <div className="p-4 border-t border-[#1D3440] bg-[#07111A] space-y-3">
        {user && (
          <div className="flex items-center justify-between bg-[#0D1B24] p-2.5 rounded-xl border border-[#1D3440]">
            <div className="min-w-0 flex-1 pr-2">
              <div className="text-xs font-bold text-[#F8FAFC] truncate">{user.name}</div>
              <div className="text-[10px] font-semibold text-[#5EEAD4] truncate">{user.role}</div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 text-[#94A3B8] hover:text-[#F87171] hover:bg-[#F87171]/10 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        <div className="flex items-center justify-between text-xs text-[#64748B]">
          <span className="text-[10px]">SIH 2026 Edition</span>
          <span className="font-mono text-[10px] bg-[#0D1B24] px-2 py-0.5 rounded text-[#E8D5A3] font-semibold border border-[#1D3440]">Governance Command</span>
        </div>
      </div>
    </aside>
  );
};
