import React, { useState, useEffect } from 'react';
import {
  Boxes,
  ShieldCheck,
  AlertOctagon,
  Scale,
  Activity,
  ArrowUpRight,
  Cpu,
  Sparkles,
  Award,
  AlertTriangle,
  Play,
  CheckCircle2,
  LineChart,
  Eye,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  FileCheck2,
  Server
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Cell } from 'recharts';
import { useHealth } from '../hooks/useHealth';
import { NavPageId, AIModel } from '../types';
import { getModels } from '../services/api';
import { DemoWorkflowModal } from '../components/DemoWorkflowModal';

interface DashboardProps {
  onNavigate: (page: NavPageId) => void;
}

const trendData = [
  { run: 'Baseline', score: 85, drift: 2 },
  { run: 'Run 1', score: 82, drift: 5 },
  { run: 'Run 2', score: 79, drift: 9 },
  { run: 'Run 3', score: 74, drift: 14 },
  { run: 'Current', score: 72, drift: 18 },
];

const riskDistributionData = [
  { risk: 'Low', count: 1, color: '#34D399' },
  { risk: 'Medium', count: 2, color: '#FACC15' },
  { risk: 'High', count: 1, color: '#FB923C' },
  { risk: 'Critical', count: 0, color: '#F87171' },
];

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { healthData, isHealthy, loading } = useHealth();
  const [models, setModels] = useState<AIModel[]>([]);
  const [isDemoOpen, setIsDemoOpen] = useState<boolean>(false);

  useEffect(() => {
    getModels()
      .then(setModels)
      .catch((err) => console.error(err));
  }, []);

  const totalModels = models.length || 1;
  const monitoredModels = models.filter((m) => m.deployment_status === 'Production').length || 1;
  const highRiskModels = models.filter((m) => m.risk_category === 'High' || m.risk_category === 'Critical').length || 1;
  const avgScore = models.length
    ? Math.round(models.reduce((acc, m) => acc + (m.governance_score || 86), 0) / models.length)
    : 86;

  const getRiskBadge = (risk: string) => {
    switch (risk.toUpperCase()) {
      case 'CRITICAL':
        return <span className="px-2.5 py-0.5 text-xs font-bold bg-[#F87171]/15 text-[#F87171] border border-[#F87171]/30 rounded-full">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2.5 py-0.5 text-xs font-bold bg-[#FB923C]/15 text-[#FB923C] border border-[#FB923C]/30 rounded-full">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-0.5 text-xs font-bold bg-[#FACC15]/15 text-[#FACC15] border border-[#FACC15]/30 rounded-full">MEDIUM</span>;
      default:
        return <span className="px-2.5 py-0.5 text-xs font-bold bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30 rounded-full">LOW</span>;
    }
  };

  return (
    <div className="space-y-6 animate-slideUp bg-[#07111A]">
      {/* 4. Hero Section Card */}
      <div className="relative overflow-hidden bg-[#0D1B24] border border-[#1D3440] rounded-2xl p-7 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 spotlight-card">
        {/* Network Lines Visualization Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 40 Q 150 100, 300 20 T 600 80" stroke="#34D399" strokeWidth="1" fill="none" />
            <path d="M100 120 Q 350 40, 700 100" stroke="#67E8F9" strokeWidth="1" strokeDasharray="4 4" fill="none" />
            <circle cx="300" cy="20" r="3" fill="#34D399" />
            <circle cx="150" cy="70" r="2" fill="#67E8F9" />
            <circle cx="600" cy="80" r="3" fill="#E8D5A3" />
          </svg>
        </div>

        <div className="space-y-2.5 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#101F29] text-[#E8D5A3] rounded-full text-xs font-bold border border-[#1D3440]">
            <Sparkles className="w-3.5 h-3.5 text-[#E8D5A3]" />
            <span>SIH 2026 Pitch Black & Matte Gold Edition</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F8FAFC]">
            AegisAI Responsible AI Governance Platform
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
            Enterprise AI governance command center: model onboarding, demographic bias metrics, SHAP feature explainability, production drift monitoring, automated governance scoring, compliance auditing, and PDF report generation.
          </p>
        </div>

        <button
          onClick={() => setIsDemoOpen(true)}
          className="emerald-button-glow flex items-center gap-2.5 px-6 py-3.5 text-[#07111A] font-bold rounded-xl border border-[#34D399]/40 whitespace-nowrap group text-xs relative z-10 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current text-[#07111A]" />
          <span>Launch Interactive Demo</span>
        </button>
      </div>

      {/* 5. Full-Width Backend Status Bar */}
      <div className="bg-[#0D1B24] border border-[#1D3440] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isHealthy ? 'bg-[#34D399]' : 'bg-[#FACC15]'}`} />
          <span className="font-bold text-[#F8FAFC]">
            Backend API Status: <code className="text-[#34D399] font-bold">{isHealthy ? 'ONLINE (FastAPI REST Service)' : 'CONNECTING...'}</code>
          </span>
        </div>
        <span className="text-[#94A3B8] font-mono text-[11px] bg-[#101F29] px-3 py-1 rounded-lg border border-[#1D3440]">
          Endpoint: <code className="text-[#34D399]">GET /api/v1/health</code>
        </span>
      </div>

      {/* 6. Four Modern KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Models */}
        <div className="bg-[#0D1B24] border border-[#1D3440] rounded-2xl p-5 shadow-sm spotlight-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Total Models</span>
            <div className="p-2.5 bg-[#34D399]/15 rounded-xl text-[#34D399] border border-[#34D399]/30">
              <Boxes className="w-5 h-5 text-[#34D399]" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#F8FAFC] tracking-tight">{totalModels} Registered</div>
            <span className="text-xs text-[#34D399] font-semibold mt-1 block">Enterprise AI Model Registry</span>
          </div>
        </div>

        {/* Card 2: Models Monitored */}
        <div className="bg-[#0D1B24] border border-[#1D3440] rounded-2xl p-5 shadow-sm spotlight-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Models Monitored</span>
            <div className="p-2.5 bg-[#67E8F9]/15 rounded-xl text-[#67E8F9] border border-[#67E8F9]/30">
              <Activity className="w-5 h-5 text-[#67E8F9]" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#F8FAFC] tracking-tight">{monitoredModels} Active</div>
            <span className="text-xs text-[#94A3B8] font-semibold mt-1 block">Continuous Drift Tracking</span>
          </div>
        </div>

        {/* Card 3: High Risk Models */}
        <div className="bg-[#0D1B24] border border-[#1D3440] rounded-2xl p-5 shadow-sm spotlight-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">High Risk Models</span>
            <div className="p-2.5 bg-[#FB923C]/15 rounded-xl text-[#FB923C] border border-[#FB923C]/30">
              <AlertOctagon className="w-5 h-5 text-[#FB923C]" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#FB923C] tracking-tight">{highRiskModels} High Risk</div>
            <span className="text-xs text-[#FB923C] font-semibold mt-1 block">Requires Mitigation</span>
          </div>
        </div>

        {/* Card 4: Average Score */}
        <div className="bg-[#0D1B24] border border-[#1D3440] rounded-2xl p-5 shadow-sm spotlight-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Average Score</span>
            <div className="p-2.5 bg-[#38BDF8]/15 rounded-xl text-[#38BDF8] border border-[#38BDF8]/30">
              <Award className="w-5 h-5 text-[#38BDF8]" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#38BDF8] tracking-tight">{avgScore} / 100</div>
            <span className="text-xs text-[#94A3B8] font-semibold mt-1 block">Platform Weighted Rating</span>
          </div>
        </div>
      </div>

      {/* 7. Main Analytics Area (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Governance Score Trend & Data Drift */}
        <div className="lg:col-span-2 bg-[#0D1B24] border border-[#1D3440] rounded-2xl p-6 space-y-4 shadow-sm spotlight-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#F8FAFC] text-sm flex items-center gap-2">
                <LineChart className="w-4 h-4 text-[#34D399]" /> Governance Score Trend & Data Drift
              </h3>
              <p className="text-xs text-[#94A3B8]">Historical governance rating vs production drift percentage.</p>
            </div>
            <span className="text-xs font-mono bg-[#101F29] px-3 py-1 rounded-lg border border-[#1D3440] text-[#E8D5A3] font-bold">
              Matte Gold Telemetry
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreTealGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34D399" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#34D399" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1D3440" opacity={0.6} />
                <XAxis dataKey="run" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0D1B24', borderColor: '#34D399', borderRadius: '12px', color: '#F8FAFC' }} />
                <Area type="monotone" dataKey="score" stroke="#34D399" strokeWidth={3} fill="url(#scoreTealGrad)" name="Governance Score" />
                <Line type="monotone" dataKey="drift" stroke="#67E8F9" strokeWidth={2} strokeDasharray="4 4" name="Data Drift %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Risk Category Distribution */}
        <div className="bg-[#0D1B24] border border-[#1D3440] rounded-2xl p-6 space-y-4 shadow-sm spotlight-card">
          <h3 className="font-bold text-[#F8FAFC] text-sm">Risk Category Distribution</h3>
          <p className="text-xs text-[#94A3B8]">Model count categorized by platform risk levels.</p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1D3440" opacity={0.6} />
                <XAxis dataKey="risk" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0D1B24', borderColor: '#34D399', borderRadius: '12px', color: '#F8FAFC' }} />
                <Bar dataKey="count" name="Models" radius={[6, 6, 0, 0]}>
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 8. Governance-at-a-Glance Section */}
      <div className="bg-[#0D1B24] border border-[#1D3440] rounded-2xl p-6 space-y-4 shadow-sm spotlight-card">
        <div>
          <h3 className="font-bold text-[#F8FAFC] text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#34D399]" /> Governance at a Glance
          </h3>
          <p className="text-xs text-[#94A3B8]">Real-time insights into model health, risks, and compliance posture.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-[#101F29] border border-[#1D3440] rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-[#94A3B8] font-medium block">Data Drift</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg font-bold text-[#F8FAFC]">2.34%</span>
                <span className="text-xs text-[#34D399] font-bold flex items-center gap-0.5">
                  <TrendingDown className="w-3 h-3" /> 0.45%
                </span>
              </div>
            </div>
            <div className="p-2.5 bg-[#67E8F9]/10 text-[#67E8F9] rounded-xl border border-[#67E8F9]/20">
              <Activity className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 bg-[#101F29] border border-[#1D3440] rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-[#94A3B8] font-medium block">Bias Score</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg font-bold text-[#F8FAFC]">0.18</span>
                <span className="text-xs text-[#34D399] font-bold flex items-center gap-0.5">
                  <TrendingDown className="w-3 h-3" /> 0.07
                </span>
              </div>
            </div>
            <div className="p-2.5 bg-[#34D399]/10 text-[#34D399] rounded-xl border border-[#34D399]/20">
              <Scale className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 bg-[#101F29] border border-[#1D3440] rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-[#94A3B8] font-medium block">Compliance</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg font-bold text-[#F8FAFC]">92%</span>
                <span className="text-xs text-[#34D399] font-bold flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> 3%
                </span>
              </div>
            </div>
            <div className="p-2.5 bg-[#E8D5A3]/10 text-[#E8D5A3] rounded-xl border border-[#E8D5A3]/20">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 bg-[#101F29] border border-[#1D3440] rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-[#94A3B8] font-medium block">Uptime</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg font-bold text-[#F8FAFC]">99.9%</span>
                <span className="text-xs text-[#34D399] font-bold flex items-center gap-1">
                  ● Healthy
                </span>
              </div>
            </div>
            <div className="p-2.5 bg-[#34D399]/10 text-[#34D399] rounded-xl border border-[#34D399]/20">
              <Server className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* AI Models Requiring Governance Attention Section */}
      <div className="bg-[#0D1B24] border border-[#1D3440] rounded-2xl p-6 space-y-4 shadow-sm spotlight-card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[#F8FAFC] text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#FB923C]" /> AI Models Requiring Governance Attention
            </h3>
            <p className="text-xs text-[#94A3B8]">High risk models or those with active bias warnings or production data drift flags.</p>
          </div>
          <button
            onClick={() => onNavigate('models')}
            className="text-xs font-bold text-[#34D399] hover:underline flex items-center gap-1"
          >
            <span>View All Models</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#101F29] border-b border-[#1D3440] text-[#94A3B8] uppercase tracking-wider font-bold">
              <tr>
                <th className="p-3.5">Model</th>
                <th className="p-3.5">Risk Level</th>
                <th className="p-3.5">Governance Score</th>
                <th className="p-3.5">Identified Issue</th>
                <th className="p-3.5">Last Assessment</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D3440]">
              {models.map((m) => (
                <tr key={m.id} className="hover:bg-[#101F29]/60 transition-colors text-[#F8FAFC] font-medium">
                  <td className="p-3.5 font-bold text-[#34D399]">
                    {m.name} <span className="text-[10px] text-[#94A3B8] font-normal">v{m.version}</span>
                  </td>
                  <td className="p-3.5">{getRiskBadge(m.risk_category)}</td>
                  <td className="p-3.5 font-bold text-[#34D399]">{m.governance_score}/100</td>
                  <td className="p-3.5 text-[#94A3B8]">
                    {m.risk_category === 'High' ? 'Gender selection rate disparity (12.8%) exceeds threshold' : 'Nominal operation'}
                  </td>
                  <td className="p-3.5 text-[#94A3B8] font-mono text-[11px]">
                    {m.last_assessment ? new Date(m.last_assessment).toLocaleDateString() : 'Today'}
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => onNavigate('models')}
                      className="px-3.5 py-1.5 bg-[#34D399]/10 hover:bg-[#34D399] text-[#34D399] hover:text-[#07111A] font-bold rounded-xl transition-all flex items-center gap-1.5 ml-auto border border-[#34D399]/30"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guided SIH Demo Modal */}
      <DemoWorkflowModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onNavigate={onNavigate}
      />
    </div>
  );
};
