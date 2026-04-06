import React from 'react';
import { useStore } from '../store';
import { Phone, Hash, MapPin } from 'lucide-react';

export const Header: React.FC = () => {
  const { settings } = useStore();

  return (
    <header className="bg-slate-900 border-b-4 border-yellow-400 print:bg-white print:border-b-2 print:border-gray-300">
      {/* Top Bar with Logos and Main Title */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 px-4 py-6 md:py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Logos */}
          <div className="flex items-center gap-4">
            <img 
              src="https://iili.io/fPz8BXj.md.png" 
              alt="Logo 1" 
              className="h-16 md:h-24 object-contain drop-shadow-lg"
              referrerPolicy="no-referrer"
            />
            <img 
              src="https://iili.io/fPz8hIs.md.png" 
              alt="Logo 2" 
              className="h-16 md:h-24 object-contain drop-shadow-lg"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Center Text */}
          <div className="text-center flex-1">
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tighter leading-none mb-1 drop-shadow-md">
              JABATAN HAL EHWAL PELAJAR
            </h1>
            <h2 className="text-xl md:text-2xl font-bold text-yellow-400 tracking-tight drop-shadow-sm">
              KOLEJ VOKASIONAL BEAUFORT
            </h2>
          </div>

          {/* Right Logo */}
          <div className="flex items-center">
            <img 
              src="https://iili.io/fPzOUx4.md.png" 
              alt="Logo 3" 
              className="h-16 md:h-24 object-contain drop-shadow-lg"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="bg-slate-900 text-white py-3 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] md:text-xs font-medium tracking-wide uppercase">
          {/* School Info */}
          <div className="flex items-center gap-6 text-blue-200">
            <div className="flex items-center gap-2">
              <Hash className="w-3 h-3 text-yellow-400" />
              <span>Kod Sekolah: <span className="text-white font-bold">{settings.schoolCode}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3 h-3 text-yellow-400" />
              <span>No. Telefon: <span className="text-white font-bold">{settings.contactPhone}</span></span>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-center gap-2 text-gray-300 text-center md:text-right">
            <MapPin className="w-3 h-3 text-yellow-400 flex-shrink-0" />
            <span className="leading-tight">{settings.address}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
