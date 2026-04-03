import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Trash2, ChevronLeft, ChevronRight, Download, Printer, FileText } from 'lucide-react';

export const Takwim: React.FC = () => {
  const { activities, addActivity, updateActivity, deleteActivity } = useStore();
  const [year, setYear] = useState('2026');
  const [unitFilter, setUnitFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<any>(null);
  const [calendarPage, setCalendarPage] = useState(0);
  
  // Form state
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [months, setMonths] = useState<string[]>([]);
  const [unit, setUnit] = useState('');
  const [action, setAction] = useState('');
  const [status, setStatus] = useState('DALAM PERANCANGAN');
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

  const filteredActivities = activities.filter(a => {
    if (unitFilter && a.unit !== unitFilter) return false;
    return true;
  }).sort((a, b) => {
    const getFirstMonth = (months: string[]) => {
      if (months.includes('all')) return 0;
      if (months.length === 0) return 12;
      return Math.min(...months.map(m => parseInt(m)));
    };
    return getFirstMonth(a.months) - getFirstMonth(b.months);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const activityData = {
      name: name.toUpperCase(),
      date,
      months: months.length > 0 ? months : ['all'],
      unit,
      action: action.toUpperCase(),
      status
    };

    if (editingActivity) {
      updateActivity(editingActivity.id, activityData);
    } else {
      addActivity(activityData);
    }
    
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingActivity(null);
    setName(''); setDate(''); setMonths([]); setUnit(''); setAction(''); setStatus('DALAM PERANCANGAN');
  };

  const handleEdit = (activity: any) => {
    setEditingActivity(activity);
    setName(activity.name);
    setDate(activity.date || '');
    setMonths(activity.months);
    setUnit(activity.unit);
    setAction(activity.action || '');
    setStatus(activity.status);
    setIsModalOpen(true);
  };

  const unitOptions = [
    "INDUK JHEP", "UNIT PENGURUSAN PELAJAR", "UPP - DISIPLIN", "UPP - MAJLIS PERWAKILAN PELAJAR",
    "UPP - KOORDINATOR DAN KELAS", "UPP - PENGAMBILAN PELAJAR", "UPP - KESIHATAN", "UPP - KEBAJIKAN",
    "UPP - BIASISWA DAN BANTUAN", "UPP - PELAJAR LUAR", "UPP - DATA PELAJAR", "UPP - LEMBAGA KOPERASI",
    "UNIT PENGURUSAN KOLEJ KEDIAMAN", "UNIT SUKAN DAN KOKURIKULUM", "UNIT PSIKOLOGI DAN KERJAYA"
  ];

  const monthNames = ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'];

  const publicHolidays: Record<number, { date: number, name: string }[]> = {
    0: [{ date: 1, name: "Tahun Baru" }],
    1: [{ date: 17, name: "Tahun Baru Cina" }, { date: 18, name: "Tahun Baru Cina (Hari Ke-2)" }],
    2: [{ date: 20, name: "Hari Raya Aidilfitri*" }, { date: 21, name: "Hari Raya Aidilfitri (Hari Ke-2)*" }],
    3: [{ date: 3, name: "Good Friday" }],
    4: [{ date: 1, name: "Hari Pekerja" }, { date: 27, name: "Hari Raya Aidiladha*" }, { date: 30, name: "Pesta Kaamatan" }, { date: 31, name: "Pesta Kaamatan (Hari Ke-2)" }, { date: 31, name: "Hari Wesak" }],
    5: [{ date: 6, name: "Hari Keputeraan YDP Agong" }, { date: 17, name: "Awal Muharram" }],
    6: [],
    7: [{ date: 26, name: "Maulidur Rasul" }, { date: 31, name: "Hari Kebangsaan" }],
    8: [{ date: 16, name: "Hari Malaysia" }],
    9: [{ date: 3, name: "Hari Jadi TYT Sabah" }],
    10: [{ date: 8, name: "Deepavali*" }],
    11: [{ date: 25, name: "Hari Krismas" }]
  };

  const toggleMonth = (month: string) => {
    if (month === 'all') {
      if (months.length === 12) setMonths([]);
      else setMonths(monthNames.map((_, i) => (i + 1).toString()));
    } else {
      if (months.includes(month)) setMonths(months.filter(m => m !== month));
      else setMonths([...months, month]);
    }
  };

  const renderCalendarMonth = (monthIndex: number) => {
    const daysInMonth = new Date(parseInt(year), monthIndex + 1, 0).getDate();
    const firstDay = new Date(parseInt(year), monthIndex, 1).getDay();
    const monthActivities = filteredActivities.filter(a => a.months.includes((monthIndex + 1).toString()) || a.months.includes('all'));

    return (
      <div key={monthIndex} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 min-w-[300px] flex-1">
        <h4 className="font-bold text-lg text-center mb-4 text-blue-800">{monthNames[monthIndex]}</h4>
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500 mb-2">
          <div>Aha</div><div>Isn</div><div>Sel</div><div>Rab</div><div>Kha</div><div>Jum</div><div>Sab</div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-sm">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} className="p-2"></div>)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const hasActivity = monthActivities.some(a => {
              if (!a.date) return false;
              const d = new Date(a.date);
              return d.getDate() === day && d.getMonth() === monthIndex;
            });
            return (
              <div key={day} className={`p-2 rounded-lg flex items-center justify-center ${hasActivity ? 'bg-blue-100 text-blue-800 font-bold border border-blue-300' : 'hover:bg-gray-50'}`}>
                {day}
              </div>
            );
          })}
        </div>
        {publicHolidays[monthIndex] && publicHolidays[monthIndex].length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs font-bold text-red-500 mb-1">Cuti Umum:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              {publicHolidays[monthIndex].map((h, i) => (
                <li key={i} className="flex justify-between items-start">
                  <span className="font-semibold whitespace-nowrap mr-2">{h.date} {monthNames[monthIndex].substring(0,3)}</span>
                  <span className="text-right text-gray-500 leading-tight">{h.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const handlePrint = () => {
    window.focus();
    setTimeout(() => {
      try {
        const isPrinted = window.print();
        // Some browsers return undefined, some return void
      } catch (e) {
        console.error('Print failed', e);
        alert('Gagal mencetak. Sila pastikan anda membenarkan pop-up atau klik butang "Buka di Tab Baru".');
      }
    }, 200);
  };

  const openInNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  const getUnitColor = (unit: string) => {
    const colors: Record<string, string> = {
      "INDUK JHEP": "bg-yellow-100",
      "UNIT SUKAN DAN KOKURIKULUM": "bg-sky-100",
      "UNIT PSIKOLOGI DAN KERJAYA": "bg-violet-100",
      "UNIT PENGURUSAN KOLEJ KEDIAMAN": "bg-rose-100",
      "UNIT PENGURUSAN PELAJAR": "bg-blue-100",
      "UPP - DISIPLIN": "bg-red-100",
      "UPP - MAJLIS PERWAKILAN PELAJAR": "bg-indigo-100",
      "UPP - KOORDINATOR DAN KELAS": "bg-pink-100",
      "UPP - PENGAMBILAN PELAJAR": "bg-cyan-100",
      "UPP - KESIHATAN": "bg-green-100",
      "UPP - KEBAJIKAN": "bg-amber-100",
      "UPP - BIASISWA DAN BANTUAN": "bg-fuchsia-100",
      "UPP - PELAJAR LUAR": "bg-purple-100",
      "UPP - DATA PELAJAR": "bg-teal-100",
      "UPP - LEMBAGA KOPERASI": "bg-orange-100",
    };
    return colors[unit] || "bg-white";
  };

  return (
    <div className="p-4 lg:p-8 print:p-0">
      <div className="max-w-7xl mx-auto print:max-w-none">
        <div className="bg-white rounded-2xl shadow-lg border-2 border-yellow-400 p-6 mb-8 print:hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 text-center sm:text-left">
              JABATAN HAL EHWAL PELAJAR (JHEP)<br/>
              KOLEJ VOKASIONAL BEAUFORT
            </h2>
            {window.self !== window.top && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 font-medium">
                ⚠️ Nota: Jika butang cetak tidak berfungsi, sila buka aplikasi di tab baru menggunakan ikon di penjuru kanan atas pelayar anda.
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6 pt-6 border-t border-gray-200">
            <select value={year} onChange={e => setYear(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg">
              {Array.from({ length: 15 }).map((_, i) => (
                <option key={2026 + i} value={2026 + i}>{2026 + i}</option>
              ))}
            </select>
            <select value={unitFilter} onChange={e => setUnitFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg">
              <option value="">Semua Unit</option>
              {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Plus className="w-5 h-5" /> Tambah Aktiviti
            </button>
          </div>
        </div>

        {/* Calendar Carousel */}
        <div className="relative mb-8 print:hidden">
          <button onClick={() => setCalendarPage(p => Math.max(0, p - 1))} disabled={calendarPage === 0} className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 w-10 h-10 bg-white border-2 border-blue-500 text-blue-600 rounded-full shadow-lg hover:bg-blue-50 flex items-center justify-center disabled:opacity-50">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={() => setCalendarPage(p => Math.min(3, p + 1))} disabled={calendarPage === 3} className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 w-10 h-10 bg-white border-2 border-blue-500 text-blue-600 rounded-full shadow-lg hover:bg-blue-50 flex items-center justify-center disabled:opacity-50">
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out gap-4" style={{ transform: `translateX(-${calendarPage * 100}%)` }}>
              <div className="flex gap-4 min-w-full">
                {renderCalendarMonth(0)}{renderCalendarMonth(1)}{renderCalendarMonth(2)}
              </div>
              <div className="flex gap-4 min-w-full">
                {renderCalendarMonth(3)}{renderCalendarMonth(4)}{renderCalendarMonth(5)}
              </div>
              <div className="flex gap-4 min-w-full">
                {renderCalendarMonth(6)}{renderCalendarMonth(7)}{renderCalendarMonth(8)}
              </div>
              <div className="flex gap-4 min-w-full">
                {renderCalendarMonth(9)}{renderCalendarMonth(10)}{renderCalendarMonth(11)}
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {[0, 1, 2, 3].map(i => (
              <button key={i} onClick={() => setCalendarPage(i)} className={`w-2 h-2 rounded-full transition ${calendarPage === i ? 'bg-blue-600' : 'bg-gray-300'}`} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border-none print:rounded-none" id="print-area">
          <div className="p-4 lg:p-6 border-b border-gray-200 flex justify-between items-center print:hidden">
            <h3 className="font-bold text-lg text-gray-800">SENARAI AKTIVITI {year}</h3>
            <div className="flex gap-2">
              {window.self !== window.top && (
                <button onClick={openInNewTab} className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2 text-sm shadow-sm transition-all active:scale-95">
                  <Download className="w-4 h-4" /> Buka di Tab Baru
                </button>
              )}
              <button onClick={handlePrint} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 text-sm shadow-sm transition-all active:scale-95">
                <Printer className="w-4 h-4" /> Cetak / PDF
              </button>
            </div>
          </div>
          <div className="hidden print:block text-center mb-6 pt-6 border-b-2 border-black pb-4">
            <div className="flex justify-center gap-4 mb-4">
              <img src="https://iili.io/fPz8BXj.md.png" alt="Logo 1" className="h-20 object-contain" />
              <img src="https://iili.io/fPz8hIs.md.png" alt="Logo 2" className="h-20 object-contain" />
              <img src="https://iili.io/fPzOUx4.md.png" alt="Logo 3" className="h-20 object-contain" />
            </div>
            <h2 className="text-2xl font-bold uppercase">SENARAI AKTIVITI TAHUN {year}</h2>
            <h3 className="text-xl font-bold uppercase">JABATAN HAL EHWAL PELAJAR</h3>
            <p className="font-semibold">KOLEJ VOKASIONAL BEAUFORT</p>
            <p className="text-sm mt-1">KM3, Jalan Beaufort - Sipitang, Peti Surat 1011, 89808 Beaufort, Sabah.</p>
            <p className="text-sm">Kod Sekolah: XHA3102 | Tel: 087-217014</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50 print:bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase border-b print:border-gray-400">Bulan</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase border-b print:border-gray-400">Tarikh</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase border-b print:border-gray-400">Aktiviti</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase border-b print:border-gray-400">Unit</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase border-b print:border-gray-400">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase border-b print:border-gray-400 print:hidden">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 print:divide-gray-400">
                {filteredActivities.map(activity => (
                  <tr key={activity.id} className={`${getUnitColor(activity.unit)}`}>
                    <td className="px-6 py-4 text-sm text-gray-700 print:text-black print:border-b print:border-gray-400">
                      {activity.months.includes('all') ? 'JAN - DIS' : activity.months.map(m => monthNames[parseInt(m)-1]).join(', ')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 print:text-black print:border-b print:border-gray-400">{activity.date ? new Date(activity.date).toLocaleDateString('ms-MY') : '-'}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 print:text-black print:border-b print:border-gray-400">{activity.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 print:text-black print:border-b print:border-gray-400">{activity.unit}</td>
                    <td className="px-6 py-4 text-sm print:border-b print:border-gray-400">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full print:bg-transparent print:text-black ${
                        activity.status === 'SELESAI' ? 'bg-green-200 text-green-900' :
                        activity.status === 'SEDANG BERJALAN' ? 'bg-blue-200 text-blue-900' :
                        'bg-yellow-200 text-yellow-900'
                      }`}>
                        {activity.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 print:hidden">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(activity)} className="text-blue-600 hover:text-blue-900 p-1 bg-white/50 rounded-md" title="Edit">
                          <FileText className="w-5 h-5" />
                        </button>
                        <button onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'laporan' }))} className="text-emerald-700 hover:text-emerald-900 flex items-center gap-1 bg-white/50 px-2 py-1 rounded-md" title="Laporan">
                          <FileText className="w-4 h-4" /> Laporan
                        </button>
                        <button onClick={() => deleteActivity(activity.id)} className="text-red-600 hover:text-red-900 p-1 bg-white/50 rounded-md" title="Padam">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredActivities.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 print:border-b print:border-gray-400">
                      Tiada aktiviti dijumpai
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h3 className="font-bold text-xl mb-4">{editingActivity ? 'Kemaskini Aktiviti' : 'Tambah Aktiviti Baru'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Aktiviti *</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border rounded-lg uppercase" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tarikh (Tidak Wajib)</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bulan *</label>
                <button type="button" onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)} className="w-full px-4 py-2 border rounded-lg text-left bg-white flex justify-between items-center">
                  <span className={months.length === 0 ? 'text-gray-500' : 'text-gray-900'}>
                    {months.length === 0 ? 'Pilih bulan...' : months.length === 12 ? 'JAN - DIS' : months.map(m => monthNames[parseInt(m)-1]).join(', ')}
                  </span>
                </button>
                {isMonthDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <label className="flex items-center px-4 py-2.5 hover:bg-blue-50 cursor-pointer border-b-2 border-blue-200 bg-blue-50">
                      <input type="checkbox" checked={months.length === 12} onChange={() => toggleMonth('all')} className="mr-3" />
                      <span className="font-bold text-blue-700">✓ SEPANJANG TAHUN (JAN - DIS)</span>
                    </label>
                    {monthNames.map((m, i) => (
                      <label key={i} className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" checked={months.includes((i + 1).toString())} onChange={() => toggleMonth((i + 1).toString())} className="mr-3" />
                        <span>{m}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
                <select required value={unit} onChange={e => setUnit(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Pilih Unit</option>
                  {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tindakan</label>
                <textarea rows={2} value={action} onChange={e => setAction(e.target.value)} className="w-full px-4 py-2 border rounded-lg uppercase" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                  <option value="SELESAI">SELESAI</option>
                  <option value="SEDANG BERJALAN">SEDANG BERJALAN</option>
                  <option value="DALAM PERANCANGAN">DALAM PERANCANGAN</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="flex-1 px-4 py-2 border rounded-lg">Batal</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg">{editingActivity ? 'Kemaskini' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
