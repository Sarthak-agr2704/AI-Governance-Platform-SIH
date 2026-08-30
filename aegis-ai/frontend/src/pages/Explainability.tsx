import React, { useState, useEffect } from 'react';
import { getGlobalExplainability, predictAndExplainSample } from '../services/api';
import { GlobalFeatureImportance, LocalExplanationResult } from '../types';
import { BrainCircuit, Info, Sliders, CheckCircle2, XCircle, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ExplainabilityProps {
  modelId?: number;
}

export const Explainability: React.FC<ExplainabilityProps> = ({ modelId = 1 }) => {
  const [globals, setGlobals] = useState<GlobalFeatureImportance[]>([]);
  const [loadingGlobal, setLoadingGlobal] = useState<boolean>(true);

  // Local Predict Form state
  const [sampleInput, setSampleInput] = useState({
    age: 38,
    gender: 'Female',
    income: 72000,
    employment_status: 'Employed',
    credit_score: 640,
    loan_amount: 28000,
    previous_defaults: 1,
    education: 'Bachelor'
  });

  const [localResult, setLocalResult] = useState<LocalExplanationResult | null>(null);
  const [loadingLocal, setLoadingLocal] = useState<boolean>(false);

  const fetchGlobal = async () => {
    try {
      setLoadingGlobal(true);
      const res = await getGlobalExplainability(modelId);
      setGlobals(res.global_feature_importance);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingGlobal(false);
    }
  };

  const handlePredict = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setLoadingLocal(true);
      const res = await predictAndExplainSample(modelId, sampleInput);
      setLocalResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLocal(false);
    }
  };

  useEffect(() => {
    fetchGlobal();
    handlePredict();
  }, [modelId]);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-primary" /> Model Explainability & Interpretability (SHAP & Factor Attribution)
          </h2>
          <p className="text-xs text-text-muted">
            Inspect global model feature rankings and analyze individual prediction decisions using mathematical linear coefficient attribution.
          </p>
        </div>
      </div>

      {/* Global Explainability View */}
      <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-text-main">Global Feature Importance Ranking</h3>
            <p className="text-xs text-text-muted">Ranked impact of features across the Loan Approval dataset.</p>
          </div>
          <button
            onClick={fetchGlobal}
            className="p-2 bg-card border border-border text-text-muted hover:text-text-main rounded-xl hover:bg-border/50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loadingGlobal ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loadingGlobal ? (
          <div className="p-8 text-center text-text-muted">Loading global feature weights...</div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={globals}
                margin={{ top: 10, right: 30, left: 100, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#272733" opacity={0.5} />
                <XAxis type="number" stroke="#a1a1aa" fontSize={12} unit="%" domain={[0, 100]} />
                <YAxis type="category" dataKey="feature" stroke="#a1a1aa" fontSize={12} width={100} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#121217', borderColor: '#eab308', borderRadius: '12px', color: '#fafafa' }}
                />
                <Bar dataKey="relative_importance" name="Relative Importance %" radius={[0, 6, 6, 0]}>
                  {globals.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#eab308' : index === 1 ? '#fde047' : '#d97706'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Local Explainability Simulator */}
      <div className="bg-card border border-border p-6 rounded-2xl space-y-6">
        <div>
          <h3 className="text-base font-bold text-text-main flex items-center gap-2">
            <Sliders className="w-5 h-5 text-primary" /> Individual Prediction & Local Factor Attribution Simulator
          </h3>
          <p className="text-xs text-text-muted">Select or modify applicant features to evaluate exact prediction confidence and influencing factors.</p>
        </div>

        {/* Input Parameters Form */}
        <form onSubmit={handlePredict} className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-text-muted font-medium mb-1">Credit Score</label>
            <input
              type="number"
              value={sampleInput.credit_score}
              onChange={(e) => setSampleInput({ ...sampleInput, credit_score: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary text-text-main font-semibold"
            />
          </div>

          <div>
            <label className="block text-text-muted font-medium mb-1">Annual Income ($)</label>
            <input
              type="number"
              value={sampleInput.income}
              onChange={(e) => setSampleInput({ ...sampleInput, income: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary text-text-main font-semibold"
            />
          </div>

          <div>
            <label className="block text-text-muted font-medium mb-1">Loan Amount ($)</label>
            <input
              type="number"
              value={sampleInput.loan_amount}
              onChange={(e) => setSampleInput({ ...sampleInput, loan_amount: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary text-text-main font-semibold"
            />
          </div>

          <div>
            <label className="block text-text-muted font-medium mb-1">Previous Defaults</label>
            <input
              type="number"
              min="0"
              max="5"
              value={sampleInput.previous_defaults}
              onChange={(e) => setSampleInput({ ...sampleInput, previous_defaults: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary text-text-main font-semibold"
            />
          </div>

          <div>
            <label className="block text-text-muted font-medium mb-1">Age</label>
            <input
              type="number"
              value={sampleInput.age}
              onChange={(e) => setSampleInput({ ...sampleInput, age: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary text-text-main font-semibold"
            />
          </div>

          <div>
            <label className="block text-text-muted font-medium mb-1">Gender</label>
            <select
              value={sampleInput.gender}
              onChange={(e) => setSampleInput({ ...sampleInput, gender: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary text-text-main font-semibold"
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>

          <div>
            <label className="block text-text-muted font-medium mb-1">Employment</label>
            <select
              value={sampleInput.employment_status}
              onChange={(e) => setSampleInput({ ...sampleInput, employment_status: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary text-text-main font-semibold"
            >
              <option value="Employed">Employed</option>
              <option value="Self-Employed">Self-Employed</option>
              <option value="Unemployed">Unemployed</option>
              <option value="Retired">Retired</option>
            </select>
          </div>

          <div>
            <label className="block text-text-muted font-medium mb-1">Education</label>
            <select
              value={sampleInput.education}
              onChange={(e) => setSampleInput({ ...sampleInput, education: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary text-text-main font-semibold"
            >
              <option value="High School">High School</option>
              <option value="Bachelor">Bachelor</option>
              <option value="Master">Master</option>
              <option value="PhD">PhD</option>
            </select>
          </div>

          <div className="col-span-2 sm:col-span-4 flex justify-end">
            <button
              type="submit"
              disabled={loadingLocal}
              className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-slate-950 font-black rounded-xl transition-all shadow-md active:scale-95"
            >
              {loadingLocal ? 'Simulating Prediction...' : 'Explain Prediction'}
            </button>
          </div>
        </form>

        {/* Output Explanation Results */}
        {localResult && (
          <div className="pt-6 border-t border-border space-y-6 animate-fadeIn">
            {/* Prediction Banner */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-5 bg-card-subtle border border-border rounded-2xl gap-4">
              <div className="flex items-center gap-3">
                {localResult.prediction === 'Approved' ? (
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                ) : (
                  <div className="p-3 bg-danger/10 text-danger border border-danger/20 rounded-2xl">
                    <XCircle className="w-8 h-8" />
                  </div>
                )}
                <div>
                  <span className="text-xs text-text-muted font-medium">Model Outcome Prediction</span>
                  <h4 className="text-xl font-extrabold text-text-main">
                    Loan {localResult.prediction}
                  </h4>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-text-muted block font-medium">Model Confidence</span>
                <span className="text-2xl font-extrabold text-primary">{localResult.confidence}%</span>
              </div>
            </div>

            {/* Plain Language Summary */}
            <div className="p-4 bg-primary/10 border border-primary/20 text-primary rounded-xl text-xs flex items-start gap-2.5">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Plain-Language Explanation:</strong> {localResult.explanation}
              </p>
            </div>

            {/* Influencing Factor Cards */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Factors Influencing Prediction</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {localResult.factors.map((factor, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border flex flex-col justify-between ${
                      factor.direction === 'Positive'
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                        : 'bg-danger/5 border-danger/20 text-danger'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-text-main">{factor.feature}</span>
                        {factor.direction === 'Positive' ? (
                          <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-danger" />
                        )}
                      </div>
                      <span className="text-[10px] block opacity-80 mt-1">{factor.impact}</span>
                    </div>
                    <div className="mt-3 text-right">
                      <span className="font-mono text-base font-extrabold">
                        {factor.contribution > 0 ? `+${factor.contribution}` : factor.contribution}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
