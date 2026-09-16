import React from 'react';

const LogViewer = ({ logs, loading }) => {
    if (loading) {
        return (
            <div className="h-full flex items-center justify-center text-[var(--text-muted)] font-mono text-xs">
                Syncing audit records from secure enclave...
            </div>
        );
    }

    if (logs.length === 0) {
        return (
            <div className="h-full flex items-center justify-center text-[var(--text-muted)] font-mono text-xs">
                No log entries match the selected filter.
            </div>
        );
    }

    const getStatusPill = (status) => {
        const s = (status || '').toUpperCase();
        if (s === 'BLOCKED') {
            return <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-red-500/15 text-red-500 border border-red-500/30">BLOCKED</span>;
        }
        if (s === 'SANITIZED') {
            return <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">SANITIZED</span>;
        }
        if (s === 'CLEARED' || s === 'SUCCESS' || s === 'AUTHORIZED') {
            return <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">{s}</span>;
        }
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-500/15 text-blue-500 border border-blue-500/30">{s || 'LOG'}</span>;
    };

    return (
        <div className="h-full overflow-y-auto scrollbar-hide">
            <table className="w-full text-left text-xs text-[var(--text-secondary)]">
                <thead className="bg-[var(--panel-bg)] text-[10px] uppercase font-mono font-bold text-[var(--text-muted)] sticky top-0 backdrop-blur-md border-b border-[var(--border-primary)] z-10">
                    <tr>
                        <th className="px-5 py-3.5">Timestamp</th>
                        <th className="px-5 py-3.5">Action</th>
                        <th className="px-5 py-3.5">Status</th>
                        <th className="px-5 py-3.5">Actor</th>
                        <th className="px-5 py-3.5">Target Resource</th>
                        <th className="px-5 py-3.5">Telemetry Metadata</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-primary)]">
                    {logs.map((log, idx) => (
                        <tr key={log.id || idx} className="hover:bg-[var(--card-bg-hover)] transition-colors">
                            <td className="px-5 py-3.5 whitespace-nowrap font-mono text-[10px] text-[var(--text-muted)]">
                                {new Date(log.timestamp).toLocaleTimeString()}
                            </td>
                            <td className="px-5 py-3.5 font-mono font-bold text-cyan-500 dark:text-cyan-400">
                                {log.action}
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap">
                                {getStatusPill(log.status)}
                            </td>
                            <td className="px-5 py-3.5 font-semibold text-[var(--text-primary)]">
                                {log.actor}
                            </td>
                            <td className="px-5 py-3.5 font-mono text-[11px] text-[var(--text-secondary)]">
                                {log.resource}
                            </td>
                            <td className="px-5 py-3.5 font-mono text-[10px] text-[var(--text-muted)] max-w-xs truncate">
                                {typeof log.metadata === 'object' ? JSON.stringify(log.metadata) : log.metadata || '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LogViewer;
