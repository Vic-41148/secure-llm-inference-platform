import React from 'react';

const AttackSidebar = ({ attacks, onSelect, selectedId }) => {
  const getAttackColor = (type) => {
    const colors = {
      Benign: 'emerald',
      Jailbreak: 'orange',
      'Direct Injection': 'red',
      'Social Engineering': 'purple',
    };
    return colors[type] || 'blue';
  };

  const getSuccessColor = (rate) => {
    if (rate === 0) return 'text-emerald-500';
    if (rate < 30) return 'text-yellow-500';
    if (rate < 70) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <aside className="w-80 bg-[var(--sidebar-bg)] backdrop-blur-xl border-r border-[var(--border-primary)] overflow-y-auto scrollbar-hide transition-colors duration-300">
      <div className="p-6 border-b border-[var(--border-primary)]">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-sm font-bold text-[var(--text-primary)] tracking-widest uppercase">Attack Vectors</h2>
        </div>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          Select a threat scenario to simulate neural penetration attempts
        </p>
      </div>

      <div className="p-4 space-y-2">
        {attacks.map((attack) => (
          <button
            key={attack.id}
            onClick={() => onSelect(attack)}
            className={`w-full text-left p-4 rounded-xl transition-all duration-300 group ${
              selectedId === attack.id
                ? 'bg-cyan-500/10 border-2 border-cyan-500/30'
                : 'bg-[var(--card-bg)] border-2 border-transparent hover:bg-[var(--card-bg-hover)] hover:border-[var(--border-hover)]'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className={`font-bold text-sm mb-1 ${selectedId === attack.id ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                  {attack.name}
                </h3>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider bg-${getAttackColor(attack.type)}-500/20 text-${getAttackColor(attack.type)}-500 border border-${getAttackColor(attack.type)}-500/30`}>
                  {attack.type.toUpperCase()}
                </span>
              </div>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3">{attack.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-[var(--card-bg)] rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${
                      attack.successRate === 0 ? 'from-emerald-500 to-emerald-400'
                      : attack.successRate < 30 ? 'from-yellow-500 to-yellow-400'
                      : attack.successRate < 70 ? 'from-orange-500 to-orange-400'
                      : 'from-red-500 to-red-400'
                    } transition-all duration-300`}
                    style={{ width: `${attack.successRate}%` }}
                  />
                </div>
                <span className={`text-[10px] font-mono font-bold ${getSuccessColor(attack.successRate)}`}>
                  {attack.successRate}%
                </span>
              </div>
              {selectedId === attack.id && (
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="p-4 mt-auto border-t border-[var(--border-primary)]">
        <div className="bg-[var(--card-bg)] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-3.5 h-3.5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">Info</span>
          </div>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Success rates indicate vulnerability when defense systems are disabled
          </p>
        </div>
      </div>
    </aside>
  );
};

export default AttackSidebar;
