import React, { useState } from 'react';
import { useStore } from '../store';
import { FileText, Plus, Trash2, Upload, Link as LinkIcon, X, FileDown, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FormsManagement: React.FC = () => {
  const { studentForms, addStudentForm, deleteStudentForm } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newForm, setNewForm] = useState({ 
    title: '', 
    description: '', 
    fileData: '', 
    externalLink: '' 
  });
  const [uploadType, setUploadType] = useState<'file' | 'link'>('file');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewForm(prev => ({ ...prev, fileData: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addStudentForm({
      ...newForm,
      fileData: uploadType === 'file' ? newForm.fileData : '',
      externalLink: uploadType === 'link' ? newForm.externalLink : '',
    });
    setNewForm({ title: '', description: '', fileData: '', externalLink: '' });
    setShowAddModal(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-blue-900 uppercase tracking-tight flex items-center gap-3">
            <FileText className="w-8 h-8" />
            Pengurusan Borang Pelajar
          </h2>
          <p className="text-gray-500 font-medium">Muat naik borang baru atau uruskan pautan borang digital untuk pelajar.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-200 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Tambah Borang Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {studentForms.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Tiada Borang</h3>
            <p className="text-gray-500 max-w-sm mx-auto">Klik butang "Tambah Borang Baru" untuk mula menyediakan borang kepada pelajar.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {studentForms.map((form) => (
              <motion.div
                key={form.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group relative"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-600 transition-colors">
                    <FileText className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <button 
                    onClick={() => deleteStudentForm(form.id)}
                    className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{form.title}</h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-2">{form.description}</p>
                
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                  {form.fileData ? (
                    <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      <FileDown className="w-3 h-3" /> Dokumen
                    </span>
                  ) : form.externalLink ? (
                    <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                      <ExternalLink className="w-3 h-3" /> Pautan Luar
                    </span>
                  ) : (
                    <span>Tiada Fail</span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Add Form Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
          >
            <div className="bg-emerald-600 p-8 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight">Tambah Borang Baru</h3>
                <p className="text-emerald-100 text-sm font-medium">Sediakan borang untuk dimuat turun oleh pelajar.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="hover:bg-white/20 p-2 rounded-xl transition-colors">
                <X className="w-8 h-8" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-8 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-widest">Nama Borang</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-100 outline-none transition-all font-medium"
                    value={newForm.title}
                    onChange={e => setNewForm({...newForm, title: e.target.value})}
                    placeholder="Contoh: Borang Kebenaran Keluar"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-widest">Penerangan Ringkas</label>
                  <textarea 
                    required
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-100 outline-none resize-none transition-all font-medium"
                    value={newForm.description}
                    onChange={e => setNewForm({...newForm, description: e.target.value})}
                    placeholder="Tulis penerangan ringkas tentang borang ini..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-gray-700 mb-4 uppercase tracking-widest">Jenis Muat Naik</label>
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setUploadType('file')}
                      className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all font-bold ${uploadType === 'file' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
                    >
                      <Upload className="w-5 h-5" />
                      Muat Naik Fail
                    </button>
                    <button 
                      type="button"
                      onClick={() => setUploadType('link')}
                      className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all font-bold ${uploadType === 'link' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
                    >
                      <LinkIcon className="w-5 h-5" />
                      Pautan Luar
                    </button>
                  </div>
                </div>

                {uploadType === 'file' ? (
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-widest">Pilih Dokumen</label>
                    <div className="relative group">
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${newForm.fileData ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 group-hover:border-emerald-400 group-hover:bg-emerald-50'}`}>
                        <div className="flex flex-col items-center gap-2">
                          <Upload className={`w-8 h-8 ${newForm.fileData ? 'text-emerald-600' : 'text-gray-300'}`} />
                          <p className="text-sm font-bold text-gray-500">
                            {newForm.fileData ? 'Fail telah dipilih' : 'Klik untuk muat naik dokumen (PDF/DOC)'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-widest">Pautan Borang (Google Form/Lain-lain)</label>
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="url" 
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-100 outline-none transition-all font-medium"
                        value={newForm.externalLink}
                        onChange={e => setNewForm({...newForm, externalLink: e.target.value})}
                        placeholder="https://docs.google.com/forms/..."
                      />
                    </div>
                  </div>
                )}
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
                  className="flex-1 bg-emerald-600 text-white font-black py-4 rounded-xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 uppercase tracking-widest"
                >
                  Simpan Borang
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
