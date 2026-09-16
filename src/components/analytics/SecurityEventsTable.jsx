import React from 'react';
import { ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';

const SecurityEventsTable = ({ events }) => {
    const getSeverityBadge = (severity) => {
        const s = (severity || 'info').toLowerCase();
        if (s === 'critical') {
            return (
                <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider bg-red-500/15 text-red-500 border border-red-500/30">
                    CRITICAL
                </span>
            );
        }
        if (s === 'warning' || s === 'high') {
            return (
                <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-500 border border-amber-500/30">
                    WARNING
                </span>
            );
        }
        return (
            <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider bg-blue-500/15 text-blue-500 border border-blue-500/30">
                INFO
            </span>
        );
    };

    return (
        <div className="glass-card p-6 rounded-2xl border border-[var(--border-accent)] shadow-xl h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/30 text-red-500 flex items-center justify-center">
                        <ShieldAlert className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm text-[var(--text-primary)]">Live Security Incidents</h3>
                </div>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">{events.length} Captured</span>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 max-h-[300px] scrollbar-hide">
                {events.length === 0 ? (
                    <div className="text-center text-xs text-[var(--text-muted)] py-12 font-mono">
                        No security incidents detected. System clear.
                    </div>
                ) : (
                    events.map((evt, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-[var(--panel-bg)] border border-[var(--border-primary)] hover:border-cyan-500/40 transition-colors flex flex-col gap-1.5 shadow-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-mono font-bold text-[var(--text-primary)]">{evt.event_type}</span>
                                {getSeverityBadge(evt.severity)}
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{evt.details}</p>
                            <span className="text-[10px] text-[var(--text-muted)] font-mono">
                                {new Date(evt.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SecurityEventsTable;
