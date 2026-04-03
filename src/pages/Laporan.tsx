import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Trash2, FileText, Eye, X, Image as ImageIcon, Printer, Download } from 'lucide-react';

export const Laporan: React.FC = () => {
  const { reports, addReport, updateReport, deleteReport, activities } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<any>(null);
  const [viewReport, setViewReport] = useState<string | null>(null);
  
  // Form state
  const [programSource, setProgramSource] = useState('list');
  const [linkActivity, setLinkActivity] = useState('');
  const [programManual, setProgramManual] = useState('');
  const [unit, setUnit] = useState('');
  const [date, setDate] = useState('');
  const [place, setPlace] = useState('');
  const [involvement, setInvolvement] = useState('');
  const [feedback, setFeedback] = useState('');
  const [notes, setNotes] = useState('');
  const [issues, setIssues] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);

  const unitOptions = [
    "INDUK JHEP", "UNIT PENGURUSAN PELAJAR", "UPP - DISIPLIN", "UPP - MAJLIS PERWAKILAN PELAJAR",
    "UPP - KOORDINATOR DAN KELAS", "UPP - PENGAMBILAN PELAJAR", "UPP - KESIHATAN", "UPP - KEBAJIKAN",
    "UPP - BIASISWA DAN BANTUAN", "UPP - PELAJAR LUAR", "UPP - DATA PELAJAR", "UPP - LEMBAGA KOPERASI",
    "UNIT PENGURUSAN KOLEJ KEDIAMAN", "UNIT SUKAN DAN KOKURIKULUM", "UNIT PSIKOLOGI DAN KERJAYA"
  ];

  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (attachments.length + files.length > 3) {
      alert('Maksimum 3 gambar sahaja dibenarkan.');
      return;
    }

    files.forEach((file: any) => {
      if (file.size > 500 * 1024) {
        alert('Saiz fail mesti kurang dari 500KB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachments(prev => [...prev, event.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let programName = programManual.toUpperCase();
    if (programSource === 'list' && linkActivity) {
      const act = activities.find(a => a.id === linkActivity);
      if (act) {
        programName = act.name;
      }
    }

    const reportData = {
      programName,
      unit,
      date,
      place: place.toUpperCase(),
      involvement: involvement.toUpperCase(),
      feedback: feedback.toUpperCase(),
      notes: notes.toUpperCase(),
      issues: issues.toUpperCase(),
      attachments,
    };

    if (editingReport) {
      updateReport(editingReport.id, reportData);
    } else {
      addReport(reportData);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingReport(null);
    setProgramSource('list'); setLinkActivity(''); setProgramManual(''); setUnit('');
    setDate(''); setPlace(''); setInvolvement(''); setFeedback(''); setNotes(''); setIssues(''); setAttachments([]);
  };

  const handleEdit = (report: any) => {
    setEditingReport(report);
    setProgramSource('manual');
    setProgramManual(report.programName);
    setUnit(report.unit);
    setDate(report.date);
    setPlace(report.place);
    setInvolvement(report.involvement || '');
    setFeedback(report.feedback || '');
    setNotes(report.notes || '');
    setIssues(report.issues || '');
    setAttachments(report.attachments || []);
    setIsModalOpen(true);
  };

  const selectedReport = reports.find(r => r.id === viewReport);

  return (
    <div className="p-4 lg:p-8 print:p-0">
      <div className="max-w-7xl mx-auto print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">📝 Laporan Aktiviti / Program</h2>
            <p className="text-gray-500 mt-1">Dokumentasi dan laporan program JHEP</p>
          </div>
          <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2">
            <Plus className="w-5 h-5" /> Tambah Laporan
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {reports.map(report => (
            <div key={report.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(report)} className="text-blue-500 hover:text-blue-700 p-1" title="Edit">
                    <FileText className="w-5 h-5" />
                  </button>
                  <button onClick={() => setViewReport(report.id)} className="text-emerald-500 hover:text-emerald-700 p-1" title="Lihat">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button onClick={() => deleteReport(report.id)} className="text-red-500 hover:text-red-700 p-1" title="Padam">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">{report.programName}</h3>
              <p className="text-sm text-gray-500 mb-4">{report.unit}</p>
              <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between text-sm text-gray-500">
                <span>{new Date(report.date).toLocaleDateString('ms-MY')}</span>
                <span>{report.place}</span>
              </div>
            </div>
          ))}
        </div>

        {reports.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Tiada laporan aktiviti dijumpai</p>
            <button onClick={() => setIsModalOpen(true)} className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium">
              + Tambah Laporan Pertama
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 print:hidden">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <h3 className="font-bold text-xl mb-4">{editingReport ? 'Kemaskini Laporan Aktiviti' : 'Tambah Laporan Aktiviti'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Sumber Nama Program *</label>
                <div className="flex gap-4 mb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="program-source" value="list" checked={programSource === 'list'} onChange={() => setProgramSource('list')} className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm">Dari Senarai Takwim</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="program-source" value="manual" checked={programSource === 'manual'} onChange={() => setProgramSource('manual')} className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm">Taip Sendiri</span>
                  </label>
                </div>
              </div>

              {programSource === 'list' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Program *</label>
                  <select required value={linkActivity} onChange={e => {
                    setLinkActivity(e.target.value);
                    const act = activities.find(a => a.id === e.target.value);
                    if (act) setUnit(act.unit);
                  }} className="w-full px-4 py-2 border rounded-lg">
                    <option value="">Pilih aktiviti dari senarai</option>
                    {activities.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Program *</label>
                  <input required type="text" value={programManual} onChange={e => setProgramManual(e.target.value)} className="w-full px-4 py-2 border rounded-lg uppercase" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit / Jawatankuasa *</label>
                <select required value={unit} onChange={e => setUnit(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Pilih Unit</option>
                  {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tarikh *</label>
                  <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tempat *</label>
                  <input required type="text" value={place} onChange={e => setPlace(e.target.value)} className="w-full px-4 py-2 border rounded-lg uppercase" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Penglibatan</label>
                <textarea rows={2} value={involvement} onChange={e => setInvolvement(e.target.value)} className="w-full px-4 py-2 border rounded-lg uppercase" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ulasan & Cadangan Penambahbaikan</label>
                <textarea rows={3} value={feedback} onChange={e => setFeedback(e.target.value)} className="w-full px-4 py-2 border rounded-lg uppercase" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
                <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} className="w-full px-4 py-2 border rounded-lg uppercase" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Isu / Permasalahan</label>
                <textarea rows={2} value={issues} onChange={e => setIssues(e.target.value)} className="w-full px-4 py-2 border rounded-lg uppercase" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lampiran (Gambar)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input type="file" id="report-attachments" multiple accept="image/*" className="hidden" onChange={handleAttachmentUpload} />
                  <label htmlFor="report-attachments" className="cursor-pointer">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Klik untuk muat naik atau seret fail ke sini</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG (max 500KB setiap fail, maksimum 3 fail)</p>
                  </label>
                </div>
                {attachments.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {attachments.map((src, i) => (
                      <div key={i} className="relative group">
                        <img src={src} alt={`Lampiran ${i+1}`} className="w-full h-24 object-cover rounded-lg border" />
                        <button type="button" onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="flex-1 px-4 py-2 border rounded-lg">Batal</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg">{editingReport ? 'Kemaskini' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Report Modal */}
      {viewReport && selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 print:p-0 print:bg-white print:static print:inset-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:rounded-none">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10 print:hidden">
              <h3 className="font-bold text-xl text-gray-800">Laporan Aktiviti</h3>
              <div className="flex gap-2 items-center">
                {window.self !== window.top && (
                  <button onClick={() => window.open(window.location.href, '_blank')} className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2 text-sm shadow-sm transition-all active:scale-95">
                    <Download className="w-4 h-4" /> Buka di Tab Baru
                  </button>
                )}
                <button onClick={() => { 
                  window.focus(); 
                  setTimeout(() => {
                    try { window.print(); } catch(e) { alert('Gagal mencetak. Sila buka di tab baru.'); } 
                  }, 200);
                }} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 text-sm shadow-sm transition-all active:scale-95">
                  <Printer className="w-4 h-4" /> Cetak / PDF
                </button>
                <button onClick={() => setViewReport(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Print Header Template */}
            <div className="hidden print:block text-center border-b-2 border-black pb-4 mb-6 pt-8">
              <div className="flex justify-center gap-4 mb-4">
                <img src="https://iili.io/fPz8BXj.md.png" alt="Logo 1" className="h-20 object-contain" />
                <img src="https://iili.io/fPz8hIs.md.png" alt="Logo 2" className="h-20 object-contain" />
                <img src="https://iili.io/fPzOUx4.md.png" alt="Logo 3" className="h-20 object-contain" />
              </div>
              <h1 className="text-2xl font-bold uppercase">JABATAN HAL EHWAL PELAJAR</h1>
              <h2 className="text-xl font-bold uppercase">KOLEJ VOKASIONAL BEAUFORT</h2>
              <p className="text-sm mt-2">KM3, Jalan Beaufort - Sipitang, Peti Surat 1011, 89808 Beaufort, Sabah.</p>
              <p className="text-sm">Kod Sekolah: XHA3102 | Tel: 087-217014</p>
            </div>

            <div className="p-6 space-y-6 print:p-0">
              <div className="text-center border-b pb-6 print:border-none print:pb-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 uppercase underline decoration-2 underline-offset-4">{selectedReport.programName}</h2>
                <p className="text-gray-800 font-bold text-lg uppercase">{selectedReport.unit}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl print:bg-white print:border print:border-gray-300 print:rounded-none">
                <div>
                  <p className="text-sm text-gray-500 mb-1 print:text-black print:font-bold">Tarikh</p>
                  <p className="font-semibold">{new Date(selectedReport.date).toLocaleDateString('ms-MY')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1 print:text-black print:font-bold">Tempat</p>
                  <p className="font-semibold">{selectedReport.place}</p>
                </div>
              </div>

              {selectedReport.involvement && (
                <div className="print:break-inside-avoid">
                  <h4 className="font-bold text-gray-800 mb-2 border-b pb-1 print:border-black">Penglibatan</h4>
                  <p className="text-gray-700 whitespace-pre-wrap print:text-black">{selectedReport.involvement}</p>
                </div>
              )}

              {selectedReport.feedback && (
                <div className="print:break-inside-avoid">
                  <h4 className="font-bold text-gray-800 mb-2 border-b pb-1 print:border-black">Ulasan & Cadangan</h4>
                  <p className="text-gray-700 whitespace-pre-wrap print:text-black">{selectedReport.feedback}</p>
                </div>
              )}

              {selectedReport.issues && (
                <div className="print:break-inside-avoid">
                  <h4 className="font-bold text-gray-800 mb-2 border-b pb-1 print:border-black">Isu / Permasalahan</h4>
                  <p className="text-gray-700 whitespace-pre-wrap print:text-black">{selectedReport.issues}</p>
                </div>
              )}

              {selectedReport.notes && (
                <div className="print:break-inside-avoid">
                  <h4 className="font-bold text-gray-800 mb-2 border-b pb-1 print:border-black">Catatan</h4>
                  <p className="text-gray-700 whitespace-pre-wrap print:text-black">{selectedReport.notes}</p>
                </div>
              )}

              {selectedReport.attachments && selectedReport.attachments.length > 0 && (
                <div className="print:break-before-page">
                  <h4 className="font-bold text-gray-800 mb-4 border-b pb-1 print:border-black">Lampiran</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 print:grid-cols-2">
                    {selectedReport.attachments.map((src, i) => (
                      <img key={i} src={src} alt={`Lampiran ${i+1}`} className="w-full h-48 object-cover rounded-xl border shadow-sm print:h-64 print:rounded-none print:border-gray-300" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
