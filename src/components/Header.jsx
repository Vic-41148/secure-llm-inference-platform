import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import GoogleLogin from './GoogleLogin';

const VIEW_TITLES = {
  overview: 'Dashboard Overview',
  analytics: 'Telemetry & Analytics',
  audit: 'Audit Trail Logs',
  threats: 'Threat Intelligence',
  dlp: 'Data Loss Prevention',
  map: 'Live Threat Topography',
  rules: 'Dynamic Rule Engine',
  fuzzer: 'Automated Red-Team',
  rag: 'RAG Context Defense',
  playground: 'AI Attack Sandbox',
  lab: 'Attack Simulation Lab',
  chat: 'Direct Neural Link',
  projects: 'Workspace Isolation',
  quotas: 'Token Economics',
  settings: 'System Configuration',
};

const Header = ({ activeView = 'overview', backendConnected = false, user, onLoginSuccess, onLogout, isDefending = true, onToggleDefense, onOpenCommandPalette }) => {
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
        {/* Logo & Breadcrumb Path */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <motion.div
              className="relative cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 blur-xl opacity-50 animate-pulse"></div>
              <motion.div
                className="relative w-11 h-11 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </motion.div>
            </motion.div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[var(--text-primary)] via-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tight">
                NEURO-SENTRY
              </h1>
              <p className="text-[10px] text-[var(--text-muted)] tracking-widest font-mono">SOVEREIGN AI OS</p>
            </div>
          </div>

          {/* Breadcrumb Separator */}
          <div className="hidden md:flex items-center gap-2 font-mono text-xs text-[var(--text-muted)] pl-4 border-l border-[var(--border-primary)]">
            <span className="opacity-60">SOVEREIGN</span>
            <span>/</span>
            <span className="font-bold text-cyan-600 dark:text-cyan-400">{VIEW_TITLES[activeView] || 'Overview'}</span>
            <span className="hidden lg:inline-flex items-center gap-1.5 ml-2 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              US-EAST-1 · 99.99% UPTIME
            </span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Quick Command Palette Launcher */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-[var(--card-bg)] border-[var(--border-primary)] hover:border-cyan-500/40 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xs font-mono transition-all shadow-sm group"
            title="Search modules and execute commands (Ctrl + K)"
          >
            <svg className="w-3.5 h-3.5 text-cyan-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[var(--panel-bg)] border border-[var(--border-primary)] text-[10px] font-bold text-cyan-600 dark:text-cyan-400">
              Ctrl+K
            </kbd>
          </button>

          {/* Backend status / Network Link */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('ns-open-network'))}
            className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-sm ${backendConnected
              ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/60 text-emerald-600 dark:text-emerald-400'
              : 'bg-blue-600/10 dark:bg-cyan-500/15 border-blue-600/30 dark:border-cyan-500/30 hover:border-blue-600/60 text-blue-700 dark:text-cyan-300'
              }`}
            title="Click to view Local / WiFi Network access URLs and QR codes (Press M)"
          >
            <div className={`w-2 h-2 rounded-full animate-pulse ${backendConnected ? 'bg-emerald-500' : 'bg-blue-600 dark:bg-cyan-400'}`} />
            <span className="text-xs font-mono font-black tracking-wider">
              MAINFRAME: {backendConnected ? 'ONLINE' : 'DEMO MODE'}
            </span>
          </button>

          {/* Defense toggle — inline */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-[var(--card-bg)] border-[var(--border-primary)] shadow-sm">
            <div className={`w-2 h-2 rounded-full animate-pulse ${isDefending ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <span className={`text-xs font-mono font-bold tracking-wider ${isDefending ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
              {isDefending ? 'PROTECTED' : 'VULNERABLE'}
            </span>
            <button
              onClick={onToggleDefense}
              className={`relative ml-1 w-9 h-5 rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${isDefending ? 'bg-emerald-500' : 'bg-red-500/60'
                }`}
              aria-pressed={isDefending}
              aria-label="Toggle defense (Press D)"
              title="Toggle Defense Pipeline (Press D)"
            >
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-500 ${isDefending ? 'translate-x-4' : 'translate-x-0'
                }`} />
            </button>
          </div>

          {/* Google Login */}
          <GoogleLogin onLoginSuccess={onLoginSuccess} onLogout={onLogout} />

          {/* Direct 1-Click Sun/Moon Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl transition-all flex items-center justify-center border bg-[var(--card-bg)] border-[var(--border-primary)] text-[var(--text-muted)] hover:text-cyan-500 hover:border-cyan-500/40 hover:scale-105 active:scale-95 shadow-sm"
            title={isDark ? "Switch to Light Mode (Press T)" : "Switch to Dark Mode (Press T)"}
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <svg className="w-5 h-5 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-blue-600 drop-shadow-[0_0_6px_rgba(37,99,235,0.5)]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          {/* Settings button + dropdown */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setSettingsOpen(prev => !prev)}
              className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center border ${settingsOpen
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-500'
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
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${isDark ? 'bg-blue-500/20' : 'bg-amber-500/20'
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
                        className={`relative w-12 h-6 rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${isDark ? 'bg-blue-600' : 'bg-amber-400'
                          }`}
                        aria-pressed={isDark}
                        aria-label="Toggle dark/light mode"
                      >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-500 flex items-center justify-center ${isDark ? 'translate-x-6' : 'translate-x-0'
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
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all border ${isDark
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
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all border ${!isDark
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
