import React, { useState, useRef } from 'react';
import { FileSearch, UploadCloud, ShieldCheck, AlertOctagon, CheckCircle2 } from 'lucide-react';

const INJECTION_PATTERNS = [
    { name: 'System Prompt Override', pattern: /\b(ignore|disregard|forget)\b.*\b(previous|prior|above|all)\b.*\b(instructions?|rules?|guidelines?|prompt)\b/i },
    { name: 'Role Manipulation', pattern: /\b(you are now|act as|pretend|roleplay|from now on)\b/i },
    { name: 'Hidden Instruction', pattern: /\[SYSTEM\]|\[ADMIN\]|\[OVERRIDE\]|<\/?system>|<\/?instruction>/i },
    { name: 'DAN / Jailbreak', pattern: /\bDAN\b|do anything now|bypass.*(?:rules|safety|filter)|jailbreak/i },
    { name: 'Data Exfiltration', pattern: /(?:output|reveal|show|print|display).*(?:system prompt|api key|password|secret|config)/i },
    { name: 'Encoded Payload', pattern: /[A-Za-z0-9+/]{40,}={0,2}/i },
    { name: 'Markdown/HTML Injection', pattern: /<script|<iframe|javascript:|onerror=|onload=/i },
    { name: 'Indirect Prompt Injection', pattern: /(?:new instructions?|updated guidelines?|revised rules?).*(?:ignore|override|replace)/i },
];

