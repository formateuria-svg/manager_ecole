import React, { createContext, useCallback, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2Icon, InfoIcon, XIcon } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  tone: 'success' | 'info';
}

const ToastCtx = createContext<(message: string, tone?: 'success' | 'info') => void>(() => {});

export function useToast() {
  return useContext(ToastCtx);
}

export function ToastProvider({ children }: {children: React.ReactNode;}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((message: string, tone: 'success' | 'info' = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex w-full max-w-xs flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) =>
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, x: 40, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 360, damping: 26 }}
            className="pointer-events-auto flex items-center gap-3 rounded-xl border-2 border-ink bg-paper px-4 py-3 shadow-hard">
            
              <span
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-ink ${
              t.tone === 'success' ? 'bg-lime' : 'bg-teal-soft'}`
              }>
              
                {t.tone === 'success' ?
              <CheckCircle2Icon className="h-4 w-4 text-ink" /> :

              <InfoIcon className="h-4 w-4 text-teal" />
              }
              </span>
              <p className="flex-1 text-sm font-medium text-ink">{t.message}</p>
              <button
              onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}
              aria-label="Fermer"
              className="text-smoke hover:text-ink">
              
                <XIcon className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>);

}