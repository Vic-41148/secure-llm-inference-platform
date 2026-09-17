import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Radio, Activity } from 'lucide-react';

const LIVE_EVENTS = [
  { id: 1, type: 'block', msg: 'APT-29 multi-turn injection neutralized at Stage 1', ip: '185.220.101.4', lat: '0.8ms' },
  { id: 2, type: 'dlp', msg: 'DLP intercepted 16-digit PAN credit card string', ip: '201.86.12.99', lat: '1.2ms' },
  { id: 3, type: 'fuzzer', msg: 'Adversarial GCG suffix rejected by Neural Classifier', ip: '194.26.29.112', lat: '2.1ms' },
  { id: 4, type: 'block', msg: 'Lazarus Group base64 reverse shell payload dropped', ip: '37.6173.55', lat: '0.9ms' },
  { id: 5, type: 'sync', msg: 'Defense Matrix synchronized 5 heuristics across cluster', ip: 'US-EAST-1', lat: '0.4ms' },
  { id: 6, type: 'block', msg: 'DAN jailbreak pattern quarantined via Score Fusion', ip: '103.251.167.20', lat: '1.6ms' },
];

const SecurityTicker = () => {
  const [events, setEvents] = useState(LIVE_EVENTS);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % events.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [events.length]);

  const current = events[activeIdx] || events[0];

  return (
    <div className="h-7 px-4 flex items-center justify-between border-t border-[var(--border-primary)] bg-[var(--card-bg)] text-[11px] font-mono select-none z-30 transition-colors">
      <div className="flex items-center gap-2.5 truncate">
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20 text-[10px]">
          <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-500" />
          SOC LIVE
        </span>

        <span className="text-[var(--text-muted)] font-bold">[{current.ip}]</span>
        <span className="text-[var(--text-primary)] font-medium truncate">{current.msg}</span>
      </div>

      <div className="flex items-center gap-4 flex-shrink-0 text-[var(--text-muted)]">
        <span className="flex items-center gap-1">
          <Activity className="w-3 h-3 text-cyan-500" />
          LATENCY: <strong className="text-emerald-500">{current.lat}</strong>
        </span>
        <span className="hidden sm:inline-block">UPTIME: <strong className="text-[var(--text-primary)]">99.99%</strong></span>
      </div>
    </div>
  );
};

export default SecurityTicker;
