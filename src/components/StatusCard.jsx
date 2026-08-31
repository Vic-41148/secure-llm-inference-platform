import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Live animated EKG Heartbeat waveform component for the Neural Core
const HeartbeatWave = ({ isProcessing }) => {
  return (
    <div className="relative w-full h-12 overflow-hidden flex items-center">
      <svg
        className="w-full h-full text-cyan-400"
        viewBox="0 0 300 40"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="ekg-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="1" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <motion.path
          d={
            isProcessing
              ? "M 0 20 L 50 20 L 60 5 L 70 35 L 80 10 L 90 28 L 100 20 L 150 20 L 160 0 L 175 40 L 185 8 L 195 28 L 205 20 L 300 20"
              : "M 0 20 L 70 20 L 80 12 L 90 28 L 100 8 L 110 32 L 120 20 L 220 20 L 230 14 L 240 26 L 250 20 L 300 20"
          }
          fill="none"
          stroke="url(#ekg-grad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathOffset: 0 }}
          animate={{ pathOffset: [0, 1] }}
          transition={{
            duration: isProcessing ? 1.2 : 2.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </svg>
      {/* Scanning light pulse */}
      <motion.div
        className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent pointer-events-none"
        animate={{ left: ['-10%', '110%'] }}
        transition={{
          duration: isProcessing ? 1.2 : 2.5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
};

// Radar Circular Shield animation for Defense Status
const ShieldRadar = ({ isDefending, isBreached }) => {
  return (
    <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
      {/* Concentric pulsing rings */}
      <motion.div
        animate={
          isBreached
            ? { scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }
            : isDefending
            ? { scale: [1, 1.35, 1], opacity: [0.6, 0.1, 0.6] }
            : { scale: 1, opacity: 0.2 }
        }
        transition={{ duration: isBreached ? 0.6 : 2, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute inset-0 rounded-full border ${
          isBreached
            ? 'border-red-500 bg-red-500/10'
            : isDefending
            ? 'border-emerald-400 bg-emerald-500/10'
            : 'border-slate-600 bg-slate-800/40'
        }`}
      />
      <div
        className={`absolute inset-1.5 rounded-full border ${
          isBreached
            ? 'border-red-500/40'
            : isDefending
            ? 'border-emerald-400/40'
            : 'border-slate-700'
        }`}
      />

      {/* Rotating Radar sweep when defending */}
      {isDefending && !isBreached && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(52,211,153,0.35) 360deg)',
          }}
        />
      )}

      {/* Center Icon */}
      <div
        className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center shadow-lg ${
          isBreached
            ? 'bg-red-500/20 text-red-400 border border-red-500/50'
            : isDefending
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            : 'bg-slate-800 text-slate-400 border border-slate-700'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      </div>
    </div>
  );
};

const StatusCard = ({ isDefending = true, isProcessing = false, isBreached = false }) => {
  // Live ticking synaptic clock & jitter for telemetry feel
  const [latency, setLatency] = useState(14);
  const [clock, setClock] = useState('00:00:00');

  useEffect(() => {
    const clockInterval = setInterval(() => {
      const now = new Date();
      setClock(now.toTimeString().split(' ')[0]);
    }, 1000);

    const latencyInterval = setInterval(() => {
      setLatency(Math.floor(12 + Math.random() * 8));
    }, 2000);

    return () => {
      clearInterval(clockInterval);
      clearInterval(latencyInterval);
    };
  }, []);

  return (
    <div className="px-8 pt-6 pb-2">
      <div className="relative overflow-hidden rounded-3xl glass-card border border-[var(--border-accent)] p-8 shadow-2xl transition-all duration-300">
        {/* Ambient radial lighting */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/10 pointer-events-none"></div>
        <div className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${isDefending ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          {/* Header Row */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  LIVE TELEMETRY
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-mono">
                  SYS_CLK: <span className="text-cyan-300 font-bold">{clock}</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-mono hidden sm:inline">
                  LATENCY: <span className="text-emerald-400 font-bold">{latency}ms</span>
                </span>
              </div>
              <h2 className="text-4xl font-extrabold bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent tracking-tight mb-1">
                System Status
              </h2>
              <p className="text-[var(--text-muted)] text-sm">Real-time neural defense & pipeline monitoring</p>
            </div>

            {/* Live activity pill */}
            <div className="flex items-center gap-3">
              {isProcessing ? (
                <div className="flex items-center gap-2.5 px-4 py-2 bg-blue-500/20 border border-blue-400/40 rounded-xl shadow-lg shadow-blue-500/10 animate-pulse">
                  <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping"></div>
                  <span className="text-xs font-mono font-bold text-cyan-300 tracking-wider">NEURAL INFERENCE ACTIVE</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-xs font-mono text-emerald-300 font-semibold">ALL GATES SECURED</span>
                </div>
              )}
            </div>
          </div>

          {/* 3 Interactive Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. Shield Status Card with Radar */}
            <div className="glass-card rounded-2xl p-6 border border-[var(--border-primary)] shadow-lg hover:border-emerald-500/50 transition-all">
              <div className="flex items-center gap-4 mb-4">
                <ShieldRadar isDefending={isDefending} isBreached={isBreached} />
                <div>
                  <div className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-wider mb-1">Defense Shield</div>
                  <div className={`text-xl font-black tracking-tight ${isBreached ? 'text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]' : isDefending ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'text-slate-400'}`}>
                    {isBreached ? 'COMPROMISED' : isDefending ? 'ENGAGED 100%' : 'OFFLINE'}
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>3-Stage Firewall</span>
                  <span className={isDefending ? 'text-emerald-400 font-bold' : 'text-red-400'}>{isDefending ? '3/3 Active' : '0/3 Disarmed'}</span>
                </div>
                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400"
                    initial={{ width: 0 }}
                    animate={{ width: isDefending ? '100%' : '0%' }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>

            {/* 2. Neural Processing Card with Live Heartbeat Wave */}
            <div className="glass-card rounded-2xl p-6 border border-[var(--border-primary)] shadow-lg hover:border-cyan-500/50 transition-all">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <div className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-wider mb-1">Neural Core</div>
                  <div className="text-xl font-black text-cyan-400 tracking-tight drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
                    {isProcessing ? 'STREAMING' : 'READY (1.4 GHz)'}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                  <svg className={`w-5 h-5 ${isProcessing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              <HeartbeatWave isProcessing={isProcessing} />
            </div>

            {/* 3. Threat Matrix Level Gauge */}
            <div className="glass-card rounded-2xl p-6 border border-[var(--border-primary)] shadow-lg hover:border-amber-500/50 transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                  isBreached
                    ? 'bg-red-500/20 border border-red-500/40 text-red-400'
                    : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                }`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-wider mb-1">Threat Level</div>
                  <div className={`text-xl font-black tracking-tight ${
                    isBreached
                      ? 'text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]'
                      : 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                  }`}>
                    {isBreached ? 'DEFCON 1: CRITICAL' : 'DEFCON 5: NOMINAL'}
                  </div>
                </div>
              </div>
              {/* Discrete LED Segmented Threat Bar */}
              <div className="grid grid-cols-5 gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((lvl) => {
                  const active = isBreached ? true : lvl === 1;
                  const colorClass = isBreached
                    ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                    : lvl === 1
                    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                    : 'bg-slate-800/80 border border-white/5';
                  return <div key={lvl} className={`h-2 rounded-sm transition-all duration-300 ${colorClass}`} />;
                })}
              </div>
            </div>

          </div>

          {/* Live Protocol Description Banner */}
          <div className="mt-6 p-4 rounded-2xl glass-card border border-[var(--border-primary)] flex items-center justify-between gap-4">
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0"></span>
              {isDefending ? (
                <>
                  <span className="text-emerald-400 font-bold">Neural Defense Matrix Active:</span> All prompts routed through Rule Engine, Groq Zero-Shot Classifier & DLP filters. Zero leakages permitted.
                </>
              ) : (
                <>
                  <span className="text-red-400 font-bold">⚠️ Warning: Defense Gates Bypassed:</span> System is running in raw inference mode without jailbreak/prompt-injection interception.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
