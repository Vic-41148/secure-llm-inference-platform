import React from 'react';
import { motion } from 'framer-motion';

const HeroBanner = ({ stats = {}, onNavigate }) => {
  const quickActions = [
    {
      label: 'Neural Link',
      sublabel: 'Live Chat Interface',
      view: 'chat',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      ),
      primary: true,
    },
    {
      label: 'Attack Lab',
      sublabel: 'Simulate & Test',
      view: 'lab',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      ),
    },
    {
      label: 'Threat Intel',
      sublabel: 'Live Feeds',
      view: 'threats',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      ),
    },
  ];

  const metrics = [
    { label: 'Block Rate', value: `${stats.blockRate || '94.2'}%`, color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/8' },
    { label: 'Neutralized', value: stats.totalBlocked || 248, color: 'text-cyan-400', border: 'border-cyan-500/20', bg: 'bg-cyan-500/8' },
    { label: 'Data Leaks', value: '0 Detected', color: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/8' },
    { label: 'Latency', value: '< 3.2ms', color: 'text-emerald-400', border: 'border-[var(--border-primary)]', bg: '' },
  ];

  return (
    <div className="px-8 pt-6 pb-4">
      <div className="relative overflow-hidden rounded-2xl glass-card border border-[var(--border-accent)] shadow-2xl">
        {/* Ambient mesh */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/8 via-blue-600/5 to-indigo-600/8 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[250px] bg-gradient-to-bl from-cyan-400/12 via-blue-500/8 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[180px] bg-gradient-to-tr from-indigo-500/8 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 p-7">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            {/* Left — Title & Status */}
            <div className="flex-1 space-y-4">
              {/* Status badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono font-bold tracking-wider"
                style={{
                  background: 'rgba(6,182,212,0.08)',
                  borderColor: 'rgba(6,182,212,0.3)',
                  color: 'rgba(6,182,212,1)',
                  boxShadow: '0 0 12px rgba(6,182,212,0.15)',
                }}>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ENTERPRISE DEFENSE GRID · ACTIVE · ZERO BREACH
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--text-primary)] leading-tight">
                  Sovereign{' '}
                  <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
                    Neural Shield
                  </span>{' '}
                  Matrix
                </h2>
                <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed max-w-xl">
                  Autonomous multi-stage LLM defense against prompt injections, adversarial jailbreaks, and sensitive data exfiltration — in real-time.
                </p>
              </div>

              {/* Metric pills */}
              <div className="flex flex-wrap gap-2">
                {metrics.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.3 }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono ${m.border}`}
                    style={{ background: 'var(--panel-bg)' }}
                  >
                    <span className="text-[var(--text-muted)]">{m.label}:</span>
                    <span className={`${m.color} font-black`}>{m.value}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right — Quick Actions */}
            <div className="flex flex-row lg:flex-col gap-2.5 lg:min-w-[200px]">
              {quickActions.map((action, i) => (
                <motion.button
                  key={action.view}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.3 }}
                  whileHover={{ scale: 1.03, x: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onNavigate && onNavigate(action.view)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    action.primary
                      ? 'text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/40'
                      : 'bg-[var(--card-bg)] border border-[var(--border-primary)] text-[var(--text-primary)] hover:border-[var(--border-hover)] hover:bg-[var(--card-bg-hover)]'
                  }`}
                  style={action.primary ? {
                    background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                  } : {}}
                >
                  <svg className={`w-4 h-4 flex-shrink-0 ${action.primary ? 'text-white' : 'text-cyan-500'}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {action.icon}
                  </svg>
                  <div className="text-left">
                    <div>{action.label}</div>
                    <div className={`text-[10px] font-normal capitalize tracking-normal ${action.primary ? 'text-white/70' : 'text-[var(--text-muted)]'}`}>
                      {action.sublabel}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom animated gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.4), rgba(59,130,246,0.4), transparent)' }} />
      </div>
    </div>
  );
};

export default HeroBanner;
