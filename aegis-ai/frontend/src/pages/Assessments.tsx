import React from 'react';
import { ClipboardCheck, FileText, CheckSquare, Clock } from 'lucide-react';

export const Assessments: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" /> Algorithmic Impact Assessments (AIA)
          </h2>
          <p className="text-xs text-text-muted">Evaluate high-risk AI deployments against mandatory regulatory checklists.</p>
        </div>
        <button className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors">
          + Start New Assessment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: 'EU AI Act High-Risk Classifier', date: 'Evaluated 2 days ago', score: '88% Compliant', status: 'Completed' },
          { title: 'NIST AI RMF 1.0 Assessment', date: 'Evaluated 1 week ago', score: '94% Compliant', status: 'Completed' },
          { title: 'Demographic Bias Assessment (Credit Model)', date: 'In Progress', score: 'Pending Review', status: 'In Review' },
          { title: 'Data Privacy & GDPR DPIA', date: 'Scheduled', score: '--', status: 'Scheduled' },
        ].map((item, idx) => (
          <div key={idx} className="bg-surface border border-surface-border rounded-xl p-5 space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-text-main text-sm">{item.title}</h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                item.status === 'Completed' ? 'bg-status-healthy/10 text-status-healthy' : 'bg-status-warning/10 text-status-warning'
              }`}>
                {item.status}
              </span>
            </div>
            <div className="text-xs text-text-muted flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" /> {item.date}
            </div>
            <div className="pt-2 border-t border-surface-border flex items-center justify-between text-xs">
              <span className="text-text-muted">Score / Rating:</span>
              <span className="font-mono font-bold text-primary">{item.score}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
