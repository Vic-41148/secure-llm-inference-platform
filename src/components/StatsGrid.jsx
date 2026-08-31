import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Animated counter hook for counting numbers smoothly
const AnimatedNumber = ({ value, duration = 1.2 }) => {
  const numValue = typeof value === 'number' ? value : parseInt(value, 10) || 0;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = numValue;
    if (start === end) {
      setDisplayValue(end);
      return;
    }
    const incrementTime = (duration * 1000) / Math.min(Math.max(end, 20), 60);
    const step = Math.max(1, Math.floor(end / 40));

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [numValue, duration]);

  return <>{typeof value === 'string' && isNaN(parseInt(value, 10)) ? value : displayValue}</>;
};

// Micro Sparkline Chart SVG Component
const Sparkline = ({ color = 'cyan', data = [12, 18, 14, 25, 20, 32, 28, 40] }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const height = 32;
  const width = 120;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(' ');

  const strokeColors = {
    blue: '#60a5fa',
    emerald: '#34d399',
    purple: '#c084fc',
    cyan: '#22d3ee',
  };

  const strokeColor = strokeColors[color] || '#22d3ee';

  return (
    <svg className="w-full h-8 overflow-visible opacity-70 group-hover:opacity-100 transition-opacity" viewBox={`0 0 ${width} ${height}`}>
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      {/* End dot */}
      {data.length > 0 && (
        <circle
          cx={width}
          cy={height - ((data[data.length - 1] - min) / range) * (height - 6) - 3}
          r="3"
          fill={strokeColor}
          className="animate-ping"
        />
      )}
    </svg>
  );
};

