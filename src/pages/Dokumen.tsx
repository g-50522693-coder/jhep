import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Trash2, Folder, FileText, Download, File as FileIcon } from 'lucide-react';

export const Dokumen: React.FC = () => {
  const { documents, addDocument, updateDocument, deleteDocument } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<any>(null);
  const [filter, setFilter] = useState('all');
  
  // Form state
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [ref, setRef] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');

  const filteredDocuments = documents.filter(d => filter === 'all' || d.type === filter);

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
    const docData = {
      type,
      title: title.toUpperCase(),
      ref: ref.toUpperCase(),
      date,
      description: description.toUpperCase(),
      url: fileUrl || undefined
    };

    if (editingDocument) {
      updateDocument(editingDocument.id, docData);
    } else {
      addDocument(docData);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingDocument(null);
    setType(''); setTitle(''); setRef(''); setDate(''); setDescription(''); setFileUrl(''); setFileName('');
  };

  const handleEdit = (doc: any) => {
    setEditingDocument(doc);
    setType(doc.type);
    setTitle(doc.title);
    setRef(doc.ref || '');
    setDate(doc.date);
    setDescription(doc.description || '');
    setFileUrl(doc.url || '');
    setFileName(doc.url ? 'Fail Sedia Ada' : '');
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">📁 Dokumen JHEP</h2>
            <p className="text-gray-500 mt-1">Pengurusan fail, surat menyurat & dokumen penting</p>
          </div>
          <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2">
            <Plus className="w-5 h-5" /> Tambah Dokumen
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'Semua Dokumen' },
              { id: 'fail', label: 'Fail JHEP' },
              { id: 'surat_kpm', label: 'Surat KPM' },
              { id: 'memo', label: 'Memo' },
              { id: 'minit', label: 'Minit Mesyuarat' },
              { id: 'lain_lain', label: 'Lain-lain' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${filter === f.id ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDocuments.map(doc => (
            <div key={doc.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col group hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(doc)} className="text-blue-500 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition" title="Edit">
                    <FileText className="w-5 h-5" />
                  </button>
                  <button onClick={() => deleteDocument(doc.id)} className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition" title="Padam">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">{doc.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{doc.ref || 'Tiada Rujukan'}</p>
              <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                <span>{new Date(doc.date).toLocaleDateString('ms-MY')}</span>
                <span className="uppercase font-medium px-2 py-1 bg-gray-100 rounded-md">{doc.type.replace('_', ' ')}</span>
              </div>
              {doc.url && (
                <a href={doc.url} download={doc.title} className="mt-4 w-full py-2 bg-amber-50 text-amber-600 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-amber-100 transition">
                  <Download className="w-4 h-4" /> Muat Turun
                </a>
              )}
            </div>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Tiada dokumen dijumpai</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h3 className="font-bold text-xl mb-4">{editingDocument ? 'Kemaskini Dokumen' : 'Tambah Dokumen'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Dokumen *</label>
                <select required value={type} onChange={e => setType(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Pilih Jenis</option>
                  <option value="fail">Fail JHEP</option>
                  <option value="surat_kpm">Surat KPM</option>
                  <option value="memo">Memo</option>
                  <option value="minit">Minit Mesyuarat</option>
                  <option value="lain_lain">Lain-lain</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tajuk Dokumen *</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg uppercase" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No. Rujukan</label>
                  <input type="text" value={ref} onChange={e => setRef(e.target.value)} className="w-full px-4 py-2 border rounded-lg uppercase" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tarikh Dokumen *</label>
                  <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2 border rounded-lg uppercase" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fail Dokumen</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input type="file" id="document-file" accept=".pdf,.doc,.docx,.xls,.xlsx" className="hidden" onChange={handleFileUpload} />
                  <label htmlFor="document-file" className="cursor-pointer">
                    <FileIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 font-medium">{fileName || 'Klik untuk muat naik fail'}</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, Word, Excel (Max 5MB)</p>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="flex-1 px-4 py-2 border rounded-lg">Batal</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg">{editingDocument ? 'Kemaskini' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
