import React, { useState, useEffect } from 'react';
import { getMonitoringHistory, simulateMonitoring } from '../services/api';
import { MonitoringResult } from '../types';
import { Activity, AlertTriangle, CheckCircle, RefreshCw, Play, TrendingDown, ShieldAlert, LineChart } from 'lucide-react';
import { LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MonitoringProps {
  modelId?: number;
}

export const Monitoring: React.FC<MonitoringProps> = ({ modelId = 1 }) => {
  const [data, setData] = useState<MonitoringResult | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [simulating, setSimulating] = useState<boolean>(false);

  const fetchMonitoring = async () => {
    try {
      setLoading(true);
      const res = await getMonitoringHistory(modelId);
      setData(res.latest_run);
      setHistory(res.history);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateNewData = async () => {
    try {
      setSimulating(true);
      const res = await simulateMonitoring(modelId, 0.30); // 30% distribution shift severity
      setData(res);
      await fetchMonitoring();
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(false);
    }
  };

  useEffect(() => {
    fetchMonitoring();
  }, [modelId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-extrabold text-xs">HEALTHY</span>;
      case 'WARNING':
        return <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full font-extrabold text-xs">WARNING</span>;
      case 'DEGRADED':
        return <span className="px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full font-extrabold text-xs">DEGRADED</span>;
      default:
        return <span className="px-3 py-1 bg-danger/10 text-danger border border-danger/20 rounded-full font-extrabold text-xs">CRITICAL</span>;
    }
  };

  // Chart data format
  const chartHistoryData = history.map((item, index) => ({
    run: `Run #${history.length - index}`,
    accuracy: item.accuracy ? parseFloat((item.accuracy * 100).toFixed(1)) : 90,
    dataDrift: item.data_drift_pct || 0,
    fairness: item.fairness_score || 80,
  })).reverse();

  return (
    <div className="space-y-6">
      {/* Top Banner / Simulate Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Production Data Drift & Model Health Monitoring
          </h2>
          <p className="text-xs text-text-muted">
            Track performance decay, Population Stability Index (PSI) data drift, prediction shift, and fairness metrics over time.
          </p>
        </div>

        <button
          onClick={handleSimulateNewData}
          disabled={simulating}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-slate-950 font-black rounded-xl transition-all shadow-md active:scale-95"
        >
          <Play className={`w-4 h-4 ${simulating ? 'animate-spin' : ''}`} />
          <span>{simulating ? 'Simulating Drift...' : 'Simulate New Production Data'}</span>
        </button>
      </div>

      {loading || !data ? (
        <div className="p-12 text-center text-text-muted bg-card border border-border rounded-2xl">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary mb-3" />
          <p>Loading production monitoring data...</p>
        </div>
      ) : (
        <>
          {/* Key Monitoring Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-card border border-border p-5 rounded-2xl flex flex-col justify-between">
              <span className="text-xs text-text-muted font-medium">Model Health Status</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-xl font-bold text-text-main">Production</span>
                {getStatusBadge(data.status)}
              </div>
              <span className="text-[10px] text-text-muted mt-2">Evaluated on {data.dataset_size} batch samples</span>
            </div>

            <div className="bg-card border border-border p-5 rounded-2xl flex flex-col justify-between">
              <span className="text-xs text-text-muted font-medium">Model Accuracy</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold text-text-main">{(data.accuracy * 100).toFixed(1)}%</span>
                {data.baseline_accuracy && (
                  <span className="text-xs text-amber-400 font-semibold">
                    (Baseline: {(data.baseline_accuracy * 100).toFixed(1)}%)
                  </span>
                )}
              </div>
              <span className="text-[10px] text-text-muted mt-2">Classification Performance SLA</span>
            </div>

            <div className="bg-card border border-border p-5 rounded-2xl flex flex-col justify-between">
              <span className="text-xs text-text-muted font-medium">Data Drift (PSI)</span>
              <div className="mt-2">
                <span className={`text-2xl font-bold ${data.data_drift_pct >= 20 ? 'text-danger' : 'text-emerald-400'}`}>
                  {data.data_drift_pct}%
                </span>
              </div>
              <span className="text-[10px] text-text-muted mt-2">Feature distribution variance</span>
            </div>

            <div className="bg-card border border-border p-5 rounded-2xl flex flex-col justify-between">
              <span className="text-xs text-text-muted font-medium">Fairness Score</span>
              <div className="mt-2">
                <span className={`text-2xl font-bold ${data.fairness_score < 70 ? 'text-danger' : 'text-primary'}`}>
                  {data.fairness_score}/100
                </span>
              </div>
              <span className="text-[10px] text-text-muted mt-2">Production subgroup parity</span>
            </div>
          </div>

          {/* Monitoring Historical Trend Line Chart */}
          <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-text-main flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-primary" /> Historical Drift & Accuracy Trend
                </h3>
                <p className="text-xs text-text-muted">Tracking metrics across recent production batch runs.</p>
              </div>
              <span className="text-xs text-primary font-bold px-3 py-1 bg-primary/10 border border-primary/20 rounded-xl">
                Synthetic Demo Monitoring Data
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ReLineChart data={chartHistoryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#272733" opacity={0.5} />
                  <XAxis dataKey="run" stroke="#a1a1aa" fontSize={12} />
                  <YAxis stroke="#a1a1aa" fontSize={12} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#121217', borderColor: '#eab308', borderRadius: '12px', color: '#fafafa' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="accuracy" name="Accuracy %" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="dataDrift" name="Data Drift %" stroke="#ef4444" strokeWidth={3} dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="fairness" name="Fairness Score" stroke="#eab308" strokeWidth={2} strokeDasharray="5 5" />
                </ReLineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active Monitoring Alerts */}
          <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" /> Active Monitoring Alerts & Drift Logs
            </h3>

            <div className="space-y-3 text-xs">
              {data.alerts && data.alerts.length > 0 ? (
                data.alerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border flex items-start gap-3 ${
                      data.status === 'CRITICAL'
                        ? 'bg-danger/10 border-danger/20 text-danger font-semibold'
                        : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{alert}</span>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>No active drift alerts. Model feature distributions match baseline.</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
