import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Save, Image as ImageIcon } from 'lucide-react';

export const Tetapan: React.FC = () => {
  const { settings, updateSettings } = useStore();
  const [deptName, setDeptName] = useState(settings.departmentName);
  const [instName, setInstName] = useState(settings.institutionName);
  const [logo, setLogo] = useState(settings.logo);

  useEffect(() => {
    setDeptName(settings.departmentName);
    setInstName(settings.institutionName);
    setLogo(settings.logo);
  }, [settings]);

  const handleSave = () => {
    updateSettings({ departmentName: deptName, institutionName: instName, logo });
    alert('Tetapan berjaya disimpan!');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">⚙️ Tetapan Sistem</h2>
          <p className="text-gray-500 mt-1">Konfigurasi logo dan maklumat institusi</p>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Logo Institusi</h3>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {logo ? (
                <img src={logo} alt="Logo" className="w-40 h-40 object-contain rounded-2xl shadow-lg border" />
              ) : (
                <div className="w-40 h-40 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  KV
                </div>
              )}
              <div className="flex-1 text-center sm:text-left">
                <p className="text-gray-600 mb-4">Muat naik logo institusi (PNG/JPG)</p>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition cursor-pointer font-medium">
                  <ImageIcon className="w-5 h-5" /> Pilih Logo
                  <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleLogoUpload} />
                </label>
                <button onClick={() => setLogo(undefined)} className="ml-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition font-medium">Reset</button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Maklumat Institusi</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Jabatan</label>
                <input type="text" value={deptName} onChange={e => setDeptName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Institusi</label>
                <input type="text" value={instName} onChange={e => setInstName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
              </div>
              <button onClick={handleSave} className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium flex items-center justify-center gap-2">
                <Save className="w-5 h-5" /> Simpan Tetapan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