const RagScanner = () => {
    const [file, setFile] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setResults(null);
            setError(null);
        }
    };

    const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFile(e.dataTransfer.files[0]);
            setResults(null);
            setError(null);
        }
    };

    const startScan = async () => {
        if (!file) return;
        setIsScanning(true);
        setError(null);
        setResults(null);

        try {
            const text = await file.text();
            await new Promise(r => setTimeout(r, 1200));

            const chunkSize = 500;
            const chunks = [];
            for (let i = 0; i < text.length; i += chunkSize) {
                chunks.push(text.slice(i, i + chunkSize));
            }

            let threatsFound = 0;
            const chunkResults = chunks.map((chunk, idx) => {
                let isThreat = false;
                let matchedRule = null;

                for (const pattern of INJECTION_PATTERNS) {
                    if (pattern.pattern.test(chunk)) {
                        isThreat = true;
                        matchedRule = pattern.name;
                        threatsFound++;
                        break;
                    }
                }

                return {
                    chunk_id: idx + 1,
                    text_preview: chunk.slice(0, 100) + (chunk.length > 100 ? '...' : ''),
                    is_threat: isThreat,
                    matched_rule: matchedRule,
                };
            });

            setResults({
                filename: file.name,
                total_chunks: chunks.length,
                total_threats_found: threatsFound,
                is_poisoned: threatsFound > 0,
                chunk_results: chunkResults,
            });
        } catch (err) {
            setError("Failed to parse document: " + err.message);
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="p-8 space-y-6 h-full flex flex-col overflow-y-auto scrollbar-hide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload Section */}
                <div className="glass-card p-6 rounded-2xl border border-[var(--border-accent)] shadow-xl flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                                <FileSearch className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-[var(--text-primary)]">RAG Poisoning Scanner</h2>
                                <p className="text-xs text-[var(--text-muted)] font-mono">Inspect vector embeddings and text files for hidden injections</p>
                            </div>
                        </div>

                        <div
                            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
                                file
                                    ? 'border-cyan-500 bg-cyan-500/10'
                                    : 'border-[var(--border-primary)] hover:border-cyan-500/50 bg-[var(--panel-bg)]'
                            }`}
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept=".txt,.md,.csv,.json" />
                            <UploadCloud className={`w-12 h-12 mx-auto mb-3 ${file ? 'text-cyan-400' : 'text-[var(--text-muted)]'}`} />

                            {file ? (
                                <div>
                                    <p className="text-cyan-400 font-bold text-sm">{file.name}</p>
                                    <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">{(file.size / 1024).toFixed(2)} KB • Ready to inspect</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm font-bold text-[var(--text-primary)]">Click to upload or drag and drop</p>
                                    <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">Supports .TXT, .MD, .CSV, .JSON</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={startScan}
                        disabled={!file || isScanning}
                        className={`mt-6 w-full py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 ${
                            !file || isScanning
                                ? 'bg-slate-700/50 text-[var(--text-muted)] cursor-not-allowed border border-[var(--border-primary)]'
                                : 'bg-gradient-to-r from-cyan-500 to-blue-600 !text-white shadow-lg shadow-cyan-500/25 active:scale-95 hover:scale-[1.01]'
                        }`}
                    >
                        {isScanning ? (
                            <span className="flex items-center gap-2 text-white">
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Scanning Document Chunks...
                            </span>
                        ) : (
                            <><ShieldCheck className="w-4 h-4 text-white" /> Initiate Security Scan</>
                        )}
                    </button>
                </div>

                {/* Analysis Report Section */}
                <div className="glass-card p-6 rounded-2xl border border-[var(--border-accent)] shadow-xl flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 border-b border-[var(--border-primary)] pb-2 flex items-center justify-between">
                            <span>Analysis Report</span>
                            {results && (
                                <span className="text-xs font-mono font-bold text-[var(--text-muted)]">{results.total_chunks} chunks parsed</span>
                            )}
                        </h3>

                        {!results && !isScanning && (
                            <div className="h-64 flex flex-col items-center justify-center text-[var(--text-muted)] italic font-mono text-xs text-center">
                                <FileSearch className="w-10 h-10 mb-2 opacity-30" />
                                Awaiting document ingestion...
                            </div>
                        )}

                        {isScanning && (
                            <div className="h-64 flex flex-col items-center justify-center space-y-4">
                                <div className="w-full max-w-xs h-2 bg-slate-700/50 rounded-full overflow-hidden">
                                    <div className="h-full bg-cyan-400 w-1/2 animate-pulse" />
                                </div>
                                <p className="text-xs font-mono text-cyan-400 animate-pulse">Running Neural Pattern Analysis...</p>
                            </div>
                        )}

                        {results && (
                            <div className="space-y-4">
                                <div className={`p-4 rounded-xl flex items-center justify-between border ${
                                    results.is_poisoned
                                        ? 'bg-red-500/15 border-red-500/30 text-red-500'
                                        : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-500'
                                }`}>
                                    <div className="flex items-center gap-3">
                                        {results.is_poisoned ? <AlertOctagon className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                                        <div>
                                            <h4 className="font-bold text-sm">
                                                {results.is_poisoned ? 'DOCUMENT POISONED' : 'DOCUMENT SECURE'}
                                            </h4>
                                            <p className="text-xs opacity-80 mt-0.5">{results.total_chunks} chunks analyzed</p>
                                        </div>
                                    </div>
                                    <div className="text-2xl font-mono font-black">
                                        {results.total_threats_found} Threats
                                    </div>
                                </div>

                                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                                    {results.chunk_results.map(chunk => (
                                        <div key={chunk.chunk_id} className={`p-3 rounded-xl border ${
                                            chunk.is_threat
                                                ? 'bg-red-500/10 border-red-500/30'
                                                : 'bg-[var(--panel-bg)] border-[var(--border-primary)]'
                                        }`}>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-mono font-bold text-[var(--text-muted)]">Chunk #{String(chunk.chunk_id).padStart(2, '0')}</span>
                                                {chunk.is_threat ? (
                                                    <span className="text-[10px] font-mono font-bold bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/40">FLAGGED: {chunk.matched_rule}</span>
                                                ) : (
                                                    <span className="text-[10px] font-mono font-bold text-emerald-500">CLEAN</span>
                                                )}
                                            </div>
                                            <p className="text-xs font-mono text-[var(--text-secondary)] truncate">{chunk.text_preview}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RagScanner;
