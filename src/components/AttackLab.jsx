import React, { useState } from 'react';
import { motion } from 'framer-motion';

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
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <button
      onClick={handleCopy}
      title="Copy"
      className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition-all font-mono
        ${copied
          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
          : 'bg-[var(--card-bg)] border-[var(--border-primary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg-hover)] hover:border-[var(--border-hover)]'
        } ${size === 'xs' ? 'text-[9px]' : 'text-[10px]'}`}
    >
      {copied ? (
        <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>COPIED</>
      ) : (
        <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>COPY</>
      )}
    </button>
  );
};

const detectLang = (code) => {
  if (/^\s*(def |import |from .+ import|class .+:|print\(|if __name__)/.test(code)) return 'python';
  if (/^\s*(const |let |var |function |=>|import .+ from|require\()/.test(code)) return 'javascript';
  if (/^\s*(import React|export default|useState|useEffect)/.test(code)) return 'jsx';
  if (/^\s*(<\?php|\$[a-zA-Z])/.test(code)) return 'php';
  if (/^\s*(public class|private |protected |System\.out)/.test(code)) return 'java';
  if (/^\s*(#include|int main|std::|cout|cin)/.test(code)) return 'c++';
  if (/^\s*(fn |let mut|use std|println!|impl )/.test(code)) return 'rust';
  if (/^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE TABLE)/i.test(code)) return 'sql';
  if (/^\s*(FROM |RUN |CMD |EXPOSE |WORKDIR )/.test(code)) return 'dockerfile';
  if (/^\s*([a-zA-Z-]+:\s|^\s*-\s)/.test(code) && code.includes('\n')) return 'yaml';
  if (/^\s*(\{|\[)/.test(code.trim())) return 'json';
  if (/^\s*(echo |apt|npm |pip |brew |cd |ls |mkdir |chmod )/.test(code)) return 'bash';
  if (/^\s*([a-zA-Z-]+\s*\{|@media|:root|\.[\w-]+\s*\{)/.test(code)) return 'css';
  return null;
};

const CodeBlock = ({ code, lang }) => {
  const resolvedLang = lang || detectLang(code);
  const lines = code.split('\n');
  return (
    <div className="my-2 rounded-xl overflow-hidden border border-[var(--border-primary)] bg-[var(--code-bg,rgba(0,0,0,0.6))]">
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--card-bg)] border-b border-[var(--border-primary)]">
        <span className="text-[10px] font-mono text-cyan-400/70 uppercase tracking-widest">{resolvedLang || 'CODE'}</span>
        <CopyButton text={code} size="xs" />
      </div>
      <div className="flex overflow-x-auto">
        <div className="select-none px-3 py-3 text-xs font-mono text-[var(--text-subtle)] text-right leading-relaxed border-r border-[var(--border-primary)] bg-[var(--card-bg)] min-w-[2.5rem]">
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
  const parts = [];
  const regex = /```(\w*)\n?([\s\S]*?)```/g;
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
          : <p key={i} className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap text-sm">{part.value}</p>
      )}
    </div>
  );
};

const AttackLab = ({ attack, isSimulating, onSimulate }) => {
  const [prompt, setPrompt] = useState(attack.lastPrompt || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() && !isSimulating) onSimulate(prompt);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="h-full flex flex-col"
    >
      {/* Attack Info Header */}
      <div className="px-8 py-6 border-b border-[var(--border-primary)] bg-[var(--panel-bg)]">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">{attack.name}</h2>
              <span className="px-3 py-1 rounded-lg bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-mono font-bold tracking-wider">
                {attack.type.toUpperCase()}
              </span>
            </div>
            <p className="text-[var(--text-muted)] leading-relaxed max-w-3xl">{attack.description}</p>
          </div>

          <div className="bg-[var(--card-bg)] backdrop-blur-xl rounded-xl p-4 border border-[var(--border-primary)] min-w-[200px]">
            <div className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-wider mb-2">Success Rate (Undefended)</div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="h-2 bg-[var(--card-bg)] rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${
                      attack.successRate === 0 ? 'from-emerald-500 to-emerald-400'
                      : attack.successRate < 30 ? 'from-yellow-500 to-yellow-400'
                      : attack.successRate < 70 ? 'from-orange-500 to-orange-400'
                      : 'from-red-500 to-red-400'
                    }`}
                    style={{ width: `${attack.successRate}%` }}
                  />
                </div>
              </div>
              <div className={`text-2xl font-bold font-mono ${
                attack.successRate === 0 ? 'text-emerald-400'
                : attack.successRate < 30 ? 'text-yellow-400'
                : attack.successRate < 70 ? 'text-orange-400'
                : 'text-red-400'
              }`}>{attack.successRate}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Input Panel */}
        <div className="flex-1 p-8 overflow-y-auto scrollbar-hide">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Attack Prompt</h3>
              </div>
              <p className="text-sm text-[var(--text-muted)] mb-4">Craft your adversarial prompt below to test the neural defense system</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your attack prompt here..."
                  className="w-full h-64 p-6 bg-[var(--card-bg)] backdrop-blur-xl border-2 border-[var(--border-primary)] focus:border-cyan-500/50 rounded-2xl text-[var(--text-primary)] placeholder-[var(--text-muted)] font-mono text-sm leading-relaxed resize-none focus:outline-none transition-all duration-300"
                  disabled={isSimulating}
                />
                <div className="absolute bottom-4 right-4 text-xs text-[var(--text-muted)] font-mono">{prompt.length} characters</div>
              </div>

              <button
                type="submit"
                disabled={isSimulating || !prompt.trim()}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-gray-400 disabled:to-gray-500 rounded-xl font-bold text-white uppercase tracking-widest transition-all duration-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isSimulating ? (
                  <><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>Executing Neural Analysis...</>
                ) : (
                  <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>Execute Attack Simulation</>
                )}
              </button>
            </form>

            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="text-sm font-bold text-yellow-500 mb-1">Simulation Mode</div>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400/80 leading-relaxed">
                    This is a controlled testing environment. All prompts are isolated and logged for security analysis. No actual system compromise will occur.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Response Panel */}
        <div className="w-[500px] border-l border-[var(--border-primary)] bg-[var(--panel-bg)] overflow-y-auto scrollbar-hide">
          <div className="p-6 border-b border-[var(--border-primary)] bg-[var(--card-bg)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Neural Response</h3>
              </div>
              {attack.lastResponse && <CopyButton text={attack.lastResponse} size="xs" />}
            </div>
          </div>

          <div className="p-6">
            {attack.lastResponse ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs">
                  {attack.successRate > 50 ? (
                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  )}
                  <span className={`font-mono font-bold uppercase tracking-wider ${attack.successRate > 50 ? 'text-red-400' : 'text-emerald-500'}`}>
                    {attack.successRate > 50 ? 'Potentially Compromised' : 'Intercepted & Cleansed'}
                  </span>
                </div>
                <MessageBody content={attack.lastResponse} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-[var(--text-subtle)] italic text-center px-12">
                Awaiting neural execution...
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AttackLab;
