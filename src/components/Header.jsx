import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Header = ({ backendConnected = false }) => {
  const { isDark, toggleTheme } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-20 header-bg backdrop-blur-2xl border-b border-[var(--border-accent)] z-50 transition-colors duration-300">
      <div className="h-full px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 blur-xl opacity-50 animate-pulse"></div>
            <div className="relative w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--text-primary)] via-cyan-300 to-blue-400 bg-clip-text text-transparent tracking-tight">
              NEURO-SENTRY
            </h1>
            <p className="text-xs text-[var(--text-muted)] tracking-widest font-mono">SOVEREIGN MATRIX OS V1.0</p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Backend status */}
          <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${
            backendConnected
              ? 'bg-emerald-500/10 border-emerald-500/20'
              : 'bg-amber-500/10 border-amber-500/20'
          }`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              backendConnected ? 'bg-emerald-500' : 'bg-amber-500'
            }`}></div>
            <span className={`text-xs font-mono tracking-wider ${
              backendConnected ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              MAINFRAME LINK: {backendConnected ? 'OK' : 'DEMO'}
            </span>
          </div>

          {/* Settings button + dropdown */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setSettingsOpen(prev => !prev)}
              className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center border ${
                settingsOpen
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                  : 'bg-[var(--card-bg)] border-[var(--border-primary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)]'
              }`}
              aria-label="Settings"
            >
              <svg className={`w-5 h-5 transition-transform duration-300 ${settingsOpen ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            <AnimatePresence>
              {settingsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-0 top-12 w-72 settings-dropdown rounded-2xl border border-[var(--border-primary)] shadow-2xl overflow-hidden z-[60]"
                >
                  {/* Dropdown header */}
                  <div className="px-4 py-3 border-b border-[var(--border-primary)] bg-[var(--dropdown-header)]">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-xs font-mono font-bold text-[var(--text-secondary)] uppercase tracking-widest">System Settings</span>
                    </div>
                  </div>

                  {/* Theme section */}
                  <div className="p-4">
                    <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-3">Appearance</div>

                    {/* Theme toggle */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border-primary)] hover:border-[var(--border-hover)] transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          isDark ? 'bg-blue-500/20' : 'bg-amber-500/20'
                        }`}>
                          {isDark ? (
                            <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[var(--text-primary)]">
                            {isDark ? 'Dark Mode' : 'Light Mode'}
                          </div>
                          <div className="text-[10px] text-[var(--text-muted)] font-mono">
                            {isDark ? 'Neural night vision active' : 'High visibility mode active'}
                          </div>
                        </div>
                      </div>

                      {/* Toggle switch */}
                      <button
                        onClick={toggleTheme}
                        className={`relative w-12 h-6 rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                          isDark ? 'bg-blue-600' : 'bg-amber-400'
                        }`}
                        aria-pressed={isDark}
                        aria-label="Toggle dark/light mode"
                      >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-500 flex items-center justify-center ${
                          isDark ? 'translate-x-6' : 'translate-x-0'
                        }`}>
                          {isDark ? (
                            <svg className="w-2.5 h-2.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                            </svg>
                          ) : (
                            <svg className="w-2.5 h-2.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                            </svg>
                          )}
                        </span>
                      </button>
                    </div>

                    {/* Mode preview pills */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => !isDark && toggleTheme()}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all border ${
                          isDark
                            ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                            : 'bg-[var(--card-bg)] border-[var(--border-primary)] text-[var(--text-muted)] hover:border-[var(--border-hover)]'
                        }`}
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                        Dark
                      </button>
                      <button
                        onClick={() => isDark && toggleTheme()}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all border ${
                          !isDark
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-600'
                            : 'bg-[var(--card-bg)] border-[var(--border-primary)] text-[var(--text-muted)] hover:border-[var(--border-hover)]'
                        }`}
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                        </svg>
                        Light
                      </button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-[var(--border-primary)] mx-4"></div>

                  {/* System info */}
                  <div className="p-4">
                    <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-3">System Info</div>
                    <div className="space-y-2">
                      {[
                        { label: 'Version', value: 'V1.0.0' },
                        { label: 'Build', value: 'SOVEREIGN-MATRIX' },
                        { label: 'Theme', value: isDark ? 'DARK / NEURAL' : 'LIGHT / CLARITY' },
                      ].map(item => (
                        <div key={item.label} className="flex items-center justify-between text-xs">
                          <span className="text-[var(--text-muted)] font-mono">{item.label}</span>
                          <span className="text-[var(--text-secondary)] font-mono font-bold">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Animated border bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
    </header>
  );
};

export default Header;
