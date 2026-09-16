import React, { useState, useEffect } from 'react';
import { Fingerprint, Save, Check, ShieldAlert, Sparkles, Play } from 'lucide-react';

const STORAGE_KEY = 'ns_dlp_settings';

const DEFAULTS = {
    mask_emails: true,
    mask_phones: true,
    mask_ssn: true,
    mask_credit_cards: true,
    action: 'redact',
};

const PiiSettings = () => {
    const [settings, setSettings] = useState(DEFAULTS);
    const [saved, setSaved] = useState(false);
    const [testPrompt, setTestPrompt] = useState('My employee John Doe (SSN: 123-45-6789, email: john.doe@securecorp.com, card: 4532-7521-8901-4432) needs system access.');
    const [sanitizedOutput, setSanitizedOutput] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try { setSettings(JSON.parse(stored)); } catch { }
        }
    }, []);

    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
        setSaved(false);
    };

    const handleSave = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const runSanitizationTest = () => {
        let result = testPrompt;
        if (settings.action === 'block') {
            const hasEmail = settings.mask_emails && /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(result);
            const hasSsn = settings.mask_ssn && /\b\d{3}-\d{2}-\d{4}\b/.test(result);
            const hasPhone = settings.mask_phones && /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/.test(result);
            const hasCard = settings.mask_credit_cards && /\b(?:\d{4}[-\s]?){3}\d{4}\b/.test(result);

            if (hasEmail || hasSsn || hasPhone || hasCard) {
                setSanitizedOutput('⛔ REQUEST HARD BLOCKED: Sensitive PII patterns detected under strict governance policy.');
                return;
            }
        }

        if (settings.mask_ssn) {
            result = result.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED_SSN]');
        }
        if (settings.mask_emails) {
            result = result.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]');
        }
        if (settings.mask_credit_cards) {
            result = result.replace(/\b(?:\d{4}[-\s]?){3}\d{4}\b/g, '[REDACTED_CREDIT_CARD]');
        }
        if (settings.mask_phones) {
            result = result.replace(/\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, '[REDACTED_PHONE]');
        }

        setSanitizedOutput(result);
    };

    const Switch = ({ checked, onChange, label, desc }) => (
        <label className="flex items-center justify-between cursor-pointer p-4 rounded-xl bg-[var(--panel-bg)] border border-[var(--border-primary)] hover:border-cyan-500/40 transition-all duration-200 shadow-sm">
            <div>
                <span className="text-sm font-bold text-[var(--text-primary)] block">{label}</span>
                <span className="text-xs text-[var(--text-muted)] font-mono">{desc}</span>
            </div>
            <div className="relative flex-shrink-0 ml-4">
                <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
                <div className="w-12 h-6 bg-slate-700/60 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-md peer-checked:bg-cyan-500"></div>
            </div>
        </label>
    );

    return (
        <div className="p-8 space-y-6 h-full flex flex-col overflow-y-auto scrollbar-hide">
            {/* Header */}
            <div className="glass-card p-6 rounded-2xl border border-[var(--border-accent)] flex items-center justify-between shadow-xl flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-500 flex items-center justify-center shadow-md">
                        <Fingerprint className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Data Loss Prevention (DLP) Policies</h2>
                        <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">Automated prompt synthesis sanitization and sensitive entity redaction</p>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold font-mono text-xs uppercase tracking-wider transition-all duration-200 shadow-lg ${
                        saved
                            ? 'bg-emerald-600 text-white shadow-emerald-500/25 scale-105'
                            : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 !text-white shadow-blue-500/25 active:scale-95'
                    }`}
                >
                    {saved ? <><Check className="w-4 h-4 text-white" /> Policies Saved</> : <><Save className="w-4 h-4 text-white" /> Save Policies</>}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
                {/* Policy Rules Configuration */}
                <div className="glass-card p-6 rounded-2xl border border-[var(--border-primary)] shadow-xl flex flex-col justify-between">
                    <div>
                        <h3 className="text-base font-bold text-[var(--text-primary)] mb-4 pb-2 border-b border-[var(--border-primary)]">
                            Active Redaction Filters
                        </h3>

                        <div className="space-y-3">
                            <Switch label="Mask Email Addresses" desc="Detects RFC-compliant email strings" checked={settings.mask_emails} onChange={() => toggleSetting('mask_emails')} />
                            <Switch label="Mask Phone Numbers" desc="Detects international & standard phone formats" checked={settings.mask_phones} onChange={() => toggleSetting('mask_phones')} />
                            <Switch label="Mask SSN / National IDs" desc="Interprets 9-digit SSN & government identifiers" checked={settings.mask_ssn} onChange={() => toggleSetting('mask_ssn')} />
                            <Switch label="Mask Credit Cards" desc="Luhn-validated 16-digit payment card numbers" checked={settings.mask_credit_cards} onChange={() => toggleSetting('mask_credit_cards')} />

                            <div className="mt-4 pt-4 border-t border-[var(--border-primary)]">
                                <label className="block text-xs font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Interception Action</label>
                                <select
                                    className="w-full bg-[var(--panel-bg)] border border-[var(--border-primary)] rounded-xl p-3 text-[var(--text-primary)] text-sm focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                                    value={settings.action}
                                    onChange={(e) => { setSettings(prev => ({ ...prev, action: e.target.value })); setSaved(false); }}
                                >
                                    <option value="redact">Redact & Forward (Replace with tokens like [REDACTED_SSN])</option>
                                    <option value="block">Hard Block (Reject prompt and terminate session)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live DLP Sanitization Playground */}
                <div className="glass-card p-6 rounded-2xl border border-[var(--border-primary)] shadow-xl flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[var(--border-primary)]">
                            <Sparkles className="w-5 h-5 text-cyan-400" />
                            <h3 className="text-base font-bold text-[var(--text-primary)]">Live DLP Policy Tester</h3>
                        </div>

                        <p className="text-xs text-[var(--text-muted)] font-mono mb-3">Paste a test prompt containing sensitive variables to test live policy interception:</p>

                        <textarea
                            value={testPrompt}
                            onChange={(e) => setTestPrompt(e.target.value)}
                            className="w-full h-28 p-3.5 bg-[var(--panel-bg)] border border-[var(--border-primary)] rounded-xl text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-cyan-500 transition-colors mb-3 resize-none"
                            placeholder="Type prompt with emails, SSNs, credit cards..."
                        />

                        <button
                            onClick={runSanitizationTest}
                            className="w-full py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 !text-white shadow-md shadow-cyan-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 mb-4"
                        >
                            <Play className="w-4 h-4 text-white" /> Evaluate DLP Sanitization
                        </button>
                    </div>

                    {sanitizedOutput && (
                        <div className="p-4 rounded-xl bg-[var(--panel-bg)] border border-cyan-500/30">
                            <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1.5">Sanitized Output Payload</div>
                            <p className="text-xs font-mono text-[var(--text-secondary)] leading-relaxed break-words">{sanitizedOutput}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PiiSettings;
