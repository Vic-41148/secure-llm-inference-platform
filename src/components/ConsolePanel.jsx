import React, { useEffect, useRef } from 'react';

const ConsolePanel = ({ logs }) => {
  const logsEndRef = useRef(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-48 bg-[var(--console-bg)] backdrop-blur-2xl border-t border-[var(--border-accent)] font-mono text-xs flex flex-col overflow-hidden z-30 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--border-primary)] bg-[var(--console-header-bg)]">
        <div className="flex items-center gap-3">
          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-[var(--console-text-muted)] font-bold tracking-wider">neuro-sentry@sovereign:~</span>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        </div>

        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/60 hover:bg-red-500 cursor-pointer transition-colors"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/60 hover:bg-yellow-500 cursor-pointer transition-colors"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/60 hover:bg-emerald-500 cursor-pointer transition-colors"></div>
        </div>
      </div>

      {/* Logs */}
      <div className="flex-1 overflow-y-auto p-6 space-y-1 scrollbar-hide">
        {logs.map((log, index) => {
          const logTime = typeof log === 'object' ? log.time : new Date().toLocaleTimeString('en-US', { hour12: false });
          const logType = typeof log === 'object' ? log.type : '';
          const logMessage = typeof log === 'object' ? log.message : log;

          return (
            <div key={index} className="flex gap-4 hover:bg-[var(--console-row-hover)] px-2 py-1 rounded transition-colors">
              <span className="text-[var(--console-time)] flex-shrink-0 select-none">[{logTime}]</span>
              <span className={`${
                logType === 'ERR'    || logMessage.includes('ERR')   ? 'text-red-500 font-bold'
                : logType === 'WARN'  || logMessage.includes('WARN')  ? 'text-yellow-500'
                : logType === 'SEC'   || logMessage.includes('SEC')   ? 'text-emerald-500'
                : logType === 'EXEC'  || logMessage.includes('EXEC')  ? 'text-blue-400'
                : logType === 'INPUT' || logMessage.includes('INPUT') ? 'text-purple-400'
                : logType === 'SYSTEM'  ? 'text-emerald-400'
                : logType === 'INERA'   ? 'text-cyan-400'
                : 'text-[var(--console-text-default)]'
              }`}>
                {logType && `${logType}: `}{logMessage}
              </span>
            </div>
          );
        })}
        <div ref={logsEndRef} />

        {/* Blinking cursor */}
        <div className="flex gap-2 mt-2">
          <span className="text-emerald-500 font-bold">➜</span>
          <span className="w-2 h-4 bg-emerald-500 animate-pulse"></span>
        </div>
      </div>

      {/* Scan line overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-scan"></div>
      </div>
    </div>
  );
};

export default ConsolePanel;
