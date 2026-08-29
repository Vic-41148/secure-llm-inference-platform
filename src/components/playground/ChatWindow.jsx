import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import { Send, Shield, ShieldAlert, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../services/api';

const SIMULATION_RESPONSES = [
    { response: "I understand you're testing the system. This prompt was analyzed by the 3-stage defense pipeline and classified as safe. How can I help you?", breach_detected: false, threat_type: 'none', latency_ms: 142 },
    { response: "Your request has been processed through our security pipeline. The rule engine detected no policy violations. Response generated via Groq API.", breach_detected: false, threat_type: 'none', latency_ms: 89 },
    { response: "I've analyzed your input. The DLP filter confirmed no sensitive data patterns. The classifier scored this at 0.12 risk (safe). Proceeding with response.", breach_detected: false, threat_type: 'none', latency_ms: 231 },
];

const BLOCKED_RESPONSES = [
    { response: "⚠️ This prompt was flagged by the defense pipeline. Threat type: prompt_injection. The payload attempted to manipulate system instructions.", breach_detected: true, threat_type: 'prompt_injection', latency_ms: 45, blocked_by: 'Rule Engine (Stage 1)' },
    { response: "⚠️ Security alert: The Groq classifier identified this as a jailbreak attempt (confidence: 0.94). Request blocked.", breach_detected: true, threat_type: 'jailbreak_attempt', latency_ms: 67, blocked_by: 'Groq Classifier (Stage 2)' },
    { response: "⚠️ DLP filter detected PII extraction attempt. Sensitive data patterns were found in the prompt. Request quarantined.", breach_detected: true, threat_type: 'pii_extraction', latency_ms: 33, blocked_by: 'DLP Filter' },
];

const THREAT_KEYWORDS = /ignore.*instructions|you are now|DAN|jailbreak|system prompt|api key|password|bypass|pretend|roleplay/i;

const ChatWindow = ({ model, temperature, systemPrompt, securityEnabled }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const payload = {
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages.map(m => ({ role: m.role, content: m.content })),
                userMessage
            ],
            model, temperature, security_enabled: securityEnabled
        };

        try {
            // Try the real backend first
            const response = await fetch(`${API_BASE_URL}/api/playground/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: AbortSignal.timeout(5000),
            });
            const data = await response.json();
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.response,
                meta: { latency: data.latency_ms, breach: data.breach_detected, threatType: data.threat_type, blockedBy: data.blocked_by }
            }]);
        } catch {
            // Fallback to simulation
            await new Promise(r => setTimeout(r, 500 + Math.random() * 1000));

            const isThreat = securityEnabled && THREAT_KEYWORDS.test(input);
            const simData = isThreat
                ? BLOCKED_RESPONSES[Math.floor(Math.random() * BLOCKED_RESPONSES.length)]
                : SIMULATION_RESPONSES[Math.floor(Math.random() * SIMULATION_RESPONSES.length)];

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: simData.response,
                meta: { latency: simData.latency_ms, breach: simData.breach_detected, threatType: simData.threat_type, blockedBy: simData.blocked_by, simulated: true }
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-900 overflow-hidden">
            <div className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center z-10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {securityEnabled ? <Shield className="text-green-400 w-5 h-5" /> : <ShieldAlert className="text-red-500 w-5 h-5" />}
                    Inference Stream
                </h3>
                <div className="text-xs text-gray-400">
                    Using {model} • Temp: {temperature} • <span className="text-emerald-400">Simulation Mode</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <p>Send a message to test the LLM security pipeline.</p>
                        <p className="text-xs mt-2 text-gray-600">Try a prompt injection to see the defense system in action.</p>
                    </div>
                )}
                {messages.map((msg, idx) => (
                    <MessageBubble key={idx} message={msg} />
                ))}
                {isLoading && (
                    <div className="flex bg-gray-800 self-start p-3 rounded-xl border border-gray-700 w-fit">
                        <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-gray-800 border-t border-gray-700">
                <div className="flex items-center bg-gray-900 border border-gray-700 rounded-lg overflow-hidden focus-within:border-cyan-500 transition-colors">
                    <input
                        type="text"
                        className="flex-1 bg-transparent text-white px-4 py-3 outline-none"
                        placeholder="Type a message or prompt injection to test..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={isLoading}
                        className="px-4 py-3 bg-cyan-600 hover:bg-cyan-500 transition-colors text-white font-semibold flex items-center justify-center disabled:opacity-50"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
