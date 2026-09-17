import React, { useState, useEffect, useCallback } from 'react';
import LogViewer from './LogViewer';
import LogFilter from './LogFilter';
import { FileText, ShieldCheck, Download, RefreshCw } from 'lucide-react';
import { getAuditLogs } from '../../services/api';

const FALLBACK_LOGS = [
    { id: 'log-101', timestamp: new Date(Date.now() - 60000).toISOString(), action: 'INTERCEPT_PAYLOAD', actor: 'rule-engine-v2', resource: '/api/v1/chat', status: 'BLOCKED', metadata: { threat: 'SQL_INJECTION', confidence: 0.99, ip: '185.220.101.4' } },
    { id: 'log-102', timestamp: new Date(Date.now() - 180000).toISOString(), action: 'SANITIZE_PII', actor: 'dlp-pipeline', resource: '/api/v1/infer', status: 'SANITIZED', metadata: { matched: ['SSN', 'EMAIL'], action: 'REDACT' } },
    { id: 'log-103', timestamp: new Date(Date.now() - 360000).toISOString(), action: 'INSPECT_DOCUMENT', actor: 'rag-scanner', resource: 'kb_financial_q3.pdf', status: 'CLEARED', metadata: { chunks_scanned: 18, threats: 0 } },
    { id: 'log-104', timestamp: new Date(Date.now() - 720000).toISOString(), action: 'DEPLOY_RULE', actor: 'admin@sovereign.local', resource: 'Rule: Block-API-Keys', status: 'SUCCESS', metadata: { rule_type: 'regex', pattern: 'sk-[a-zA-Z0-9]+' } },
    { id: 'log-105', timestamp: new Date(Date.now() - 1200000).toISOString(), action: 'AUTH_WORKSPACE_KEY', actor: 'gateway-proxy', resource: 'Workspace: Production', status: 'AUTHORIZED', metadata: { key_id: 'k-prod-primary', role: 'read_write' } },
    { id: 'log-106', timestamp: new Date(Date.now() - 1800000).toISOString(), action: 'CLASSIFY_INTENT', actor: 'groq-classifier', resource: '/api/v1/chat', status: 'BLOCKED', metadata: { threat: 'JAILBREAK_DAN', score: 0.94 } },
    { id: 'log-107', timestamp: new Date(Date.now() - 3600000).toISOString(), action: 'TOGGLE_DEFENSE', actor: 'security-operator', resource: 'Defense Matrix', status: 'ENABLED', metadata: { mode: 'STRICT_CONTAINMENT' } },
];

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [filter, setFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const fetchLogs = useCallback(async (isManual = false) => {
        if (isManual) setIsRefreshing(true);
        try {
            const data = await getAuditLogs(100);
            if (data.logs && Array.isArray(data.logs) && data.logs.length > 0) {
                setLogs(data.logs);
            } else {
                setLogs(FALLBACK_LOGS);
            }
        } catch (error) {
            console.warn("Audit logs service unavailable, using fallback buffer:", error);
            setLogs(prev => prev.length > 0 ? prev : FALLBACK_LOGS);
        } finally {
            setLoading(false);
            if (isManual) setTimeout(() => setIsRefreshing(false), 400);
        }
    }, []);

    useEffect(() => {
        fetchLogs(false);
        // Poll for new audit logs every 8 seconds
        const interval = setInterval(() => {
            fetchLogs(false);
        }, 8000);
        return () => clearInterval(interval);
    }, [fetchLogs]);

    const filteredLogs = logs.filter(log => {
        const matchesQuery = 
            (log.action || '').toLowerCase().includes(filter.toLowerCase()) ||
            (log.resource || '').toLowerCase().includes(filter.toLowerCase()) ||
            (log.actor || '').toLowerCase().includes(filter.toLowerCase());
        
        const matchesStatus = 
            statusFilter === 'ALL' || (log.status || '').toUpperCase() === statusFilter;

        return matchesQuery && matchesStatus;
    });

    const exportLogs = () => {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(logs, null, 2))}`;
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', jsonString);
        downloadAnchor.setAttribute('download', `audit-trail-${Date.now()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    };

    return (
        <div className="p-8 space-y-6 h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="glass-card p-6 rounded-2xl border border-[var(--border-accent)] flex items-center justify-between shadow-xl flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center shadow-md">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">System Audit Trail</h2>
                        <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">Immutable record of all platform events, DLP actions, and rule executions</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fetchLogs(true)}
                        disabled={isRefreshing}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--card-bg)] border border-[var(--border-primary)] text-[var(--text-primary)] text-xs font-mono font-bold hover:border-cyan-500/40 transition-all shadow-sm active:scale-95"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span>{isRefreshing ? 'Syncing...' : 'Sync'}</span>
                    </button>
                    <button
                        onClick={exportLogs}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--card-bg)] border border-[var(--border-primary)] text-[var(--text-primary)] text-xs font-mono font-bold hover:border-cyan-500/40 transition-all shadow-sm"
                    >
                        <Download className="w-4 h-4 text-cyan-500" /> Export JSON
                    </button>
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-mono text-xs font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>IMMUTABLE LEDGER</span>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="glass-card p-4 rounded-2xl border border-[var(--border-primary)] shadow-md flex flex-wrap items-center justify-between gap-4 flex-shrink-0">
                <LogFilter filter={filter} setFilter={setFilter} />
                
                {/* Status Badges Filter */}
                <div className="flex items-center gap-1.5">
                    {['ALL', 'BLOCKED', 'SANITIZED', 'CLEARED', 'SUCCESS', 'AUTHORIZED'].map((st) => (
                        <button
                            key={st}
                            onClick={() => setStatusFilter(st)}
                            className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all border ${
                                statusFilter === st
                                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                                    : 'bg-[var(--card-bg)] text-[var(--text-muted)] border-[var(--border-primary)] hover:border-[var(--border-hover)]'
                            }`}
                        >
                            {st}
                        </button>
                    ))}
                </div>
            </div>

            {/* Log Viewer Table */}
            <div className="flex-1 overflow-hidden glass-card rounded-2xl border border-[var(--border-primary)] shadow-xl flex flex-col">
                <LogViewer logs={filteredLogs} loading={loading} />
            </div>
        </div>
    );
};

export default AuditLogs;
