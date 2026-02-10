"use client";

import { useState, useEffect } from "react";
import {
    Plus, Trash2, Pencil, Save, ArrowLeft,
    Loader2, Upload, X, Users, Layers, ExternalLink, Globe
} from "lucide-react";
import { Link } from '@/i18n/routing';
import { useRouter } from "@/i18n/routing";

export default function AdminStaffManagement() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'staff' | 'category'>('staff');
    const [staff, setStaff] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Editor State
    const [editingStaff, setEditingStaff] = useState<any | null>(null);
    const [editingCategory, setEditingCategory] = useState<any | null>(null);

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        setIsLoading(true);
        try {
            const [staffRes, catRes] = await Promise.all([
                fetch('/api/admin/staff?type=staff'),
                fetch('/api/admin/staff?type=category')
            ]);
            const staffData = await staffRes.json();
            const catData = await catRes.json();
            setStaff(staffData);
            setCategories(catData);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    // --- CATEGORY ACTIONS ---
    const handleSaveCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/staff', {
                method: 'POST',
                body: JSON.stringify({ type: 'category', ...editingCategory })
            });
            if (res.ok) {
                setEditingCategory(null);
                loadAllData();
            }
        } catch (e) {
            alert("Gagal menyimpan kategori");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm("Hapus kategori ini? Semua staff di kategori ini mungkin akan bermasalah.")) return;
        try {
            await fetch(`/api/admin/staff?type=category&id=${id}`, { method: 'DELETE' });
            loadAllData();
        } catch (e) {
            alert("Gagal menghapus");
        }
    };

    // --- STAFF ACTIONS ---
    const handleSaveStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/staff', {
                method: 'POST',
                body: JSON.stringify({ type: 'staff', ...editingStaff })
            });
            if (res.ok) {
                setEditingStaff(null);
                loadAllData();
            }
        } catch (e) {
            alert("Gagal menyimpan data staff");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteStaff = async (id: string) => {
        if (!confirm("Hapus staff ini?")) return;
        try {
            await fetch(`/api/admin/staff?type=staff&id=${id}`, { method: 'DELETE' });
            loadAllData();
        } catch (e) {
            alert("Gagal menghapus");
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', e.target.files[0]);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                setEditingStaff({ ...editingStaff, image: data.url });
            }
        } catch (error) {
            alert("Gagal upload gambar");
        } finally {
            setUploading(false);
        }
    };

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                        <ArrowLeft size={20} className="text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Manajemen SDM</h1>
                        <p className="text-sm text-gray-500">Kelola Dosen dan Tenaga Kependidikan</p>
                    </div>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('staff')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'staff' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Users size={16} /> Staff
                    </button>
                    <button
                        onClick={() => setActiveTab('category')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'category' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Layers size={16} /> Kategori
                    </button>
                </div>
            </div>

            {activeTab === 'staff' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* STAFF LIST */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="font-bold text-gray-700">Daftar Personnel ({staff.length})</h2>
                            <button
                                onClick={() => setEditingStaff({ name: "", role: "", roleEn: "", nidn: "", image: "", scholarUrl: "", categoryId: categories[0]?.id || "", order: 0 })}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700"
                            >
                                <Plus size={16} /> Tambah Staff
                            </button>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Staff</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Kategori</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 font-sans">
                                    {staff.map((s) => (
                                        <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border">
                                                        {s.image ? (
                                                            <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Users className="w-full h-full p-2 text-gray-300" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-800 text-sm">{s.name}</p>
                                                        <p className="text-xs text-gray-500">{s.role}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                                                    {s.category?.name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => setEditingStaff(s)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil size={18} /></button>
                                                    <button onClick={() => handleDeleteStaff(s.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {staff.length === 0 && <div className="p-12 text-center text-gray-400 italic">Belum ada data staff.</div>}
                        </div>
                    </div>

                    {/* STAFF FORM */}
                    <div className="h-fit lg:sticky lg:top-8 animate-in fade-in slide-in-from-right duration-500">
                        {editingStaff ? (
                            <form onSubmit={handleSaveStaff} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 space-y-5">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-bold text-lg text-gray-800">{editingStaff.id ? "Edit Staff" : "Tambah Staff"}</h3>
                                    <button type="button" onClick={() => setEditingStaff(null)} className="text-gray-400 hover:text-red-500"><X size={20} /></button>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                        <div className="w-24 h-24 rounded-full bg-white shadow-sm overflow-hidden mb-3 border-2 border-white ring-1 ring-gray-100">
                                            {editingStaff.image ? (
                                                <img src={editingStaff.image} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <Users size={32} className="w-full h-full p-6 text-gray-200" />
                                            )}
                                        </div>
                                        <label className="cursor-pointer bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-2">
                                            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                                            {editingStaff.image ? "Ganti Foto" : "Unggah Foto"}
                                            <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                                        </label>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Nama Lengkap</label>
                                        <input
                                            required
                                            value={editingStaff.name}
                                            onChange={e => setEditingStaff({ ...editingStaff, name: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                            placeholder="Nama Lengkap & Gelar"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Jabatan / Peran (ID)</label>
                                            <input
                                                required
                                                value={editingStaff.role}
                                                onChange={e => setEditingStaff({ ...editingStaff, role: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                                placeholder="Dosen, Staff, dll"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1 mb-1 ml-1">
                                                <Globe size={10} className="text-blue-500" />
                                                <label className="block text-xs font-bold text-gray-500 uppercase">Jabatan (EN)</label>
                                            </div>
                                            <input
                                                value={editingStaff.roleEn || ""}
                                                onChange={e => setEditingStaff({ ...editingStaff, roleEn: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                                placeholder="Lecturer, Staff, etc"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">NIDN (Opsional)</label>
                                            <input
                                                value={editingStaff.nidn || ""}
                                                onChange={e => setEditingStaff({ ...editingStaff, nidn: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
                                                placeholder="061xxxx"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Kategori</label>
                                            <select
                                                required
                                                value={editingStaff.categoryId}
                                                onChange={e => setEditingStaff({ ...editingStaff, categoryId: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
                                            >
                                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Google Scholar URL</label>
                                        <input
                                            value={editingStaff.scholarUrl || ""}
                                            onChange={e => setEditingStaff({ ...editingStaff, scholarUrl: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
                                            placeholder="https://scholar.google.com/..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Urutan</label>
                                        <input
                                            type="number"
                                            value={editingStaff.order}
                                            onChange={e => setEditingStaff({ ...editingStaff, order: parseInt(e.target.value) || 0 })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    Simpan Perubahan
                                </button>
                            </form>
                        ) : (
                            <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100 text-center space-y-3">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-blue-500">
                                    <Users size={32} />
                                </div>
                                <h3 className="font-bold text-blue-900">Pilih Staff untuk Diedit</h3>
                                <p className="text-sm text-blue-700/60 leading-relaxed">Gunakan tombol tambah untuk personnel baru atau klik tombol edit pada daftar untuk mengubah informasi yang ada.</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* CATEGORY MANAGEMENT */}
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-gray-700 text-lg">Manajemen Kategori SDM</h2>
                        <button
                            onClick={() => setEditingCategory({ name: "", nameEn: "", slug: "", order: 0 })}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700"
                        >
                            <Plus size={16} /> Kategori Baru
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y">
                            {categories.map(c => (
                                <div key={c.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div>
                                        <p className="font-bold text-gray-800">{c.name}</p>
                                        <p className="text-xs text-gray-400 font-mono">/{c.slug}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => setEditingCategory(c)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={16} /></button>
                                        <button onClick={() => handleDeleteCategory(c.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                            {categories.length === 0 && <div className="p-12 text-center text-gray-400 italic">Belum ada kategori.</div>}
                        </div>

                        {editingCategory && (
                            <form onSubmit={handleSaveCategory} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 space-y-4 h-fit">
                                <h3 className="font-bold text-gray-800 mb-4">{editingCategory.id ? "Edit Kategori" : "Tambah Kategori"}</h3>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Kategori (ID)</label>
                                    <input
                                        required
                                        value={editingCategory.name}
                                        onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-xl text-sm outline-none"
                                        placeholder="Contoh: Dosen Fikes"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-1 mb-1">
                                        <Globe size={10} className="text-blue-500" />
                                        <label className="block text-xs font-bold text-gray-500 uppercase">Nama Kategori (EN)</label>
                                    </div>
                                    <input
                                        value={editingCategory.nameEn || ""}
                                        onChange={e => setEditingCategory({ ...editingCategory, nameEn: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-xl text-sm outline-none"
                                        placeholder="Example: Faculty of Health Sciences"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Slug (URL)</label>
                                    <input
                                        required
                                        value={editingCategory.slug}
                                        onChange={e => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-xl text-sm outline-none font-mono"
                                        placeholder="dosen-fikes"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Urutan</label>
                                    <input
                                        type="number"
                                        value={editingCategory.order}
                                        onChange={e => setEditingCategory({ ...editingCategory, order: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 border rounded-xl text-sm outline-none"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => setEditingCategory(null)} className="flex-1 py-2 bg-gray-100 rounded-xl text-sm font-bold">Batal</button>
                                    <button type="submit" disabled={isSaving} className="flex-[2] py-2 bg-blue-600 text-white rounded-xl text-sm font-bold flex justify-center gap-2">
                                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                        Simpan
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
