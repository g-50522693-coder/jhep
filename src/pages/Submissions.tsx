import React from 'react';
import { useStore } from '../store';
import { Inbox, User, Hash, Calendar, FileText, CheckCircle2, Clock, AlertCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Submissions: React.FC = () => {
  const { submissions, updateSubmission, deleteSubmission } = useStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'reviewed': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const handleStatusChange = (id: string, status: 'pending' | 'reviewed' | 'completed') => {
    updateSubmission(id, { status });
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Permohonan Pelajar</h1>
          <p className="text-gray-500 font-medium">Urus dan semak borang yang dihantar oleh pelajar.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          <div className="px-4 py-2 bg-amber-50 rounded-xl text-amber-700 text-sm font-bold border border-amber-100">
            {submissions.filter(s => s.status === 'pending').length} Baru
          </div>
          <div className="px-4 py-2 bg-blue-50 rounded-xl text-blue-700 text-sm font-bold border border-blue-100">
            {submissions.filter(s => s.status === 'reviewed').length} Disemak
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {submissions.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Inbox className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Tiada Permohonan</h3>
            <p className="text-gray-500">Semua permohonan pelajar akan dipaparkan di sini.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Pelajar</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Jenis Borang</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tarikh</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <AnimatePresence mode="popLayout">
                    {submissions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((sub) => (
                      <motion.tr 
                        key={sub.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="hover:bg-gray-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                              {sub.studentName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800">{sub.studentName}</p>
                              <p className="text-xs text-gray-500">{sub.studentId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-700 font-medium">
                            <FileText className="w-4 h-4 text-gray-400" />
                            {sub.formTitle}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {sub.submissionDate}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(sub.status)}`}>
                            {sub.status === 'pending' ? 'Menunggu' : sub.status === 'reviewed' ? 'Disemak' : 'Selesai'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <select 
                              value={sub.status}
                              onChange={(e) => handleStatusChange(sub.id, e.target.value as any)}
                              className="text-xs font-bold bg-gray-100 border-none rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="pending">Menunggu</option>
                              <option value="reviewed">Disemak</option>
                              <option value="completed">Selesai</option>
                            </select>
                            <button 
                              onClick={() => deleteSubmission(sub.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
