import React, { useState, useEffect } from 'react';
import { generatePDFReport, getReportsList, getDownloadReportUrl } from '../services/api';
import { ReportItem } from '../types';
import { FileText, Download, Plus, RefreshCw, CheckCircle2, ShieldCheck, Award, FileSpreadsheet } from 'lucide-react';

interface ReportsProps {
  modelId?: number;
}

export const Reports: React.FC<ReportsProps> = ({ modelId = 1 }) => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await getReportsList();
      setReports(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setGenerating(true);
      await generatePDFReport(modelId, 'AegisAI Governance & Audit Report');
      await fetchReports();
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [modelId]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> Automated Governance Report Generation
          </h2>
          <p className="text-xs text-text-muted">
            Compile publication-ready 15-section PDF audit reports with executive summary, fairness findings, explainability, and compliance sign-off.
          </p>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={generating}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all shadow-md active:scale-95"
        >
          <Plus className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
          <span>{generating ? 'Generating PDF...' : 'Generate Audit Report'}</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-text-muted bg-card border border-border rounded-2xl">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary mb-3" />
          <p>Loading generated governance reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="p-12 text-center text-text-muted bg-card border border-border rounded-2xl space-y-3">
          <FileSpreadsheet className="w-10 h-10 text-primary mx-auto opacity-50" />
          <p className="font-bold text-text-main">No Reports Generated Yet</p>
          <p className="text-xs">Click "Generate Audit Report" above to build a 15-section PDF report for SIH judges and stakeholders.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-card border border-border rounded-2xl p-5 space-y-4 hover:border-primary/50 transition-all shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-text-main text-sm">{report.title}</h3>
                      <span className="text-[10px] text-text-muted">
                        Generated {report.created_at ? new Date(report.created_at).toLocaleString() : 'Recently'}
                      </span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    report.risk_level === 'HIGH' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {report.risk_level} RISK
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 bg-card-subtle rounded-xl border border-border/50 text-xs my-3">
                  <div>
                    <span className="text-[10px] text-text-muted block">Governance Rating</span>
                    <span className="font-bold text-primary">{report.governance_score}/100</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted block">File Size</span>
                    <span className="font-mono text-text-main">{Math.round((report.file_size_bytes || 45000) / 1024)} KB</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-[10px] text-text-muted font-mono">15 Standard Sections</span>
                <a
                  href={getDownloadReportUrl(report.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl text-xs font-semibold transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
