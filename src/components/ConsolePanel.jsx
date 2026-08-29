import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConsolePanel = ({ logs = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const logsEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isOpen]);

  return (
    <motion.div
      initial={false}
      animate={{ height: isOpen ? 220 : 38 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--console-bg)] backdrop-blur-2xl border-t border-[var(--border-accent)] font-mono text-xs flex flex-col overflow-hidden shadow-[0_-8px_30px_rgba(0,0,0,0.5)] transition-colors duration-300 select-none"
    >
      {/* Header bar (clickable to toggle open/closed) */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between px-6 h-[38px] min-h-[38px] border-b border-[var(--border-primary)] bg-[var(--console-header-bg)] cursor-pointer hover:bg-cyan-500/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-[var(--console-text-muted)] font-bold tracking-wider text-xs">
            neuro-sentry@sovereign:~
          </span>
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>

          <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
            {logs.length} events
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-[var(--text-muted)] tracking-widest hidden sm:inline">
            {isOpen ? 'CLICK TO MINIMIZE' : 'CLICK TO EXPAND'}
          </span>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-5 h-5 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </motion.div>

          <div className="flex gap-1.5 ml-1" onClick={(e) => e.stopPropagation()}>
            <div
              onClick={() => setIsOpen(false)}
              className="w-3 h-3 rounded-full bg-red-500/60 hover:bg-red-500 cursor-pointer transition-colors"
              title="Close"
            ></div>
            <div
              onClick={() => setIsOpen((prev) => !prev)}
              className="w-3 h-3 rounded-full bg-yellow-500/60 hover:bg-yellow-500 cursor-pointer transition-colors"
              title="Toggle"
            ></div>
            <div
              onClick={() => setIsOpen(true)}
              className="w-3 h-3 rounded-full bg-emerald-500/60 hover:bg-emerald-500 cursor-pointer transition-colors"
              title="Maximize"
            ></div>
          </div>
        </div>
      </div>

      {/* Logs Viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide select-text">
        {logs.map((log, index) => {
          const logTime = typeof log === 'object' ? log.time : new Date().toLocaleTimeString('en-US', { hour12: false });
          const logType = typeof log === 'object' ? log.type : '';
          const logMessage = typeof log === 'object' ? log.message : log;

          return (
            <div key={index} className="flex gap-4 hover:bg-[var(--console-row-hover)] px-2 py-0.5 rounded transition-colors font-mono text-[11px]">
              <span className="text-[var(--console-time)] flex-shrink-0 select-none">[{logTime}]</span>
              <span className={`${
                logType === 'ERR'    || logMessage.includes('ERR')   ? 'text-red-400 font-bold'
                : logType === 'WARN'  || logMessage.includes('WARN')  ? 'text-amber-400'
                : logType === 'SEC'   || logMessage.includes('SEC')   ? 'text-emerald-400'
                : logType === 'EXEC'  || logMessage.includes('EXEC')  ? 'text-blue-400'
                : logType === 'INPUT' || logMessage.includes('INPUT') ? 'text-purple-400'
                : logType === 'SYSTEM'  ? 'text-emerald-300'
                : logType === 'INERA'   ? 'text-cyan-300'
                : 'text-[var(--console-text-default)]'
              }`}>
                {logType && `${logType}: `}{logMessage}
              </span>
            </div>
          );
        })}
        <div ref={logsEndRef} />

        {/* Blinking prompt line */}
        <div className="flex items-center gap-2 mt-2 pt-1 border-t border-white/5 text-[11px]">
          <span className="text-emerald-400 font-bold">➜</span>
          <span className="text-cyan-400 font-mono">neural-bus/stream:</span>
          <span className="w-2 h-3.5 bg-cyan-400 animate-pulse inline-block"></span>
        </div>
      </div>

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-scan"></div>
      </div>
    </motion.div>
  );
};

export default ConsolePanel;
