import React, { useState, useEffect } from 'react';
import NodeStatus from './NodeStatus';
import TrafficGraph from './TrafficGraph';
import { Route, HardDrive, Share2 } from 'lucide-react';

const RoutingDashboard = () => {
    // Mocking real-time state for inference node architecture
    const [nodes, setNodes] = useState([
        { id: "node-alpha", capacity: 100, current_load: 45, status: "healthy", model: "llama3.1" },
        { id: "node-beta", capacity: 100, current_load: 85, status: "degraded", model: "phi" },
        { id: "node-gamma", capacity: 100, current_load: 12, status: "healthy", model: "llama3.1" },
    ]);

    useEffect(() => {
        // Simulate real-time fluctuating loads
        const interval = setInterval(() => {
            setNodes(prevNodes => prevNodes.map(node => ({
                ...node,
                current_load: Math.max(5, Math.min(100, node.current_load + (Math.random() * 20 - 10)))
            })));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col h-full bg-[var(--bg-body)] text-[var(--text-primary)] p-6 gap-6 overflow-y-auto w-full">
            <div>
                <h1 className="text-2xl font-bold font-mono text-cyan-400 mb-2 flex items-center gap-3">
                    <Route className="w-6 h-6" /> ROUTING & OPTIMIZATION
                </h1>
                <p className="text-sm text-gray-400">View live semantic routing paths and physical inference node states.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Visualizer */}
                <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md min-h-[400px]">
                    <h3 className="font-semibold text-gray-200 mb-4 flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-purple-400" />
                        Inference Subnet Topology
                    </h3>
                    <TrafficGraph nodes={nodes} />
                </div>

                {/* Node List */}
                <div className="lg:col-span-1 bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md flex flex-col gap-4">
                    <h3 className="font-semibold text-gray-200 flex items-center gap-2">
                        <HardDrive className="w-5 h-5 text-cyan-400" />
                        Active Compute Nodes
                    </h3>
                    <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
                        {nodes.map(n => (
                            <NodeStatus key={n.id} node={n} />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default RoutingDashboard;
