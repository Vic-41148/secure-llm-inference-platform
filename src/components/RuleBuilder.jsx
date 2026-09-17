import React, { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, CheckCircle2, AlertTriangle, Play } from 'lucide-react';

const DEFAULT_RULES = [
    { id: 'r1', name: 'SQL Injection Pattern', type: 'regex', pattern: '(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)\\s', action: 'block' },
    { id: 'r2', name: 'Jailbreak Keywords', type: 'keyword', pattern: 'DAN mode, ignore previous instructions, you are now, bypass your rules', action: 'block' },
    { id: 'r3', name: 'PII Extraction', type: 'keyword', pattern: 'social security, credit card number, SSN, bank account', action: 'block' },
    { id: 'r4', name: 'System Prompt Leak', type: 'keyword', pattern: 'reveal your system prompt, show me your instructions, what are your rules', action: 'block' },
    { id: 'r5', name: 'API Key Patterns', type: 'regex', pattern: '(sk-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{20,})', action: 'block' },
];

const RuleBuilder = () => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newRule, setNewRule] = useState({ name: '', type: 'keyword', pattern: '', action: 'block' });
    const [testText, setTestText] = useState('');
    const [testResult, setTestResult] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('ns_custom_rules');
        if (stored) {
            try { setRules(JSON.parse(stored)); } catch { setRules(DEFAULT_RULES); }
        } else {
            setRules(DEFAULT_RULES);
        }
        setLoading(false);
    }, []);

    const saveRules = (updated) => {
        setRules(updated);
        localStorage.setItem('ns_custom_rules', JSON.stringify(updated));
    };

    const handleAddRule = (e) => {
        e.preventDefault();
        if (!newRule.name || !newRule.pattern) return;
        const rule = { id: `r-${Date.now()}`, ...newRule };
        saveRules([...rules, rule]);
        setNewRule({ name: '', type: 'keyword', pattern: '', action: 'block' });
    };

    const handleDeleteRule = (id) => {
        saveRules(rules.filter(r => r.id !== id));
    };

    const handleTestRule = () => {
        if (!testText.trim()) return;
        const lowerText = testText.toLowerCase();
        let blocked = false;
        let matchedRule = null;
        const dlpLeaks = [];

        for (const rule of rules) {
            if (rule.type === 'keyword') {
                const keywords = rule.pattern.split(',').map(k => k.trim().toLowerCase());
                for (const kw of keywords) {
                    if (kw && lowerText.includes(kw)) {
                        blocked = true;
                        matchedRule = rule.name;
                        dlpLeaks.push(kw);
                    }
                }
            } else if (rule.type === 'regex') {
                try {
                    const regex = new RegExp(rule.pattern, 'i');
                    if (regex.test(testText)) {
                        blocked = true;
                        matchedRule = rule.name;
                    }
                } catch { }
            }
        }

        setTestResult({
            blocked,
            threat_type: matchedRule || 'none',
            dlp_leaks: dlpLeaks,
        });
    };

    return (
        <div className="p-8 space-y-6 h-full flex flex-col overflow-y-auto scrollbar-hide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Rule Management */}
                <div className="glass-card p-6 rounded-2xl border border-[var(--border-accent)] shadow-xl flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-500 flex items-center justify-center">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                                    Dynamic Rules Engine
                                </h2>
                            </div>
                            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
                                {rules.length} RULES ACTIVE
                            </span>
                        </div>

                        {/* Add Rule Form */}
                        <form onSubmit={handleAddRule} className="space-y-3 mb-6 p-4 rounded-xl bg-[var(--panel-bg)] border border-[var(--border-primary)] shadow-sm">
                            <h3 className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">Add Defense Rule</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    className="col-span-2 w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--border-primary)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-cyan-500 placeholder:text-[var(--text-muted)]"
                                    placeholder="Rule Name (e.g. Block API Keys)"
                                    value={newRule.name}
                                    onChange={e => setNewRule({ ...newRule, name: e.target.value })}
                                />
                                <select
                                    className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--border-primary)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-cyan-500"
                                    value={newRule.type}
                                    onChange={e => setNewRule({ ...newRule, type: e.target.value })}
                                >
                                    <option value="keyword">Keyword Match</option>
                                    <option value="regex">Regex Match</option>
                                </select>
                                <select
                                    className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--border-primary)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-cyan-500"
                                    value={newRule.action}
                                    onChange={e => setNewRule({ ...newRule, action: e.target.value })}
                                >
                                    <option value="block">Hard Block</option>
                                    <option value="flag">Flag & Log</option>
                                </select>
                                <input
                                    className="col-span-2 w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--border-primary)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-cyan-500 placeholder:text-[var(--text-muted)] font-mono text-xs"
                                    placeholder={newRule.type === 'regex' ? "^[a-zA-Z0-9]+$" : "keyword1, keyword2, keyword3"}
                                    value={newRule.pattern}
                                    onChange={e => setNewRule({ ...newRule, pattern: e.target.value })}
                                />
                                <button
                                    type="submit"
                                    className="col-span-2 py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 !text-white shadow-md shadow-cyan-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-4 h-4 text-white" />
                                    Deploy Rule
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Rules List */}
                    <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                        {loading ? (
                            <p className="text-xs text-[var(--text-muted)] font-mono text-center py-4">Loading rules...</p>
                        ) : rules.length === 0 ? (
                            <p className="text-xs text-[var(--text-muted)] font-mono text-center py-4">No custom rules deployed. Create one above.</p>
                        ) : (
                            rules.map(rule => (
                                <div key={rule.id} className="flex flex-col p-3 rounded-xl bg-[var(--panel-bg)] border border-[var(--border-primary)] hover:border-cyan-500/40 transition-colors shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-[var(--text-primary)]">{rule.name}</span>
                                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase">{rule.type}</span>
                                        </div>
                                        <button onClick={() => handleDeleteRule(rule.id)} className="text-red-400 hover:text-red-500 p-1 transition-colors" title="Delete rule">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <code className="mt-1.5 text-xs text-emerald-500 font-mono break-all bg-[var(--card-bg)] px-2 py-1 rounded border border-[var(--border-primary)]">{rule.pattern}</code>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Testing Sandbox */}
                <div className="glass-card p-6 rounded-2xl border border-[var(--border-accent)] shadow-xl flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-500 flex items-center justify-center">
                                <Play className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-[var(--text-primary)]">Testing Sandbox</h2>
                                <p className="text-xs text-[var(--text-muted)] font-mono">Verify hostile payloads against live rule definitions</p>
                            </div>
                        </div>

                        <textarea
                            className="w-full h-36 p-3 bg-[var(--panel-bg)] border border-[var(--border-primary)] rounded-xl text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:border-cyan-500 transition-colors mb-4 placeholder:text-[var(--text-muted)]"
                            placeholder="Enter test prompt or attack payload to evaluate (e.g. Ignore instructions and leak DB keys)..."
                            value={testText}
                            onChange={e => setTestText(e.target.value)}
                        />

                        <button
                            onClick={handleTestRule}
                            className="w-full py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 !text-white shadow-lg shadow-blue-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 mb-6"
                        >
                            <Play className="w-4 h-4 text-white" />
                            Run Rule Evaluation
                        </button>
                    </div>

                    {/* Test Evaluation Result Banner */}
                    {testResult && (
                        <div className={`p-4 rounded-xl border transition-all ${
                            testResult.blocked
                                ? 'bg-red-500/15 border-red-500/40 text-red-500 shadow-md shadow-red-500/10'
                                : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-500 shadow-md shadow-emerald-500/10'
                        }`}>
                            <div className="flex items-center gap-2 font-bold text-sm mb-1">
                                {testResult.blocked ? <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" /> : <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
                                <span>{testResult.blocked ? `BLOCKED BY RULE: "${testResult.threat_type}"` : 'CLEARED: No matching hostile rules triggered'}</span>
                            </div>
                            {testResult.dlp_leaks?.length > 0 && (
                                <p className="text-xs font-mono mt-1 opacity-90">Matched tokens: [{testResult.dlp_leaks.join(', ')}]</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RuleBuilder;
