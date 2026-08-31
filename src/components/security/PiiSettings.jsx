import React, { useState, useEffect } from 'react';
import { Fingerprint, Save, Check, ShieldAlert } from 'lucide-react';

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

    const Switch = ({ checked, onChange, label, desc }) => (
        <label className="flex items-center justify-between cursor-pointer p-4 rounded-xl glass-card border border-[var(--border-primary)] hover:border-cyan-500/40 transition-all duration-200">
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
        <div className="p-8 space-y-6 h-full flex flex-col overflow-hidden max-w-4xl mx-auto">
            <div className="glass-card p-6 rounded-2xl border border-[var(--border-accent)] flex items-center justify-between shadow-xl flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-500 flex items-center justify-center shadow-md">
                        <Fingerprint className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Data Loss Prevention (DLP)</h2>
                        <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">Intercept and sanitize sensitive data before prompt synthesis</p>
                    </div>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-[var(--border-primary)] shadow-xl flex-1 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-3">
                    <Switch label="Mask Email Addresses" desc="Detects RFC-compliant email strings" checked={settings.mask_emails} onChange={() => toggleSetting('mask_emails')} />
                    <Switch label="Mask Phone Numbers" desc="Detects international & local phone formats" checked={settings.mask_phones} onChange={() => toggleSetting('mask_phones')} />
                    <Switch label="Mask SSN / National IDs" desc="Interprets 9-digit SSN & passport patterns" checked={settings.mask_ssn} onChange={() => toggleSetting('mask_ssn')} />
                    <Switch label="Mask Credit Cards" desc="Luhn-algorithm validated 16-digit PAN numbers" checked={settings.mask_credit_cards} onChange={() => toggleSetting('mask_credit_cards')} />

                    <div className="mt-6 pt-6 border-t border-[var(--border-primary)]">
                        <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Interception Action</label>
                        <select
                            className="w-full bg-[var(--panel-bg)] border border-[var(--border-primary)] rounded-xl p-3 text-[var(--text-primary)] text-sm focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                            value={settings.action}
                            onChange={(e) => { setSettings(prev => ({ ...prev, action: e.target.value })); setSaved(false); }}
                        >
                            <option value="redact">Redact and Synthesize (Replace with tokens: [REDACTED_SSN])</option>
                            <option value="block">Hard Block (Reject prompt and terminate request)</option>
                        </select>
                    </div>
                </div>

                <div className="mt-8 pt-4 border-t border-[var(--border-primary)] flex items-center justify-between">
                    <span className="text-xs text-[var(--text-muted)] font-mono">Changes persist automatically to defense matrix</span>
                    <button
                        onClick={handleSave}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold font-mono text-xs uppercase tracking-wider transition-all duration-200 shadow-lg ${
                            saved
                                ? 'bg-emerald-600 text-white shadow-emerald-500/25 scale-105'
                                : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 !text-white shadow-blue-500/25 active:scale-95'
                        }`}
                    >
                        {saved ? <><Check className="w-4 h-4 text-white" /> Saved Successfully</> : <><Save className="w-4 h-4 text-white" /> Save Policies</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PiiSettings;
