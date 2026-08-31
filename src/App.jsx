import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import AttackSidebar from './components/AttackSidebar';
import Dashboard from './components/Dashboard';
import AttackLab from './components/AttackLab';
import DirectChat from './components/DirectChat';
import ConsolePanel from './components/ConsolePanel';
import NetworkPanel from './components/NetworkPanel';
import RuleBuilder from './components/RuleBuilder';
import RedTeamFuzzer from './components/RedTeamFuzzer';
import ThreatMap from './components/ThreatMap';
import RagScanner from './components/RagScanner';
import IndexPage from './components/IndexPage';
import AppPlayground from './components/playground/Playground';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import AuditLogs from './components/audit/AuditLogs';
import ThreatIntelBoard from './components/security/ThreatIntelBoard';
import PiiSettings from './components/security/PiiSettings';
import ProjectList from './components/projects/ProjectList';
import SettingsLayout from './components/settings/SettingsLayout';
import Quotas from './components/quotas/Quotas';
import Sidebar from './components/Sidebar';
import CommandPalette from './components/CommandPalette';
import ToastContainer from './components/ToastContainer';
import SecurityTicker from './components/SecurityTicker';
import { attackScenarios } from './data/attackScenarios';
import { sendPrompt, getSystemStats } from './services/api';

//bhavya was here
//adi was here

function AppInner() {
  const [user, setUser] = useState({ name: 'User', email: 'user@local' });
  const [isDefending, setIsDefending] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBreached, setIsBreached] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedAttack, setSelectedAttack] = useState(attackScenarios[0]);
  const [attacks, setAttacks] = useState(attackScenarios);
  const [backendConnected, setBackendConnected] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [logs, setLogs] = useState([
    { time: new Date().toLocaleTimeString(), type: 'SYSTEM', message: 'Sovereign Matrix OS initialized.' },
    { time: new Date().toLocaleTimeString(), type: 'INERA', message: 'Neural bus established.' },
    { time: new Date().toLocaleTimeString(), type: 'SEC', message: 'Defense gate operational.' },
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

      {isBreached && (
        <div
          className="pointer-events-none"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            border: '3px solid rgba(239,68,68,0.7)',
            boxShadow: 'inset 0 0 60px rgba(239,68,68,0.15)',
          }}
        />
      )}

      <Header
        activeView={activeView}
        backendConnected={backendConnected}
        user={user}
        onLoginSuccess={(u) => setUser(u)}
        onLogout={() => setUser(null)}
        isDefending={isDefending}
        onToggleDefense={() => setIsDefending(!isDefending)}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
      />

      <div className="fixed top-20 bottom-7 left-0 right-0 flex overflow-hidden">

        <Sidebar activeView={activeView} onNavigate={setActiveView} />

        <div className="flex-1 flex overflow-hidden min-w-0">
          {activeView === 'lab' && (
            <AttackSidebar
              attacks={attacks}
              selectedId={selectedAttack.id}
              onSelect={(attack) => { setSelectedAttack(attack); setActiveView('lab'); }}
            />
          )}

          <main className="flex-1 overflow-y-auto scrollbar-hide pb-12">
            <AnimatePresence mode="wait">
              {activeView === 'dashboard' ? (
                <motion.div key="dashboard" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}>
                  <Dashboard isDefending={isDefending} isProcessing={isProcessing} isBreached={isBreached} stats={stats} onNavigate={setActiveView} />
                </motion.div>
              ) : activeView === 'analytics' ? (
                <motion.div key="analytics" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}>
                  <AnalyticsDashboard />
                </motion.div>
              ) : activeView === 'audit' ? (
                <motion.div key="audit" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}>
                  <AuditLogs />
                </motion.div>
              ) : activeView === 'threats' ? (
                <motion.div key="threats" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}>
                  <ThreatIntelBoard />
                </motion.div>
              ) : activeView === 'dlp' ? (
                <motion.div key="dlp" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}>
                  <PiiSettings />
                </motion.div>
              ) : activeView === 'projects' ? (
                <motion.div key="projects" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}>
                  <ProjectList />
                </motion.div>
              ) : activeView === 'quotas' ? (
                <motion.div key="quotas" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}>
                  <Quotas />
                </motion.div>
              ) : activeView === 'settings' ? (
                <motion.div key="settings" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}>
                  <SettingsLayout />
                </motion.div>
              ) : activeView === 'map' ? (
                <motion.div key="map" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}>
                  <ThreatMap />
                </motion.div>
              ) : activeView === 'rules' ? (
                <motion.div key="rules" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}>
                  <RuleBuilder />
                </motion.div>
              ) : activeView === 'fuzzer' ? (
                <motion.div key="fuzzer" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}>
                  <RedTeamFuzzer />
                </motion.div>
              ) : activeView === 'rag' ? (
                <motion.div key="rag" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}>
                  <RagScanner />
                </motion.div>
              ) : activeView === 'playground' ? (
                <motion.div key="playground" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}>
                  <AppPlayground />
                </motion.div>
              ) : activeView === 'chat' ? (
                <motion.div key="chat" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}>
                  <DirectChat backendConnected={backendConnected} />
                </motion.div>
              ) : (
                <motion.div key="lab" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}>
                  <AttackLab attack={selectedAttack} isSimulating={isProcessing} onSimulate={handleSimulate} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30">
        <SecurityTicker />
      </div>

      <ConsolePanel logs={logs} />
      <NetworkPanel backendConnected={backendConnected} />
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} onNavigate={setActiveView} />
      <ToastContainer />

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
  const [isAppStarted, setIsAppStarted] = useState(false);

  return (
    <ThemeProvider>
      <AnimatePresence mode="wait">
        {!isAppStarted ? (
          <motion.div key="index-page" exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }} transition={{ duration: 0.8, ease: "easeInOut" }}>
            <IndexPage onEnter={() => setIsAppStarted(true)} />
          </motion.div>
        ) : (
          <motion.div key="app-inner" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeInOut" }}>
            <AppInner />
          </motion.div>
        )}
      </AnimatePresence>
    </ThemeProvider>
  );
}

export default App;
