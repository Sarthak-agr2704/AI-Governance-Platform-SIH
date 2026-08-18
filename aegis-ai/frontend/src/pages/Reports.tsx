import React from 'react';
import { FileSpreadsheet, Download, FileText } from 'lucide-react';

export const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" /> Governance & Audit Reports
          </h2>
          <p className="text-xs text-text-muted">Generate and export regulatory compliance dossiers and model card reports.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: 'EU AI Act Compliance Report (PDF)', type: 'Official PDF Dossier', size: '2.4 MB', date: 'Generated today' },
          { title: 'Model Card & Bias Metrics Export (JSON)', type: 'Machine readable export', size: '480 KB', date: 'Generated today' },
          { title: 'NIST AI RMF Executive Summary', type: 'Executive Presentation', size: '1.8 MB', date: 'Generated 3 days ago' },
          { title: 'Full System Audit Log Dump (CSV)', type: 'Raw Audit Logs', size: '5.1 MB', date: 'Generated 1 week ago' },
        ].map((report, idx) => (
          <div key={idx} className="bg-surface border border-surface-border rounded-xl p-5 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-text-main text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> {report.title}
              </h3>
              <p className="text-xs text-text-muted">{report.type} • {report.size} • {report.date}</p>
            </div>
            <button className="bg-surface-card hover:bg-surface-hover text-text-main border border-surface-border p-2.5 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
