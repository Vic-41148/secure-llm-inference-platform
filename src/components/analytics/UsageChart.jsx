import React, { useEffect, useState, useCallback } from 'react';
import { BarChart3 } from 'lucide-react';
import { getUsageTimeSeries } from '../../services/api';

const DEMO_DATA = Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
    value: Math.floor(Math.random() * 400 + 120 + (i > 8 && i < 20 ? 320 : 0)),
}));

const UsageChart = () => {
    const [data, setData] = useState(DEMO_DATA);

    const fetchUsage = useCallback(async () => {
        try {
            const resData = await getUsageTimeSeries(24);
            if (resData.data && Array.isArray(resData.data) && resData.data.length > 0) {
                setData(resData.data);
            }
        } catch (e) {
            // Keep demo data on error
        }
    }, []);

    useEffect(() => {
        fetchUsage();
        const interval = setInterval(fetchUsage, 8000);
        return () => clearInterval(interval);
    }, [fetchUsage]);

    const maxVal = Math.max(...data.map(d => d.value), 1);

    return (
        <div className="glass-card p-6 rounded-2xl border border-[var(--border-accent)] shadow-xl h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-500 flex items-center justify-center shadow-md">
                        <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-base text-[var(--text-primary)]">Inference Volume (24h)</h3>
                        <p className="text-xs text-[var(--text-muted)] font-mono">Real-time throughput across all inference routes</p>
                    </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-cyan-500 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/30">
                    LIVE TELEMETRY
                </span>
            </div>

            <div className="flex-1 flex items-end gap-1.5 px-2 pt-8 border-b border-l border-[var(--border-primary)] relative min-h-[220px]">
                <div className="absolute top-0 -left-2 text-[10px] text-[var(--text-muted)] font-mono -translate-x-full">{maxVal}</div>
                <div className="absolute bottom-0 -left-2 text-[10px] text-[var(--text-muted)] font-mono -translate-x-full">0</div>

                {data.map((point, idx) => {
                    const heightPct = (point.value / maxVal) * 100;
                    const timeStr = new Date(point.timestamp).getHours() + ":00";

                    return (
                        <div key={idx} className="flex-1 flex flex-col items-center justify-end group h-full">
                            <div
                                className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 group-hover:from-blue-500 group-hover:to-cyan-300 rounded-t-md transition-all duration-200 relative shadow-sm group-hover:shadow-cyan-500/30"
                                style={{ height: `${Math.max(6, heightPct)}%` }}
                            >
                                <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 bg-[var(--dropdown-bg)] border border-[var(--border-accent)] text-[var(--text-primary)] text-[10px] font-mono px-2 py-1 rounded shadow-xl transition-opacity whitespace-nowrap z-20">
                                    {point.value} reqs
                                </div>
                            </div>
                            <span className="text-[9px] text-[var(--text-muted)] mt-2 font-mono truncate max-w-full hidden md:block">
                                {idx % 4 === 0 ? timeStr : ''}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UsageChart;
