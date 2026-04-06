import React, { useState } from 'react';
import { useStore } from '../store';
import { FileDown, Upload, CheckCircle2, AlertCircle, FileText, User, Hash, Calendar, Plus, Trash2, ArrowLeft, MapPin, Phone, Mail, Facebook, Music2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from '../components/Header';

export const StudentPortal: React.FC = () => {
  const { studentForms, addSubmission } = useStore();
  const [showSubmitModal, setShowSubmitModal] = useState<string | null>(null);
  const [submission, setSubmission] = useState({ studentName: '', studentId: '', fileData: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSubmission({ ...submission, fileData: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showSubmitModal) return;

    addSubmission({
      ...submission,
      formTitle: showSubmitModal,
      submissionDate: new Date().toLocaleDateString('ms-MY'),
      status: 'pending',
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowSubmitModal(null);
      setSubmission({ studentName: '', studentId: '', fileData: '' });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Hero Section */}
      <div className="bg-blue-900 text-white py-12 px-4 border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('navigate-portal', { detail: 'public' }))}
              className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-4 font-bold uppercase tracking-widest text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Portal Umum
            </button>
            <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">Portal Pelajar JHEP</h1>
            <p className="text-blue-100 text-lg font-medium">Pusat muat turun borang rasmi dan penghantaran permohonan digital.</p>
          </div>
          <div className="flex items-center gap-4">
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 w-full flex-grow">
          {studentForms.length === 0 ? (
            <div className="col-span-full bg-white rounded-3xl p-16 text-center border-2 border-dashed border-gray-200">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Tiada Borang Tersedia</h3>
              <p className="text-gray-500 max-w-sm mx-auto">Pihak JHEP belum memuat naik sebarang borang buat masa ini. Sila semak semula nanti.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentForms.map((form) => (
                <motion.div
                  key={form.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-blue-50 transition-all group relative"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-4 bg-blue-50 rounded-2xl group-hover:bg-blue-600 transition-colors">
                      <FileText className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{form.title}</h3>
                  <p className="text-gray-500 mb-8 leading-relaxed line-clamp-2">{form.description}</p>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    {form.fileData ? (
                      <a 
                        href={form.fileData} 
                        download={form.title}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-all"
                      >
                        <FileDown className="w-5 h-5" />
                        Muat Turun
                      </a>
                    ) : form.externalLink ? (
                      <a 
                        href={form.externalLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-3 rounded-xl transition-all"
                      >
                        <ExternalLink className="w-5 h-5" />
                        Pautan Borang
                      </a>
                    ) : (
                      <button disabled className="flex-1 bg-gray-50 text-gray-400 font-bold py-3 rounded-xl cursor-not-allowed">
                        Tiada Fail
                      </button>
                    )}
                    <button 
                      onClick={() => setShowSubmitModal(form.title)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-100"
                    >
                      <Upload className="w-5 h-5" />
                      Hantar Borang
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white border-t-8 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-4 text-yellow-400">TENTANG JHEP</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Jabatan Hal Ehwal Pelajar (JHEP) bertanggungjawab menguruskan kebajikan, disiplin, dan aktiviti kokurikulum pelajar Kolej Vokasional Beaufort.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-yellow-400 uppercase">Hubungi Kami</h3>
              <div className="space-y-3 text-sm text-gray-400">
                <p className="flex items-start gap-2"><MapPin className="w-4 h-4 text-yellow-400 flex-shrink-0" /> Kolej Vokasional Beaufort, KM3, Jalan Beaufort - Sipitang, Peti Surat 1011, 89808 Beaufort, Sabah.</p>
                <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-yellow-400" /> 087-217014</p>
                <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-yellow-400" /> kvbeaufort@moe.edu.my</p>
                <p className="flex items-center gap-2 font-bold text-yellow-400/80 tracking-widest"><Hash className="w-4 h-4" /> XHA3102</p>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end justify-center">
              <div className="flex gap-4 mb-4">
                <a href="https://www.facebook.com/kolejvokasionalbeaufort" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://www.tiktok.com/@kvbeaufort" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 hover:bg-rose-600 rounded-lg flex items-center justify-center transition-all">
                  <Music2 className="w-5 h-5" />
                </a>
              </div>
              <p className="text-[10px] text-gray-500 font-black tracking-widest uppercase">© 2026 JHEP KV BEAUFORT</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">Hantar Borang</h3>
                <p className="text-blue-100 text-sm mt-1">{showSubmitModal}</p>
              </div>
              <button onClick={() => setShowSubmitModal(null)} className="hover:bg-white/20 p-2 rounded-xl transition-colors">
                <Plus className="w-8 h-8 rotate-45" />
              </button>
            </div>

            <div className="p-8">
              {submitted ? (
                <div className="py-12 text-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                  </motion.div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-2">Penghantaran Berjaya!</h4>
                  <p className="text-gray-500">Permohonan anda telah diterima dan akan diproses oleh JHEP.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                        <User className="w-4 h-4 text-blue-600" />
                        Nama Penuh
                      </label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                        value={submission.studentName}
                        onChange={e => setSubmission({...submission, studentName: e.target.value})}
                        placeholder="Contoh: Ahmad Bin Ali"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                        <Hash className="w-4 h-4 text-blue-600" />
                        No. Kad Pengenalan
                      </label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                        value={submission.studentId}
                        onChange={e => setSubmission({...submission, studentId: e.target.value})}
                        placeholder="000000-00-0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                      <Upload className="w-4 h-4 text-blue-600" />
                      Muat Naik Fail (PDF/Imej)
                    </label>
                    <div className="relative group">
                      <input 
                        required
                        type="file" 
                        accept=".pdf,image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${submission.fileData ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 group-hover:border-blue-400 group-hover:bg-blue-50'}`}>
                        {submission.fileData ? (
                          <div className="flex items-center justify-center gap-3 text-emerald-600 font-bold">
                            <CheckCircle2 className="w-6 h-6" />
                            Fail Sedia Untuk Dihantar
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="w-8 h-8 text-gray-300 mx-auto" />
                            <p className="text-sm font-bold text-gray-500">Klik atau seret fail ke sini</p>
                            <p className="text-xs text-gray-400">Saiz maksimum: 5MB</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-2xl p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <p className="text-xs text-blue-700 leading-relaxed">Pastikan semua maklumat adalah benar sebelum menghantar. Pihak JHEP berhak menolak permohonan yang tidak lengkap.</p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button"
                      onClick={() => setShowSubmitModal(null)}
                      className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                    >
                      Hantar Sekarang
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
