import React from 'react';
import { Settings, Database, Server, Key, ShieldCheck } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-surface border border-surface-border rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-main">System Configuration & Integrations</h2>
            <p className="text-xs text-text-muted">Manage environment parameters, database connections, and API endpoints.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-surface-card border border-surface-border rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-text-main">
              <Database className="w-4 h-4 text-primary" /> Database Connection Mode
            </div>
            <p className="text-xs text-text-muted">Active URL: <code className="text-primary-light font-mono">sqlite:///./aegis.db</code> (Local Development SQLite Fallback)</p>
            <p className="text-xs text-text-dim">PostgreSQL ready via <code className="text-text-muted">DATABASE_URL</code> env variable.</p>
          </div>

          <div className="p-4 bg-surface-card border border-surface-border rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-text-main">
              <Server className="w-4 h-4 text-primary" /> Backend API Server
            </div>
            <p className="text-xs text-text-muted">Base URL: <code className="text-primary-light font-mono">http://localhost:8000</code></p>
          </div>
        </div>
      </div>
    </div>
  );
};
