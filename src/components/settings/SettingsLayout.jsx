import React, { useState } from 'react';
import ApiKeysSettings from './ApiKeysSettings';
import SecuritySettings from './SecuritySettings';
import ModelPreferences from './ModelPreferences';
import { Settings, Key, Shield, Cpu } from 'lucide-react';

const SettingsLayout = () => {
    const [activeTab, setActiveTab] = useState('apikeys');

    return (
        <div className="flex h-full bg-[var(--bg-body)] text-[var(--text-primary)] p-6 gap-6 overflow-hidden w-full">
            {/* Sidebar Navigation */}
            <div className="w-1/4 flex flex-col gap-2">
                <div className="mb-6 px-3">
                    <h1 className="text-2xl font-bold font-mono text-cyan-400 mb-1 flex items-center gap-2">
                        <Settings className="w-5 h-5" /> PREFERENCES
                    </h1>
                    <p className="text-xs text-gray-500 line-clamp-2">Manage global platform behaviors and access credentials.</p>
                </div>

                <button
                    onClick={() => setActiveTab('apikeys')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'apikeys' ? 'bg-gray-800 text-cyan-400 border border-gray-700' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}
                >
                    <Key className="w-4 h-4" /> API Credentials
                </button>
                <button
                    onClick={() => setActiveTab('security')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'security' ? 'bg-gray-800 text-cyan-400 border border-gray-700' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}
                >
                    <Shield className="w-4 h-4" /> Global Security
                </button>
                <button
                    onClick={() => setActiveTab('models')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'models' ? 'bg-gray-800 text-cyan-400 border border-gray-700' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}
                >
                    <Cpu className="w-4 h-4" /> Model Preferences
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-gray-800 rounded-xl border border-gray-700 shadow-lg p-6 overflow-y-auto">
                {activeTab === 'apikeys' && <ApiKeysSettings />}
                {activeTab === 'security' && <SecuritySettings />}
                {activeTab === 'models' && <ModelPreferences />}
            </div>
        </div>
    );
};

export default SettingsLayout;