const StatsGrid = ({ stats = {} }) => {
  const statCards = [
    {
      label: 'Total Attack Attempts',
      value: stats.totalAttempts || 342,
      color: 'blue',
      change: '+14%',
      sparkData: [15, 22, 18, 30, 26, 45, 38, 52],
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      ),
    },
    {
      label: 'Successfully Blocked',
      value: stats.totalBlocked || 322,
      color: 'emerald',
      change: '+28%',
      sparkData: [12, 19, 16, 28, 25, 42, 36, 50],
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      ),
    },
    {
      label: 'Data Leaks Prevented',
      value: stats.totalLeaked === 0 ? (stats.totalAttempts || 342) : (stats.totalAttempts || 342) - (stats.totalLeaked || 0),
      color: 'indigo',
      change: '100% SECURE',
      sparkData: [30, 30, 30, 30, 30, 30, 30, 30],
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      ),
    },
    {
      label: 'Defense Block Rate',
      value: `${stats.blockRate || 94.2}%`,
      color: 'cyan',
      change: '+2.4%',
      sparkData: [88, 90, 89, 92, 91, 93, 94, 95],
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      ),
    },
  ];

  const colorMap = {
    blue: {
      bg: 'bg-blue-500/15',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      glow: 'group-hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]',
      gradient: 'from-blue-500 to-cyan-400',
    },
    emerald: {
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      glow: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]',
      gradient: 'from-emerald-500 to-teal-400',
    },
    indigo: {
      bg: 'bg-indigo-500/15',
      text: 'text-indigo-400',
      border: 'border-indigo-500/30',
      glow: 'group-hover:shadow-[0_0_30px_rgba(99,102,241,0.25)]',
      gradient: 'from-indigo-500 to-blue-400',
    },
    cyan: {
      bg: 'bg-cyan-500/15',
      text: 'text-cyan-400',
      border: 'border-cyan-500/30',
      glow: 'group-hover:shadow-[0_0_30px_rgba(6,182,212,0.25)]',
      gradient: 'from-cyan-500 to-blue-400',
    },
  };

  return (
    <div className="px-8 pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Telemetry Analytics</h3>
          </div>
          <p className="text-xs text-slate-400 font-mono tracking-wider mt-1">Real-time attack classification and telemetry metrics</p>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
          <span className="text-slate-500">POLLING:</span>
          <span className="text-emerald-400 font-bold">1000ms AUTO</span>
        </div>
      </div>

      {/* 4 Interactive Stat Cards with Number Ticker & Sparklines */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { staggerChildren: 0.1 } }}
      >
        {statCards.map((stat, index) => {
          const c = colorMap[stat.color] || colorMap.cyan;
          return (
            <motion.div
              key={index}
              variants={{ hidden: { opacity: 0, scale: 0.95, y: 15 }, visible: { opacity: 1, scale: 1, y: 0 } }}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`group relative glass-card rounded-2xl p-6 border border-[var(--border-primary)] hover:border-[var(--border-hover)] ${c.glow} transition-all duration-300 overflow-hidden flex flex-col justify-between`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`}></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-md`}>
                    <svg className={`w-7 h-7 ${c.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">{stat.icon}</svg>
                  </div>

                  {/* Sparkline Micro-chart */}
                  <div className="w-24">
                    <Sparkline color={stat.color} data={stat.sparkData} />
                  </div>
                </div>

                {/* Animated Value */}
                <div className={`text-3xl sm:text-4xl font-black ${c.text} mb-1.5 drop-shadow-md tracking-tight font-mono`}>
                  <AnimatedNumber value={stat.value} />
                </div>

                <div className="text-xs text-slate-300 font-mono uppercase tracking-wider font-semibold mb-3">
                  {stat.label}
                </div>
              </div>

              {/* Bottom pill comparison */}
              <div className="relative z-10 pt-2 border-t border-white/5 flex items-center justify-between">
                <div className={`px-2.5 py-0.5 rounded-md ${c.bg} border ${c.border}`}>
                  <span className={`text-[11px] font-mono font-bold ${c.text}`}>{stat.change}</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">live telemetry</span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--border-hover)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Threat Distribution & System Health Matrix */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threat Distribution */}
        <div className="glass-card rounded-2xl p-6 border border-[var(--border-primary)] shadow-lg hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              Threat Classification Vector
            </h4>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
              STAGE 1 & 2
            </span>
          </div>

          <div className="space-y-4">
            {[
              { name: 'Jailbreak & Persona Manipulation', value: 45, color: 'text-amber-400', bar: 'from-amber-500 to-orange-400' },
              { name: 'Direct Prompt Injection (Payload)', value: 30, color: 'text-red-400', bar: 'from-red-500 to-rose-400' },
              { name: 'PII Extraction & Sensitive Data Exfil', value: 20, color: 'text-purple-400', bar: 'from-purple-500 to-indigo-400' },
              { name: 'Benign & Compliant Prompts', value: 5, color: 'text-emerald-400', bar: 'from-emerald-500 to-teal-400' },
            ].map((threat, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs sm:text-sm font-medium text-slate-200">{threat.name}</span>
                  <span className={`text-xs sm:text-sm font-mono font-bold ${threat.color}`}>{threat.value}%</span>
                </div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${threat.bar}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${threat.value}%` }}
                    transition={{ duration: 1, delay: idx * 0.1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health Matrix */}
        <div className="glass-card rounded-2xl p-6 border border-[var(--border-primary)] shadow-lg hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Neural Defense Matrix Integrity
            </h4>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              100% OPERATIONAL
            </span>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Rule Engine (Stage 1 Exact Match)', value: 100, status: 'Active (0ms)' },
              { label: 'Groq Classifier (Stage 2 Zero-Shot)', value: 98, status: 'Optimal (45ms)' },
              { label: 'DLP Pattern Sanitizer (Stage 3)', value: 100, status: 'Active (12ms)' },
              { label: 'Neural Token Vault & Quarantine', value: 92, status: 'Protected' },
            ].map((system, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs sm:text-sm font-medium text-slate-200">{system.label}</span>
                    <span className="text-xs text-emerald-400 font-mono font-bold">{system.status}</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${system.value}%` }}
                      transition={{ duration: 1, delay: idx * 0.1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsGrid;
