import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './store';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Takwim } from './pages/Takwim';
import { Laporan } from './pages/Laporan';
import { Carta } from './pages/Carta';
import { Dokumen } from './pages/Dokumen';
import { FailUnit } from './pages/FailUnit';
import { Tetapan } from './pages/Tetapan';
import { PublicPortal } from './pages/PublicPortal';
import { StudentPortal } from './pages/StudentPortal';
import { Login } from './pages/Login';

import { Submissions } from './pages/Submissions';
import { Announcements } from './pages/Announcements';
import { FormsManagement } from './pages/FormsManagement';

const AppContent: React.FC = () => {
  const { user } = useStore();
  const [portal, setPortal] = useState<'public' | 'student' | 'login' | 'lecturer'>('public');
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    const handleNavigate = (e: CustomEvent) => {
      if (e.detail) setCurrentPage(e.detail);
    };
    const handlePortalNavigate = (e: CustomEvent) => {
      if (e.detail) setPortal(e.detail);
    };
    
    window.addEventListener('navigate', handleNavigate as EventListener);
    window.addEventListener('navigate-portal', handlePortalNavigate as EventListener);
    
    return () => {
      window.removeEventListener('navigate', handleNavigate as EventListener);
      window.removeEventListener('navigate-portal', handlePortalNavigate as EventListener);
    };
  }, []);

  // Redirect to login if trying to access lecturer portal without being logged in
  useEffect(() => {
    if (portal === 'lecturer' && !user) {
      setPortal('login');
    }
  }, [portal, user]);

  if (portal === 'public') return <PublicPortal />;
  if (portal === 'student') return <StudentPortal />;
  if (portal === 'login') return <Login />;

  // Lecturer Portal (Existing App)
  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {currentPage === 'dashboard' && <Dashboard />}
      {currentPage === 'hebahan' && <Announcements />}
      {currentPage === 'pengurusan-borang' && <FormsManagement />}
      {currentPage === 'takwim' && <Takwim />}
      {currentPage === 'laporan' && <Laporan />}
      {currentPage === 'carta' && <Carta />}
      {currentPage === 'dokumen' && <Dokumen />}
      {currentPage === 'fail-unit' && <FailUnit />}
      {currentPage === 'submissions' && <Submissions />}
      {currentPage === 'tetapan' && <Tetapan />}
    </Layout>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
