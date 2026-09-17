import React, { useState } from 'react';
import { Target, UserX, AlertTriangle, ShieldCheck, Check, Clock } from 'lucide-react';

const ThreatCard = ({ threat, onBlock }) => {
  const [isBlocked, setIsBlocked] = useState(threat.isBlocked || false);
  const [isBlocking, setIsBlocking] = useState(false);

  const getBadgeStyle = (sev) => {
    switch ((sev || '').toLowerCase()) {
      case 'critical':
        return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'high':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      case 'medium':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      default:
        return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
    }
  };

  const getBorderGlow = (sev) => {
    switch ((sev || '').toLowerCase()) {
      case 'critical': return 'hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]';
      case 'high': return 'hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]';
      default: return 'hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]';
    }
  };

  const handleBlock = async () => {
    if (isBlocked || isBlocking) return;
    setIsBlocking(true);
    try {
      if (onBlock) {
        await onBlock(threat);
      }
      setIsBlocked(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsBlocking(false);
    }
  };

  return (
    <div className={`glass-card p-5 rounded-2xl border border-[var(--border-primary)] flex flex-col justify-between gap-4 transition-all duration-300 ${getBorderGlow(threat.severity)}`}>
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2.5 font-bold text-[var(--text-primary)] text-sm">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <UserX className="w-4 h-4" />
            </div>
            <span>{threat.actor}</span>
          </div>
          <span className={`text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border ${getBadgeStyle(threat.severity)}`}>
            {threat.severity}
          </span>
        </div>

        <div className="space-y-2 mt-3">
          <div className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
            <span className="font-medium leading-snug">{threat.type}</span>
          </div>

          <div className="flex items-start gap-2 text-xs font-mono text-[var(--text-muted)] bg-[var(--panel-bg)] p-2 rounded-lg border border-[var(--border-primary)]">
            <Target className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0 mt-0.5" />
            <span className="break-all">{threat.ioc}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-[var(--border-primary)] flex items-center justify-between">
        <span className="text-[10px] font-mono text-[var(--text-muted)] flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {threat.last_seen || 'MONITORED'}
        </span>
        <button
          onClick={handleBlock}
          disabled={isBlocked || isBlocking}
          className={`text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
            isBlocked
              ? 'bg-red-500/20 text-red-400 border-red-500/40 cursor-default'
              : isBlocking
              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 opacity-70 cursor-wait'
              : 'text-cyan-500 hover:text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 active:scale-95'
          }`}
        >
          {isBlocked ? (
            <><Check className="w-3.5 h-3.5" /> Blocked</>
          ) : isBlocking ? (
            <><span className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" /> Blocking...</>
          ) : (
            <><ShieldCheck className="w-3.5 h-3.5" /> Add to Blocklist</>
          )}
        </button>
      </div>
    </div>
  );
};

export default ThreatCard;
