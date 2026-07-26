import React, { useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAuth } from '../../store/useAuth';

export function AppLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const currentEmail = useAuth((s) => s.currentEmail);

  if (!currentEmail) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-full w-full bg-canvas">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="flex-1 grain px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}>
              
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>
    </div>);

}