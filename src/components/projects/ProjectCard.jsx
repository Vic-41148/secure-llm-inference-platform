import React, { useState } from 'react';
import { KeyRound, ShieldCheck, Activity, Copy, Check, Eye, EyeOff, Trash2 } from 'lucide-react';

const ProjectCard = ({ project, onDelete }) => {
    const [showKeyIndex, setShowKeyIndex] = useState(null);
    const [copiedIndex, setCopiedIndex] = useState(null);

    const handleCopy = (keyStr, idx) => {
        navigator.clipboard.writeText(keyStr);
        setCopiedIndex(idx);
        setTimeout(() => setCopiedIndex(null), 1800);
    };

    return (
        <div className="glass-card p-6 rounded-2xl border border-[var(--border-primary)] shadow-xl flex flex-col justify-between group hover:border-cyan-500/50 transition-all duration-200">
            <div>
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-[var(--text-primary)] text-lg group-hover:text-cyan-400 transition-colors">{project.name}</h3>
                    <span className="bg-cyan-500/10 text-cyan-400 px-2.5 py-0.5 rounded-full text-[10px] font-mono border border-cyan-500/30">
                        {project.id.substring(0, 8)}
                    </span>
                </div>

                <p className="text-[var(--text-muted)] text-xs mb-5 line-clamp-2 leading-relaxed">{project.description}</p>

                <div className="space-y-3">
                    <div className="bg-[var(--panel-bg)] rounded-xl p-3.5 border border-[var(--border-primary)]">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-mono font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                                <KeyRound className="w-3.5 h-3.5 text-amber-400" /> Active API Keys
                            </span>
                            <span className="text-[10px] font-mono bg-[var(--card-bg)] px-2 py-0.5 rounded-full border border-[var(--border-primary)] text-[var(--text-muted)]">
                                {project.api_keys?.length || 0}
                            </span>
                        </div>
                        {project.api_keys?.map((key, idx) => (
                            <div key={key.id || idx} className="flex justify-between items-center bg-[var(--card-bg)] p-2.5 rounded-lg mt-2 border border-[var(--border-primary)]">
                                <span className="text-xs font-mono font-medium text-[var(--text-secondary)]">{key.name}</span>
                                <div className="flex items-center gap-1.5">
                                    <span className="font-mono text-[10px] text-[var(--text-primary)] bg-[var(--panel-bg)] px-2 py-1 rounded border border-[var(--border-primary)] select-all">
                                        {showKeyIndex === idx ? key.key : "sk-••••••••••••••••"}
                                    </span>
                                    <button
                                        className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                                        onClick={() => setShowKeyIndex(showKeyIndex === idx ? null : idx)}
                                        title={showKeyIndex === idx ? "Hide key" : "Show key"}
                                    >
                                        {showKeyIndex === idx ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                    <button
                                        className="p-1 text-[var(--text-muted)] hover:text-cyan-400 transition-colors"
                                        onClick={() => handleCopy(key.key, idx)}
                                        title="Copy API key"
                                    >
                                        {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="flex items-center justify-center gap-1.5 bg-[var(--panel-bg)] p-2 rounded-xl text-[var(--text-muted)] border border-[var(--border-primary)]">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Sec: STRICT
                        </div>
                        <div className="flex items-center justify-center gap-1.5 bg-[var(--panel-bg)] p-2 rounded-xl text-[var(--text-muted)] border border-[var(--border-primary)]">
                            <Activity className="w-3.5 h-3.5 text-cyan-500" /> Live Isolated
                        </div>
                    </div>
                </div>
            </div>

            {onDelete && (
                <div className="mt-4 pt-3 border-t border-[var(--border-primary)] flex justify-end">
                    <button
                        onClick={() => onDelete(project.id)}
                        className="text-[11px] font-mono text-red-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                    >
                        <Trash2 className="w-3.5 h-3.5" /> Delete Workspace
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProjectCard;
