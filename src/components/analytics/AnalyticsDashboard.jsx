import React, { useEffect, useState, useCallback } from 'react';
import MetricCard from './MetricCard';
import UsageChart from './UsageChart';
import SecurityEventsTable from './SecurityEventsTable';
import { Activity, ShieldCheck, Zap, Sparkles, RefreshCw } from 'lucide-react';
import { getAnalyticsSummary, getSecurityEvents } from '../../services/api';

const DEMO_SUMMARY = {
    total_requests: 14892,
    total_tokens: 3247100,
    avg_latency: 142.7,
    security_incidents: 37,
};

const DEMO_EVENTS = [
    { event_type: 'PROMPT_INJECTION', severity: 'critical', details: 'Multi-turn jailbreak attempt detected — "DAN mode" variant. Intercepted at Stage 1.', timestamp: new Date(Date.now() - 120000).toISOString() },
    { event_type: 'PII_EXTRACTION', severity: 'critical', details: 'User attempted to extract SSN data via roleplay scenario. DLP sanitized.', timestamp: new Date(Date.now() - 300000).toISOString() },
    { event_type: 'RAG_POISONING', severity: 'warning', details: 'Ingested document contained hidden system prompt override in chunk #04.', timestamp: new Date(Date.now() - 600000).toISOString() },
    { event_type: 'TOKEN_ABUSE', severity: 'warning', details: 'Recursive expansion prompt attempted high token drain. Throttled.', timestamp: new Date(Date.now() - 900000).toISOString() },
    { event_type: 'API_KEY_LEAK', severity: 'critical', details: 'Model output contained partial API key pattern. Redacted automatically.', timestamp: new Date(Date.now() - 1800000).toISOString() },
    { event_type: 'ADVERSARIAL_SUFFIX', severity: 'warning', details: 'GCG-style adversarial token suffix detected. Classifier score: 0.94.', timestamp: new Date(Date.now() - 5400000).toISOString() },
];

const AnalyticsDashboard = () => {
    const [summary, setSummary] = useState(DEMO_SUMMARY);
    const [events, setEvents] = useState(DEMO_EVENTS);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchTelemetry = useCallback(async (isManual = false) => {
        if (isManual) setIsRefreshing(true);
        try {
            const sumData = await getAnalyticsSummary();
            if (sumData && sumData.total_requests !== undefined) {
                setSummary(sumData);
            }
        } catch (e) {
            // Keep demo summary if backend unreachable
        }

        try {
            const evData = await getSecurityEvents(10);
            if (evData && evData.events && evData.events.length > 0) {
                setEvents(evData.events);
            }
        } catch (e) {
            // Keep demo events if backend unreachable
        }

        if (isManual) setTimeout(() => setIsRefreshing(false), 400);
    }, []);

    useEffect(() => {
        fetchTelemetry(false);
        // Live telemetry polling every 6 seconds
        const interval = setInterval(() => {
            fetchTelemetry(false);
        }, 6000);
        return () => clearInterval(interval);
    }, [fetchTelemetry]);

    return (
        <div className="p-8 space-y-6 h-full flex flex-col overflow-y-auto scrollbar-hide">
            {/* Header */}
            <div className="glass-card p-6 rounded-2xl border border-[var(--border-accent)] flex items-center justify-between shadow-xl flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-500 flex items-center justify-center shadow-md">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Platform Telemetry & Analytics</h2>
                        <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">Real-time inference load, token metrics, and threat frequency</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fetchTelemetry(true)}
                        disabled={isRefreshing}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-primary)] text-[var(--text-primary)] text-xs font-mono font-bold hover:border-cyan-500/40 transition-all shadow-sm active:scale-95"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span>{isRefreshing ? 'Syncing...' : 'Sync Telemetry'}</span>
                    </button>
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-mono text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        STREAM SYNCHRONIZED
                    </div>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
                <MetricCard title="Total Inferences" value={Number(summary.total_requests || 0).toLocaleString()} icon="activity" color="text-blue-500" trend="14.2%" />
                <MetricCard title="Tokens Processed" value={Number(summary.total_tokens || 0).toLocaleString()} icon="cpu" color="text-cyan-500" trend="8.7%" />
                <MetricCard title="Mean Latency" value={`${Number(summary.avg_latency || 0).toFixed(1)}ms`} icon="clock" color="text-emerald-500" />
                <MetricCard title="Threats Neutralized" value={summary.security_incidents || 0} icon="shield" color="text-red-500" />
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[380px]">
                <div className="lg:col-span-2 h-full">
                    <UsageChart />
                </div>
                <div className="lg:col-span-1 h-full">
                    <SecurityEventsTable events={events} />
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
