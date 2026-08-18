import React from 'react';
import {
  Boxes,
  ShieldCheck,
  AlertOctagon,
  Scale,
  Activity,
  ArrowUpRight,
  Database,
  ExternalLink,
  Cpu
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useHealth } from '../hooks/useHealth';
import { NavPageId } from '../types';

interface DashboardProps {
  onNavigate: (page: NavPageId) => void;
}

// Sample telemetry data for foundation visualization
const telemetryData = [
  { time: '00:00', health: 100, drift: 0.02, requests: 120 },
  { time: '04:00', health: 100, drift: 0.02, requests: 95 },
  { time: '08:00', health: 98, drift: 0.04, requests: 410 },
  { time: '12:00', health: 100, drift: 0.03, requests: 680 },
  { time: '16:00', health: 99, drift: 0.05, requests: 540 },
  { time: '20:00', health: 100, drift: 0.03, requests: 310 },
];

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { healthData, isHealthy, loading } = useHealth();

  return (
    <div className="space-y-6">
      {/* Top Banner / System Status */}
      <div className="bg-surface-card border border-surface-border rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg border ${
            isHealthy 
              ? 'bg-status-healthy/10 border-status-healthy/30 text-status-healthy' 
              : 'bg-status-critical/10 border-status-critical/30 text-status-critical'
          }`}>
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-text-main text-base flex items-center gap-2">
              Backend Service Status: 
              <span className={`font-mono text-sm ${isHealthy ? 'text-status-healthy' : 'text-status-critical'}`}>
                {loading ? 'CONNECTING...' : (healthData?.status.toUpperCase() || 'UNREACHABLE')}
              </span>
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Service: <code className="text-primary-light">{healthData?.service || 'AegisAI Backend'}</code> | REST API Endpoint: <code className="text-text-dim">GET /api/health</code>
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('models')}
          className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <span>View Model Inventory</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-surface border border-surface-border rounded-xl p-4 hover:border-surface-hover transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-muted uppercase">Active Models</span>
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-text-main">4 Deployed</div>
            <div className="text-xs text-status-healthy flex items-center gap-1 mt-1 font-medium">
              <span>● All systems operational</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-surface border border-surface-border rounded-xl p-4 hover:border-surface-hover transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-muted uppercase">Fairness Index</span>
            <div className="p-2 bg-status-healthy/10 rounded-lg text-status-healthy">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-text-main">0.94 / 1.0</div>
            <div className="text-xs text-text-muted mt-1 font-medium">
              <span>Disparate Impact Threshold &gt; 0.80</span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-surface border border-surface-border rounded-xl p-4 hover:border-surface-hover transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-muted uppercase">Compliance Rating</span>
            <div className="p-2 bg-status-info/10 rounded-lg text-status-info">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-text-main">92% Pass</div>
            <div className="text-xs text-status-healthy mt-1 font-medium">
              <span>EU AI Act High-Risk Compliant</span>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-surface border border-surface-border rounded-xl p-4 hover:border-surface-hover transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-muted uppercase">Risk Alerts</span>
            <div className="p-2 bg-status-warning/10 rounded-lg text-status-warning">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-text-main">1 Warning</div>
            <div className="text-xs text-status-warning mt-1 font-medium">
              <span>Data drift flag on Credit Model</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Area Chart */}
        <div className="lg:col-span-2 bg-surface border border-surface-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-text-main text-sm">System Health & Request Telemetry</h3>
              <p className="text-xs text-text-muted">Real-time platform throughput and service uptime percentage</p>
            </div>
            <span className="text-xs font-mono bg-surface-card px-2.5 py-1 rounded text-primary">Live Monitoring</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={11} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={11} domain={[90, 105]} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f9fafb' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Area type="monotone" dataKey="health" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#healthGradient)" name="Uptime %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Navigation Panels */}
        <div className="bg-surface border border-surface-border rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-text-main text-sm border-b border-surface-border pb-3">Governance Modules</h3>
          <div className="space-y-2">
            {[
              { id: 'fairness', name: 'Fairness & Bias Detection', desc: 'Disparate impact & parity ratios', icon: Scale },
              { id: 'explainability', name: 'Explainability Engine', desc: 'Feature attributions & SHAP values', icon: Cpu },
              { id: 'monitoring', name: 'Drift & Telemetry', desc: 'Data & concept drift monitoring', icon: Activity },
              { id: 'compliance', name: 'Compliance Checklist', desc: 'EU AI Act & NIST AI RMF framework', icon: ShieldCheck },
            ].map((module) => {
              const Icon = module.icon;
              return (
                <button
                  key={module.id}
                  onClick={() => onNavigate(module.id as NavPageId)}
                  className="w-full p-3 rounded-lg bg-surface-card hover:bg-surface-hover border border-surface-border text-left flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-background text-primary group-hover:text-primary-light transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-text-main">{module.name}</div>
                      <div className="text-[10px] text-text-muted">{module.desc}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-text-dim group-hover:text-text-main transition-colors" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
