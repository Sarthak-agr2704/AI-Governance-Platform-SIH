import React, { useState, useEffect } from 'react';
import { getAuditLogs } from '../services/api';
import { AuditLogItem } from '../types';
import { History, Search, Filter, ShieldCheck, RefreshCw, Clock, User, Cpu, List, GitCommit } from 'lucide-react';

interface AuditTrailProps {
  modelId?: number;
}

export const AuditTrail: React.FC<AuditTrailProps> = ({ modelId }) => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchAction, setSearchAction] = useState<string>('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await getAuditLogs({
        model_id: modelId,
        action: searchAction || undefined,
        severity: filterSeverity !== 'all' ? filterSeverity : undefined
      });
      setLogs(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [modelId, filterSeverity]);

  const getSeverityBadge = (sev: string) => {
    switch (sev.toUpperCase()) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-danger/10 text-danger border border-danger/20 rounded">CRITICAL</span>;
      case 'WARNING':
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">WARNING</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 rounded">INFO</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
            <History className="w-5 h-5 text-primary" /> Immutable Governance Audit Trail
          </h2>
          <p className="text-xs text-text-muted">
            Chronological audit log tracking model registrations, evaluations, risk adjustments, monitoring events, and report downloads.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Switcher: Timeline vs Table */}
          <div className="flex items-center p-1 bg-card-subtle border border-border rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'timeline'
                  ? 'bg-primary text-slate-950 font-black shadow-sm'
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>Timeline</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-primary text-slate-950 font-black shadow-sm'
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={fetchLogs}
            className="p-2.5 bg-card border border-border text-text-muted hover:text-text-main rounded-xl hover:bg-border/50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Filter by action name..."
            value={searchAction}
            onChange={(e) => setSearchAction(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchLogs()}
            className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-xs text-text-main"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-text-muted font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Severity Filter:</span>
          </div>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-2 bg-card border border-border rounded-xl text-xs font-semibold focus:outline-none text-text-main"
          >
            <option value="all">All Severities</option>
            <option value="INFO">INFO</option>
            <option value="WARNING">WARNING</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
        </div>
      </div>

      {/* Audit Log Content */}
      {loading ? (
        <div className="p-12 text-center text-text-muted bg-card border border-border rounded-2xl">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary mb-3" />
          <p>Loading audit trail logs...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="p-12 text-center text-text-muted bg-card border border-border rounded-2xl">
          <p>No audit trail records found matching filters.</p>
        </div>
      ) : viewMode === 'timeline' ? (
        /* TIMELINE VIEW */
        <div className="bg-card border border-border rounded-2xl p-6 relative">
          <div className="absolute left-9 top-8 bottom-8 w-0.5 bg-border" />
          <div className="space-y-6 relative">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 group">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center z-10 border-2 ${
                    log.severity === 'CRITICAL'
                      ? 'bg-danger/20 border-danger text-danger'
                      : log.severity === 'WARNING'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                      : 'bg-primary/20 border-primary text-primary'
                  }`}
                >
                  <GitCommit className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 bg-card-subtle border border-border rounded-xl p-4 space-y-1 hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-text-main">{log.action}</span>
                    {getSeverityBadge(log.severity)}
                  </div>
                  <p className="text-xs text-text-muted">{log.new_value || log.previous_value || 'Governance action recorded.'}</p>
                  <div className="flex items-center justify-between pt-2 text-[10px] text-text-muted border-t border-border/50">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-primary" />
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Just now'}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-primary" />
                      {log.user_email}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-card-subtle border-b border-border text-text-muted uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Action Event</th>
                  <th className="p-3.5">Entity</th>
                  <th className="p-3.5">Changes / Details</th>
                  <th className="p-3.5">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-card-subtle/50 transition-colors text-text-main">
                    <td className="p-3.5 font-mono text-text-muted text-[11px] whitespace-nowrap">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Just now'}
                    </td>
                    <td className="p-3.5 font-medium">{log.user_email}</td>
                    <td className="p-3.5 font-bold text-primary">{log.action}</td>
                    <td className="p-3.5 text-text-muted">{log.entity}</td>
                    <td className="p-3.5 max-w-xs truncate text-text-muted">
                      {log.new_value || log.previous_value || 'Success'}
                    </td>
                    <td className="p-3.5">{getSeverityBadge(log.severity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
