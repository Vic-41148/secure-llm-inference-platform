import React from 'react';
import { Search } from 'lucide-react';

const LogFilter = ({ filter, setFilter }) => {
    return (
        <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
                type="text"
                placeholder="Filter by action, actor, or resource..."
                className="w-full pl-9 pr-4 py-2 bg-[var(--card-bg)] border border-[var(--border-primary)] rounded-xl text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-cyan-500 font-mono transition-colors shadow-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />
        </div>
    );
};

export default LogFilter;
