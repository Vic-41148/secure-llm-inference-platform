import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOOT_LINES = [
  { text: 'SOVEREIGN MATRIX OS v4.2.1 — LOADING KERNEL...', delay: 0 },
  { text: 'INITIALIZING NEURAL DEFENSE SUBSYSTEMS...', delay: 600 },
  { text: 'CALIBRATING THREAT CLASSIFICATION ENGINE...', delay: 1200 },
  { text: 'ESTABLISHING ENCRYPTED SECURE CHANNEL...', delay: 1800 },
  { text: '✓ ALL SYSTEMS NOMINAL — READY FOR DEPLOYMENT', delay: 2400, accent: true },
];

const IndexPage = ({ onEnter }) => {
  const [visibleLines, setVisibleLines] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const [typedMap, setTypedMap] = useState({});

  useEffect(() => {
    BOOT_LINES.forEach((line, idx) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, idx]);
        let charIdx = 0;
        const interval = setInterval(() => {
          charIdx++;
          setTypedMap(prev => ({ ...prev, [idx]: line.text.slice(0, charIdx) }));
          if (charIdx >= line.text.length) clearInterval(interval);
        }, 28);
      }, line.delay);
    });
    setTimeout(() => setShowButton(true), 3200);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-[100] overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #0d1a2e 0%, #050a14 55%, #020507 100%)' }}>

      {/* Grid background */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(6,182,212,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.07) 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }} />

      {/* Top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.12) 0%, transparent 70%)' }} />

      {/* Corner decorative lines */}
      {[
        'top-6 left-6 border-t-2 border-l-2',
        'top-6 right-6 border-t-2 border-r-2',
        'bottom-6 left-6 border-b-2 border-l-2',
        'bottom-6 right-6 border-b-2 border-r-2',
      ].map((cls, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: 'easeOut' }}
          className={`absolute w-10 h-10 border-cyan-500/40 ${cls}`} />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Orbital Logo */}
        <div className="relative mb-10 flex items-center justify-center" style={{ width: 160, height: 160 }}>
          {/* Outer blur glow */}
          <div className="absolute inset-0 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)', filter: 'blur(20px)' }} />

          {/* Outermost orbit ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-cyan-500/20"
          >
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.9)]" />
          </motion.div>

          {/* Mid orbit ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-6 rounded-full border border-blue-500/30"
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
          </motion.div>

          {/* Inner orbit ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-12 rounded-full border border-purple-500/25"
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
          </motion.div>

          {/* Center shield icon */}
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(59,130,246,0.2))', border: '1px solid rgba(6,182,212,0.4)' }}
          >
            <svg className="w-9 h-9 text-cyan-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </motion.div>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center mb-2"
        >
          <h1 className="text-6xl font-black font-mono tracking-[0.15em] mb-2"
            style={{
              background: 'linear-gradient(135deg, #67e8f9 0%, #38bdf8 40%, #818cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 20px rgba(6,182,212,0.4))'
            }}>
            NEURO-SENTRY
          </h1>
          <p className="text-xs text-cyan-500/60 font-mono tracking-[0.3em] uppercase">
            Sovereign AI Security OS · Enterprise Grade
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="w-80 h-px my-6 origin-center"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.5), transparent)' }} />

        {/* Boot sequence terminal */}
        <div className="w-[520px] rounded-xl border border-cyan-500/20 overflow-hidden mb-8"
          style={{ background: 'rgba(2,6,14,0.8)', backdropFilter: 'blur(12px)' }}>
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-cyan-500/10"
            style={{ background: 'rgba(6,182,212,0.05)' }}>
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-amber-500/70" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
            <span className="ml-2 text-[10px] font-mono text-cyan-500/50 tracking-widest">SOVEREIGN-BOOT — /kernel/init.sh</span>
          </div>
          <div className="p-4 space-y-1.5 min-h-[130px]">
            <AnimatePresence>
              {BOOT_LINES.map((line, idx) =>
                visibleLines.includes(idx) ? (
                  <motion.div key={idx}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start gap-2 text-[11px] font-mono ${line.accent ? 'text-emerald-400' : 'text-cyan-400/70'}`}>
                    <span className="text-cyan-600/50 flex-shrink-0 mt-px">›</span>
                    <span>
                      {typedMap[idx] || ''}
                      {(typedMap[idx] || '').length < line.text.length && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                          className="inline-block w-1.5 h-3 bg-cyan-400 ml-0.5 align-middle"
                        />
                      )}
                    </span>
                  </motion.div>
                ) : null
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Enter Button */}
        <AnimatePresence>
          {showButton && (
            <motion.button
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onEnter}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="relative group px-12 py-4 rounded-xl font-mono font-black tracking-[0.2em] text-sm overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(59,130,246,0.15))',
                border: '1px solid rgba(6,182,212,0.4)',
                color: '#67e8f9',
              }}
            >
              {/* Hover shimmer */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(59,130,246,0.2))' }}
              />
              {/* Animated border glow */}
              <motion.div
                className="absolute inset-0 rounded-xl"
                animate={{ boxShadow: ['0 0 0px rgba(6,182,212,0)', '0 0 20px rgba(6,182,212,0.4)', '0 0 0px rgba(6,182,212,0)'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <span className="relative z-10 flex items-center gap-3">
                ACCESS MAINFRAME
                <motion.svg
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </motion.svg>
              </span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Bottom status line */}
        <AnimatePresence>
          {showButton && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 flex items-center gap-6 text-[10px] font-mono text-cyan-500/40"
            >
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SECURE ENCLAVE ACTIVE
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                E2E ENCRYPTED
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                ZERO TRUST FRAMEWORK
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default IndexPage;
