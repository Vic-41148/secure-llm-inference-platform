import React from 'react';

const StatusCard = ({ isDefending, isProcessing, isBreached }) => {
  return (
    <div className="p-8">
      <div className="relative overflow-hidden rounded-3xl bg-[var(--card-bg)] border border-[var(--border-primary)] p-8 transition-colors duration-300">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5"></div>
        <div className={`absolute inset-0 transition-opacity duration-500 ${isDefending ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-[var(--text-primary)] to-cyan-400 bg-clip-text text-transparent mb-2">
                System Status
              </h2>
              <p className="text-[var(--text-muted)] text-sm">Real-time neural defense monitoring</p>
            </div>
            {isProcessing && (
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-mono text-blue-400 tracking-wider">PROCESSING</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Shield Status */}
            <div className="bg-[var(--panel-bg)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--border-primary)]">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDefending ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                  <svg className={`w-7 h-7 ${isDefending ? 'text-emerald-500' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-wider mb-1">Defense Shield</div>
                  <div className={`text-lg font-bold ${isDefending ? 'text-emerald-500' : 'text-red-500'}`}>
                    {isDefending ? 'ACTIVE' : 'OFFLINE'}
                  </div>
                </div>
              </div>
              <div className="h-1 bg-[var(--panel-bg)] rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-500 ${isDefending ? 'w-full bg-gradient-to-r from-emerald-500 to-emerald-400' : 'w-0'}`}></div>
              </div>
            </div>

            {/* Neural Processing */}
            <div className="bg-[var(--panel-bg)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--border-primary)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-wider mb-1">Neural Core</div>
                  <div className="text-lg font-bold text-blue-400">{isProcessing ? 'ANALYZING' : 'STANDBY'}</div>
                </div>
              </div>
              <div className="h-1 bg-[var(--panel-bg)] rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r from-blue-500 to-blue-400 ${isProcessing ? 'w-full animate-pulse' : 'w-3/4'} transition-all duration-500`}></div>
              </div>
            </div>

            {/* Threat Level */}
            <div className="bg-[var(--panel-bg)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--border-primary)]">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isBreached ? 'bg-red-500/20' : 'bg-emerald-500/20'}`}>
                  <svg className={`w-7 h-7 ${isBreached ? 'text-red-500' : 'text-emerald-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-wider mb-1">Threat Level</div>
                  <div className={`text-lg font-bold ${isBreached ? 'text-red-500' : 'text-emerald-500'}`}>
                    {isBreached ? 'CRITICAL' : 'NOMINAL'}
                  </div>
                </div>
              </div>
              <div className="h-1 bg-[var(--panel-bg)] rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-500 ${isBreached ? 'w-full bg-gradient-to-r from-red-500 to-red-400' : 'w-1/4 bg-gradient-to-r from-emerald-500 to-emerald-400'}`}></div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 p-4 bg-[var(--card-bg)] rounded-xl border border-[var(--border-primary)]">
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {isDefending ? (
                <><span className="text-emerald-500 font-bold">Neural defense matrix active.</span> All incoming prompts are being analyzed through quantum-encrypted threat detection layers. System is operating at optimal security parameters.</>
              ) : (
                <><span className="text-red-500 font-bold">⚠️ Defense systems offline.</span> The system is vulnerable to prompt injection and jailbreak attempts. Activate shield immediately to prevent data leakage.</>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
