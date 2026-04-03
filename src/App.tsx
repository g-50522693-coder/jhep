import React, { useState, useEffect } from 'react';
import { StoreProvider } from './store';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Takwim } from './pages/Takwim';
import { Laporan } from './pages/Laporan';
import { Carta } from './pages/Carta';
import { Dokumen } from './pages/Dokumen';
import { FailUnit } from './pages/FailUnit';
import { Tetapan } from './pages/Tetapan';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    const handleNavigate = (e: CustomEvent) => {
      if (e.detail) setCurrentPage(e.detail);
    };
    window.addEventListener('navigate', handleNavigate as EventListener);
    return () => window.removeEventListener('navigate', handleNavigate as EventListener);
  }, []);

  return (
    <StoreProvider>
      <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'takwim' && <Takwim />}
        {currentPage === 'laporan' && <Laporan />}
        {currentPage === 'carta' && <Carta />}
        {currentPage === 'dokumen' && <Dokumen />}
        {currentPage === 'fail-unit' && <FailUnit />}
        {currentPage === 'tetapan' && <Tetapan />}
      </Layout>
    </StoreProvider>
  );
}
