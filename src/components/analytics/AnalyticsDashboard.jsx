import React, { useEffect, useState } from 'react';
import MetricCard from './MetricCard';
import UsageChart from './UsageChart';
import SecurityEventsTable from './SecurityEventsTable';

const DEMO_SUMMARY = {
    total_requests: 14892,
    total_tokens: 3247100,
    avg_latency: 142.7,
    security_incidents: 37,
};

const DEMO_EVENTS = [
    { event_type: 'PROMPT_INJECTION', severity: 'critical', details: 'Multi-turn jailbreak attempt detected — "DAN mode" variant. Blocked at Stage 1.', timestamp: new Date(Date.now() - 120000).toISOString() },
    { event_type: 'PII_EXTRACTION', severity: 'critical', details: 'User attempted to extract SSN data via roleplay scenario. DLP intercepted.', timestamp: new Date(Date.now() - 300000).toISOString() },
    { event_type: 'RAG_POISONING', severity: 'warning', details: 'Uploaded document contained hidden system prompt override in metadata.', timestamp: new Date(Date.now() - 600000).toISOString() },
    { event_type: 'TOKEN_ABUSE', severity: 'warning', details: 'Recursive expansion prompt consumed 45k tokens in single request.', timestamp: new Date(Date.now() - 900000).toISOString() },
    { event_type: 'API_KEY_LEAK', severity: 'critical', details: 'Model output contained partial API key from training data. Redacted.', timestamp: new Date(Date.now() - 1800000).toISOString() },
    { event_type: 'RATE_LIMIT', severity: 'info', details: '192.168.1.45 exceeded 100 req/min threshold. Throttled.', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { event_type: 'ADVERSARIAL_SUFFIX', severity: 'warning', details: 'GCG-style adversarial suffix detected in input. Classifier confidence: 0.94', timestamp: new Date(Date.now() - 5400000).toISOString() },
];

const AnalyticsDashboard = () => {
    const [summary, setSummary] = useState(DEMO_SUMMARY);
    const [events, setEvents] = useState(DEMO_EVENTS);

    useEffect(() => {
        // Try backend, fall back to demo
        fetch('http://localhost:8000/api/analytics/summary')
            .then(res => res.json())
            .then(data => { if (data.total_requests !== undefined) setSummary(data); })
            .catch(() => { });

        fetch('http://localhost:8000/api/analytics/security-events?limit=10')
            .then(res => res.json())
            .then(data => { if (data.events && data.events.length > 0) setEvents(data.events); })
            .catch(() => { });
    }, []);

    return (
        <div className="flex flex-col h-full bg-gray-900 text-white p-6 gap-6 overflow-y-auto w-full">
            <div>
                <h1 className="text-2xl font-bold font-mono text-cyan-400 mb-2">TELEMETRY & ANALYTICS</h1>
                <p className="text-sm text-gray-400">Real-time platform usage and security monitoring.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard title="Total Requests" value={summary.total_requests.toLocaleString()} icon="activity" color="text-blue-500" />
                <MetricCard title="Total Tokens" value={summary.total_tokens.toLocaleString()} icon="cpu" color="text-cyan-500" />
                <MetricCard title="Avg Latency" value={`${summary.avg_latency.toFixed(1)}ms`} icon="clock" color="text-emerald-500" />
                <MetricCard title="Security Incidents" value={summary.security_incidents} icon="shield" color="text-red-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <UsageChart />
                </div>
                <div className="lg:col-span-1">
                    <SecurityEventsTable events={events} />
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
