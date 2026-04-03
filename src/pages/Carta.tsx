import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Trash2, Users, Download, Printer, Image as ImageIcon } from 'lucide-react';

export const Carta: React.FC = () => {
  const { orgPositions, addOrgPosition, deleteOrgPosition } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state
  const [position, setPosition] = useState('');
  const [name, setName] = useState('');
  const [level, setLevel] = useState('1');
  const [parentId, setParentId] = useState('');
  const [image, setImage] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const f = file as File;
      if (f.size > 500 * 1024) {
        alert('Saiz fail mesti kurang dari 500KB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(f);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addOrgPosition({
      position: position.toUpperCase(),
      name: name.toUpperCase(),
      level,
      parentId: parentId || undefined,
      image: image || undefined
    });
    setIsModalOpen(false);
    setPosition(''); setName(''); setLevel('1'); setParentId(''); setImage('');
  };

  const handlePrint = () => {
    window.focus();
    setTimeout(() => {
      try {
        window.print();
      } catch (e) {
        console.error('Print failed', e);
        alert('Gagal mencetak. Sila buka di tab baru.');
      }
    }, 200);
  };

  // Group positions by level for rendering
  const levels = ['1', '2', '3', '4', '5', '6'];

  return (
    <div className="p-4 lg:p-8 print:p-0">
      <div className="max-w-7xl mx-auto print:max-w-none">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 print:hidden">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">👥 Carta Organisasi JHEP</h2>
            <p className="text-gray-500 mt-1">Struktur organisasi Jabatan Hal Ehwal Pelajar</p>
          </div>
          <div className="flex gap-2 items-center">
            {window.self !== window.top && (
              <button onClick={() => window.open(window.location.href, '_blank')} className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2 text-sm shadow-sm transition-all active:scale-95">
                <Download className="w-4 h-4" /> Buka di Tab Baru
              </button>
            )}
            <button onClick={handlePrint} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 text-sm shadow-sm transition-all active:scale-95">
              <Printer className="w-4 h-4" /> Cetak / PDF
            </button>
            <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2">
              <Plus className="w-5 h-5" /> Tambah Jawatan
            </button>
          </div>
        </div>

        <div className="hidden print:block text-center mb-8 pt-6 border-b-2 border-black pb-4">
          <div className="flex justify-center gap-4 mb-4">
            <img src="https://iili.io/fPz8BXj.md.png" alt="Logo 1" className="h-20 object-contain" />
            <img src="https://iili.io/fPz8hIs.md.png" alt="Logo 2" className="h-20 object-contain" />
            <img src="https://iili.io/fPzOUx4.md.png" alt="Logo 3" className="h-20 object-contain" />
          </div>
          <h2 className="text-2xl font-bold uppercase">CARTA ORGANISASI</h2>
          <h3 className="text-xl font-bold uppercase">JABATAN HAL EHWAL PELAJAR</h3>
          <p className="font-semibold">KOLEJ VOKASIONAL BEAUFORT</p>
          <p className="text-sm mt-1">KM3, Jalan Beaufort - Sipitang, Peti Surat 1011, 89808 Beaufort, Sabah.</p>
          <p className="text-sm">Kod Sekolah: XHA3102 | Tel: 087-217014</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 overflow-x-auto print:shadow-none print:border-none print:p-0">
          <div className="min-w-[800px] flex flex-col items-center gap-12 py-8 print:py-0">
            {levels.map(lvl => {
              const positionsInLevel = orgPositions.filter(p => p.level === lvl);
              if (positionsInLevel.length === 0) return null;

              return (
                <div key={lvl} className="flex justify-center gap-8 relative w-full flex-wrap">
                  {/* Connectors to parent level (simplified) */}
                  {parseInt(lvl) > 1 && (
                    <div className="absolute -top-6 left-1/2 w-px h-6 bg-emerald-300"></div>
                  )}
                  {parseInt(lvl) > 1 && positionsInLevel.length > 1 && (
                    <div className="absolute -top-6 left-1/4 right-1/4 h-px bg-emerald-300"></div>
                  )}

                  {positionsInLevel.map(org => (
                    <div key={org.id} className="relative flex flex-col items-center group">
                      {/* Connector to child level (simplified) */}
                      {parseInt(lvl) < 6 && orgPositions.some(p => p.level === (parseInt(lvl) + 1).toString()) && (
                        <div className="absolute -bottom-6 left-1/2 w-px h-6 bg-emerald-300"></div>
                      )}

                      <div className="w-48 bg-white rounded-xl shadow-md border-2 border-emerald-100 p-4 text-center hover:border-emerald-300 transition relative print:shadow-none print:border-gray-300">
                        <button onClick={() => deleteOrgPosition(org.id)} className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition z-10 print:hidden">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        <div className="w-20 h-20 mx-auto bg-emerald-50 rounded-full border-4 border-white shadow-sm flex items-center justify-center mb-3 overflow-hidden print:border-gray-200 print:shadow-none">
                          {org.image ? (
                            <img src={org.image} alt={org.name} className="w-full h-full object-cover" />
                          ) : (
                            <Users className="w-8 h-8 text-emerald-300" />
                          )}
                        </div>
                        
                        <h4 className="font-bold text-sm text-gray-900 mb-1 leading-tight">{org.position}</h4>
                        <p className="text-xs text-emerald-600 font-medium print:text-gray-700">{org.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}

            {orgPositions.length === 0 && (
              <div className="text-center py-12 print:hidden">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Tiada jawatan dalam carta organisasi</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 print:hidden">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h3 className="font-bold text-xl mb-4">Tambah Jawatan</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jawatan *</label>
                <input required type="text" value={position} onChange={e => setPosition(e.target.value)} className="w-full px-4 py-2 border rounded-lg uppercase" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pemegang Jawatan *</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border rounded-lg uppercase" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Profil</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                    {image ? (
                      <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input type="file" id="profile-image" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    <label htmlFor="profile-image" className="cursor-pointer inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
                      Pilih Gambar
                    </label>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG (Max 500KB)</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tahap Hierarki *</label>
                <select required value={level} onChange={e => setLevel(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                  <option value="1">Tahap 1 - Pengarah</option>
                  <option value="2">Tahap 2 - G3</option>
                  <option value="3">Tahap 3 - Ketua Jabatan</option>
                  <option value="4">Tahap 4 - Ketua Unit</option>
                  <option value="5">Tahap 5 - Penyelaras</option>
                  <option value="6">Tahap 6 - Ahli Jawatankuasa</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border rounded-lg">Batal</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
