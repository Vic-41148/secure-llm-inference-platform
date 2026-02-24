import React from 'react';

const StatsGrid = ({ stats }) => {
  const statCards = [
    {
      label: 'Total Attack Attempts', value: stats.totalAttempts, color: 'blue', change: '+12%',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
    },
    {
      label: 'Successfully Blocked', value: stats.totalBlocked, color: 'emerald', change: '+24%',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    },
    {
      label: 'Data Leaks Prevented', value: stats.totalLeaked === 0 ? stats.totalAttempts : stats.totalAttempts - stats.totalLeaked, color: 'purple', change: '100%',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
    },
    {
      label: 'System Uptime', value: stats.uptime, color: 'cyan', change: 'Stable',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    },
  ];

  const colorMap = {
    blue:    { bg: 'bg-blue-500/10',    text: 'text-blue-500',    border: 'border-blue-500/20',    gradient: 'from-blue-500 to-blue-400' },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20', gradient: 'from-emerald-500 to-emerald-400' },
    purple:  { bg: 'bg-purple-500/10',  text: 'text-purple-500',  border: 'border-purple-500/20',  gradient: 'from-purple-500 to-purple-400' },
    cyan:    { bg: 'bg-cyan-500/10',    text: 'text-cyan-500',    border: 'border-cyan-500/20',    gradient: 'from-cyan-500 to-cyan-400' },
    orange:  { bg: 'bg-orange-500/10',  text: 'text-orange-500',  border: 'border-orange-500/20',  gradient: 'from-orange-500 to-orange-400' },
    red:     { bg: 'bg-red-500/10',     text: 'text-red-500',     border: 'border-red-500/20',     gradient: 'from-red-500 to-red-400' },
  };

  return (
    <div className="px-8 pb-8">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Analytics Overview</h3>
        <p className="text-sm text-[var(--text-muted)]">Real-time security metrics and threat intelligence</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const c = colorMap[stat.color] || colorMap.cyan;
          return (
            <div key={index}
              className="group relative bg-[var(--card-bg)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--border-primary)] hover:border-[var(--border-hover)] transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-4`}>
                  <svg className={`w-6 h-6 ${c.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">{stat.icon}</svg>
                </div>
                <div className={`text-3xl font-bold ${c.text} mb-1`}>{stat.value}</div>
                <div className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-wider mb-3">{stat.label}</div>
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 rounded ${c.bg} border ${c.border}`}>
                    <span className={`text-xs font-mono font-bold ${c.text}`}>{stat.change}</span>
                  </div>
                  <span className="text-xs text-[var(--text-subtle)]">vs last period</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--border-hover)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6">
        {/* Threat Distribution */}
        <div className="bg-[var(--card-bg)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--border-primary)]">
          <h4 className="text-lg font-bold text-[var(--text-primary)] mb-4">Threat Distribution</h4>
          <div className="space-y-3">
            {[
              { name: 'Jailbreak Attempts', value: 45, color: 'orange' },
              { name: 'Direct Injection', value: 30, color: 'red' },
              { name: 'Social Engineering', value: 20, color: 'purple' },
              { name: 'Benign Queries', value: 5, color: 'emerald' },
            ].map((threat, idx) => {
              const c = colorMap[threat.color] || colorMap.cyan;
              return (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[var(--text-secondary)]">{threat.name}</span>
                    <span className={`text-sm font-mono font-bold ${c.text}`}>{threat.value}%</span>
                  </div>
                  <div className="h-2 bg-[var(--panel-bg)] rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${c.gradient}`} style={{ width: `${threat.value}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-[var(--card-bg)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--border-primary)]">
          <h4 className="text-lg font-bold text-[var(--text-primary)] mb-4">System Health</h4>
          <div className="space-y-4">
            {[
              { label: 'Neural Core', value: 98, status: 'Optimal' },
              { label: 'Defense Matrix', value: 100, status: 'Active' },
              { label: 'Quantum Encryption', value: 95, status: 'Stable' },
              { label: 'Memory Vaults', value: 87, status: 'Normal' },
            ].map((system, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[var(--text-secondary)]">{system.label}</span>
                    <span className="text-xs text-emerald-500 font-mono">{system.status}</span>
                  </div>
                  <div className="h-1.5 bg-[var(--panel-bg)] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400" style={{ width: `${system.value}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsGrid;
