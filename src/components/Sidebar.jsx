import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_GROUPS = [
  {
    label: 'Monitoring',
    items: [
      {
        id: 'overview',
        label: 'Overview',
        icon: (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        ),
      },
      {
        id: 'analytics',
        label: 'Analytics',
        badge: 'LIVE',
        badgeColor: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/30',
        icon: (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        ),
      },
      {
        id: 'audit',
        label: 'Audit Logs',
        badge: 'STREAM',
        badgeColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
        icon: (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        ),
      },
    ],
  },
  {
    label: 'Security',
    items: [
      {
        id: 'threats',
        label: 'Threat Intel',
        badge: '9',
        badgeColor: 'text-red-500 bg-red-500/10 border-red-500/30',
        icon: (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        ),
      },
      {
        id: 'dlp',
        label: 'DLP Setup',
        badge: '4',
        badgeColor: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
        icon: (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        ),
      },
      {
        id: 'map',
        label: 'Threat Map',
        badge: 'GPS',
        badgeColor: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/30',
        icon: (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        ),
      },
    ],
  },
  {
    label: 'Arsenal',
    items: [
      {
        id: 'rules',
        label: 'Rule Engine',
        badge: '5',
        badgeColor: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
        icon: (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        ),
      },
      {
        id: 'fuzzer',
        label: 'Auto Fuzzer',
        badge: '12',
        badgeColor: 'text-red-500 bg-red-500/10 border-red-500/30',
        icon: (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M13 10V3L4 14h7v7l9-11h-7z" />
        ),
      },
      {
        id: 'rag',
        label: 'RAG Scanner',
        icon: (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        ),
      },
      {
        id: 'playground',
        label: 'AI Playground',
        icon: (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        ),
      },
    ],
  },
  {
    label: 'Operations',
    items: [
      {
        id: 'lab',
        label: 'Attack Lab',
        badge: 'HOT',
        badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
        icon: (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        ),
      },
      {
        id: 'chat',
        label: 'Neural Link',
        icon: (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        ),
      },
    ],
  },
  {
    label: 'System',
    items: [
      {
        id: 'projects',
        label: 'Workspaces',
        icon: (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        ),
      },
      {
        id: 'quotas',
        label: 'Billing',
        icon: (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        ),
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: (
          <>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </>
        ),
      },
    ],
  },
];

const COLLAPSED_WIDTH = 64;
const EXPANDED_WIDTH = 224;

const Sidebar = ({ activeView, onNavigate }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="flex-shrink-0 h-full flex flex-col relative z-20 overflow-hidden sidebar-bg border-r border-[var(--border-primary)] shadow-xl transition-colors duration-300 select-none"
    >
      {/* Subtle top glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.4), transparent)' }}
      />

      {/* Scrollable nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 scrollbar-hide">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-1">
            {/* Group label */}
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                  className="px-4 pt-4 pb-1"
                >
                  <span
                    className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] sidebar-group-label"
                  >
                    {group.label}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Items */}
            {group.items.map((item) => {
              const isActive = activeView === item.id;
              return (
                <div key={item.id} className="relative group px-2">
                  {/* Tooltip for collapsed mode */}
                  {collapsed && (
                    <div
                      className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 bg-[var(--dropdown-bg)] border border-[var(--border-accent)] text-[var(--text-primary)] shadow-2xl"
                    >
                      {item.label} {item.badge && `(${item.badge})`}
                    </div>
                  )}

                  <button
                    onClick={() => onNavigate(item.id)}
                    className={`relative w-full flex items-center rounded-xl transition-all duration-200 overflow-hidden sidebar-nav-btn ${
                      isActive
                        ? 'sidebar-nav-btn-active'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg-hover)]'
                    }`}
                    style={{
                      padding: collapsed ? '10px 0' : '9px 10px',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      gap: collapsed ? 0 : 10,
                    }}
                  >
                    {/* Active left border */}
                    {isActive && (
                      <motion.div
                        layoutId="activeBar"
                        className="absolute left-0 top-1 bottom-1 w-1 rounded-full bg-blue-600 dark:bg-cyan-400 shadow-[0_0_8px_rgba(37,99,235,0.8)] dark:shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}

                    {/* Icon */}
                    <svg
                      className="flex-shrink-0 transition-colors duration-200"
                      style={{
                        width: 18,
                        height: 18,
                      }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {item.icon}
                    </svg>

                    {/* Label & Dynamic Counter Badge */}
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.div
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          transition={{ duration: 0.15 }}
                          className="flex items-center justify-between flex-1 truncate"
                        >
                          <span
                            className="text-[11px] tracking-wide whitespace-nowrap font-semibold truncate"
                            style={{
                              fontFamily: 'Space Grotesk, sans-serif',
                            }}
                          >
                            {item.label}
                          </span>

                          {item.badge && (
                            <span className={`text-[9px] font-mono font-black px-1.5 py-0.2 rounded border ml-1.5 flex-shrink-0 ${item.badgeColor || 'text-cyan-500 bg-cyan-500/10 border-cyan-500/30'}`}>
                              {item.badge}
                            </span>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse toggle button */}
      <div
        className="flex-shrink-0 border-t py-3 px-2 border-[var(--border-primary)]"
      >
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="w-full flex items-center rounded-xl transition-all duration-200 py-2 hover:bg-[var(--card-bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          style={{
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '8px 0' : '8px 10px',
            gap: collapsed ? 0 : 8,
          }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <motion.svg
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-4 h-4 flex-shrink-0 text-cyan-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </motion.svg>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider"
              >
                Collapse View
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
