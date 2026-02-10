"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Loader2, Users, Briefcase, GraduationCap, Upload, Search, Filter } from "lucide-react";
import Image from "next/image";

interface Category {
    id: string;
    name: string;
    nameEn?: string;
    slug: string;
}

interface Staff {
    id: string;
    name: string;
    role: string;
    roleEn?: string;
    nidn?: string;
    categoryId: string;
    image?: string;
    scholarUrl?: string;
}

export default function AdminSDMPage() {
    const [activeTab, setActiveTab] = useState<'categories' | 'staff'>('staff');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadingId, setUploadingId] = useState<string | null>(null);

    const [categories, setCategories] = useState<Category[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);

    // Filters for Staff Tab
    const [filterCategory, setFilterCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/sdm');
            const data = await res.json();
            setCategories(data.categories || []);
            setStaff(data.staff || []);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (type: string, payload: any) => {
        setIsSaving(true);
        try {
            await fetch('/api/admin/sdm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, ...payload })
            });
            alert('Perubahan berhasil disimpan!');
        } catch (e) {
            console.error(e);
            alert('Gagal menyimpan.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        if (!e.target.files?.[0]) return;

        setUploadingId(`staff-${idx}`);
        const formData = new FormData();
        formData.append('file', e.target.files[0]);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.url) {
                const newStaff = [...staff];
                newStaff[idx].image = data.url;
                setStaff(newStaff);
            } else {
                alert('Upload gagal: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            alert('Terjadi kesalahan saat upload.');
        } finally {
            setUploadingId(null);
        }
    };

    const filteredStaff = staff.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.role.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || s.categoryId === filterCategory;
        return matchesSearch && matchesCategory;
    });

    if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen SDM (Dosen & Tendik)</h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-white rounded-xl p-2 shadow-sm border border-gray-100 w-fit">
                <button
                    onClick={() => setActiveTab('staff')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'staff' ? 'bg-unaicNavy text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Users size={16} /> Data Pegawai
                </button>
                <button
                    onClick={() => setActiveTab('categories')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'categories' ? 'bg-unaicNavy text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Briefcase size={16} /> Kelola Kategori
                </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[500px]">

                {/* STAFF TAB */}
                {activeTab === 'staff' && (
                    <div className="space-y-6">
                        {/* Toolbar */}
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div className="flex gap-3 w-full md:w-auto">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        placeholder="Cari nama/jabatan..."
                                        className="pl-9 p-2 border rounded-lg text-sm w-full md:w-60"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <select
                                    className="p-2 border rounded-lg text-sm max-w-[200px]"
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                >
                                    <option value="All">Semua Kategori</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <button
                                onClick={() => setStaff([{ id: crypto.randomUUID(), name: "", role: "", roleEn: "", categoryId: categories[0]?.id || "", nidn: "" }, ...staff])}
                                className="text-sm bg-unaicNavy text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-90 transition shadow-sm"
                            >
                                <Plus size={16} /> Tambah Pegawai
                            </button>
                        </div>

                        <div className="space-y-4">
                            {filteredStaff.map((item, idx) => {
                                // Find actual index in main array for updates
                                const realIdx = staff.findIndex(s => s.id === item.id);
                                return (
                                    <div key={item.id} className="flex flex-col md:flex-row gap-6 items-start bg-white border border-gray-200 p-4 rounded-xl hover:shadow-md transition-shadow">
                                        {/* Image Upload */}
                                        <div className="shrink-0">
                                            <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden relative border-2 border-dashed border-gray-300 group">
                                                {item.image ? (
                                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-gray-400"><Users size={24} /></div>
                                                )}
                                                <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs">
                                                    {uploadingId === `staff-${realIdx}` ? <Loader2 className="animate-spin" /> : 'Upload'}
                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, realIdx)} />
                                                </label>
                                            </div>
                                        </div>

                                        {/* Fields */}
                                        <div className="flex-1 grid md:grid-cols-2 gap-4 w-full">
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-gray-500">Nama Lengkap & Gelar</label>
                                                <input
                                                    value={item.name}
                                                    onChange={(e) => {
                                                        const newData = [...staff];
                                                        newData[realIdx].name = e.target.value;
                                                        setStaff(newData);
                                                    }}
                                                    className="input-field p-2 border rounded w-full"
                                                    placeholder="Contoh: Dr. Budi Santoso"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-gray-500">Jabatan / Role (ID)</label>
                                                <input
                                                    value={item.role}
                                                    onChange={(e) => {
                                                        const newData = [...staff];
                                                        newData[realIdx].role = e.target.value;
                                                        setStaff(newData);
                                                    }}
                                                    className="input-field p-2 border rounded w-full"
                                                    placeholder="Dosen Prodi..."
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-gray-400">Jabatan / Role (EN)</label>
                                                <input
                                                    value={item.roleEn || ""}
                                                    onChange={(e) => {
                                                        const newData = [...staff];
                                                        newData[realIdx].roleEn = e.target.value;
                                                        setStaff(newData);
                                                    }}
                                                    className="input-field p-2 border rounded w-full bg-blue-50/10"
                                                    placeholder="Lecturer of..."
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-gray-500">NIDN / NIP</label>
                                                <input
                                                    value={item.nidn || ""}
                                                    onChange={(e) => {
                                                        const newData = [...staff];
                                                        newData[realIdx].nidn = e.target.value;
                                                        setStaff(newData);
                                                    }}
                                                    className="input-field p-2 border rounded w-full"
                                                    placeholder="Nomor Induk..."
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-gray-500">Kategori</label>
                                                <select
                                                    value={item.categoryId}
                                                    onChange={(e) => {
                                                        const newData = [...staff];
                                                        newData[realIdx].categoryId = e.target.value;
                                                        setStaff(newData);
                                                    }}
                                                    className="input-field p-2 border rounded w-full bg-white"
                                                >
                                                    <option value="">Pilih Kategori...</option>
                                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-1 md:col-span-2">
                                                <label className="text-xs font-semibold text-gray-500">Link Profil (Scholar/LinkedIn)</label>
                                                <input
                                                    value={item.scholarUrl || ""}
                                                    onChange={(e) => {
                                                        const newData = [...staff];
                                                        newData[realIdx].scholarUrl = e.target.value;
                                                        setStaff(newData);
                                                    }}
                                                    className="input-field p-2 border rounded w-full text-blue-600"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        </div>

                                        <button onClick={() => setStaff(staff.filter((_, i) => i !== realIdx))} className="text-red-500 p-2 hover:bg-red-50 rounded-lg transition"><Trash2 size={18} /></button>
                                    </div>
                                );
                            })}
                        </div>
                        <button onClick={() => handleSave('update_staff', { staff })} disabled={isSaving} className="fixed bottom-8 right-8 btn-primary flex items-center gap-2 px-6 py-3 bg-unaicNavy text-white rounded-full shadow-lg hover:shadow-xl transition-all z-40">
                            <Save size={20} /> {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                )}

                {/* CATEGORIES TAB */}
                {activeTab === 'categories' && (
                    <div className="space-y-6 max-w-3xl">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold">Kategori SDM (Slider Menu)</h3>
                            <button
                                onClick={() => setCategories([...categories, { id: crypto.randomUUID(), name: "", nameEn: "", slug: "" }])}
                                className="text-sm text-green-600 hover:bg-green-50 px-3 py-1 rounded-lg flex items-center gap-1"
                            >
                                <Plus size={16} /> Tambah Kategori
                            </button>
                        </div>
                        <div className="space-y-3">
                            {categories.map((cat, idx) => (
                                <div key={cat.id} className="flex gap-4 items-center bg-gray-50 p-3 rounded-lg border">
                                    <div className="flex-1 space-y-1">
                                        <label className="text-[10px] text-gray-400 font-bold uppercase">Nama Kategori (ID)</label>
                                        <input
                                            value={cat.name}
                                            onChange={(e) => {
                                                const newData = [...categories];
                                                newData[idx].name = e.target.value;
                                                // Auto-slug
                                                if (!newData[idx].slug) {
                                                    newData[idx].slug = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
                                                }
                                                setCategories(newData);
                                            }}
                                            className="w-full p-2 border rounded font-medium"
                                            placeholder="Nama Kategori (misal: Dosen Farmasi)"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <label className="text-[10px] text-gray-400 font-bold uppercase">Nama Kategori (EN)</label>
                                        <input
                                            value={cat.nameEn || ""}
                                            onChange={(e) => {
                                                const newData = [...categories];
                                                newData[idx].nameEn = e.target.value;
                                                setCategories(newData);
                                            }}
                                            className="w-full p-2 border rounded font-medium bg-blue-50/10"
                                            placeholder="Category Name (EN)"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <label className="text-[10px] text-gray-400 font-bold uppercase">Slug (URL)</label>
                                        <input
                                            value={cat.slug}
                                            onChange={(e) => {
                                                const newData = [...categories];
                                                newData[idx].slug = e.target.value;
                                                setCategories(newData);
                                            }}
                                            className="w-full p-2 border rounded font-mono text-sm text-gray-500"
                                            placeholder="slug-url"
                                        />
                                    </div>
                                    <button onClick={() => setCategories(categories.filter((_, i) => i !== idx))} className="text-red-500 p-2"><Trash2 size={18} /></button>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleSave('update_categories', { categories })} disabled={isSaving} className="btn-primary flex items-center gap-2 px-4 py-2 bg-unaicNavy text-white rounded-lg">
                            <Save size={16} /> Simpan Kategori
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
