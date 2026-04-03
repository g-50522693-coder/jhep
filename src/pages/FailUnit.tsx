import React, { useState } from 'react';
import { useStore } from '../store';
import { FolderOpen, Plus, Trash2, FileText, Image as ImageIcon, Download, X } from 'lucide-react';

export const FailUnit: React.FC = () => {
  const { unitFiles, addUnitFile, updateUnitFile, deleteUnitFile } = useStore();
  const [currentUnit, setCurrentUnit] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<any>(null);
  const [viewFile, setViewFile] = useState<string | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');

  const units = [
    { id: 'INDUK JHEP', label: 'INDUK JHEP', color: 'from-yellow-50 to-yellow-100 border-yellow-300 text-yellow-800 bg-yellow-400' },
    { id: 'UNIT SUKAN DAN KOKURIKULUM', label: 'UNIT SUKAN', color: 'from-sky-50 to-sky-100 border-sky-300 text-sky-800 bg-sky-400' },
    { id: 'UNIT PSIKOLOGI DAN KERJAYA', label: 'UNIT KERJAYA', color: 'from-violet-50 to-violet-100 border-violet-300 text-violet-800 bg-violet-400' },
    { id: 'UNIT PENGURUSAN KOLEJ KEDIAMAN', label: 'UNIT KOLEJ', color: 'from-rose-50 to-rose-100 border-rose-300 text-rose-800 bg-rose-400' },
    { id: 'UNIT PENGURUSAN PELAJAR', label: 'UNIT PENGURUSAN PELAJAR', color: 'from-blue-50 to-blue-100 border-blue-300 text-blue-800 bg-blue-400' },
    { id: 'UPP - DISIPLIN', label: 'UPP - DISIPLIN', color: 'from-red-50 to-red-100 border-red-300 text-red-800 bg-red-400' },
    { id: 'UPP - MAJLIS PERWAKILAN PELAJAR', label: 'UPP - MPP', color: 'from-indigo-50 to-indigo-100 border-indigo-300 text-indigo-800 bg-indigo-400' },
    { id: 'UPP - KOORDINATOR DAN KELAS', label: 'UPP - KOORDINATOR DAN KELAS', color: 'from-pink-50 to-pink-100 border-pink-300 text-pink-800 bg-pink-400' },
    { id: 'UPP - PENGAMBILAN PELAJAR', label: 'UPP - PENGAMBILAN', color: 'from-cyan-50 to-cyan-100 border-cyan-300 text-cyan-800 bg-cyan-400' },
    { id: 'UPP - KESIHATAN', label: 'UPP - KESIHATAN', color: 'from-green-50 to-green-100 border-green-300 text-green-800 bg-green-400' },
    { id: 'UPP - KEBAJIKAN', label: 'UPP - KEBAJIKAN', color: 'from-amber-50 to-amber-100 border-amber-300 text-amber-800 bg-amber-400' },
    { id: 'UPP - BIASISWA DAN BANTUAN', label: 'UPP - BIASISWA', color: 'from-fuchsia-50 to-fuchsia-100 border-fuchsia-300 text-fuchsia-800 bg-fuchsia-400' },
    { id: 'UPP - PELAJAR LUAR', label: 'UPP - PELAJAR LUAR', color: 'from-purple-50 to-purple-100 border-purple-300 text-purple-800 bg-purple-400' },
    { id: 'UPP - DATA PELAJAR', label: 'UPP - DATA PELAJAR', color: 'from-teal-50 to-teal-100 border-teal-300 text-teal-800 bg-teal-400' },
    { id: 'UPP - LEMBAGA KOPERASI', label: 'UPP - KOPERASI', color: 'from-orange-50 to-orange-100 border-orange-300 text-orange-800 bg-orange-400' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Saiz fail mesti kurang dari 5MB');
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUnit) return;
    const fileData = {
      unitName: currentUnit,
      title: title.toUpperCase(),
      description: description.toUpperCase(),
      url: fileUrl || undefined
    };

    if (editingFile) {
      updateUnitFile(editingFile.id, fileData);
    } else {
      addUnitFile(fileData);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingFile(null);
    setTitle(''); setDescription(''); setFileUrl(''); setFileName('');
  };

  const handleEdit = (file: any) => {
    setEditingFile(file);
    setTitle(file.title);
    setDescription(file.description || '');
    setFileUrl(file.url || '');
    setFileName(file.url ? 'Fail Sedia Ada' : '');
    setIsModalOpen(true);
  };

  const currentFiles = unitFiles.filter(f => f.unitName === currentUnit);
  const selectedFile = unitFiles.find(f => f.id === viewFile);

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">📂 Fail Unit</h2>
            <p className="text-gray-500 mt-1">Pengurusan fail mengikut unit JHEP</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {units.map(unit => {
            const count = unitFiles.filter(f => f.unitName === unit.id).length;
            const bgGradient = unit.color.split(' ').find(c => c.startsWith('from-')) + ' ' + unit.color.split(' ').find(c => c.startsWith('to-'));
            const border = unit.color.split(' ').find(c => c.startsWith('border-'));
            const text = unit.color.split(' ').find(c => c.startsWith('text-'));
            const iconBg = unit.color.split(' ').find(c => c.startsWith('bg-'));

            return (
              <div
                key={unit.id}
                onClick={() => setCurrentUnit(unit.id)}
                className={`bg-gradient-to-br ${bgGradient} rounded-2xl shadow-sm border-2 ${border} p-6 cursor-pointer hover:shadow-lg hover:scale-105 transition-all`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                    <FolderOpen className={`w-8 h-8 ${text}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1 text-sm">{unit.label}</h3>
                    <p className="text-sm text-gray-600">{count} fail</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {currentUnit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <button onClick={() => setCurrentUnit(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <span className="text-2xl">&times;</span>
                </button>
                <div>
                  <h3 className="font-bold text-xl text-gray-800">{currentUnit}</h3>
                  <p className="text-sm text-gray-500">Fail & dokumen unit</p>
                </div>
              </div>
              <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
                <Plus className="w-5 h-5" /> Tambah Fail
              </button>
            </div>
            <div className="p-6">
              {currentFiles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentFiles.map(file => (
                    <div key={file.id} className="bg-white rounded-xl border-2 border-gray-200 p-4 hover:border-indigo-300 hover:shadow-md transition">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2 flex-1">
                          <FileText className="w-6 h-6 text-indigo-500 flex-shrink-0" />
                          <h4 className="font-semibold text-gray-800 text-sm line-clamp-2">{file.title}</h4>
                        </div>
                        <div className="flex items-center gap-1">
                          {file.url && (
                            <button onClick={() => setViewFile(file.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Lihat">
                              Lihat
                            </button>
                          )}
                          <button onClick={() => handleEdit(file)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Edit">
                            <FileText className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteUnitFile(file.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition" title="Padam">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {file.description && <p className="text-xs text-gray-500 mb-2 line-clamp-2">{file.description}</p>}
                      <p className="text-xs text-gray-400">{new Date(file.createdAt).toLocaleDateString('ms-MY')}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Tiada fail dalam folder ini</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6">
            <h3 className="font-bold text-xl mb-4">{editingFile ? 'Kemaskini Fail Unit' : `Tambah Fail Unit - ${currentUnit}`}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tajuk Fail *</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg uppercase" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2 border rounded-lg uppercase" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Fail *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input required type="file" id="unit-file" accept=".pdf,.doc,.docx,.xls,.xlsx,image/*" className="hidden" onChange={handleFileUpload} />
                  <label htmlFor="unit-file" className="cursor-pointer">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 font-medium">{fileName || 'Klik untuk muat naik fail'}</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, Word, Excel, Imej (Max 5MB)</p>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="flex-1 px-4 py-2 border rounded-lg">Batal</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg">{editingFile ? 'Kemaskini' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View File Modal */}
      {viewFile && selectedFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-800">{selectedFile.title}</h3>
              <div className="flex items-center gap-2">
                <a href={selectedFile.url} download={selectedFile.title} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  <Download className="w-5 h-5" />
                </a>
                <button onClick={() => setViewFile(null)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-gray-50 flex items-center justify-center min-h-[500px]">
              {selectedFile.url?.startsWith('data:image') ? (
                <img src={selectedFile.url} alt={selectedFile.title} className="max-w-full max-h-full object-contain" />
              ) : selectedFile.url?.startsWith('data:application/pdf') ? (
                <iframe src={selectedFile.url} className="w-full h-full min-h-[500px]" title={selectedFile.title} />
              ) : (
                <div className="text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Pratonton tidak tersedia untuk jenis fail ini.</p>
                  <a href={selectedFile.url} download={selectedFile.title} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Download className="w-4 h-4" /> Muat Turun Fail
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
