import React, { useEffect, useState } from 'react';
import ProjectCard from './ProjectCard';
import { Briefcase, Plus, ShieldCheck } from 'lucide-react';

import { getProjects } from '../../services/api';

const STORAGE_KEY = 'ns_projects';

const DEFAULT_PROJECTS = [
    {
        id: 'proj-a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        name: 'Production Gateway',
        description: 'Main inference endpoint with 3-stage defense pipeline. Sanitizes PII and classifies prompt injection attempts.',
        api_keys: [
            { id: 'k1', name: 'prod-primary', key: 'sk-prod-a9c8f2b1d3e4f5a6b7c8d9e0f1a2b3c4' },
            { id: 'k2', name: 'prod-readonly', key: 'sk-ro-1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d' },
        ],
    },
    {
        id: 'proj-f7e6d5c4-b3a2-1098-fedc-ba0987654321',
        name: 'Staging / QA Lab',
        description: 'Pre-production environment for vetting new rule updates, custom regexes, and classifier threshold changes.',
        api_keys: [
            { id: 'k3', name: 'staging-dev', key: 'sk-stg-x7y8z9a0b1c2d3e4f5g6h7i8j9k0l1m' },
        ],
    },
    {
        id: 'proj-12345678-abcd-ef01-2345-6789abcdef01',
        name: 'Red Team Sandbox',
        description: 'Isolated test bench for automated fuzzing and jailbreak payload evaluation without production rate limits.',
        api_keys: [
            { id: 'k4', name: 'redteam-key', key: 'sk-rt-m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b' },
        ],
    },
];

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProjects()
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setProjects(data);
                } else {
                    loadLocal();
                }
                setLoading(false);
            })
            .catch(() => {
                loadLocal();
                setLoading(false);
            });
    }, []);

    const loadLocal = () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try { setProjects(JSON.parse(stored)); } catch { setProjects(DEFAULT_PROJECTS); }
        } else {
            setProjects(DEFAULT_PROJECTS);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS));
        }
    };

    const addProject = () => {
        const newProj = {
            id: 'proj-' + crypto.randomUUID(),
            name: `Project Workspace ${projects.length + 1}`,
            description: 'Isolated LLM execution environment with dedicated rate limits and security boundaries.',
            api_keys: [{ id: 'k-' + Date.now(), name: 'default-key', key: 'sk-' + crypto.randomUUID().replace(/-/g, '').slice(0, 32) }],
        };
        const updated = [...projects, newProj];
        setProjects(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const handleDelete = (id) => {
        const updated = projects.filter(p => p.id !== id);
        setProjects(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    return (
        <div className="p-8 space-y-6 h-full flex flex-col overflow-y-auto scrollbar-hide">
            <div className="glass-card p-6 rounded-2xl border border-[var(--border-accent)] flex items-center justify-between shadow-xl flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-500 flex items-center justify-center shadow-md">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Project Workspaces & Isolation</h2>
                        <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">Manage distinct security boundaries, rate limits, and API keys</p>
                    </div>
                </div>

                <button
                    onClick={addProject}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 !text-white shadow-lg shadow-cyan-500/25 active:scale-95 transition-all"
                >
                    <Plus className="w-4 h-4 text-white" /> Create Workspace
                </button>
            </div>

            {loading ? (
                <div className="text-[var(--text-muted)] font-mono text-xs text-center py-16">
                    Loading workspaces...
                </div>
            ) : projects.length === 0 ? (
                <div className="text-[var(--text-muted)] font-mono text-xs text-center py-16">
                    No workspaces configured. Click "Create Workspace" above.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((proj) => (
                        <ProjectCard key={proj.id} project={proj} onDelete={handleDelete} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectList;
