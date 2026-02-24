import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';
import { getApiUrl } from '../services/api';

const NetworkPanel = ({ backendConnected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [qrCodeLocal, setQrCodeLocal] = useState('');
  const [qrCodeNetwork, setQrCodeNetwork] = useState('');
  const [copied, setCopied] = useState('');
  const [qrCodesLoading, setQrCodesLoading] = useState(true);
  const [qrError, setQrError] = useState(null);
  const [qrPopup, setQrPopup] = useState(null);
  const [networkInfo, setNetworkInfo] = useState({ localUrl: '', networkUrl: '', apiUrl: '', mode: 'local' });

  useEffect(() => {
    const initializeNetwork = async () => {
      try {
        setQrCodesLoading(true); setQrError(null);
        const hostname = window.location.hostname;
        const port = window.location.port || '5173';
        const protocol = window.location.protocol;
        const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
        const localUrl = `http://localhost:${port}`;
        const networkUrl = !isLocalhost ? `${protocol}//${hostname}:${port}` : '';
        const mode = !isLocalhost ? 'network' : 'local';
        setNetworkInfo({ localUrl, networkUrl, apiUrl: getApiUrl(), mode });
        try {
          const qrOptions = { width: 400, margin: 2, color: { dark: '#000000ff', light: '#ffffffff' }, errorCorrectionLevel: 'M' };
          setQrCodeLocal(await QRCode.toDataURL(localUrl, qrOptions));
          if (networkUrl) setQrCodeNetwork(await QRCode.toDataURL(networkUrl, qrOptions));
        } catch (qrErr) { setQrError('Failed to generate QR codes. Please refresh the page.'); }
      } catch (error) { setQrError('Failed to initialize network settings.'); }
      finally { setQrCodesLoading(false); }
    };
    initializeNetwork();
  }, []);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const QRDisplay = ({ src, label, accentColor = 'cyan' }) => (
    <div className="flex justify-center py-4">
      {qrCodesLoading ? (
        <div className="flex items-center gap-2 text-[var(--text-muted)]">
          {[0,150,300].map(d => <div key={d} className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
          <span className="text-xs font-mono ml-2">Generating QR...</span>
        </div>
      ) : qrError ? (
        <div className="text-red-400 text-sm font-mono text-center">⚠️ {qrError}</div>
      ) : src ? (
        <button
          onClick={() => setQrPopup({ src, label })}
          className={`p-3 bg-white rounded-2xl cursor-pointer hover:shadow-lg hover:shadow-${accentColor}-500/20 transition-shadow duration-200 group/qr`}
          title="Click to enlarge QR code"
        >
          <img src={src} alt={`QR Code - ${label}`} width={160} height={160} className="block" style={{ imageRendering: 'pixelated' }} />
          <div className={`text-xs text-gray-400 text-center mt-2 group-hover/qr:text-${accentColor}-500 transition-colors`}>Click to enlarge</div>
        </button>
      ) : null}
    </div>
  );

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-2xl shadow-2xl shadow-cyan-500/20 transition-all duration-300 group"
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
            {backendConnected && <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></span>}
          </div>
          <span className="text-sm font-bold text-white uppercase tracking-wider hidden sm:block">Network</span>
        </div>
      </motion.button>

      {/* QR Popup */}
      <AnimatePresence>
        {qrPopup && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setQrPopup(null)} className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100]" />
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="relative pointer-events-auto">
                <button onClick={() => setQrPopup(null)}
                  className="absolute -top-4 -right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="bg-white rounded-3xl p-6 shadow-2xl">
                  <img src={qrPopup.src} alt={`QR - ${qrPopup.label}`} className="w-64 h-64 sm:w-80 sm:h-80" />
                </div>
                <div className="text-center mt-4 text-white/70 text-sm font-mono">{qrPopup.label}</div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Network Panel Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[var(--dropdown-bg)] border border-[var(--border-primary)] rounded-3xl shadow-2xl scrollbar-hide pointer-events-auto transition-colors duration-300"
              >
                {/* Header */}
                <div className="sticky top-0 px-8 py-6 border-b border-[var(--border-primary)] bg-[var(--panel-bg)] backdrop-blur-xl rounded-t-3xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                        <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                        </svg>
                        Network Access
                      </h2>
                      <p className="text-[var(--text-muted)] text-sm mt-1">Connect from any device on your network</p>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-[var(--card-bg)] rounded-xl transition-colors">
                      <svg className="w-6 h-6 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  {/* Status */}
                  <div className="flex items-center gap-4 p-4 bg-[var(--card-bg)] rounded-2xl border border-[var(--border-primary)]">
                    <div className={`w-3 h-3 rounded-full ${networkInfo.mode === 'network' ? 'bg-emerald-400 animate-pulse' : 'bg-yellow-400'}`}></div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-[var(--text-primary)]">
                        {networkInfo.mode === 'network' ? '🌐 Network Mode Active' : '🏠 Local Mode'}
                      </div>
                      <div className="text-xs text-[var(--text-muted)] mt-1">
                        {networkInfo.mode === 'network' ? 'Accessible from devices on your network' : 'Only accessible from this computer'}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${backendConnected ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                      {backendConnected ? 'BACKEND ONLINE' : 'BACKEND OFFLINE'}
                    </div>
                  </div>

                  {/* URLs Grid */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Local */}
                    <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border-primary)]">
                      <div className="flex items-center gap-2 mb-4">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <h3 className="font-bold text-[var(--text-primary)]">Local Access</h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs text-[var(--text-muted)] mb-1 font-mono uppercase tracking-wider">Frontend</div>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 px-3 py-2 bg-[var(--panel-bg)] rounded-lg text-cyan-500 text-sm font-mono">{networkInfo.localUrl}</code>
                            <button onClick={() => copyToClipboard(networkInfo.localUrl, 'local')} className="p-2 hover:bg-[var(--card-bg-hover)] rounded-lg transition-colors">
                              {copied === 'local'
                                ? <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                : <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                              }
                            </button>
                          </div>
                        </div>
                        <QRDisplay src={qrCodeLocal} label={networkInfo.localUrl} accentColor="cyan" />
                        <div className="text-xs text-[var(--text-muted)] text-center">Scan to open on mobile (same network)</div>
                      </div>
                    </div>

                    {/* Network */}
                    <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border-primary)]">
                      <div className="flex items-center gap-2 mb-4">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        <h3 className="font-bold text-[var(--text-primary)]">Network Access</h3>
                      </div>
                      {networkInfo.networkUrl ? (
                        <div className="space-y-3">
                          <div>
                            <div className="text-xs text-[var(--text-muted)] mb-1 font-mono uppercase tracking-wider">Frontend</div>
                            <div className="flex items-center gap-2">
                              <code className="flex-1 px-3 py-2 bg-[var(--panel-bg)] rounded-lg text-emerald-500 text-sm font-mono break-all">{networkInfo.networkUrl}</code>
                              <button onClick={() => copyToClipboard(networkInfo.networkUrl, 'network')} className="p-2 hover:bg-[var(--card-bg-hover)] rounded-lg transition-colors">
                                {copied === 'network'
                                  ? <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                  : <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                }
                              </button>
                            </div>
                          </div>
                          <QRDisplay src={qrCodeNetwork} label={networkInfo.networkUrl} accentColor="emerald" />
                          <div className="text-xs text-[var(--text-muted)] text-center">Scan from any device on your network</div>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <svg className="w-16 h-16 text-[var(--text-subtle)] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
                          </svg>
                          <div className="text-[var(--text-secondary)] font-bold mb-2">Not on Network</div>
                          <div className="text-sm text-[var(--text-muted)]">Access via localhost to see network URL</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* API Info */}
                  <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border-primary)]">
                    <div className="flex items-center gap-2 mb-4">
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                      </svg>
                      <h3 className="font-bold text-[var(--text-primary)]">Backend API</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-[var(--panel-bg)] rounded-lg text-purple-400 text-sm font-mono">{networkInfo.apiUrl}</code>
                      <button onClick={() => copyToClipboard(networkInfo.apiUrl, 'api')} className="p-2 hover:bg-[var(--card-bg-hover)] rounded-lg transition-colors">
                        {copied === 'api'
                          ? <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          : <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        }
                      </button>
                    </div>
                  </div>

                  {/* Connection Guide */}
                  <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl p-6 border border-cyan-500/20">
                    <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Connection Guide
                    </h3>
                    <div className="space-y-3 text-sm text-[var(--text-muted)]">
                      {[
                        ['1.', <>Make sure both devices are on the <span className="text-[var(--text-primary)] font-semibold">same WiFi network</span></>],
                        ['2.', 'Scan the QR code or type the network URL on your mobile device'],
                        ['3.', <>If connection fails, check your <span className="text-[var(--text-primary)] font-semibold">firewall settings</span> (ports 5173 & 8000)</>],
                      ].map(([num, text]) => (
                        <div key={num} className="flex gap-3">
                          <div className="text-cyan-400 font-bold">{num}</div>
                          <div>{text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NetworkPanel;
