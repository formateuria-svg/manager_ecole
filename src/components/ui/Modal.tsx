import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from 'lucide-react';

export function Modal({
  open,
  onClose,
  title,
  children,
  wide






}: {open: boolean;onClose: () => void;title: string;children: React.ReactNode;wide?: boolean;}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open &&
      <motion.div
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}>
        
          <div
          className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden />
        
          <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className={`relative w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} rounded-xl2 border-2 border-ink bg-paper shadow-hard-lg`}
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}>
          
            <div className="flex items-center justify-between border-b-2 border-ink px-6 py-4">
              <h2 className="font-display text-xl font-bold">{title}</h2>
              <button
              onClick={onClose}
              aria-label="Fermer"
              className="rounded-full border-2 border-ink bg-canvas p-1.5 transition-colors hover:bg-coral">
              
                <XIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>);

}