import React, { useState, useEffect } from 'react';
import { getFairness } from '../services/api';
import { FairnessAnalysisResult } from '../types';
import { Scale, AlertTriangle, CheckCircle, Info, RefreshCw, Sliders } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BiasDetectionProps {
  modelId?: number;
}

export const BiasDetection: React.FC<BiasDetectionProps> = ({ modelId = 1 }) => {
  const [attribute, setAttribute] = useState<string>('Gender');
  const [warningThreshold, setWarningThreshold] = useState<number>(0.10);
  const [criticalThreshold, setCriticalThreshold] = useState<number>(0.20);
  const [data, setData] = useState<FairnessAnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchFairnessData = async () => {
    try {
      setLoading(true);
      const res = await getFairness(modelId, attribute);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFairnessData();
  }, [modelId, attribute]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PASS':
        return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-extrabold text-xs">PASS</span>;
      case 'WARNING':
        return <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full font-extrabold text-xs">WARNING</span>;
      default:
        return <span className="px-3 py-1 bg-danger/10 text-danger border border-danger/20 rounded-full font-extrabold text-xs">FAIL</span>;
    }
  };

  // Format chart data from group metrics
  const chartData = data?.selection_rates
    ? Object.keys(data.selection_rates).map((groupKey) => ({
        group: groupKey,
        selectionRate: roundPct(data.selection_rates[groupKey]),
        tpr: roundPct(data.true_positive_rates[groupKey]),
        fpr: roundPct(data.false_positive_rates[groupKey]),
        fnr: roundPct(data.false_negative_rates[groupKey]),
      }))
    : [];

  function roundPct(val: number) {
    return val ? parseFloat((val * 100).toFixed(1)) : 0;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Attribute Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" /> Bias & Fairness Evaluation Engine
          </h2>
          <p className="text-xs text-text-muted">
            Assess Demographic Parity, Selection Rates, and Equal Opportunity disparities across protected subgroups.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-text-muted" />
            <span className="text-xs font-semibold text-text-muted">Sensitive Attribute:</span>
          </div>
          <select
            value={attribute}
            onChange={(e) => setAttribute(e.target.value)}
            className="px-3 py-2 bg-background border border-border rounded-xl text-xs font-semibold focus:outline-none text-text-main"
          >
            <option value="Gender">Gender (Male vs Female)</option>
            <option value="Age Group">Age Group (&lt;30, 30-50, &gt;50)</option>
          </select>
          <button
            onClick={fetchFairnessData}
            className="p-2 bg-card border border-border text-text-muted hover:text-text-main rounded-xl hover:bg-border/50 transition-colors"
            title="Refresh Fairness Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading || !data ? (
        <div className="p-12 text-center text-text-muted bg-card border border-border rounded-2xl">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary mb-3" />
          <p>Calculating real model fairness metrics...</p>
        </div>
      ) : (
        <>
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-card border border-border p-5 rounded-2xl flex flex-col justify-between">
              <span className="text-xs text-text-muted font-medium">Overall Fairness Score</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className={`text-3xl font-extrabold ${data.overall_fairness_score >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {data.overall_fairness_score}/100
                </span>
                {getStatusBadge(data.status)}
              </div>
              <p className="text-[10px] text-text-muted mt-2">Weighted composite rating</p>
            </div>

            <div className="bg-card border border-border p-5 rounded-2xl flex flex-col justify-between">
              <span className="text-xs text-text-muted font-medium">Demographic Parity Diff</span>
              <div className="mt-2">
                <span className="text-2xl font-bold text-text-main">
                  {(data.demographic_parity_diff * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-[10px] text-amber-400 mt-2">Threshold: {(warningThreshold * 100).toFixed(0)}% Warning / {(criticalThreshold * 100).toFixed(0)}% Critical</p>
            </div>

            <div className="bg-card border border-border p-5 rounded-2xl flex flex-col justify-between">
              <span className="text-xs text-text-muted font-medium">Disparate Impact Ratio</span>
              <div className="mt-2">
                <span className="text-2xl font-bold text-text-main">
                  {data.disparate_impact_ratio.toFixed(2)}
                </span>
              </div>
              <p className="text-[10px] text-text-muted mt-2">80% Rule (0.80) Benchmark</p>
            </div>

            <div className="bg-card border border-border p-5 rounded-2xl flex flex-col justify-between">
              <span className="text-xs text-text-muted font-medium">Equal Opportunity Gap</span>
              <div className="mt-2">
                <span className="text-2xl font-bold text-text-main">
                  {(data.equal_opportunity_diff * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-[10px] text-text-muted mt-2">True Positive Rate variance</p>
            </div>
          </div>

          {/* Group Comparison Chart */}
          <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-text-main">Subgroup Selection Rate Comparison ({attribute})</h3>
                <p className="text-xs text-text-muted">Calculated loan approval percentages by sensitive demographic subgroup.</p>
              </div>
              <span className="text-[10px] bg-card-subtle px-2.5 py-1 rounded-lg border border-border text-primary font-bold">
                Gold Platform Thresholds
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#272733" opacity={0.5} />
                  <XAxis dataKey="group" stroke="#a1a1aa" fontSize={12} />
                  <YAxis stroke="#a1a1aa" fontSize={12} unit="%" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#121217', borderColor: '#eab308', borderRadius: '12px', color: '#fafafa' }}
                  />
                  <Legend />
                  <Bar dataKey="selectionRate" name="Selection (Approval) Rate %" fill="#eab308" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="tpr" name="True Positive Rate (TPR) %" fill="#10b981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="fpr" name="False Positive Rate (FPR) %" fill="#f97316" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Subgroup Metrics Breakdown Table */}
          <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-text-main">Detailed Subgroup Metric Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-card-subtle border-b border-border text-text-muted">
                  <tr>
                    <th className="p-3 font-semibold">Subgroup ({attribute})</th>
                    <th className="p-3 font-semibold">Total Sample</th>
                    <th className="p-3 font-semibold">Approved Count</th>
                    <th className="p-3 font-semibold">Selection Rate</th>
                    <th className="p-3 font-semibold">True Positive Rate (TPR)</th>
                    <th className="p-3 font-semibold">False Positive Rate (FPR)</th>
                    <th className="p-3 font-semibold">False Negative Rate (FNR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {Object.keys(data.group_metrics).map((g) => {
                    const m = data.group_metrics[g];
                    return (
                      <tr key={g} className="hover:bg-card-subtle/50 transition-colors text-text-main font-medium">
                        <td className="p-3 font-bold text-primary">{g}</td>
                        <td className="p-3">{m.total_count?.toLocaleString()}</td>
                        <td className="p-3">{m.approved_count?.toLocaleString()}</td>
                        <td className="p-3 font-bold text-emerald-400">{m.selection_rate_pct}</td>
                        <td className="p-3">{(m.true_positive_rate * 100).toFixed(1)}%</td>
                        <td className="p-3">{(m.false_positive_rate * 100).toFixed(1)}%</td>
                        <td className="p-3">{(m.false_negative_rate * 100).toFixed(1)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommendations & Plain Language Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border p-6 rounded-2xl space-y-3">
              <h3 className="text-base font-bold text-text-main flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" /> Plain-Language Fairness Explanation
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">{data.explanation}</p>
              <p className="text-[10px] text-text-muted font-mono italic pt-2 border-t border-border">
                {data.disclaimer}
              </p>
            </div>

            <div className="bg-card border border-border p-6 rounded-2xl space-y-3">
              <h3 className="text-base font-bold text-text-main flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Automated Governance Recommendations
              </h3>
              <div className="space-y-2 text-xs">
                {data.recommendations.map((rec, i) => (
                  <div key={i} className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
