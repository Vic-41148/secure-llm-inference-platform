import React from 'react';
import { Activity, Clock, ShieldAlert, Cpu } from 'lucide-react';

const icons = {
    activity: Activity,
    clock: Clock,
    shield: ShieldAlert,
    cpu: Cpu
};

const MetricCard = ({ title, value, icon, color = 'text-cyan-500', trend }) => {
    const IconComponent = icons[icon] || Activity;

    return (
        <div className="glass-card p-5 rounded-2xl border border-[var(--border-primary)] shadow-lg flex items-center justify-between transition-all duration-200 hover:border-cyan-500/40 hover:scale-[1.01]">
            <div>
                <p className="text-[var(--text-muted)] text-xs font-mono uppercase tracking-wider mb-1">{title}</p>
                <p className="text-2xl lg:text-3xl font-bold font-mono tracking-tight text-[var(--text-primary)]">{value}</p>
                {trend && (
                    <span className="text-[10px] font-mono text-emerald-500 font-bold mt-1 inline-block">
                        ↑ {trend} vs last cycle
                    </span>
                )}
            </div>
            <div className={`p-3.5 rounded-xl bg-[var(--panel-bg)] border border-[var(--border-primary)] ${color} shadow-sm flex items-center justify-center`}>
                <IconComponent className="w-6 h-6" />
            </div>
        </div>
    );
};

export default MetricCard;
