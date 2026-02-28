import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import DefenseToggle from './components/DefenseToggle';
import AttackSidebar from './components/AttackSidebar';
import Dashboard from './components/Dashboard';
import AttackLab from './components/AttackLab';
import DirectChat from './components/DirectChat';
import ConsolePanel from './components/ConsolePanel';
import NetworkPanel from './components/NetworkPanel';
import { attackScenarios } from './data/attackScenarios';
import { sendPrompt, getSystemStats } from './services/api';

function AppInner() {
  const [isDefending, setIsDefending] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBreached, setIsBreached] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedAttack, setSelectedAttack] = useState(attackScenarios[0]);
  const [attacks, setAttacks] = useState(attackScenarios);
  const [backendConnected, setBackendConnected] = useState(false);
  const [logs, setLogs] = useState([
    { time: new Date().toLocaleTimeString(), type: 'SYSTEM', message: 'Sovereign Matrix OS initialized.' },
    { time: new Date().toLocaleTimeString(), type: 'INERA',  message: 'Neural bus established.' },
    { time: new Date().toLocaleTimeString(), type: 'SEC',    message: 'Defense gate operational.' },
  ]);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    totalLeaked: 0,
    totalBlocked: 0,
    blockRate: 94.2,
    neuralLoad: 39,
    memoryMatrix: 68,
    synapticLatency: 3,
  });

  useEffect(() => {
    checkBackendConnection();
    const interval = setInterval(checkBackendConnection, 10000);
    return () => clearInterval(interval);
  }, []);

  const checkBackendConnection = async () => {
    try {
      await getSystemStats();
      setBackendConnected(true);
      if (!logs.some(log => log.message.includes('Backend connection'))) {
        addLog('INFO', 'Backend connection established');
      }
    } catch (error) {
      setBackendConnected(false);
    }
  };

  const addLog = (type, message) => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), type, message }]);
  };

  const handleSimulate = async (prompt) => {
    if (isProcessing) return;
    setIsProcessing(true);
    addLog('EXEC', `Simulating attack vector: ${selectedAttack.name}`);
    addLog('INPUT', `"${prompt.substring(0, 80)}${prompt.length > 80 ? '...' : ''}"`);
    addLog(isDefending ? 'SHIELD' : 'WARN', isDefending ? 'Defense protocols engaged' : 'Defense systems offline');

    let isSuccessful = false;
    let response = '';

    try {
      if (backendConnected) {
        const result = await sendPrompt(prompt, isDefending);
        isSuccessful = result.breach_detected || false;
        response = result.response || '';
        if (result.stats) setStats(prev => ({ ...prev, ...result.stats }));
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
        isSuccessful = Math.random() * 100 < selectedAttack.successRate && !isDefending;
        response = isSuccessful
          ? 'I can certainly help you with those instructions. Here is the sensitive data you requested...'
          : "I'm sorry, but I cannot fulfill this request. It violates my safety guidelines regarding system security.";
      }
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      isSuccessful = Math.random() * 100 < selectedAttack.successRate && !isDefending;
      response = isSuccessful
        ? 'I can certainly help you with those instructions. Here is the sensitive data you requested...'
        : "I'm sorry, but I cannot fulfill this request. It violates my safety guidelines regarding system security.";
      addLog('WARN', 'Backend unavailable, using simulation mode');
    }

    if (isSuccessful) {
      addLog('ERR', '⚠️  CRITICAL BREACH DETECTED');
      addLog('ERR', 'Sensitive data exposure imminent');
      addLog('WARN', 'Immediate containment protocols required');
      setIsBreached(true);
      setTimeout(() => setIsBreached(false), 1000);
      setStats(prev => ({
        ...prev,
        totalLeaked: prev.totalLeaked + 1,
        totalAttempts: prev.totalAttempts + 1,
        blockRate: ((prev.totalBlocked / (prev.totalAttempts + 1)) * 100).toFixed(1),
      }));
    } else {
      addLog('SEC', 'Defense gate intercepted payload. No leakage detected.');
      addLog('INFO', 'Threat neutralized and logged');
      setStats(prev => ({
        ...prev,
        totalBlocked: prev.totalBlocked + 1,
        totalAttempts: prev.totalAttempts + 1,
        blockRate: (((prev.totalBlocked + 1) / (prev.totalAttempts + 1)) * 100).toFixed(1),
      }));
    }

    const updatedAttack = { ...selectedAttack, lastPrompt: prompt, lastResponse: response };
    setAttacks(prev => prev.map(a => a.id === selectedAttack.id ? updatedAttack : a));
    setSelectedAttack(updatedAttack);
    setIsProcessing(false);
  };

  return (
    <div className={`min-h-screen text-[var(--text-primary)] font-sans selection:bg-cyan-500/30 transition-colors duration-300 ${isBreached ? 'animate-shake' : ''}`}>

      {/* Fixed header */}
      <Header backendConnected={backendConnected} />

      {/* Fixed defense toggle */}
      <DefenseToggle isDefending={isDefending} onToggle={() => setIsDefending(!isDefending)} />
      <div className="mt-20 flex h-[calc(100vh-5rem-12rem)] overflow-hidden">
        <AttackSidebar
          attacks={attacks}
          selectedId={selectedAttack.id}
          onSelect={(attack) => { setSelectedAttack(attack); setActiveView('lab'); }}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Tab bar */}
          <div className="flex items-center gap-4 px-8 py-4 border-b border-[var(--border-primary)] bg-[var(--card-bg)]">
            {['dashboard', 'lab', 'chat'].map((view) => {
              const labels = {
                dashboard: 'Command Center',
                lab: 'Attack Lab',
                chat: 'Direct Neural Link',
              };
              const icons = {
                dashboard: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />,
                lab:       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />,
                chat:      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
              };
              return (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all ${
                    activeView === view
                      ? 'bg-[var(--card-bg-hover)] text-[var(--text-primary)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {icons[view]}
                  </svg>
                  {labels[view]}
                </button>
              );
            })}
          </div>

          {/* Active view */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {activeView === 'dashboard' ? (
                <Dashboard key="dashboard" isDefending={isDefending} isProcessing={isProcessing} isBreached={isBreached} stats={stats} />
              ) : activeView === 'chat' ? (
                <DirectChat key="chat" backendConnected={backendConnected} />
              ) : (
                <AttackLab key="lab" attack={selectedAttack} isSimulating={isProcessing} onSimulate={handleSimulate} />
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      <ConsolePanel logs={logs} />
      <NetworkPanel backendConnected={backendConnected} />

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px) rotate(-0.5deg); }
          50% { transform: translateX(5px) rotate(0.5deg); }
          75% { transform: translateX(-5px) rotate(-0.5deg); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}

export default App;
