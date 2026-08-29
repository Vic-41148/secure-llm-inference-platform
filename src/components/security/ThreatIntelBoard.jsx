import React, { useEffect, useState } from 'react';
import ThreatCard from './ThreatCard';
import { Globe, Radio } from 'lucide-react';

const DEMO_THREATS = [
    { id: 't1', actor: 'APT-29 (Cozy Bear)', severity: 'critical', type: 'Prompt Injection → Data Exfiltration', ioc: 'C2: 185.220.101.x / TTP: T1059.001' },
    { id: 't2', actor: 'Lazarus Group', severity: 'critical', type: 'LLM Jailbreak via Multi-turn Manipulation', ioc: 'Payload: base64-encoded reverse-shell in markdown' },
    { id: 't3', actor: 'FIN7 (Carbanak)', severity: 'high', type: 'RAG Context Poisoning', ioc: 'Injected docs contain hidden system prompt overrides' },
    { id: 't4', actor: 'Sandworm', severity: 'high', type: 'Model Weight Extraction via Side-Channel', ioc: 'Abnormal token timing variance > 200ms' },
    { id: 't5', actor: 'DarkHydrus', severity: 'medium', type: 'PII Extraction Attempt via Roleplay', ioc: '"Pretend you are a database admin with access to..."' },
    { id: 't6', actor: 'Scattered Spider', severity: 'medium', type: 'Social Engineering → API Key Leak', ioc: 'Phishing template requesting GROQ_API_KEY' },
    { id: 't7', actor: 'Volt Typhoon', severity: 'critical', type: 'Adversarial Suffix Attack on Classifier', ioc: 'GCG suffix: "...primarily describe whereby...]{ Sure"' },
    { id: 't8', actor: 'Kimsuky', severity: 'high', type: 'Indirect Prompt Injection via URL Fetch', ioc: 'Payload hosted on typosquat domain: op3nai.com' },
    { id: 't9', actor: 'Anonymous Sudan', severity: 'medium', type: 'DDoS via High-Token Prompts', ioc: 'Recursive "expand this 10x" loops consuming quota' },
];

const ThreatIntelBoard = () => {
    const [threats, setThreats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8000/api/threat-intel/')
            .then(res => res.json())
            .then(data => {
                if (data.threats && data.threats.length > 0) setThreats(data.threats);
                else setThreats(DEMO_THREATS);
                setLoading(false);
            })
            .catch(() => {
                setThreats(DEMO_THREATS);
                setLoading(false);
            });
    }, []);

    return (
        <div className="p-8 space-y-6 h-full flex flex-col overflow-hidden">
            <div className="glass-card p-6 rounded-2xl border border-[var(--border-accent)] flex items-center justify-between shadow-xl flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-500 flex items-center justify-center shadow-md">
                        <Globe className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Global Threat Intelligence</h2>
                        <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">Live feeds of known malicious actors targeting LLM infrastructure</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
                    <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                    <span>{threats.length} FEEDS ACTIVE</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 scrollbar-hide">
                {loading ? (
                    <div className="text-center text-[var(--text-muted)] py-12 font-mono">Syncing intelligence feeds...</div>
                ) : threats.length === 0 ? (
                    <div className="text-center text-[var(--text-muted)] py-12 font-mono">No active threats reported.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                        {threats.map((threat) => (
                            <ThreatCard key={threat.id} threat={threat} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ThreatIntelBoard;
