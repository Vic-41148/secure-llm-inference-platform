import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

// Mock active attack signals worldwide
const DEMO_SIGNALS = [
    { id: 'sig-1', threat: 'Prompt Injection', severity: 'critical', intensity: 8, origin: '185.220.101.4', coordinates: [-74.006, 40.7128], actor: 'APT-29', details: 'Direct injection targeting financial database schema.' },
    { id: 'sig-2', threat: 'Jailbreak', severity: 'critical', intensity: 9, origin: '194.26.29.112', coordinates: [37.6173, 55.7558], actor: 'Lazarus Group', details: 'Multi-turn DAN jailbreak via encoded token stream.' },
    { id: 'sig-3', threat: 'Data Exfil', severity: 'critical', intensity: 7, origin: '103.251.167.20', coordinates: [116.4074, 39.9042], actor: 'Volt Typhoon', details: 'PII harvest payload requesting SSN & API keys.' },
    { id: 'sig-4', threat: 'RAG Poison', severity: 'high', intensity: 6, origin: '45.154.255.88', coordinates: [2.3522, 48.8566], actor: 'FIN7', details: 'Poisoned vector embedding containing prompt injection.' },
    { id: 'sig-5', threat: 'Social Eng', severity: 'medium', intensity: 4, origin: '198.51.100.23', coordinates: [-0.1278, 51.5074], actor: 'Scattered Spider', details: 'Phishing prompt mimicking system administrator.' },
    { id: 'sig-6', threat: 'DDoS Prompt', severity: 'high', intensity: 6, origin: '103.145.13.9', coordinates: [77.209, 28.6139], actor: 'Anonymous Sudan', details: 'Recursive expansion prompt consuming memory.' },
    { id: 'sig-7', threat: 'APT Probe', severity: 'critical', intensity: 9, origin: '178.62.204.11', coordinates: [139.6917, 35.6895], actor: 'Kimsuky', details: 'Indirect prompt injection embedded in fetched web page.' },
    { id: 'sig-8', threat: 'Recon Scan', severity: 'medium', intensity: 3, origin: '185.191.171.3', coordinates: [151.2093, -33.8688], actor: 'Unknown', details: 'Automated fuzzing probe checking for bypassable keywords.' },
    { id: 'sig-9', threat: 'PII Extract', severity: 'medium', intensity: 5, origin: '201.86.12.99', coordinates: [-46.6333, -23.5505], actor: 'DarkHydrus', details: 'Roleplay extraction attempting credit card harvesting.' },
    { id: 'sig-10', threat: 'Jailbreak', severity: 'high', intensity: 7, origin: '89.248.165.70', coordinates: [13.405, 52.52], actor: 'Sandworm', details: 'Side-channel token timing probe.' },
];

