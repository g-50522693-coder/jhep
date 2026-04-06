import React, { useState } from 'react';
import { useStore } from '../store';
import { Bell, Clock, Phone, Mail, MapPin, Info, Plus, Trash2, Megaphone, LogIn, Facebook, Music2, FileText, Hash, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from '../components/Header';

export const PublicPortal: React.FC = () => {
  const { announcements, settings, user, addAnnouncement, deleteAnnouncement } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAnn, setNewAnn] = useState({ title: '', content: '', isImportant: false, attachments: [] as string[] });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewAnn(prev => ({
            ...prev,
            attachments: [...prev.attachments, reader.result as string]
          }));
        };
        reader.readAsDataURL(file as Blob);
      });
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addAnnouncement({
      ...newAnn,
      date: new Date().toLocaleDateString('ms-MY'),
      author: user?.name || 'Pensyarah JHEP',
    });
    setNewAnn({ title: '', content: '', isImportant: false, attachments: [] });
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Hero Section */}
      <div className="bg-blue-900 text-white py-12 px-4 border-b-4 border-yellow-400 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-400 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center md:text-left">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight uppercase"
              >
                PUSAT MAKLUMAT DIGITAL <br />
                <span className="text-yellow-400">JHEP KV BEAUFORT</span>
              </motion.h1>
              <p className="text-blue-100 text-lg md:text-xl font-medium leading-relaxed">
                Platform rasmi integrasi maklumat, kebajikan, dan pengurusan pelajar bagi melahirkan graduan TVET yang kompeten dan berakhlak mulia.
              </p>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-sm bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
                  <Megaphone className="w-6 h-6 text-blue-900" />
                </div>
                <h3 className="text-xl font-bold">Hebahan Terkini</h3>
              </div>
              <div className="space-y-4">
                {announcements.slice(0, 2).map(ann => (
                  <div key={ann.id} className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <p className="text-xs font-bold text-yellow-400 mb-1 uppercase tracking-wider">{ann.isImportant ? 'PENTING' : 'INFO'}</p>
                    <p className="text-sm font-bold line-clamp-1">{ann.title}</p>
                  </div>
                ))}
                {announcements.length === 0 && <p className="text-sm text-blue-200 italic">Tiada hebahan buat masa ini.</p>}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Announcements */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Megaphone className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Hebahan & Pengumuman</h2>
              </div>
            </div>

            <div className="space-y-4">
              {announcements.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium">Tiada hebahan buat masa ini.</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {announcements.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((ann) => (
                    <motion.div
                      key={ann.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`bg-white rounded-2xl shadow-sm border-l-4 ${ann.isImportant ? 'border-red-500' : 'border-blue-500'} p-6 relative group hover:shadow-md transition-all`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          {ann.isImportant && (
                            <span className="inline-block px-3 py-1 bg-red-100 text-red-600 text-[10px] font-bold rounded-full uppercase tracking-widest mb-2">Penting</span>
                          )}
                          <h3 className="text-xl font-bold text-gray-800">{ann.title}</h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {ann.date}</span>
                            <span className="flex items-center gap-1 font-medium text-blue-600">Oleh: {ann.author}</span>
                          </div>
                        </div>
                        {user && (
                          <button 
                            onClick={() => deleteAnnouncement(ann.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap mb-4">{ann.content}</p>
                      
                      {ann.attachments && ann.attachments.length > 0 && (
                        <div className="space-y-4 mb-4">
                          {ann.attachments.map((att, index) => {
                            const isImage = att.startsWith('data:image/') || att.includes('picsum.photos') || att.match(/\.(jpeg|jpg|gif|png|webp)$/i);
                            if (isImage) {
                              return (
                                <motion.div 
                                  key={index} 
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50"
                                >
                                  <img 
                                    src={att} 
                                    alt={`Lampiran ${index + 1}`} 
                                    className="w-full h-auto object-cover max-h-[500px] hover:scale-105 transition-transform duration-500"
                                    referrerPolicy="no-referrer"
                                  />
                                </motion.div>
                              );
                            }
                            return (
                              <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 text-xs font-bold w-fit">
                                <FileText className="w-3 h-3" />
                                Lampiran {index + 1} (Dokumen)
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Sidebar: Info JHEP */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                Informasi JHEP
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Waktu Operasi</p>
                    <p className="text-sm text-gray-700 font-medium">{settings.operatingHours}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Telefon</p>
                    <p className="text-sm text-gray-700 font-medium">{settings.contactPhone}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Emel</p>
                    <p className="text-sm text-gray-700 font-medium">{settings.contactEmail}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Lokasi</p>
                    <p className="text-sm text-gray-700 font-medium leading-relaxed">{settings.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Kalendar Tahunan (Ringkasan)
              </h3>
              <div className="space-y-3">
                {[
                  { date: '15 Apr', event: 'Tarikh Akhir Borang Kebajikan' },
                  { date: '20 Apr', event: 'Mesyuarat Agung PIBG' },
                  { date: '01 Mei', event: 'Cuti Hari Pekerja' },
                  { date: '25 Mei', event: 'Peperiksaan Akhir Semester' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50 last:border-0">
                    <div className="w-12 text-center">
                      <p className="text-[10px] font-black text-blue-600 leading-none uppercase">{item.date.split(' ')[1]}</p>
                      <p className="text-lg font-black text-gray-800 leading-none">{item.date.split(' ')[0]}</p>
                    </div>
                    <p className="text-xs font-bold text-gray-600 line-clamp-1">{item.event}</p>
                  </div>
                ))}
                <button className="w-full mt-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors">
                  Lihat Takwim Penuh →
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-bold mb-2">Portal Pelajar</h3>
              <p className="text-sm text-blue-100 mb-4">Muat turun borang dan hantar permohonan anda secara atas talian.</p>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('navigate-portal', { detail: 'student' }))}
                className="w-full bg-white text-blue-600 font-bold py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Ke Portal Pelajar
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-2">Akses Pensyarah</h3>
              <p className="text-sm text-gray-500 mb-4">Log masuk untuk menguruskan takwim, laporan, dan dokumen JHEP.</p>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('navigate-portal', { detail: 'login' }))}
                className="w-full bg-gray-100 text-gray-700 font-bold py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Log Masuk Pensyarah
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Announcement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
          >
            <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Hebahan Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Tajuk Hebahan</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newAnn.title}
                  onChange={e => setNewAnn({...newAnn, title: e.target.value})}
                  placeholder="Contoh: Makluman Cuti Peristiwa"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Kandungan</label>
                <textarea 
                  required
                  rows={5}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  value={newAnn.content}
                  onChange={e => setNewAnn({...newAnn, content: e.target.value})}
                  placeholder="Tulis butiran hebahan di sini..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Lampiran (Gambar/Dokumen)</label>
                <input 
                  type="file" 
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {newAnn.attachments.length > 0 && (
                  <p className="text-xs text-blue-600 mt-1 font-bold">{newAnn.attachments.length} fail dipilih</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="important"
                  className="w-4 h-4 text-blue-600 rounded"
                  checked={newAnn.isImportant}
                  onChange={e => setNewAnn({...newAnn, isImportant: e.target.checked})}
                />
                <label htmlFor="important" className="text-sm font-bold text-gray-700">Tandakan sebagai Penting</label>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                  Terbitkan Hebahan
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      {/* Footer */}
      <footer className="bg-slate-900 text-white border-t-4 border-yellow-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-4 text-yellow-400">TENTANG JHEP</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Jabatan Hal Ehwal Pelajar (JHEP) bertanggungjawab menguruskan kebajikan, disiplin, dan aktiviti kokurikulum pelajar Kolej Vokasional Beaufort.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-yellow-400">PAUTAN PANTAS</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="https://www.facebook.com/kolejvokasionalbeaufort" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition flex items-center gap-2"><Facebook className="w-4 h-4" /> Facebook KV Beaufort</a></li>
                <li><a href="https://www.tiktok.com/@kvbeaufort" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition flex items-center gap-2"><Music2 className="w-4 h-4" /> TikTok KV Beaufort</a></li>
                <li><a href="https://www.moe.gov.my" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition">Portal KPM</a></li>
              </ul>
            </div>
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
            <p className="text-xs text-gray-500 font-bold tracking-widest uppercase">© 2026 JHEP Kolej Vokasional Beaufort. Hak Cipta Terpelihara.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
