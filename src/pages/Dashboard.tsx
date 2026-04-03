import React from 'react';
import { useStore } from '../store';
import { Calendar, FileText, Users, Folder, FolderOpen } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { activities, reports, orgPositions, documents, unitFiles } = useStore();

  const stats = [
    { label: 'Jumlah Aktiviti', value: activities.length, icon: Calendar, color: 'bg-blue-500' },
    { label: 'Jumlah Laporan', value: reports.length, icon: FileText, color: 'bg-emerald-500' },
    { label: 'Ahli Organisasi', value: orgPositions.length, icon: Users, color: 'bg-purple-500' },
    { label: 'Dokumen JHEP', value: documents.length, icon: Folder, color: 'bg-amber-500' },
    { label: 'Fail Unit', value: unitFiles.length, icon: FolderOpen, color: 'bg-indigo-500' },
  ];

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Dashboard */}
        <div className="bg-gradient-to-r from-[#000033] via-[#0033cc] to-[#ffcc00] rounded-2xl shadow-xl overflow-hidden text-white">
          <div className="p-6 lg:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 bg-black/20">
            
            {/* Logos */}
            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm shrink-0">
              <img src="https://iili.io/fPz8BXj.md.png" alt="Logo 1" className="h-12 md:h-16 object-contain" />
              <img src="https://iili.io/fPz8hIs.md.png" alt="Logo 2" className="h-12 md:h-16 object-contain" />
              <img src="https://iili.io/fPzOUx4.md.png" alt="Logo 3" className="h-12 md:h-16 object-contain" />
            </div>

            {/* Title and Address */}
            <div className="flex-1 text-center md:text-left flex flex-col justify-center w-full">
              
              <div className="mb-3">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold drop-shadow-md tracking-wide">
                  JABATAN HAL EHWAL PELAJAR
                </h1>
                <h2 className="text-lg md:text-xl font-semibold drop-shadow-md text-yellow-300">
                  KOLEJ VOKASIONAL BEAUFORT
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 text-xs md:text-sm text-blue-100/90">
                <div className="text-left">
                  <p>Kod sekolah : XHA3102</p>
                  <p>No telefon : 087-217014</p>
                </div>
                <div className="hidden sm:block w-px bg-white/30"></div>
                <div className="text-left">
                  <p>Kolej Vokasional Beaufort, KM3, Jalan Beaufort - Sipitang</p>
                  <p>Peti Surat 1011, 89808 Beaufort, Sabah.</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Statistics */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Statistik Penggunaan Sistem</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
