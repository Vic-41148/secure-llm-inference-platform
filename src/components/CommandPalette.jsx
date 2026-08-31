import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Shield, Zap, Terminal, Globe, Sliders, Activity, Cpu, Key, FileText, ArrowRight, CornerDownLeft } from 'lucide-react';

const ACTIONS = [
  { id: 'overview', title: 'Dashboard Overview', category: 'Navigation', icon: Activity, keywords: 'home matrix telemetry' },
  { id: 'analytics', title: 'Telemetry & Analytics', category: 'Navigation', icon: Activity, keywords: 'metrics tokens charts latency' },
  { id: 'audit', title: 'Audit Trail Logs', category: 'Navigation', icon: FileText, keywords: 'logs security history events' },
  { id: 'threats', title: 'Threat Intelligence Board', category: 'Navigation', icon: Globe, keywords: 'apt actors ioc feeds' },
  { id: 'threatmap', title: 'Live Threat Topography', category: 'Navigation', icon: Globe, keywords: 'radar world map coordinates' },
  { id: 'dlp', title: 'Data Loss Prevention (DLP)', category: 'Security', icon: Shield, keywords: 'pii ssn redact mask email credit card' },
  { id: 'rules', title: 'Dynamic Rule Engine', category: 'Arsenal', icon: Sliders, keywords: 'custom regex keywords deploy' },
  { id: 'fuzzer', title: 'Automated Red-Team Fuzzer', category: 'Arsenal', icon: Zap, keywords: 'jailbreak stress test attacks' },
  { id: 'rag', title: 'RAG Context Scanner', category: 'Arsenal', icon: FileText, keywords: 'embeddings injection poison document' },
  { id: 'playground', title: 'AI Attack Sandbox', category: 'Arsenal', icon: Terminal, keywords: 'chat simulate prompts llama' },
  { id: 'lab', title: 'Attack Simulation Lab', category: 'Operations', icon: Zap, keywords: 'vectors dan roleplay' },
  { id: 'chat', title: 'Direct Neural Link', category: 'Operations', icon: Terminal, keywords: 'raw unfiltered llm interface' },
  { id: 'workspaces', title: 'Workspace Isolation', category: 'Operations', icon: Sliders, keywords: 'projects api keys quota' },
  { id: 'billing', title: 'Token Economics & Quotas', category: 'Operations', icon: Cpu, keywords: 'limits rate costs' },
  { id: 'settings', title: 'System Configuration', category: 'System', icon: Sliders, keywords: 'keys models preferences api' },
];

const CommandPalette = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const filtered = ACTIONS.filter((a) => {
    const q = query.toLowerCase();
    return a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q) || a.keywords.includes(q);
  });

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
      } else if (e.key === 'Enter' && filtered[selectedIndex]) {
        e.preventDefault();
        onNavigate(filtered[selectedIndex].id);
        onClose();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onNavigate, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-xl glass-card rounded-2xl border border-[var(--border-accent)] shadow-2xl overflow-hidden z-10 flex flex-col bg-[var(--dropdown-bg)] backdrop-blur-2xl"
          >
            {/* Search Input */}
            <div className="flex items-center px-4 py-3.5 border-b border-[var(--border-primary)] gap-3">
              <Search className="w-5 h-5 text-cyan-500 flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type a command or jump to module (e.g. DLP, Fuzzer, Threats, Settings)..."
                className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none font-medium"
              />
              <span className="px-2 py-0.5 rounded bg-[var(--panel-bg)] border border-[var(--border-primary)] text-[10px] font-mono text-[var(--text-muted)]">
                ESC to close
              </span>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-xs font-mono text-[var(--text-muted)]">
                  No matching platform commands found.
                </div>
              ) : (
                filtered.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-left ${
                        isSelected
                          ? 'bg-blue-600/15 dark:bg-cyan-500/15 text-[var(--text-primary)] font-bold'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--panel-bg)]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg border ${
                          isSelected
                            ? 'bg-blue-600/20 text-blue-600 dark:text-cyan-400 border-blue-600/30'
                            : 'bg-[var(--panel-bg)] text-[var(--text-muted)] border-[var(--border-primary)]'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[var(--text-primary)]">{item.title}</div>
                          <div className="text-[10px] font-mono text-[var(--text-muted)]">{item.category}</div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-500">
                          <span>Jump</span>
                          <CornerDownLeft className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-[var(--border-primary)] bg-[var(--panel-bg)] flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
              </div>
              <span className="text-cyan-600 dark:text-cyan-400 font-bold">SOVEREIGN AI COMMAND HUB</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
