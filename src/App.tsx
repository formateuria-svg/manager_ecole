import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { AppLayout } from './components/app/AppLayout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/app/Dashboard';
import { Students } from './pages/app/Students';
import { Teachers } from './pages/app/Teachers';
import { Enrollments } from './pages/app/Enrollments';
import { Payments } from './pages/app/Payments';
import { Grades } from './pages/app/Grades';
import { Timetable } from './pages/app/Timetable';
import { Absences } from './pages/app/Absences';
import { Settings } from './pages/app/Settings';

export function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="inscriptions" element={<Enrollments />} />
            <Route path="apprenants" element={<Students />} />
            <Route path="enseignants" element={<Teachers />} />
            <Route path="paiements" element={<Payments />} />
            <Route path="notes" element={<Grades />} />
            <Route path="emploi-du-temps" element={<Timetable />} />
            <Route path="absences" element={<Absences />} />
            <Route path="parametres" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>);

}