const ThreatMap = () => {
    const [dataPoints, setDataPoints] = useState(DEMO_SIGNALS);
    const [selectedThreat, setSelectedThreat] = useState(null);
    const [loading, setLoading] = useState(false);
    const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 1000, h: 500 });
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });
    const svgRef = useRef(null);

    // Convert lat/long to SVG coordinates
    const toSvg = (lon, lat) => {
        const x = ((lon + 180) / 360) * 1000;
        const y = ((90 - lat) / 180) * 500;
        return { x, y };
    };

    const handleWheel = useCallback((e) => {
        e.preventDefault();
        const factor = e.deltaY > 0 ? 1.15 : 0.85;
        setViewBox(prev => {
            const nw = Math.max(200, Math.min(1000, prev.w * factor));
            const nh = Math.max(100, Math.min(500, prev.h * factor));
            const nx = prev.x + (prev.w - nw) / 2;
            const ny = prev.y + (prev.h - nh) / 2;
            return { x: Math.max(0, Math.min(1000 - nw, nx)), y: Math.max(0, Math.min(500 - nh, ny)), w: nw, h: nh };
        });
    }, []);

    const handleMouseDown = useCallback((e) => {
        setIsPanning(true);
        setPanStart({ x: e.clientX, y: e.clientY });
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (!isPanning) return;
        const svg = svgRef.current;
        if (!svg) return;
        const rect = svg.getBoundingClientRect();
        const dx = ((e.clientX - panStart.x) / rect.width) * viewBox.w;
        const dy = ((e.clientY - panStart.y) / rect.height) * viewBox.h;
        setViewBox(prev => ({ ...prev, x: prev.x - dx, y: prev.y - dy }));
        setPanStart({ x: e.clientX, y: e.clientY });
    }, [isPanning, panStart, viewBox]);

    const handleMouseUp = useCallback(() => setIsPanning(false), []);

    const resetView = () => {
        setViewBox({ x: 0, y: 0, w: 1000, h: 500 });
        setSelectedThreat(null);
    };

    const focusThreat = (point) => {
        const { x, y } = toSvg(point.coordinates[0], point.coordinates[1]);
        setViewBox({ x: Math.max(0, x - 100), y: Math.max(0, y - 50), w: 200, h: 100 });
        setSelectedThreat(point);
    };

    const zoomLevel = Math.round((1000 / viewBox.w) * 100);

    return (
        <div className="p-6 h-full flex flex-col gap-4 overflow-hidden">
            {/* Top bar header */}
            <div className="glass-card p-4 rounded-2xl border border-[var(--border-accent)] flex items-center justify-between shadow-xl flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-[var(--text-primary)]">Live Threat Topography</h2>
                        <p className="text-xs text-[var(--text-muted)] font-mono">{dataPoints.length} active signals • Scroll to zoom • Drag to pan</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-[var(--text-muted)] bg-[var(--panel-bg)] px-3 py-1.5 rounded-lg border border-[var(--border-primary)]">ZOOM: {zoomLevel}%</span>
                    <button onClick={resetView} className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/15 px-3.5 py-1.5 rounded-lg border border-cyan-500/40 hover:bg-cyan-500/25 transition-all">
                        RESET VIEW
                    </button>
                </div>
            </div>

            {/* Radar Viewport */}
            <div className="flex-1 relative rounded-2xl overflow-hidden glass-card border border-[var(--border-primary)] shadow-2xl bg-[#070b14]" style={{ minHeight: 400 }}>
                <svg
                    ref={svgRef}
                    className="w-full h-full cursor-grab active:cursor-grabbing select-none"
                    viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    {/* Grid lines */}
                    <defs>
                        <pattern id="radar-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(6,182,212,0.12)" strokeWidth="0.8" />
                        </pattern>
                        <radialGradient id="radar-center" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                        </radialGradient>
                    </defs>

                    <rect x="0" y="0" width="1000" height="500" fill="#060913" />
                    <rect x="0" y="0" width="1000" height="500" fill="url(#radar-grid)" />
                    <circle cx="500" cy="250" r="240" fill="url(#radar-center)" />

                    {/* Concentric Radar Rings */}
                    {[80, 160, 240].map((r, i) => (
                        <circle key={i} cx="500" cy="250" r={r} fill="none" stroke="rgba(6,182,212,0.2)" strokeWidth="1" strokeDasharray="4 4" />
                    ))}

                    {/* Threat Signals */}
                    {dataPoints.map((point) => {
                        const { x, y } = toSvg(point.coordinates[0], point.coordinates[1]);
                        const isHigh = point.intensity > 5;
                        const isSelected = selectedThreat?.id === point.id;
                        const color = isHigh ? '#ef4444' : '#f59e0b';

                        return (
                            <g key={point.id} onClick={() => setSelectedThreat(point)} className="cursor-pointer">
                                {/* Pulse glow */}
                                <circle cx={x} cy={y} r={point.intensity * 2.8} fill={color} fillOpacity="0.25">
                                    <animate attributeName="r" values={`${point.intensity * 2};${point.intensity * 4};${point.intensity * 2}`} dur="2s" repeatCount="indefinite" />
                                    <animate attributeName="fill-opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" />
                                </circle>

                                {/* Core dot */}
                                <circle cx={x} cy={y} r={isSelected ? 6 : 4} fill="#ffffff" stroke={color} strokeWidth="2.5" />

                                {/* Label */}
                                <text x={x + 10} y={y + 4} fill={color} fontSize="9" fontFamily="monospace" fontWeight="bold" opacity="0.9">
                                    {point.threat.toUpperCase()} [{point.intensity}x]
                                </text>
                            </g>
                        );
                    })}
                </svg>

                {/* Threat Index Sidebar */}
                <div className="absolute top-4 right-4 w-52 glass-card rounded-xl border border-[var(--border-primary)] shadow-2xl max-h-[300px] overflow-y-auto bg-[var(--dropdown-bg)] backdrop-blur-xl">
                    <div className="px-3 py-2 border-b border-[var(--border-primary)] text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider sticky top-0 bg-[var(--dropdown-bg)]">
                        THREAT INDEX ({dataPoints.length})
                    </div>
                    {dataPoints.map((point) => {
                        const isSelected = selectedThreat?.id === point.id;
                        const isHigh = point.intensity > 5;
                        return (
                            <button
                                key={point.id}
                                onClick={() => focusThreat(point)}
                                className={`w-full text-left px-3 py-2 text-[11px] font-mono transition-all flex items-center justify-between border-b border-white/5 last:border-0 ${
                                    isSelected
                                        ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                                        : 'text-[var(--text-secondary)] hover:bg-white/5'
                                }`}
                            >
                                <div className="flex items-center gap-2 truncate">
                                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isHigh ? 'bg-red-500' : 'bg-amber-400'}`} />
                                    <span className="truncate">{point.threat}</span>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 ml-1">{point.intensity}x</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Selected Threat Details Panel */}
            {selectedThreat && (
                <div className="glass-card p-4 rounded-2xl border border-[var(--border-accent)] flex items-center justify-between gap-4 shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${selectedThreat.intensity > 5 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                            {selectedThreat.intensity > 5 ? 'CRIT' : 'WARN'}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-[var(--text-primary)]">{selectedThreat.threat}</span>
                                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">ACTOR: {selectedThreat.actor}</span>
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] mt-0.5">{selectedThreat.details}</p>
                            <p className="text-[11px] font-mono text-[var(--text-muted)] mt-1">📍 ORIGIN IP: {selectedThreat.origin} • Coords: [{selectedThreat.coordinates[1].toFixed(2)}°, {selectedThreat.coordinates[0].toFixed(2)}°]</p>
                        </div>
                    </div>
                    <button onClick={() => setSelectedThreat(null)} className="p-2 rounded-lg bg-[var(--panel-bg)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-primary)]">
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
};

export default ThreatMap;
