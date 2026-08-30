import React, { useState, useEffect } from 'react';
import { getComplianceChecks } from '../services/api';
import { ComplianceResult } from '../types';
import { ShieldCheck, AlertTriangle, CheckCircle, Info, RefreshCw, FileCheck2, Layers } from 'lucide-react';

interface ComplianceProps {
  modelId?: number;
}

export const Compliance: React.FC<ComplianceProps> = ({ modelId = 1 }) => {
  const [data, setData] = useState<ComplianceResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCompliance = async () => {
    try {
      setLoading(true);
      const res = await getComplianceChecks(modelId);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompliance();
  }, [modelId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PASS':
        return <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-bold text-xs">PASS</span>;
      case 'WARNING':
        return <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full font-bold text-xs">WARNING</span>;
      default:
        return <span className="px-2.5 py-1 bg-danger/10 text-danger border border-danger/20 rounded-full font-bold text-xs">FAIL</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-primary" /> Governance Rules & Policy Engine
          </h2>
          <p className="text-xs text-text-muted">
            Automated checklist evaluating model governance artifacts against organizational policy rules and global AI safety standards.
          </p>
        </div>
        <button
          onClick={fetchCompliance}
          className="p-2.5 bg-card border border-border text-text-muted hover:text-text-main rounded-xl hover:bg-border/50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading || !data ? (
        <div className="p-12 text-center text-text-muted bg-card border border-border rounded-2xl">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary mb-3" />
          <p>Evaluating governance policy checks...</p>
        </div>
      ) : (
        <>
          {/* Compliance Score Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-card border border-border p-5 rounded-2xl">
              <span className="text-xs text-text-muted font-medium block">Policy Compliance Score</span>
              <span className="text-3xl font-extrabold text-primary mt-1 inline-block">{data.compliance_score}%</span>
            </div>

            <div className="bg-card border border-border p-5 rounded-2xl">
              <span className="text-xs text-text-muted font-medium block">Rules Evaluated</span>
              <span className="text-2xl font-bold text-text-main mt-1 inline-block">{data.total_rules} Rules</span>
            </div>

            <div className="bg-card border border-border p-5 rounded-2xl">
              <span className="text-xs text-text-muted font-medium block">Passed Requirements</span>
              <span className="text-2xl font-bold text-emerald-400 mt-1 inline-block">{data.passed} Passed</span>
            </div>

            <div className="bg-card border border-border p-5 rounded-2xl">
              <span className="text-xs text-text-muted font-medium block">Potential Policy Gaps</span>
              <span className="text-2xl font-bold text-amber-400 mt-1 inline-block">{data.warnings + data.failed} Gaps</span>
            </div>
          </div>

          {/* Governance Rules Table */}
          <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-text-main">Automated Governance Checklist</h3>
              <span className="text-xs text-text-muted italic">{data.disclaimer}</span>
            </div>

            <div className="space-y-3">
              {data.checks.map((c) => (
                <div
                  key={c.id}
                  className="p-4 bg-card-subtle border border-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-primary/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-primary">{c.id}</span>
                      <h4 className="text-sm font-bold text-text-main">{c.rule}</h4>
                    </div>
                    <p className="text-xs text-text-muted">{c.details}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {c.frameworks.map((fw, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 bg-background border border-border rounded text-text-muted">
                          {fw}
                        </span>
                      ))}
                    </div>
                  </div>
                  {getStatusBadge(c.status)}
                </div>
              ))}
            </div>
          </div>

          {/* Regulatory Framework Architecture Support */}
          <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" /> Supported Regulatory & Standards Frameworks
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-card-subtle border border-border rounded-xl space-y-2">
                <span className="font-bold text-xs text-primary block">NIST AI RMF 1.0</span>
                <p className="text-[11px] text-text-muted">Govern, Map, Measure, and Manage functions for trustworthy AI risk reduction.</p>
              </div>

              <div className="p-4 bg-card-subtle border border-border rounded-xl space-y-2">
                <span className="font-bold text-xs text-amber-400 block">EU AI Act Alignment</span>
                <p className="text-[11px] text-text-muted">Risk classification, technical documentation, transparency, and human oversight controls.</p>
              </div>

              <div className="p-4 bg-card-subtle border border-border rounded-xl space-y-2">
                <span className="font-bold text-xs text-emerald-400 block">ISO/IEC 42001</span>
                <p className="text-[11px] text-text-muted">Artificial Intelligence Management System (AIMS) standard controls and auditability.</p>
              </div>

              <div className="p-4 bg-card-subtle border border-border rounded-xl space-y-2">
                <span className="font-bold text-xs text-primary block">Organizational Policies</span>
                <p className="text-[11px] text-text-muted">Custom enterprise governance thresholds, approval workflows, and audit evidence policies.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
