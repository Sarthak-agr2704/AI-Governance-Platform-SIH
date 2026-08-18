import React from 'react';
import { History, Shield, Lock } from 'lucide-react';

export const AuditTrail: React.FC = () => {
  const auditLogs = [
    { id: 'LOG-8812', timestamp: '2026-08-18 22:45:12', user: 'admin@aegis.ai', event: 'Model Registration', details: 'Registered Credit Scoring AI (v2.4.1)', hash: 'sha256:7f8a9...' },
    { id: 'LOG-8811', timestamp: '2026-08-18 21:10:00', user: 'system', event: 'Health Check', details: 'Database ping successful (SQLite local)', hash: 'sha256:3b1c2...' },
    { id: 'LOG-8810', timestamp: '2026-08-18 19:30:45', user: 'auditor@aegis.ai', event: 'AIA Evaluation', details: 'Completed EU AI Act high-risk checklist', hash: 'sha256:9e4f5...' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
            <History className="w-5 h-5 text-primary" /> Immutable Audit Logs
          </h2>
          <p className="text-xs text-text-muted">Cryptographically verifiable trail of model updates, assessments, and policy changes.</p>
        </div>
      </div>

      <div className="bg-surface border border-surface-border rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs text-text-main">
          <thead className="bg-surface-card border-b border-surface-border text-text-muted uppercase text-[11px]">
            <tr>
              <th className="p-4 font-semibold">Log ID & Timestamp</th>
              <th className="p-4 font-semibold">Actor / User</th>
              <th className="p-4 font-semibold">Event</th>
              <th className="p-4 font-semibold">Description</th>
              <th className="p-4 font-semibold">Cryptographic Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border font-mono text-[11px]">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-surface-card/50">
                <td className="p-4">
                  <div className="font-semibold text-text-main">{log.id}</div>
                  <div className="text-text-muted text-[10px]">{log.timestamp}</div>
                </td>
                <td className="p-4 text-text-main font-sans">{log.user}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded bg-surface-card border border-surface-border text-primary font-semibold">
                    {log.event}
                  </span>
                </td>
                <td className="p-4 text-text-muted font-sans">{log.details}</td>
                <td className="p-4 text-text-dim">{log.hash}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
