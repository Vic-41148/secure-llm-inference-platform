import React, { useState, useEffect } from 'react';
import QuotaProgress from './QuotaProgress';
import { DollarSign } from 'lucide-react';

const Quotas = () => {
    // Mock data for multiple projects
    const [mockQuotas] = useState([
        { id: "proj_main", name: "Default Infrastructure", tokens_used: 850000, token_limit: 1000000, spend: 85.0, budget: 100.0 },
        { id: "proj_lab", name: "Red Team Lab", tokens_used: 12000, token_limit: 50000, spend: 1.2, budget: 5.0 },
        { id: "proj_dev", name: "Alpha Dev Sandbox", tokens_used: 49000, token_limit: 50000, spend: 4.9, budget: 5.0 }
    ]);

    return (
        <div className="flex flex-col h-full bg-[var(--bg-body)] text-[var(--text-primary)] p-6 gap-6 overflow-y-auto w-full">
            <div>
                <h1 className="text-2xl font-bold font-mono text-cyan-400 mb-2 flex items-center gap-3">
                    <DollarSign className="w-6 h-6" /> BILLING & QUOTAS
                </h1>
                <p className="text-sm text-gray-400">Monitor token consumption, analyze spend rate, and enforce budget caps per project.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockQuotas.map(q => (
                    <QuotaProgress key={q.id} quota={q} />
                ))}
            </div>
        </div>
    );
};

export default Quotas;
