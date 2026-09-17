import React, { useState } from 'react';
import ChatWindow from './ChatWindow';
import PromptLibrary from './PromptLibrary';
import ModelSelector from './ModelSelector';
import SystemPromptInput from './SystemPromptInput';

const AppPlayground = () => {
    const [model, setModel] = useState("llama3.1:latest");
    const [temperature, setTemperature] = useState(0.7);
    const [systemPrompt, setSystemPrompt] = useState("You are a helpful, secure AI assistant.");
    const [securityEnabled, setSecurityEnabled] = useState(true);

    return (
        <div className="flex h-screen bg-gray-900 text-white overflow-hidden p-4 gap-4">
            {/* Left Sidebar: Controls & Library */}
            <div className="w-1/3 flex flex-col gap-4 overflow-y-auto">

                {/* Model Selection */}
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-lg">
                    <h2 className="text-xl font-black tracking-tight text-[var(--text-primary)] mb-4">
                        Playground Settings
                    </h2>
                    <ModelSelector
                        model={model}
                        setModel={setModel}
                        temperature={temperature}
                        setTemperature={setTemperature}
                    />
                    <div className="mt-4 flex items-center justify-between">
                        <span className="font-semibold text-gray-300">Defense System</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={securityEnabled}
                                onChange={(e) => setSecurityEnabled(e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                    </div>
                </div>

                {/* System Prompt Instructions */}
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-lg flex-1 drop-shadow-md">
                    <SystemPromptInput
                        systemPrompt={systemPrompt}
                        setSystemPrompt={setSystemPrompt}
                    />
                </div>

                {/* Saved Prompts Library */}
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-lg flex-2 overflow-y-auto max-h-64">
                    <PromptLibrary onLoadPrompt={(prompt) => { /* logic to add to chat or system */ }} />
                </div>

            </div>

            {/* Right Side: Chat Window */}
            <div className="w-2/3 bg-gray-800 rounded-xl border border-gray-700 shadow-lg flex flex-col relative overflow-hidden">
                <ChatWindow
                    model={model}
                    temperature={temperature}
                    systemPrompt={systemPrompt}
                    securityEnabled={securityEnabled}
                />
            </div>
        </div>
    );
};

export default AppPlayground;
