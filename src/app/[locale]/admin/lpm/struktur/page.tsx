"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Save, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function AdminLPMStruktur() {
    const [staff, setStaff] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [editing, setEditing] = useState<any | null>(null);

    // Form State
    const [formData, setFormData] = useState({ name: "", position: "", positionEn: "", image: "" });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/lpm/staff');
            const data = await res.json();
            if (Array.isArray(data)) {
                setStaff(data);
            } else {
                console.error("API returned non-array:", data);
                setStaff([]);
            }
        } catch (e) {
            console.error(e);
            setStaff([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await fetch('/api/admin/lpm/staff', {
                method: 'POST',
                body: JSON.stringify(editing ? { id: editing.id, ...formData } : formData)
            });
            await loadData();
            setEditing(null);
            setFormData({ name: "", position: "", positionEn: "", image: "" });
        } catch (e) {
            alert("Gagal menyimpan");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Hapus staff ini?")) return;
        try {
            await fetch(`/api/admin/lpm/staff?id=${id}`, { method: 'DELETE' });
            loadData();
        } catch (e) {
            alert("Gagal menghapus");
        }
    };

    const startEdit = (item: any) => {
        setEditing(item);
        setFormData({
            name: item.name,
            position: item.position,
            positionEn: item.positionEn || "",
            image: item.image || ""
        });
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-6 flex items-center gap-4">
                <Link href="/admin/lpm" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Struktur Organisasi</h1>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* LIST */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-bold text-lg mb-4">Daftar Tim</h2>
                    {isLoading ? <div className="text-center p-4">Loading...</div> : (
                        <div className="space-y-4">
                            {staff.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800">{item.name}</h3>
                                            <p className="text-sm text-gray-500">{item.position} / {item.positionEn}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => startEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit size={16} /></button>
                                        <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                            {staff.length === 0 && <p className="text-center text-gray-400">Belum ada data staff.</p>}
                        </div>
                    )}
                </div>

                {/* FORM */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit sticky top-4">
                    <h2 className="font-bold text-lg mb-4">{editing ? "Edit Staff" : "Tambah Staff Baru"}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-600">Nama Lengkap</label>
                            <input
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full border rounded p-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-600">Jabatan (ID)</label>
                            <input
                                required
                                value={formData.position}
                                onChange={e => setFormData({ ...formData, position: e.target.value })}
                                className="w-full border rounded p-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-600">Position (EN)</label>
                            <input
                                value={formData.positionEn}
                                onChange={e => setFormData({ ...formData, positionEn: e.target.value })}
                                className="w-full border rounded p-2 text-sm bg-blue-50/20"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-600">URL Foto</label>
                            <input
                                value={formData.image}
                                onChange={e => setFormData({ ...formData, image: e.target.value })}
                                className="w-full border rounded p-2 text-sm"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="flex gap-2 pt-2">
                            {editing && (
                                <button
                                    type="button"
                                    onClick={() => { setEditing(null); setFormData({ name: "", position: "", positionEn: "", image: "" }); }}
                                    className="flex-1 py-2 border rounded text-gray-600 hover:bg-gray-50 font-medium"
                                >
                                    Batal
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex-1 py-2 bg-unaicNavy text-white rounded font-medium hover:bg-blue-900 disabled:opacity-50 flex justify-center gap-2"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                {editing ? "Update" : "Simpan"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
