import React, { useEffect, useRef } from 'react';

const ConsolePanel = ({ logs }) => {
  const logsEndRef = useRef(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-48 bg-black/90 backdrop-blur-2xl border-t border-cyan-500/20 font-mono text-xs flex flex-col overflow-hidden z-30">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-black/50">
        <div className="flex items-center gap-3">
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-white/60 font-bold tracking-wider">neuro-sentry@sovereign:~</span>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        </div>

        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50 hover:bg-red-500/80 cursor-pointer transition-colors"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/50 hover:bg-yellow-500/80 cursor-pointer transition-colors"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/50 hover:bg-emerald-500/80 cursor-pointer transition-colors"></div>
        </div>
      </div>

      {/* Logs */}
      <div className="flex-1 overflow-y-auto p-6 space-y-1 scrollbar-hide">
        {logs.map((log, index) => {
          const logTime = typeof log === 'object' ? log.time : new Date().toLocaleTimeString('en-US', { hour12: false });
          const logType = typeof log === 'object' ? log.type : '';
          const logMessage = typeof log === 'object' ? log.message : log;
          
          return (
            <div key={index} className="flex gap-4 hover:bg-white/5 px-2 py-1 rounded transition-colors">
              <span className="text-white/20 flex-shrink-0 select-none">
                [{logTime}]
              </span>
              <span
                className={`${
                  logType === 'ERR' || logMessage.includes('ERR')
                    ? 'text-red-400 font-bold'
                    : logType === 'WARN' || logMessage.includes('WARN')
                      ? 'text-yellow-400'
                      : logType === 'SEC' || logMessage.includes('SEC')
                        ? 'text-emerald-400'
                        : logType === 'EXEC' || logMessage.includes('EXEC')
                          ? 'text-blue-400'
                          : logType === 'INPUT' || logMessage.includes('INPUT')
                            ? 'text-purple-400'
                            : logType === 'SYSTEM'
                              ? 'text-emerald-400'
                              : logType === 'INERA'
                                ? 'text-cyan-400'
                                : 'text-cyan-400/80'
                }`}
              >
                {logType && `${logType}: `}{logMessage}
              </span>
            </div>
          );
        })}
        <div ref={logsEndRef} />

        {/* Cursor */}
        <div className="flex gap-2 mt-2">
          <span className="text-emerald-400 font-bold">➜</span>
          <span className="w-2 h-4 bg-emerald-400 animate-pulse"></span>
        </div>
      </div>

      {/* Decorative scan line effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-scan"></div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan {
          animation: scan 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ConsolePanel;
