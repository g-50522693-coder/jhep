import React, { useState } from 'react';
import { LayoutDashboard, Calendar, FileText, Users, Folder, FolderOpen, Settings as SettingsIcon, Menu, X } from 'lucide-react';
import { useStore } from '../store';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const { settings } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { id: 'takwim', label: 'Takwim Tahunan', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 'laporan', label: 'Laporan Aktiviti', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { id: 'carta', label: 'Carta Organisasi', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { id: 'dokumen', label: 'Dokumen JHEP', icon: Folder, color: 'text-amber-600', bg: 'bg-amber-100' },
    { id: 'fail-unit', label: 'Fail Unit', icon: FolderOpen, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { id: 'tetapan', label: 'Tetapan', icon: SettingsIcon, color: 'text-gray-600', bg: 'bg-gray-100' },
  ];

  const handleNavigate = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 min-h-screen">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-20 print:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {settings.logo ? (
              <img src={settings.logo} alt="Logo" className="w-12 h-12 object-contain" />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-yellow-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">KV</div>
            )}
            <div>
              <h1 className="text-sm font-bold text-gray-800 line-clamp-1">{settings.departmentName}</h1>
              <p className="text-xs text-gray-500 line-clamp-1">{settings.institutionName}</p>
            </div>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg hover:bg-gray-100">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-2 bg-white px-4 pb-4 shadow-lg absolute w-full left-0">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full text-left p-3 rounded-lg flex items-center gap-3 ${currentPage === item.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}
              >
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        )}
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-white border-r border-gray-200 sticky top-0 h-screen print:hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            {settings.logo ? (
              <img src={settings.logo} alt="Logo" className="w-16 h-16 object-contain" />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-yellow-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">KV</div>
            )}
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-gray-800 leading-tight">{settings.departmentName}</h1>
              <p className="text-xs text-gray-500 mt-1">{settings.institutionName}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.slice(0, 6).map(item => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${currentPage === item.id ? 'bg-gradient-to-r from-blue-50 to-transparent border-l-4 border-blue-600' : 'text-gray-700 hover:bg-gray-50 hover:translate-x-1'}`}
            >
              <div className={`w-10 h-10 ${item.bg} rounded-lg flex items-center justify-center`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div>
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-gray-100">
            <button
              onClick={() => handleNavigate('tetapan')}
              className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${currentPage === 'tetapan' ? 'bg-gradient-to-r from-blue-50 to-transparent border-l-4 border-blue-600' : 'text-gray-700 hover:bg-gray-50 hover:translate-x-1'}`}
            >
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <SettingsIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <span className="font-semibold text-sm">Tetapan</span>
              </div>
            </button>
          </div>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4">
            <p className="text-xs text-gray-600 text-center">Sistem Pengurusan JHEP</p>
            <p className="text-xs text-gray-400 text-center mt-1">Versi 1.0</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50/50 flex flex-col print:bg-white print:overflow-visible">
        <div className="flex-1">
          {children}
        </div>
        
        {/* Footer */}
        <footer className="bg-gradient-to-r from-slate-800 via-blue-900 to-slate-900 text-white border-t-4 border-yellow-400 mt-auto print:hidden">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Column 1: About JHEP */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-yellow-400">TENTANG JHEP</h3>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">Jabatan Hal Ehwal Pelajar (JHEP) bertanggungjawab menguruskan kebajikan, disiplin, dan aktiviti kokurikulum pelajar Kolej Vokasional Beaufort.</p>
              </div>
              {/* Column 2: Quick Links */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-yellow-400">PAUTAN PANTAS</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="https://www.moe.gov.my" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-yellow-400 transition flex items-center gap-2">Portal Kementerian Pendidikan Malaysia</a></li>
                  <li><a href="https://ssdm.moe.gov.my" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-yellow-400 transition flex items-center gap-2">Sistem Sekolah Dato' Mokhtar (SSDM)</a></li>
                  <li><a href="https://moeis.moe.gov.my" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-yellow-400 transition flex items-center gap-2">MOEIS - Kehadiran Pelajar</a></li>
                  <li><a href="https://www.facebook.com/kolejvokasionalbeaufort" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-yellow-400 transition flex items-center gap-2">Facebook KV Beaufort</a></li>
                  <li><a href="https://www.tiktok.com/@kvbeaufort" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-yellow-400 transition flex items-center gap-2">TikTok KV Beaufort</a></li>
                </ul>
              </div>
              {/* Column 3: Contact Info */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-yellow-400">HUBUNGI KAMI</h3>
                <div className="space-y-3 text-sm text-gray-300">
                  <p>Kolej Vokasional Beaufort,<br/>KM3, Jalan Beaufort - Sipitang,<br/>Peti Surat 1011,<br/>89808 Beaufort, Sabah.</p>
                  <p>087-217014</p>
                  <p>kvbeaufort@moe.edu.my</p>
                </div>
              </div>
            </div>
          </div>
          {/* Bottom Bar */}
          <div className="border-t-4 border-yellow-400 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-gray-200 text-sm font-bold">© 2026 JHEP Kolej Vokasional Beaufort. Hak Cipta Terpelihara.</p>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg border-2 border-blue-400 shadow-lg">
                <span className="text-white font-bold text-sm">JHEPKVB</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};
