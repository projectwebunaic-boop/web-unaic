"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, FlaskConical, Search, Phone, Save, Info, Globe, Loader2, Image as ImageIcon } from "lucide-react";

interface LabItem {
    id: string;
    name: string;
    nameEn: string | null;
    description: string | null;
    descriptionEn: string | null;
    image: string | null;
    facilities: string[];
    facilitiesEn: string[];
    order: number;
}

interface LabConfig {
    title: string | null;
    titleEn: string | null;
    subtitle: string | null;
    subtitleEn: string | null;
    contactName: string | null;
    contactPhone: string | null;
    contactEmail: string | null;
    contactAddress: string | null;
    contactAddressEn: string | null;
}

export default function AdminLaboratoriumPage() {
    const [activeTab, setActiveTab] = useState<'list' | 'config'>('list');

    // --- LABS STATE ---
    const [items, setItems] = useState<LabItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<LabItem | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        nameEn: "",
        description: "",
        descriptionEn: "",
        image: "/images/fasilitas/lab.jpg",
        facilities: "",
        facilitiesEn: "",
        order: 0
    });

    // --- CONFIG STATE ---
    const [config, setConfig] = useState<LabConfig>({
        title: "",
        titleEn: "",
        subtitle: "",
        subtitleEn: "",
        contactName: "",
        contactPhone: "",
        contactEmail: "",
        contactAddress: "",
        contactAddressEn: ""
    });
    const [configLoading, setConfigLoading] = useState(true);
    const [isSavingConfig, setIsSavingConfig] = useState(false);

    useEffect(() => {
        fetchData();
        fetchConfig();
    }, []);

    async function fetchData() {
        try {
            const res = await fetch('/api/admin/laboratorium');
            const json = await res.json();
            setItems(json);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchConfig() {
        try {
            const res = await fetch('/api/admin/laboratorium/config');
            const json = await res.json();
            setConfig(json);
        } catch (error) {
            console.error("Failed to fetch config", error);
        } finally {
            setConfigLoading(false);
        }
    }

    // --- LABS HANDLERS ---
    const openModal = (item?: LabItem) => {
        if (item) {
            setEditItem(item);
            setFormData({
                name: item.name,
                nameEn: item.nameEn || "",
                description: item.description || "",
                descriptionEn: item.descriptionEn || "",
                image: item.image || "/images/fasilitas/lab.jpg",
                facilities: Array.isArray(item.facilities) ? item.facilities.join(", ") : "",
                facilitiesEn: Array.isArray(item.facilitiesEn) ? item.facilitiesEn.join(", ") : "",
                order: item.order || 0
            });
        } else {
            setEditItem(null);
            setFormData({
                name: "",
                nameEn: "",
                description: "",
                descriptionEn: "",
                image: "/images/fasilitas/lab.jpg",
                facilities: "",
                facilitiesEn: "",
                order: items.length
            });
        }
        setIsModalOpen(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const data = new FormData();
        data.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: data,
            });

            if (!res.ok) throw new Error("Upload failed");

            const json = await res.json();
            setFormData(prev => ({ ...prev, image: json.url }));
        } catch (error) {
            console.error("Upload Error:", error);
            alert("Gagal mengupload gambar.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = '/api/admin/laboratorium';
            const method = editItem ? 'PUT' : 'POST';

            const facilitiesArray = formData.facilities.split(",").map(f => f.trim()).filter(f => f !== "");
            const facilitiesEnArray = formData.facilitiesEn.split(",").map(f => f.trim()).filter(f => f !== "");

            const body = {
                ...(editItem ? { id: editItem.id } : {}),
                ...formData,
                facilities: facilitiesArray,
                facilitiesEn: facilitiesEnArray
            };

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                alert("Data berhasil disimpan!");
                fetchData();
                setIsModalOpen(false);
            } else {
                alert("Gagal menyimpan data");
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus data ini?")) return;
        try {
            await fetch(`/api/admin/laboratorium?id=${id}`, { method: 'DELETE' });
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    // --- CONFIG HANDLERS ---
    const handleConfigSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingConfig(true);
        try {
            const res = await fetch('/api/admin/laboratorium/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });

            if (res.ok) {
                alert("Konfigurasi berhasil diperbarui!");
                fetchConfig();
            } else {
                alert("Gagal memperbarui konfigurasi");
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan saat menyimpan konfigurasi");
        } finally {
            setIsSavingConfig(false);
        }
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading || configLoading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="animate-spin text-unaicBlue" size={48} />
        </div>
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-3">
                        <FlaskConical className="text-unaicNavy" /> Manajemen Laboratorium
                    </h1>
                    <p className="text-sm text-gray-500 font-medium tracking-wide">Kelola fasilitas, konten galeri, dan informasi kontak laboratorium.</p>
                </div>
                {activeTab === 'list' && (
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 bg-unaicNavy text-white px-8 py-2.5 rounded-2xl font-bold hover:bg-unaicBlue transition shadow-lg transform hover:-translate-y-0.5 duration-200"
                    >
                        <Plus size={18} /> Tambah Lab
                    </button>
                )}
            </div>

            {/* TABS Navigation */}
            <div className="flex space-x-2 bg-white/50 p-1.5 rounded-2xl border border-gray-100 w-fit backdrop-blur-sm">
                <button
                    onClick={() => setActiveTab('list')}
                    className={`px-6 py-2.5 rounded-xl transition-all font-bold flex items-center gap-2 text-sm ${activeTab === 'list'
                        ? 'bg-white text-unaicNavy shadow-sm border border-gray-100'
                        : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <FlaskConical size={18} />
                    Daftar Lab
                </button>
                <button
                    onClick={() => setActiveTab('config')}
                    className={`px-6 py-2.5 rounded-xl transition-all font-bold flex items-center gap-2 text-sm ${activeTab === 'config'
                        ? 'bg-white text-unaicNavy shadow-sm border border-gray-100'
                        : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <SettingsIcon size={18} />
                    Konfigurasi Halaman
                </button>
            </div>

            {/* TAB CONTENT: LIST */}
            {activeTab === 'list' && (
                <div className="space-y-6">
                    {/* Search Bar */}
                    <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 focus-within:ring-2 focus-within:ring-unaicBlue/20 transition-all">
                        <Search className="text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari nama laboratorium..."
                            className="flex-1 outline-none text-gray-700 placeholder-gray-400 font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group relative">
                                <div className="h-56 bg-gray-100 relative">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-unaicNavy/10">
                                            <ImageIcon size={64} />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                                        <button
                                            onClick={() => openModal(item)}
                                            className="bg-white/90 backdrop-blur-md text-gray-700 p-2.5 rounded-2xl shadow-lg hover:text-blue-600 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="bg-white/90 backdrop-blur-md text-gray-700 p-2.5 rounded-2xl shadow-lg hover:text-red-600 transition-colors"
                                            title="Hapus"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="font-black text-unaicNavy text-lg leading-tight capitalize tracking-tight">{item.name}</h3>
                                        <span className="bg-gray-50 text-gray-400 text-[10px] font-bold px-2 py-1 rounded-lg border border-gray-100">ORDER: {item.order}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium mb-6 line-clamp-2 leading-relaxed">{item.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {item.facilities && item.facilities.slice(0, 4).map((fac, i) => (
                                            <span key={i} className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold border border-blue-100 capitalize tracking-tighter">
                                                {fac}
                                            </span>
                                        ))}
                                        {item.facilities && item.facilities.length > 4 && (
                                            <span className="text-[10px] text-gray-400 font-bold self-center">+{item.facilities.length - 4} items</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB CONTENT: CONFIG */}
            {activeTab === 'config' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-8">
                            <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
                                <Globe className="text-unaicBlue" size={28} />
                                <h2 className="text-xl font-bold text-gray-800">Konten Halaman & Header</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-500 capitalize tracking-widest">Judul Halaman (ID)</label>
                                    <input
                                        className="w-full p-3.5 rounded-2xl border border-gray-200 text-sm focus:ring-2 focus:ring-unaicBlue outline-none transition-all"
                                        value={config.title || ""}
                                        onChange={(e) => setConfig({ ...config, title: e.target.value })}
                                        placeholder="LABORATORIUM UNAIC"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-blue-600 capitalize tracking-widest">Judul Halaman (EN)</label>
                                    <input
                                        className="w-full p-3.5 rounded-2xl border border-blue-100 bg-blue-50/10 text-sm focus:ring-2 focus:ring-unaicBlue outline-none transition-all"
                                        value={config.titleEn || ""}
                                        onChange={(e) => setConfig({ ...config, titleEn: e.target.value })}
                                        placeholder="UNAIC LABORATORY"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-500 capitalize tracking-widest">Sub-judul (ID)</label>
                                    <textarea
                                        className="w-full p-4 rounded-2xl border border-gray-200 text-sm focus:ring-2 focus:ring-unaicBlue outline-none h-24 resize-none transition-all"
                                        value={config.subtitle || ""}
                                        onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-blue-600 capitalize tracking-widest">Sub-judul (EN)</label>
                                    <textarea
                                        className="w-full p-4 rounded-2xl border border-blue-100 bg-blue-50/10 text-sm focus:ring-2 focus:ring-unaicBlue outline-none h-24 resize-none transition-all"
                                        value={config.subtitleEn || ""}
                                        onChange={(e) => setConfig({ ...config, subtitleEn: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-8">
                            <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
                                <MapPinIcon size={28} className="text-unaicGold" />
                                <h2 className="text-xl font-bold text-gray-800">Lokasi Lab</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-500 capitalize tracking-widest">Alamat (ID)</label>
                                    <textarea
                                        className="w-full p-4 rounded-2xl border border-gray-200 text-sm focus:ring-2 focus:ring-unaicBlue outline-none h-20 resize-none transition-all"
                                        value={config.contactAddress || ""}
                                        onChange={(e) => setConfig({ ...config, contactAddress: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-blue-600 capitalize tracking-widest">Alamat (EN)</label>
                                    <textarea
                                        className="w-full p-4 rounded-2xl border border-blue-100 bg-blue-50/10 text-sm focus:ring-2 focus:ring-unaicBlue outline-none h-20 resize-none transition-all"
                                        value={config.contactAddressEn || ""}
                                        onChange={(e) => setConfig({ ...config, contactAddressEn: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-8 sticky top-6">
                            <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
                                <Phone className="text-green-600" size={24} />
                                <h2 className="text-xl font-bold text-gray-800">Kontak Person</h2>
                            </div>
                            <form onSubmit={handleConfigSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-400 capitalize tracking-widest">Nama Kontak</label>
                                    <input
                                        className="w-full p-3.5 rounded-2xl border border-gray-200 text-sm focus:ring-2 focus:ring-unaicBlue outline-none transition-all"
                                        value={config.contactName || ""}
                                        onChange={(e) => setConfig({ ...config, contactName: e.target.value })}
                                        placeholder="Administrator Lab"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-400 capitalize tracking-widest">Phone / WA</label>
                                    <input
                                        className="w-full p-3.5 rounded-2xl border border-gray-200 text-sm focus:ring-2 focus:ring-unaicBlue outline-none transition-all"
                                        value={config.contactPhone || ""}
                                        onChange={(e) => setConfig({ ...config, contactPhone: e.target.value })}
                                        placeholder="+62..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-400 capitalize tracking-widest">Email</label>
                                    <input
                                        type="email"
                                        className="w-full p-3.5 rounded-2xl border border-gray-200 text-sm focus:ring-2 focus:ring-unaicBlue outline-none transition-all"
                                        value={config.contactEmail || ""}
                                        onChange={(e) => setConfig({ ...config, contactEmail: e.target.value })}
                                        placeholder="lab@unaic.ac.id"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSavingConfig}
                                    className="w-full bg-unaicNavy text-white py-4 rounded-2xl font-black capitalize tracking-widest hover:bg-unaicBlue transition shadow-xl disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
                                >
                                    {isSavingConfig ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    Simpan Konfigurasi
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-unaicNavy/40 z-50 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-4xl shadow-2xl my-auto animate-in fade-in zoom-in duration-300 overflow-hidden border border-white/20">
                        <div className="flex justify-between items-center p-8 border-b border-gray-50 bg-gray-50/50 backdrop-blur-sm">
                            <div>
                                <h2 className="text-2xl font-black text-unaicNavy capitalize tracking-tight">
                                    {editItem ? "Edit Laboratorium" : "Tambah Laboratorium Baru"}
                                </h2>
                                <p className="text-xs text-gray-400 font-bold capitalize tracking-widest mt-1">Lengkapi informasi teknis laboratorium</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="bg-white text-gray-400 hover:text-red-500 p-2 rounded-2xl shadow-sm border border-gray-100 transition-all">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-gray-500 capitalize tracking-widest">Nama Lab (ID)</label>
                                        <input
                                            className="w-full p-3.5 rounded-2xl border border-gray-200 text-sm focus:ring-2 focus:ring-unaicBlue outline-none font-bold"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-gray-500 capitalize tracking-widest">Deskripsi (ID)</label>
                                        <textarea
                                            className="w-full p-4 rounded-2xl border border-gray-200 text-sm focus:ring-2 focus:ring-unaicBlue outline-none h-24 resize-none transition-all"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-gray-500 capitalize tracking-widest">Alat / Fasilitas (ID) - Pisahkan Koma</label>
                                        <input
                                            className="w-full p-3.5 rounded-2xl border border-gray-200 text-sm focus:ring-2 focus:ring-unaicBlue outline-none"
                                            value={formData.facilities}
                                            onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                                            placeholder="Mikroskop, Bed Pasien, ..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6 bg-blue-50/20 p-6 rounded-[2rem] border border-blue-50">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-blue-600 capitalize tracking-widest">Nama Lab (EN)</label>
                                        <input
                                            className="w-full p-3.5 rounded-2xl border border-blue-100 bg-white text-sm focus:ring-2 focus:ring-unaicBlue outline-none font-bold"
                                            value={formData.nameEn}
                                            onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-blue-600 capitalize tracking-widest">Deskripsi (EN)</label>
                                        <textarea
                                            className="w-full p-4 rounded-2xl border border-blue-100 bg-white text-sm focus:ring-2 focus:ring-unaicBlue outline-none h-24 resize-none transition-all"
                                            value={formData.descriptionEn}
                                            onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-blue-600 capitalize tracking-widest">Facilities (EN) - Comma Separated</label>
                                        <input
                                            className="w-full p-3.5 rounded-2xl border border-blue-100 bg-white text-sm focus:ring-2 focus:ring-unaicBlue outline-none"
                                            value={formData.facilitiesEn}
                                            onChange={(e) => setFormData({ ...formData, facilitiesEn: e.target.value })}
                                            placeholder="Microscope, Patient Bed, ..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-500 capitalize tracking-widest">Gambar Laboratorium</label>
                                    <div className="relative group/img aspect-video bg-gray-50 rounded-[2rem] overflow-hidden border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 p-4 transition-all hover:bg-gray-100/50">
                                        {formData.image ? (
                                            <>
                                                <img src={formData.image} className="absolute inset-0 w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                                                    <span className="text-white text-xs font-black capitalize tracking-widest">Ganti Gambar</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <ImageIcon className="text-gray-300" size={48} />
                                                <span className="text-xs font-bold text-gray-400">Pilih Gambar</span>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            disabled={uploading}
                                        />
                                    </div>
                                    {uploading && <div className="text-center text-xs font-bold text-unaicBlue animate-pulse mt-2">SEDANG MENGUPLOAD...</div>}
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-gray-500 capitalize tracking-widest">No. Urut Tampil</label>
                                        <input
                                            type="number"
                                            className="w-full p-3.5 rounded-2xl border border-gray-200 text-sm focus:ring-2 focus:ring-unaicBlue outline-none"
                                            value={formData.order}
                                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="w-full bg-unaicNavy text-white py-4 rounded-2xl font-black capitalize tracking-widest hover:bg-unaicBlue transition shadow-xl disabled:opacity-50"
                                    >
                                        {editItem ? "Simpan Perubahan" : "Simpan Laboratorium"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function SettingsIcon({ size }: { size: number }) {
    return <Info size={size} />;
}

function MapPinIcon({ size, className }: { size: number, className?: string }) {
    return <Info size={size} className={className} />;
}
