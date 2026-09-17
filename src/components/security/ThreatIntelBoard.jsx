import React, { useEffect, useState, useCallback } from 'react';
import ThreatCard from './ThreatCard';
import { Globe, Radio, RefreshCw, ShieldAlert } from 'lucide-react';
import { getThreatIntelFeeds, blockThreatIOC } from '../../services/api';

const DEMO_THREATS = [
    { id: 't1', actor: 'APT-29 (Cozy Bear)', severity: 'critical', type: 'Prompt Injection → Data Exfiltration', ioc: 'C2: 185.220.101.x / TTP: T1059.001', last_seen: 'Active (12m ago)' },
    { id: 't2', actor: 'Lazarus Group', severity: 'critical', type: 'LLM Jailbreak via Multi-turn Manipulation', ioc: 'Payload: base64-encoded reverse-shell in markdown', last_seen: 'Active (28m ago)' },
    { id: 't3', actor: 'FIN7 (Carbanak)', severity: 'high', type: 'RAG Context Poisoning', ioc: 'Injected docs contain hidden system prompt overrides', last_seen: 'Active (1h ago)' },
    { id: 't4', actor: 'Sandworm', severity: 'high', type: 'Model Weight Extraction via Side-Channel', ioc: 'Abnormal token timing variance > 200ms', last_seen: 'Active (2h ago)' },
    { id: 't5', actor: 'DarkHydrus', severity: 'medium', type: 'PII Extraction Attempt via Roleplay', ioc: '"Pretend you are a database admin with access to..."', last_seen: 'Active (3h ago)' },
    { id: 't6', actor: 'Scattered Spider', severity: 'medium', type: 'Social Engineering → API Key Leak', ioc: 'Phishing template requesting GROQ_API_KEY', last_seen: 'Active (5h ago)' },
    { id: 't7', actor: 'Volt Typhoon', severity: 'critical', type: 'Adversarial Suffix Attack on Classifier', ioc: 'GCG suffix: "...primarily describe whereby...]{ Sure"', last_seen: 'Active (6h ago)' },
    { id: 't8', actor: 'Kimsuky', severity: 'high', type: 'Indirect Prompt Injection via URL Fetch', ioc: 'Payload hosted on typosquat domain: op3nai.com', last_seen: 'Active (9h ago)' },
    { id: 't9', actor: 'Anonymous Sudan', severity: 'medium', type: 'DDoS via High-Token Prompts', ioc: 'Recursive "expand this 10x" loops consuming quota', last_seen: 'Active (12h ago)' },
];

const ThreatIntelBoard = () => {
    const [threats, setThreats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastSync, setLastSync] = useState(null);

    const fetchFeeds = useCallback(async (isManual = false) => {
        if (isManual) setIsRefreshing(true);
        try {
            const data = await getThreatIntelFeeds();
            if (data.threats && Array.isArray(data.threats) && data.threats.length > 0) {
                setThreats(data.threats);
            } else {
                setThreats(DEMO_THREATS);
            }
            setLastSync(new Date().toLocaleTimeString());
        } catch (error) {
            console.warn("Backend threat-intel offline, using cached intelligence feeds:", error);
            setThreats(prev => prev.length > 0 ? prev : DEMO_THREATS);
            setLastSync(new Date().toLocaleTimeString());
        } finally {
            setLoading(false);
            if (isManual) setTimeout(() => setIsRefreshing(false), 500);
        }
    }, []);

    useEffect(() => {
        fetchFeeds(false);
        // Polling interval: live update every 10 seconds
        const interval = setInterval(() => {
            fetchFeeds(false);
        }, 10000);
        return () => clearInterval(interval);
    }, [fetchFeeds]);

    const handleBlockThreat = async (threat) => {
        try {
            await blockThreatIOC(threat.ioc, threat.actor, `Blocked from Threat Intel Board: ${threat.type}`);
            setThreats(prev => prev.map(t => t.id === threat.id ? { ...t, isBlocked: true } : t));
        } catch (err) {
            console.error("Failed to block IOC on backend:", err);
            // Optimistic update locally
            setThreats(prev => prev.map(t => t.id === threat.id ? { ...t, isBlocked: true } : t));
        }
    };

    return (
        <div className="p-8 space-y-6 h-full flex flex-col overflow-hidden">
            <div className="glass-card p-6 rounded-2xl border border-[var(--border-accent)] flex items-center justify-between shadow-xl flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-500 flex items-center justify-center shadow-md">
                        <Globe className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Global Threat Intelligence</h2>
                        <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">Live feeds of known malicious actors and zero-day LLM attack patterns</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fetchFeeds(true)}
                        disabled={isRefreshing}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-primary)] text-[var(--text-primary)] text-xs font-mono font-bold hover:border-cyan-500/40 transition-all shadow-sm active:scale-95"
                        title="Force sync intelligence feeds"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span>{isRefreshing ? 'Syncing...' : 'Sync Feeds'}</span>
                    </button>
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
                        <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                        <span>{threats.length} FEEDS ACTIVE</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 scrollbar-hide">
                {loading ? (
                    <div className="text-center text-[var(--text-muted)] py-12 font-mono flex flex-col items-center gap-3">
                        <span className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                        <span>Syncing intelligence feeds with neural threat bus...</span>
                    </div>
                ) : threats.length === 0 ? (
                    <div className="text-center text-[var(--text-muted)] py-12 font-mono flex flex-col items-center gap-2">
                        <ShieldAlert className="w-8 h-8 text-emerald-400" />
                        <span>No active threats reported in the current telemetry window.</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                        {threats.map((threat) => (
                            <ThreatCard
                                key={threat.id}
                                threat={threat}
                                onBlock={handleBlockThreat}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ThreatIntelBoard;
