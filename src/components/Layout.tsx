import React, { useState } from 'react';
import { LayoutDashboard, Calendar, FileText, Users, Folder, FolderOpen, Settings as SettingsIcon, Menu, X, LogOut, Home, Inbox, User, MapPin, Phone, Mail, Facebook, Music2, Megaphone, Hash } from 'lucide-react';
import { useStore } from '../store';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const { settings, isConnected, user, logout, submissions } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingSubmissions = submissions.filter(s => s.status === 'pending').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { id: 'hebahan', label: 'Hebahan & Pengumuman', icon: Megaphone, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 'pengurusan-borang', label: 'Pengurusan Borang', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { id: 'takwim', label: 'Takwim Tahunan', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 'laporan', label: 'Laporan Aktiviti', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { id: 'carta', label: 'Carta Organisasi', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { id: 'dokumen', label: 'Dokumen JHEP', icon: Folder, color: 'text-amber-600', bg: 'bg-amber-100' },
    { id: 'fail-unit', label: 'Fail Unit', icon: FolderOpen, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { id: 'submissions', label: 'Permohonan Pelajar', icon: Inbox, color: 'text-rose-600', bg: 'bg-rose-100', badge: pendingSubmissions },
    { id: 'tetapan', label: 'Tetapan', icon: SettingsIcon, color: 'text-gray-600', bg: 'bg-gray-100' },
  ];

  const handleNavigate = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    window.dispatchEvent(new CustomEvent('navigate-portal', { detail: 'public' }));
  };

  const goToPublic = () => {
    window.dispatchEvent(new CustomEvent('navigate-portal', { detail: 'public' }));
  };

  return (
    <div className="h-full flex flex-col lg:flex-row bg-slate-900 min-h-screen">
      {/* Mobile Header */}
      <header className="lg:hidden bg-blue-900 border-b-4 border-yellow-400 p-4 sticky top-0 z-20 print:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white font-bold shadow-lg border border-white/20">KV</div>
            <div>
              <h1 className="text-xs font-black text-white uppercase tracking-tighter">JHEP KVB</h1>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <p className="text-[10px] text-blue-200 uppercase tracking-wider font-bold">{isConnected ? 'Online' : 'Offline'}</p>
              </div>
            </div>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg bg-white/10 text-white">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2 bg-blue-900 px-4 pb-4 shadow-2xl absolute w-full left-0">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full text-left p-3 rounded-lg flex items-center gap-3 ${currentPage === item.id ? 'bg-yellow-400 text-blue-900 font-bold' : 'hover:bg-white/10 text-blue-100'}`}
              >
                <item.icon className={`w-5 h-5 ${currentPage === item.id ? 'text-blue-900' : item.color}`} />
                <span>{item.label}</span>
                {item.badge ? <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{item.badge}</span> : null}
              </button>
            ))}
            <div className="pt-4 mt-4 border-t border-white/10">
              <button onClick={goToPublic} className="w-full text-left p-3 rounded-lg flex items-center gap-3 text-blue-100 hover:bg-white/10">
                <Home className="w-5 h-5 text-yellow-400" />
                <span>Ke Portal Umum</span>
              </button>
              <button onClick={handleLogout} className="w-full text-left p-3 rounded-lg flex items-center gap-3 text-rose-400 hover:bg-rose-900/20">
                <LogOut className="w-5 h-5" />
                <span>Log Keluar</span>
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-white border-r border-gray-200 sticky top-0 h-screen print:hidden">
        <div className="p-6 border-b border-gray-100 bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0 border-2 border-yellow-400">KV</div>
            <div className="min-w-0">
              <h1 className="text-xs font-black text-blue-900 uppercase tracking-tighter leading-none">Portal Pensyarah</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`} />
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                  {isConnected ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="px-6 py-4 bg-blue-900 border-b border-blue-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-blue-900 shadow-lg">
              <User className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Akses JHEP</p>
              <p className="text-sm font-bold text-white truncate">{user?.name}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${currentPage === item.id ? 'bg-blue-50 text-blue-900 border-l-4 border-blue-900' : 'text-gray-600 hover:bg-gray-50 hover:translate-x-1'}`}
            >
              <div className={`w-10 h-10 ${item.bg} rounded-lg flex items-center justify-center relative`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
                {item.badge ? (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <div>
                <span className="font-bold text-sm">{item.label}</span>
              </div>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2 bg-slate-50">
          <button 
            onClick={goToPublic}
            className="w-full text-left p-3 rounded-xl flex items-center gap-3 text-gray-700 hover:bg-white transition-all border border-transparent hover:border-gray-200"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-blue-900" />
            </div>
            <span className="font-bold text-sm">Portal Umum</span>
          </button>
          <button 
            onClick={handleLogout}
            className="w-full text-left p-3 rounded-xl flex items-center gap-3 text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
          >
            <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm">Log Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50/50 flex flex-col print:bg-white print:overflow-visible">
        <Header />
        <div className="flex-1">
          {children}
        </div>
        
        {/* Footer */}
        <footer className="bg-slate-900 text-white border-t-4 border-yellow-400 mt-auto print:hidden">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Column 1: About JHEP */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-yellow-400 uppercase tracking-tight">Tentang JHEP</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Jabatan Hal Ehwal Pelajar (JHEP) bertanggungjawab menguruskan kebajikan, disiplin, dan aktiviti kokurikulum pelajar Kolej Vokasional Beaufort.</p>
              </div>
              {/* Column 2: Quick Links */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-yellow-400 uppercase tracking-tight">Pautan Pantas</h3>
                <ul className="space-y-3 text-sm">
                  <li><a href="https://www.facebook.com/kolejvokasionalbeaufort" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition flex items-center gap-2"><Facebook className="w-4 h-4" /> Facebook KV Beaufort</a></li>
                  <li><a href="https://www.tiktok.com/@kvbeaufort" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition flex items-center gap-2"><Music2 className="w-4 h-4" /> TikTok KV Beaufort</a></li>
                  <li><a href="https://www.moe.gov.my" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition">Portal KPM</a></li>
                </ul>
              </div>
              {/* Column 3: Contact Info */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-yellow-400 uppercase tracking-tight">Hubungi Kami</h3>
                <div className="space-y-4 text-sm text-gray-400">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <p className="leading-relaxed">
                      Kolej Vokasional Beaufort,<br />
                      KM3, Jalan Beaufort - Sipitang,<br />
                      Peti Surat 1011, 89808 Beaufort,<br />
                      Sabah.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-yellow-400" />
                    <p>087-217014</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-yellow-400" />
                    <p>kvbeaufort@moe.edu.my</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Hash className="w-5 h-5 text-yellow-400" />
                    <p>Kod Sekolah: XHA3102</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-black py-4 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">© 2026 JHEP Kolej Vokasional Beaufort. Hak Cipta Terpelihara.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};
