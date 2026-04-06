import React, { useState } from 'react';
import { useStore } from '../store';
import { Megaphone, Plus, Trash2, Calendar, Clock, AlertCircle, FileText, Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Announcements: React.FC = () => {
  const { announcements, addAnnouncement, deleteAnnouncement, user } = useStore();
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
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-blue-900 uppercase tracking-tight flex items-center gap-3">
            <Megaphone className="w-8 h-8" />
            Pengurusan Hebahan
          </h2>
          <p className="text-gray-500 font-medium">Uruskan pengumuman dan makluman rasmi untuk portal umum.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Hebahan Baru
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {announcements.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Megaphone className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Tiada Hebahan</h3>
            <p className="text-gray-500 max-w-sm mx-auto">Klik butang "Hebahan Baru" untuk mula menerbitkan makluman.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {announcements.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((ann) => (
              <motion.div
                key={ann.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`bg-white rounded-2xl shadow-sm border-l-8 ${ann.isImportant ? 'border-rose-500' : 'border-blue-600'} p-6 relative group hover:shadow-md transition-all`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {ann.isImportant && (
                        <span className="px-3 py-1 bg-rose-100 text-rose-600 text-[10px] font-black rounded-full uppercase tracking-widest flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Penting
                        </span>
                      )}
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {ann.date}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 leading-tight">{ann.title}</h3>
                  </div>
                  <button 
                    onClick={() => deleteAnnouncement(ann.id)}
                    className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
                
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap mb-6">{ann.content}</p>

                {ann.attachments && ann.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-6">
                    {ann.attachments.map((att, index) => (
                      <div key={index} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 text-xs font-bold">
                        <FileText className="w-4 h-4" />
                        Lampiran {index + 1}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                    {ann.author[0]}
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Diterbitkan oleh: {ann.author}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
          >
            <div className="bg-blue-600 p-8 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight">Hebahan Baru</h3>
                <p className="text-blue-100 text-sm font-medium">Lengkapkan butiran makluman di bawah.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="hover:bg-white/20 p-2 rounded-xl transition-colors">
                <X className="w-8 h-8" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-8 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-widest">Tajuk Hebahan</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium"
                    value={newAnn.title}
                    onChange={e => setNewAnn({...newAnn, title: e.target.value})}
                    placeholder="Masukkan tajuk hebahan..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-widest">Kandungan / Butiran</label>
                  <textarea 
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-100 outline-none resize-none transition-all font-medium"
                    value={newAnn.content}
                    onChange={e => setNewAnn({...newAnn, content: e.target.value})}
                    placeholder="Tulis butiran lengkap hebahan di sini..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-widest">Lampiran (Gambar/Dokumen)</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      multiple
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${newAnn.attachments.length > 0 ? 'border-blue-500 bg-blue-50' : 'border-gray-200 group-hover:border-blue-400 group-hover:bg-blue-50'}`}>
                      <div className="flex flex-col items-center gap-2">
                        <Upload className={`w-8 h-8 ${newAnn.attachments.length > 0 ? 'text-blue-600' : 'text-gray-300'}`} />
                        <p className="text-sm font-bold text-gray-500">
                          {newAnn.attachments.length > 0 ? `${newAnn.attachments.length} fail dipilih` : 'Klik untuk muat naik lampiran'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
                  <input 
                    type="checkbox" 
                    id="important_lecturer"
                    className="w-5 h-5 text-blue-600 rounded-lg focus:ring-blue-500"
                    checked={newAnn.isImportant}
                    onChange={e => setNewAnn({...newAnn, isImportant: e.target.checked})}
                  />
                  <label htmlFor="important_lecturer" className="text-sm font-bold text-gray-700 uppercase tracking-widest">Tandakan sebagai hebahan penting</label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-4 rounded-xl font-black text-gray-500 hover:bg-gray-100 transition-all uppercase tracking-widest"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 uppercase tracking-widest"
                >
                  Terbitkan Hebahan
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
