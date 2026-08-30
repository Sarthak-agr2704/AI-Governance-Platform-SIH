import React, { useState, useEffect } from 'react';
import { getGovernanceScore } from '../services/api';
import { GovernanceScoreResult } from '../types';
import { ShieldCheck, ShieldAlert, Award, AlertCircle, RefreshCw, ChevronRight, CheckCircle2 } from 'lucide-react';

interface GovernanceProps {
  modelId?: number;
}

export const Governance: React.FC<GovernanceProps> = ({ modelId = 1 }) => {
  const [data, setData] = useState<GovernanceScoreResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchScore = async () => {
    try {
      setLoading(true);
      const res = await getGovernanceScore(modelId);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScore();
  }, [modelId]);

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
        return <span className="px-4 py-1.5 bg-danger/10 text-danger border border-danger/20 rounded-full font-extrabold text-sm">CRITICAL RISK</span>;
      case 'HIGH':
        return <span className="px-4 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full font-extrabold text-sm">HIGH RISK</span>;
      case 'MEDIUM':
        return <span className="px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full font-extrabold text-sm">MEDIUM RISK</span>;
      default:
        return <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-extrabold text-sm">LOW RISK</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" /> Integrated AI Governance Score & Risk Engine
          </h2>
          <p className="text-xs text-text-muted">
            Multi-dimensional weighted governance equation aggregating Fairness, Performance, Explainability, Data Quality, Monitoring, and Compliance.
          </p>
        </div>
        <button
          onClick={fetchScore}
          className="p-2.5 bg-card border border-border text-text-muted hover:text-text-main rounded-xl hover:bg-border/50 transition-colors"
          title="Recalculate Governance Score"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading || !data ? (
        <div className="p-12 text-center text-text-muted bg-card border border-border rounded-2xl">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary mb-3" />
          <p>Calculating integrated governance score...</p>
        </div>
      ) : (
        <>
          {/* Main Score Hero Card */}
          <div className="bg-card border border-border p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
            <div className="flex items-center gap-6">
              {/* Radial Score Representation */}
              <div className="relative w-32 h-32 flex items-center justify-center bg-card-subtle border-4 border-primary/40 rounded-full shadow-inner">
                <div className="text-center">
                  <span className="text-3xl font-black text-gold-gradient">{data.overall_score}</span>
                  <span className="text-[10px] text-text-muted block font-bold uppercase">/ 100</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-extrabold text-text-main">AI Governance Rating</h3>
                  {getRiskBadge(data.risk_level)}
                </div>
                <p className="text-xs text-text-muted leading-relaxed max-w-lg">
                  {data.risk_explanation}
                </p>
                <span className="text-[10px] text-text-muted italic block pt-1">
                  {data.disclaimer}
                </span>
              </div>
            </div>

            {/* Threshold Ranges Card */}
            <div className="p-4 bg-card-subtle border border-border rounded-xl text-xs space-y-2 w-full md:w-64">
              <span className="font-bold text-text-main block border-b border-border pb-1">Governance Risk Scale</span>
              <div className="flex justify-between text-emerald-400"><span>90 – 100</span><span className="font-semibold">LOW</span></div>
              <div className="flex justify-between text-primary"><span>75 – 89</span><span className="font-semibold">MEDIUM</span></div>
              <div className="flex justify-between text-amber-400"><span>50 – 74</span><span className="font-semibold">HIGH</span></div>
              <div className="flex justify-between text-danger"><span>0 – 49</span><span className="font-semibold">CRITICAL</span></div>
            </div>
          </div>

          {/* Component Score Breakdown Cards */}
          <div>
            <h3 className="text-base font-bold text-text-main mb-3">Governance Dimension Weighting Breakdown</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { name: 'Fairness', weight: '25%', score: data.component_scores.fairness, color: 'text-amber-400' },
                { name: 'Performance', weight: '20%', score: data.component_scores.performance, color: 'text-emerald-400' },
                { name: 'Explainability', weight: '15%', score: data.component_scores.explainability, color: 'text-primary' },
                { name: 'Data Quality', weight: '15%', score: data.component_scores.data_quality, color: 'text-amber-300' },
                { name: 'Monitoring', weight: '15%', score: data.component_scores.monitoring, color: 'text-primary' },
                { name: 'Compliance', weight: '10%', score: data.component_scores.compliance, color: 'text-emerald-300' },
              ].map((item, idx) => (
                <div key={idx} className="bg-card border border-border p-4 rounded-xl space-y-2 text-center">
                  <div className="flex items-center justify-between text-[10px] text-text-muted font-bold">
                    <span>{item.name}</span>
                    <span className="bg-card-subtle px-1.5 py-0.5 rounded border border-border">{item.weight}</span>
                  </div>
                  <p className={`text-2xl font-black ${item.color}`}>{item.score}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Why is this model high risk? Section */}
          <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" /> Why is this model classified as {data.risk_level} risk?
            </h3>

            <div className="space-y-3">
              {data.findings.map((f, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border space-y-2 ${
                    f.severity === 'HIGH'
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                      : f.severity === 'MEDIUM'
                      ? 'bg-primary/10 border-primary/20 text-primary'
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-text-main">{f.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-card border border-border">{f.severity}</span>
                  </div>
                  <p className="text-xs text-text-muted">{f.description}</p>
                  <div className="text-xs pt-2 border-t border-border/50">
                    <span className="font-semibold text-text-main">Evidence:</span> {f.evidence}
                  </div>
                  <div className="text-xs text-primary font-semibold">
                    <span>Recommended Action:</span> {f.recommended_action}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
