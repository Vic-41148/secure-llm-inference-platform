import React from 'react';

const DefenseToggle = ({ isDefending, onToggle }) => {
  return (
    // Moved to RIGHT side — no longer overlaps the center tab bar
    <div
      className="fixed z-50"
      style={{
        top: '4.5rem',
        right: '1.5rem',      // anchored to right edge
        willChange: 'transform',
      }}
    >
      <div className="relative">
        {/* Glow */}
        <div
          className={`absolute inset-0 blur-xl transition-all duration-500 pointer-events-none rounded-2xl ${
            isDefending ? 'bg-emerald-500/20' : 'bg-red-500/20'
          }`}
        />

        {/* Toggle container */}
        <div
          className="relative px-3 py-2 bg-[var(--card-bg)] backdrop-blur-xl rounded-2xl border-2 transition-all duration-300 shadow-lg"
          style={{
            borderColor: isDefending ? 'rgb(16 185 129 / 0.5)' : 'rgb(239 68 68 / 0.5)',
          }}
        >
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
              isDefending ? 'bg-emerald-500/20' : 'bg-red-500/20'
            }`}>
              <svg
                className={`w-5 h-5 transition-all duration-300 ${isDefending ? 'text-emerald-400' : 'text-red-400'}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                {isDefending ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                )}
              </svg>
            </div>

            {/* Text */}
            <div className="text-left">
              <div className="text-[10px] font-mono text-[var(--text-muted)] tracking-widest uppercase">
                Defense Status
              </div>
              <div className={`text-base font-bold tracking-tight transition-all duration-300 leading-tight ${
                isDefending ? 'text-emerald-500' : 'text-red-500'
              }`}>
                {isDefending ? 'PROTECTED' : 'VULNERABLE'}
              </div>
            </div>

            {/* Toggle switch */}
            <div className="ml-3 pl-3 border-l border-[var(--border-primary)] flex items-center">
              <button
                onClick={onToggle}
                className={`relative w-12 h-6 rounded-full transition-all duration-500 focus:outline-none ${
                  isDefending ? 'bg-emerald-500' : 'bg-red-500/60'
                }`}
                aria-pressed={isDefending}
                aria-label="Toggle defense"
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-500 ${
                  isDefending ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Pulse ring */}
        <div className={`absolute inset-0 rounded-2xl border-2 animate-ping pointer-events-none transition-colors duration-300 ${
          isDefending ? 'border-emerald-500/20' : 'border-red-500/20'
        }`} />
      </div>
    </div>
  );
};

export default DefenseToggle;
