import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

const CodeBlock = ({ children }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = String(children).replace(/\n$/, '');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 text-[10px] font-mono bg-black/70 px-2 py-1 rounded border border-white/10 text-cyan-400 opacity-0 group-hover:opacity-100 transition"
      >
        {copied ? 'COPIED' : 'COPY'}
      </button>

      <pre className="overflow-x-auto rounded-lg p-4 bg-black/60 border border-white/10 text-sm">
        <code>{children}</code>
      </pre>
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = {
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString()
    };

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
        content: '⚠️ NEURAL LINK SEVERED - Backend connection lost.',
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full flex flex-col"
    >
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="max-w-[80%] bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">

                <div className="flex justify-between mb-2">
                  <span className="text-xs font-mono text-cyan-400 uppercase">
                    {msg.role}
                  </span>
                  <span className="text-[10px] text-white/30 font-mono">
                    {msg.timestamp}
                  </span>
                </div>

                <div className="text-sm text-white/90 font-mono leading-relaxed">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      code({ inline, children }) {
                        if (inline) {
                          return (
                            <code className="bg-black/50 px-1 py-0.5 rounded text-cyan-400">
                              {children}
                            </code>
                          );
                        }
                        return <CodeBlock>{children}</CodeBlock>;
                      }
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>

              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="text-cyan-400 text-xs font-mono">
            NEURAL CORE PROCESSING...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-8 py-4 border-t border-white/10 bg-black/60">
        <div className="flex gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter neural command..."
            disabled={loading}
            rows={1}
            className="flex-1 bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white resize-none font-mono text-sm"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-cyan-600 hover:bg-cyan-500 px-6 py-3 rounded-xl text-white font-mono"
          >
            SEND
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DirectChat;
