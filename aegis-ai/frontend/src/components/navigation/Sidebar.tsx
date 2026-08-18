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
  ShieldCheck
} from 'lucide-react';
import { NavPageId } from '../../types';

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
  return (
    <aside className="w-64 bg-surface flex flex-col border-r border-surface-border h-screen sticky top-0 select-none z-20">
      {/* Brand Logo Header */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-surface-border">
        <div className="p-2 bg-primary/10 rounded-lg text-primary border border-primary/20">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-text-main tracking-tight leading-none">AegisAI</h1>
          <span className="text-[10px] font-mono tracking-wider text-text-muted uppercase">Governance Platform</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold text-text-dim uppercase tracking-wider">
          Platform Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectPage(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-text-muted hover:text-text-main hover:bg-surface-card'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-text-muted'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-surface-border text-text-muted">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Build Version */}
      <div className="p-4 border-t border-surface-border bg-background/50">
        <div className="flex items-center justify-between text-xs text-text-dim">
          <span>SIH 2026 Edition</span>
          <span className="font-mono text-[11px] bg-surface-card px-1.5 py-0.5 rounded text-text-muted">v0.1.0-alpha</span>
        </div>
      </div>
    </aside>
  );
};
