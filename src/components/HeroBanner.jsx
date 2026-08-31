import React from 'react';
import { motion } from 'framer-motion';

const HeroBanner = ({ stats = {}, onNavigate }) => {
  return (
    <div className="px-8 py-3">
      <div className="relative overflow-hidden rounded-3xl glass-card border border-[var(--border-accent)] p-8 shadow-2xl transition-all duration-300">
        {/* Animated Cybernetic Ambient Mesh */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-600/10 to-indigo-600/10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-gradient-to-bl from-cyan-400/15 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Title & Status */}
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/35 text-cyan-400 text-xs font-mono font-bold tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              ENTERPRISE DEFENSE GRID ACTIVE · ZERO COMPROMISE
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--text-primary)] drop-shadow-md">
              Sovereign <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">Neural Shield</span> Matrix
            </h1>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-normal">
              Autonomous multi-stage defense system protecting Large Language Models against prompt injections, adversarial jailbreaks, and sensitive data exfiltration in real-time.
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--panel-bg)] border border-emerald-500/30 text-xs font-mono shadow-sm">
                <span className="text-[var(--text-muted)]">Block Rate:</span>
                <span className="text-emerald-500 font-black">{stats.blockRate || '94.2'}%</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--panel-bg)] border border-cyan-500/30 text-xs font-mono shadow-sm">
                <span className="text-[var(--text-muted)]">Threats Neutralized:</span>
                <span className="text-cyan-500 font-black">{stats.totalBlocked || '248'}</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--panel-bg)] border border-blue-500/30 text-xs font-mono shadow-sm">
                <span className="text-[var(--text-muted)]">Data Leaks:</span>
                <span className="text-blue-500 font-black">0 Detected</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--panel-bg)] border border-[var(--border-primary)] text-xs font-mono shadow-sm">
                <span className="text-[var(--text-muted)]">Latency Overhead:</span>
                <span className="text-emerald-500 font-bold">&lt; 3.2ms</span>
              </div>
            </div>
          </div>

          {/* Right Action Quick-Launch Hub */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[220px]">
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(6,182,212,0.4)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate && onNavigate('playground')}
              className="px-5 py-3 rounded-xl font-mono text-xs font-black uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 !text-white shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 border border-cyan-400/40"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Launch Playground
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: 'var(--card-bg-hover)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate && onNavigate('lab')}
              className="px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-[var(--card-bg)] hover:bg-[var(--card-bg-hover)] text-[var(--text-primary)] border border-[var(--border-primary)] flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              Attack Simulation Lab
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
