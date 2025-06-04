import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UserMenu from './components/UserMenu';
import ConnectionStatus from './components/ConnectionStatus';
import LoginPage from './pages/LoginPage';
import StartPage from './pages/StartPage';
import RecipientsPage from './pages/RecipientsPage';
import TemplatesPage from './pages/TemplatesPage';
import MailPage from './pages/MailPage';
import RequireAdmin from './components/RequireAdmin';
import AuditLogPage from './pages/AuditLogPage';
import UsersPage from './pages/UsersPage';
import StammdatenPage from './pages/StammdatenPage';
import ResetRequestPage from './pages/ResetRequestPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import FilesPage from './pages/FilesPage';
import OnboardingPage from './pages/OnboardingPage';

function RequireAuth({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex' }}>
        <UserMenu />
        <div className="main-content" style={{ flex: 1, marginLeft: 240, minHeight: '100vh', background: 'transparent', transition: 'margin-left 0.2s' }}>
          <ConnectionStatus />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-request" element={<ResetRequestPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/" element={<RequireAuth><StartPage /></RequireAuth>} />
            <Route path="/admin" element={<RequireAuth><AdminDashboardPage /></RequireAuth>} />
            <Route path="/admin/users" element={<RequireAuth><RequireAdmin><UsersPage /></RequireAdmin></RequireAuth>} />
            <Route path="/admin/auditlog" element={<RequireAuth><RequireAdmin><AuditLogPage /></RequireAdmin></RequireAuth>} />
            <Route path="/admin/files" element={<RequireAuth><RequireAdmin><FilesPage /></RequireAdmin></RequireAuth>} />
            <Route path="/admin/onboarding" element={<RequireAuth><RequireAdmin><OnboardingPage /></RequireAdmin></RequireAuth>} />
            <Route path="/recipients" element={<RequireAuth><RequireAdmin><RecipientsPage /></RequireAdmin></RequireAuth>} />
            <Route path="/templates" element={<RequireAuth><RequireAdmin><TemplatesPage /></RequireAdmin></RequireAuth>} />
            <Route path="/mail" element={<RequireAuth><MailPage /></RequireAuth>} />
            <Route path="/stammdaten" element={<RequireAuth><RequireAdmin><StammdatenPage /></RequireAdmin></RequireAuth>} />
            <Route path="/users" element={<Navigate to="/admin/users" />} />
            <Route path="/auditlog" element={<Navigate to="/admin/auditlog" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
} 