import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CopyButton = ({ text, size = 'sm' }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <button onClick={handleCopy} title="Copy"
      className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition-all font-mono
        ${copied
          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
          : 'bg-[var(--card-bg)] border-[var(--border-primary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg-hover)] hover:border-[var(--border-hover)]'
        } ${size === 'xs' ? 'text-[9px]' : 'text-[10px]'}`}
    >
      {copied
        ? <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>COPIED</>
        : <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>COPY</>
      }
    </button>
  );
};

const detectLang = (code) => {
  if (/^\s*(def |import |from .+ import|class .+:|print\(|if __name__)/.test(code)) return 'python';
  if (/^\s*(const |let |var |function |=>|import .+ from|require\()/.test(code)) return 'javascript';
  if (/^\s*(import React|export default|useState|useEffect)/.test(code)) return 'jsx';
  if (/^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE TABLE)/i.test(code)) return 'sql';
  if (/^\s*(\{|\[)/.test(code.trim())) return 'json';
  if (/^\s*(echo |apt|npm |pip |brew |cd |ls |mkdir |chmod )/.test(code)) return 'bash';
  return null;
};

const CodeBlock = ({ code, lang }) => {
  const resolvedLang = lang || detectLang(code);
  const lines = code.split('\n');
  return (
    <div className="my-2 rounded-xl overflow-hidden border border-[var(--border-primary)]">
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--card-bg)] border-b border-[var(--border-primary)]">
        <span className="text-[10px] font-mono text-cyan-400/70 uppercase tracking-widest">{resolvedLang || 'CODE'}</span>
        <CopyButton text={code} size="xs" />
      </div>
      <div className="flex overflow-x-auto bg-[var(--code-bg,rgba(0,0,0,0.4))]">
        <div className="select-none px-3 py-3 text-xs font-mono text-[var(--text-subtle)] text-right leading-relaxed border-r border-[var(--border-primary)] min-w-[2.5rem]">
          {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
        </div>
        <pre className="px-4 py-3 text-xs font-mono text-emerald-600 dark:text-emerald-300/90 leading-relaxed flex-1">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

const parseContent = (content) => {
  const parts = []; const regex = /```(\w*)\n?([\s\S]*?)```/g;
  let lastIndex = 0, match;
  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) parts.push({ type: 'text', value: content.slice(lastIndex, match.index) });
    parts.push({ type: 'code', lang: match[1] || '', value: match[2].trimEnd() });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) parts.push({ type: 'text', value: content.slice(lastIndex) });
  return parts;
};

const MessageBody = ({ content }) => {
  const parts = parseContent(content);
  return (
    <div>
      {parts.map((part, i) =>
        part.type === 'code'
          ? <CodeBlock key={i} code={part.value} lang={part.lang} />
          : <p key={i} className="text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap break-words font-mono">{part.value}</p>
      )}
    </div>
  );
};

const DirectChat = ({ backendConnected }) => {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'DIRECT NEURAL INTERFACE ACTIVE', timestamp: new Date().toLocaleTimeString() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input, timestamp: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg.content })
      });
      if (!response.ok) throw new Error('Backend error');
      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response || data.message || 'Neural core processing complete.',
        timestamp: new Date().toLocaleTimeString()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'error',
        content: '⚠️ NEURAL LINK SEVERED - Backend connection lost. Ensure Ollama and FastAPI are running.',
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  const roleLabel = (role) => ({ user: '▶ OPERATOR', system: '⚡ SYS', error: '⚠ ERR' }[role] || '◀ NEURAL-CORE');

  const roleBubbleClass = (role) => ({
    user: 'bg-blue-500/10 border-blue-500/20',
    error: 'bg-red-500/10 border-red-500/20',
    system: 'bg-emerald-500/10 border-emerald-500/20',
  }[role] || 'bg-[var(--card-bg)] border-[var(--border-primary)]');

  const roleLabelClass = (role) => ({
    user: 'text-blue-400', error: 'text-red-400', system: 'text-emerald-400',
  }[role] || 'text-cyan-400');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="px-8 py-6 border-b border-[var(--border-primary)] bg-[var(--panel-bg)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              DIRECT NEURAL INTERFACE
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-mono mt-1">Raw LLM access • Unfiltered communication channel</p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
            backendConnected ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${backendConnected ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            <span className={`text-xs font-mono ${backendConnected ? 'text-emerald-400' : 'text-red-400'}`}>
              {backendConnected ? 'LINKED' : 'OFFLINE'}
            </span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4 scrollbar-hide">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div key={idx}
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${roleBubbleClass(msg.role)} border rounded-2xl p-4 backdrop-blur-xl`}>
                <div className="flex items-center justify-between mb-2 gap-3">
                  <span className={`text-xs font-mono font-bold uppercase tracking-wider ${roleLabelClass(msg.role)}`}>
                    {roleLabel(msg.role)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[var(--text-subtle)] font-mono">{msg.timestamp}</span>
                    {msg.role !== 'system' && <CopyButton text={msg.content} size="xs" />}
                  </div>
                </div>
                <MessageBody content={msg.content} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-[var(--card-bg)] border border-[var(--border-primary)] rounded-2xl p-4 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[0, 150, 300].map(delay => (
                    <div key={delay} className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }}></div>
                  ))}
                </div>
                <span className="text-xs text-cyan-400 font-mono">NEURAL CORE PROCESSING...</span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="px-8 py-4 border-t border-[var(--border-primary)] bg-[var(--panel-bg)] backdrop-blur-xl">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter neural command..."
              disabled={loading}
              rows={1}
              className="w-full bg-[var(--card-bg)] border border-[var(--border-primary)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none font-mono text-sm scrollbar-hide disabled:opacity-50"
              style={{ minHeight: '48px', maxHeight: '120px' }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
            />
            <div className="absolute bottom-2 right-2 text-[10px] text-[var(--text-subtle)] font-mono">
              {loading ? 'TRANSMITTING...' : 'ENTER TO SEND'}
            </div>
          </div>

          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="group relative bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl px-6 py-3 transition-all disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div><span className="text-sm font-mono">XMIT</span></>
            ) : (
              <><svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg><span className="text-sm font-mono">SEND</span></>
            )}
          </button>
        </div>

        <div className="mt-3 text-[10px] text-[var(--text-muted)] font-mono flex items-center gap-4">
          <span>⌨️ SHIFT+ENTER for new line</span>
          <span>•</span>
          <span>⚡ Direct link to Ollama LLaMA 3 via FastAPI</span>
          {!backendConnected && <><span>•</span><span className="text-red-400">⚠️ Backend offline - start services first</span></>}
        </div>
      </div>
    </motion.div>
  );
};

export default DirectChat;
