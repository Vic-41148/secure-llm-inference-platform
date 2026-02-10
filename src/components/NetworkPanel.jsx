import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';
import { getApiUrl } from '../services/api';

const NetworkPanel = ({ backendConnected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [qrCodeLocal, setQrCodeLocal] = useState('');
  const [qrCodeNetwork, setQrCodeNetwork] = useState('');
  const [copied, setCopied] = useState('');
  const [networkInfo, setNetworkInfo] = useState({
    localUrl: '',
    networkUrl: '',
    apiUrl: '',
    mode: 'local'
  });

  useEffect(() => {
    // Get current URLs
    const hostname = window.location.hostname;
    const port = window.location.port || '5173';
    const protocol = window.location.protocol;
    
    const localUrl = `http://localhost:${port}`;
    const networkUrl = hostname !== 'localhost' && hostname !== '127.0.0.1' 
      ? `${protocol}//${hostname}:${port}` 
      : '';
    
    const mode = hostname !== 'localhost' && hostname !== '127.0.0.1' ? 'network' : 'local';
    
    setNetworkInfo({
      localUrl,
      networkUrl,
      apiUrl: getApiUrl(),
      mode
    });

    // Generate QR codes
    QRCode.toDataURL(localUrl, { 
      width: 200, 
      margin: 1,
      color: { dark: '#ffffff', light: '#00000000' }
    }).then(setQrCodeLocal);

    if (networkUrl) {
      QRCode.toDataURL(networkUrl, { 
        width: 200, 
        margin: 1,
        color: { dark: '#ffffff', light: '#00000000' }
      }).then(setQrCodeNetwork);
    }
  }, []);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <>
      {/* Floating Network Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-2xl shadow-2xl shadow-cyan-500/20 transition-all duration-300 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
            {backendConnected && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></span>
            )}
          </div>
          <span className="text-sm font-bold text-white uppercase tracking-wider hidden sm:block">
            Network
          </span>
        </div>
      </motion.button>

      {/* Network Panel Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-white/10 rounded-3xl shadow-2xl z-50 scrollbar-hide"
            >
              {/* Header */}
              <div className="sticky top-0 px-8 py-6 border-b border-white/10 bg-black/60 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                      </svg>
                      Network Access
                    </h2>
                    <p className="text-white/50 text-sm mt-1">Connect from any device on your network</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8">
                {/* Status */}
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className={`w-3 h-3 rounded-full ${networkInfo.mode === 'network' ? 'bg-emerald-400 animate-pulse' : 'bg-yellow-400'}`}></div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-white">
                      {networkInfo.mode === 'network' ? '🌐 Network Mode Active' : '🏠 Local Mode'}
                    </div>
                    <div className="text-xs text-white/50 mt-1">
                      {networkInfo.mode === 'network' 
                        ? 'Accessible from devices on your network' 
                        : 'Only accessible from this computer'}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-lg ${backendConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'} text-xs font-mono font-bold`}>
                    {backendConnected ? 'BACKEND ONLINE' : 'BACKEND OFFLINE'}
                  </div>
                </div>

                {/* URLs Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Local Access */}
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center gap-2 mb-4">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <h3 className="font-bold text-white">Local Access</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-white/40 mb-1 font-mono uppercase tracking-wider">Frontend</div>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 px-3 py-2 bg-black/60 rounded-lg text-cyan-400 text-sm font-mono">
                            {networkInfo.localUrl}
                          </code>
                          <button
                            onClick={() => copyToClipboard(networkInfo.localUrl, 'local')}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            {copied === 'local' ? (
                              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* QR Code for Local */}
                      <div className="flex justify-center py-4">
                        <div className="p-4 bg-white rounded-2xl">
                          {qrCodeLocal && <img src={qrCodeLocal} alt="QR Code - Local" className="w-40 h-40" />}
                        </div>
                      </div>

                      <div className="text-xs text-white/40 text-center">
                        Scan to open on mobile (same network)
                      </div>
                    </div>
                  </div>

                  {/* Network Access */}
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center gap-2 mb-4">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <h3 className="font-bold text-white">Network Access</h3>
                    </div>

                    {networkInfo.networkUrl ? (
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs text-white/40 mb-1 font-mono uppercase tracking-wider">Frontend</div>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 px-3 py-2 bg-black/60 rounded-lg text-emerald-400 text-sm font-mono break-all">
                              {networkInfo.networkUrl}
                            </code>
                            <button
                              onClick={() => copyToClipboard(networkInfo.networkUrl, 'network')}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              {copied === 'network' ? (
                                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* QR Code for Network */}
                        <div className="flex justify-center py-4">
                          <div className="p-4 bg-white rounded-2xl">
                            {qrCodeNetwork && <img src={qrCodeNetwork} alt="QR Code - Network" className="w-40 h-40" />}
                          </div>
                        </div>

                        <div className="text-xs text-white/40 text-center">
                          Scan from any device on your network
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <svg className="w-16 h-16 text-white/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
                        </svg>
                        <div className="text-white/60 font-bold mb-2">Not on Network</div>
                        <div className="text-sm text-white/40">
                          Access via localhost to see network URL
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* API Info */}
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                    </svg>
                    <h3 className="font-bold text-white">Backend API</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-black/60 rounded-lg text-purple-400 text-sm font-mono">
                      {networkInfo.apiUrl}
                    </code>
                    <button
                      onClick={() => copyToClipboard(networkInfo.apiUrl, 'api')}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {copied === 'api' ? (
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Connection Guide */}
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl p-6 border border-cyan-500/20">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Connection Guide
                  </h3>
                  <div className="space-y-3 text-sm text-white/70">
                    <div className="flex gap-3">
                      <div className="text-cyan-400 font-bold">1.</div>
                      <div>Make sure both devices are on the <span className="text-white font-semibold">same WiFi network</span></div>
                    </div>
                    <div className="flex gap-3">
                      <div className="text-cyan-400 font-bold">2.</div>
                      <div>Scan the QR code or type the network URL on your mobile device</div>
                    </div>
                    <div className="flex gap-3">
                      <div className="text-cyan-400 font-bold">3.</div>
                      <div>If connection fails, check your <span className="text-white font-semibold">firewall settings</span> (ports 5173 & 8000)</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NetworkPanel;