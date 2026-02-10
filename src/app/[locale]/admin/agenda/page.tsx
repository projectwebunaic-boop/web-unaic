"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2, Edit, Search, Calendar, MapPin, Clock, Upload, Image as ImageIcon } from "lucide-react";

interface AgendaItem {
    id: string;
    title: string;
    titleEn?: string;
    slug: string;
    date: string;
    time: string;
    location: string;
    locationEn?: string;
    category: string;
    thumbnail: string;
    description: string;
    descriptionEn?: string;
}

const CATEGORIES = ["Akademik", "Event", "Rapat", "Kemahasiswaan", "Lainnya"];

export default function AdminAgendaPage() {
    const [agendas, setAgendas] = useState<AgendaItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [filterCategory, setFilterCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [uploadingState, setUploadingState] = useState(false);

    // Form State
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<AgendaItem>>({});

    const translateField = async (text: string, callback: (translated: string) => void) => {
        if (!text) return;
        try {
            const res = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, targetLanguage: 'English' })
            });
            const data = await res.json();
            if (data.translatedText) {
                callback(data.translatedText);
            }
        } catch (error) {
            console.error("Translation failed", error);
            alert("Gagal menerjemahkan.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/agenda', { cache: 'no-store' });
            const json = await res.json();
            setAgendas(json);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.title || !formData.date || !formData.category) {
            alert("Judul, Tanggal, dan Kategori wajib diisi.");
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/agenda', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Gagal menyimpan data');
            alert('Agenda berhasil disimpan!');
            setIsEditing(false);
            setFormData({});
            fetchData();
        } catch (e: any) {
            alert('Gagal menyimpan: ' + e.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus agenda ini?")) return;
        try {
            const res = await fetch('/api/admin/agenda', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, type: 'DELETE' })
            });
            if (!res.ok) throw new Error('Gagal menghapus');
            fetchData();
        } catch (e: any) {
            alert('Gagal menghapus: ' + e.message);
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        setUploadingState(true);

        const formDataFile = new FormData();
        formDataFile.append('file', e.target.files[0]);

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formDataFile });
            const result = await res.json();
            if (result.url) {
                setFormData(prev => ({ ...prev, thumbnail: result.url }));
            } else {
                alert('Upload gagal');
            }
        } catch (error) {
            alert('Terjadi kesalahan saat upload.');
        } finally {
            setUploadingState(false);
        }
    };

    // Filtered data
    const filteredAgendas = agendas.filter(item => {
        const matchCategory = filterCategory === "All" || item.category === filterCategory;
        const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    if (isEditing) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-xl font-bold text-unaicNavy">{formData.id ? "Edit Agenda" : "Tambah Agenda Baru"}</h2>
                    <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">Kembali</button>
                </div>

                <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Nama Agenda (ID)</label>
                                    <button
                                        onClick={() => translateField(formData.title || "", (val) => setFormData({ ...formData, titleEn: val }))}
                                        className="text-[10px] text-blue-600 hover:text-blue-800 font-bold"
                                    >
                                        Auto-Translate ➔ EN
                                    </button>
                                </div>
                                <input className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-unaicBlue" placeholder="Nama Agenda (ID)" value={formData.title || ""} onChange={e => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Nama Agenda (EN)</label>
                                <input className="w-full border rounded-lg p-3 text-sm bg-blue-50/20" placeholder="Agenda Name (EN)" value={formData.titleEn || ""} onChange={e => setFormData({ ...formData, titleEn: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Slug (Otomatis)</label>
                                <input className="w-full border rounded-lg p-2 text-sm bg-gray-50 text-gray-500" value={formData.slug || ""} disabled />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Kategori</label>
                                    <select className="w-full border rounded-lg p-2 text-sm" value={formData.category || "Akademik"} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Tanggal</label>
                                    <input type="date" className="w-full border rounded-lg p-2 text-sm" value={formData.date || ""} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Waktu</label>
                                    <input type="text" className="w-full border rounded-lg p-2 text-sm" placeholder="e.g. 08:00 - 12:00 WIB" value={formData.time || ""} onChange={e => setFormData({ ...formData, time: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Lokasi (ID)</label>
                                        <button
                                            onClick={() => translateField(formData.location || "", (val) => setFormData({ ...formData, locationEn: val }))}
                                            className="text-[10px] text-blue-600 hover:text-blue-800 font-bold"
                                        >
                                            TI ➔ EN
                                        </button>
                                    </div>
                                    <input type="text" className="w-full border rounded-lg p-2 text-sm" placeholder="e.g. Auditorium" value={formData.location || ""} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                                    <input type="text" className="w-full border rounded-lg p-2 text-sm bg-blue-50/20 mt-1" placeholder="Location (EN)" value={formData.locationEn || ""} onChange={e => setFormData({ ...formData, locationEn: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Thumbnail</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 text-center relative group h-40">
                                    {formData.thumbnail ? (
                                        <div className="relative w-full h-full">
                                            <img src={formData.thumbnail} className="w-full h-full object-cover rounded-lg" />
                                            <button onClick={() => setFormData({ ...formData, thumbnail: "" })} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"><Trash2 size={14} /></button>
                                        </div>
                                    ) : (
                                        <>
                                            <ImageIcon className="w-8 h-8 text-gray-400" />
                                            <span className="text-xs text-gray-500">Klik untuk upload gambar</span>
                                        </>
                                    )}
                                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} />
                                    {uploadingState && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="animate-spin text-unaicBlue" /></div>}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Deskripsi (ID)</label>
                                    <button
                                        onClick={() => translateField(formData.description || "", (val) => setFormData({ ...formData, descriptionEn: val }))}
                                        className="text-[10px] text-blue-600 hover:text-blue-800 font-bold"
                                    >
                                        Auto-Translate ➔ EN
                                    </button>
                                </div>
                                <textarea className="w-full border rounded-lg p-3 text-sm h-32" placeholder="Deskripsi singkat agenda (ID)..." value={formData.description || ""} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Deskripsi (EN)</label>
                                <textarea className="w-full border rounded-lg p-3 text-sm h-32 bg-blue-50/20" placeholder="Description (EN)..." value={formData.descriptionEn || ""} onChange={e => setFormData({ ...formData, descriptionEn: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button onClick={() => setIsEditing(false)} className="px-6 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200">Batal</button>
                        <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 rounded-lg text-white bg-unaicNavy hover:bg-unaicBlue disabled:opacity-50 flex items-center gap-2">
                            {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />} Simpan Agenda
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Agenda</h1>

            <div className="flex flex-col sm:flex-row justify-between gap-4">
                {/* Filter Tabs */}
                <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
                    {["All", ...CATEGORIES].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilterCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${filterCategory === cat ? 'bg-unaicNavy text-white shadow' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'}`}
                        >
                            {cat === 'All' ? 'Semua' : cat}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-unaicBlue/20"
                            placeholder="Cari agenda..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button onClick={() => { setFormData({ date: new Date().toISOString().split('T')[0], time: "08:00 WIB" }); setIsEditing(true); }} className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm hover:bg-green-700 shadow-sm whitespace-nowrap">
                        <Plus size={16} /> Tambah
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAgendas.map(item => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group flex flex-col h-full">
                        <div className="relative h-40 bg-gray-100">
                            {item.thumbnail ? (
                                <img src={item.thumbnail} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-300"><Calendar size={32} /></div>
                            )}
                            <span className="absolute top-2 left-2 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded text-unaicNavy">
                                {item.category}
                            </span>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                            <h3 className="font-bold text-gray-800 line-clamp-2 mb-2 leading-tight flex-1">{item.title}</h3>
                            <div className="space-y-2 text-xs text-gray-600 mb-4">
                                <div className="flex items-center gap-2"><Calendar size={12} className="text-unaicBlue" /> {item.date}</div>
                                <div className="flex items-center gap-2"><Clock size={12} className="text-unaicBlue" /> {item.time}</div>
                                <div className="flex items-center gap-2"><MapPin size={12} className="text-unaicBlue" /> {item.location}</div>
                            </div>

                            <div className="flex justify-end gap-2 border-t pt-3 mt-auto">
                                <button onClick={() => { setFormData(item); setIsEditing(true); }} className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium hover:bg-blue-100 flex items-center gap-1"><Edit size={12} /> Edit</button>
                                <button onClick={() => handleDelete(item.id)} className="px-3 py-1 bg-red-50 text-red-600 rounded text-xs font-medium hover:bg-red-100 flex items-center gap-1"><Trash2 size={12} /> Hapus</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {filteredAgendas.length === 0 && <div className="text-center py-20 text-gray-400">Tidak ada agenda ditemukan.</div>}
        </div>
    );
}
