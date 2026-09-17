import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const { title, message, type = 'info', duration = 4000 } = e.detail || {};
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, title, message, type, duration }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    };

    window.addEventListener('ns-toast', handleToast);
    return () => window.removeEventListener('ns-toast', handleToast);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'threat':
      case 'error':
        return <ShieldAlert className="w-5 h-5 text-red-500 flex-shrink-0" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-cyan-500 flex-shrink-0" />;
    }
  };

  const getBadgeStyle = (type) => {
    switch (type) {
      case 'threat':
      case 'error':
        return 'border-red-500/40 bg-red-500/10 text-red-500';
      case 'success':
        return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500';
      case 'warning':
        return 'border-amber-500/40 bg-amber-500/10 text-amber-500';
      default:
        return 'border-cyan-500/40 bg-cyan-500/10 text-cyan-500';
    }
  };

  return (
    <div className="fixed bottom-14 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto glass-card p-4 rounded-2xl border shadow-2xl flex items-start gap-3 backdrop-blur-2xl relative overflow-hidden"
          >
            {/* Top border glow line */}
            <div className={`absolute top-0 left-0 right-0 h-0.5 ${getBadgeStyle(t.type).split(' ')[1]}`} />

            {getIcon(t.type)}

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[var(--text-primary)] uppercase tracking-wider">{t.title}</span>
                <button
                  onClick={() => removeToast(t.id)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-0.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-snug">{t.message}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
