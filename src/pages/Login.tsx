import React, { useState } from 'react';
import { useStore } from '../store';
import { LogIn, Lock, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Header } from '../components/Header';

export const Login: React.FC = () => {
  const { login } = useStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      window.dispatchEvent(new CustomEvent('navigate-portal', { detail: 'lecturer' }));
    } else {
      setError('Kata laluan salah. Sila cuba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/10">
            <div className="bg-blue-900 p-8 text-center border-b-4 border-yellow-400">
              <div className="w-20 h-20 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <ShieldCheck className="w-10 h-10 text-blue-900" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Log Masuk Pensyarah</h2>
              <p className="text-blue-200 text-sm font-medium mt-1 uppercase tracking-widest">Akses Jabatan Hal Ehwal Pelajar</p>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Kata Laluan</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                      required
                      type="password" 
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-blue-900 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Masukkan kata laluan"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 italic">* Masukkan kata laluan jabatan untuk akses.</p>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-rose-600 bg-rose-50 p-4 rounded-2xl border border-rose-100"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-bold">{error}</p>
                  </motion.div>
                )}

                <button 
                  type="submit"
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-100 hover:shadow-blue-200 active:scale-[0.98] uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  Log Masuk
                </button>
              </form>

              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('navigate-portal', { detail: 'public' }))}
                className="w-full mt-6 flex items-center justify-center gap-2 text-gray-500 hover:text-blue-900 font-bold transition-colors py-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Portal Umum
              </button>
            </div>
          </div>
          
          <p className="text-center text-blue-300 text-xs mt-8 font-bold uppercase tracking-widest opacity-50">
            Sistem Pengurusan JHEP © 2026
          </p>
        </motion.div>
      </div>
    </div>
  );
};
