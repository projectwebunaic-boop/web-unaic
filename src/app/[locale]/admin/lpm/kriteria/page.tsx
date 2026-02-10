"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Save, ArrowLeft, Loader2, Calendar } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function AdminLPMKriteria() {
    const [list, setList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [editing, setEditing] = useState<any | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: "", titleEn: "",
        subtitle: "", subtitleEn: "",
        slug: "",
        description: "", descriptionEn: "",
        content: "", contentEn: "",
        icon: "ShieldCheck",
        order: 0
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/lpm/kriteria');
            const data = await res.json();
            setList(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const payload = {
                ...formData,
                order: Number(formData.order) // Ensure number
            };

            await fetch('/api/admin/lpm/kriteria', {
                method: 'POST',
                body: JSON.stringify(editing ? { id: editing.id, ...payload } : payload)
            });
            await loadData();
            setEditing(null);
            setFormData({ title: "", titleEn: "", subtitle: "", subtitleEn: "", slug: "", description: "", descriptionEn: "", content: "", contentEn: "", icon: "ShieldCheck", order: 0 });
        } catch (e) {
            alert("Gagal menyimpan kriteria");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Hapus kriteria ini?")) return;
        try {
            await fetch(`/api/admin/lpm/kriteria?id=${id}`, { method: 'DELETE' });
            loadData();
        } catch (e) {
            alert("Gagal menghapus");
        }
    };

    const startEdit = (item: any) => {
        setEditing(item);
        setFormData({
            title: item.title,
            titleEn: item.titleEn || "",
            subtitle: item.subtitle || "",
            subtitleEn: item.subtitleEn || "",
            slug: item.slug || "",
            description: item.description || "",
            descriptionEn: item.descriptionEn || "",
            content: item.content || "",
            contentEn: item.contentEn || "",
            icon: item.icon || "ShieldCheck",
            order: item.order || 0
        });
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-6 flex items-center gap-4">
                <Link href="/admin/lpm" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Manajemen 9 Kriteria</h1>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* LIST */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-bold text-lg mb-4">Daftar Kriteria</h2>
                    {isLoading ? <div className="text-center p-4">Loading...</div> : (
                        <div className="space-y-4">
                            {list.map((item) => (
                                <div key={item.id} className="p-4 bg-gray-50 rounded-lg border">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-800">{item.title}</h3>
                                        <div className="flex gap-2">
                                            <button onClick={() => startEdit(item)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-blue-600 mb-1 font-semibold">{item.subtitle}</p>
                                    <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                                </div>
                            ))}
                            {list.length === 0 && <p className="text-center text-gray-400">Belum ada data.</p>}
                        </div>
                    )}
                </div>

                {/* FORM */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit sticky top-4">
                    <h2 className="font-bold text-lg mb-4">{editing ? "Edit Kriteria" : "Buat Kriteria Baru"}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-600">No. Urut</label>
                                <input
                                    type="number"
                                    value={formData.order}
                                    onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                    className="w-full border rounded p-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600">Initial Slug</label>
                                <input
                                    value={formData.slug}
                                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full border rounded p-2 text-sm font-mono"
                                    placeholder="visi-misi"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div>
                                <label className="text-xs font-semibold text-gray-600">Judul (ID)</label>
                                <input
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full border rounded p-1.5 text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600">Title (EN)</label>
                                <input
                                    value={formData.titleEn}
                                    onChange={e => setFormData({ ...formData, titleEn: e.target.value })}
                                    className="w-full border rounded p-1.5 text-sm bg-blue-50/20"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div>
                                <label className="text-xs font-semibold text-gray-600">Sub-Judul (ID)</label>
                                <input
                                    required
                                    value={formData.subtitle}
                                    onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                                    className="w-full border rounded p-1.5 text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600">Subtitle (EN)</label>
                                <input
                                    value={formData.subtitleEn}
                                    onChange={e => setFormData({ ...formData, subtitleEn: e.target.value })}
                                    className="w-full border rounded p-1.5 text-sm bg-blue-50/20"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div>
                                <label className="text-xs font-semibold text-gray-600">Deskripsi Singkat (ID)</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full border rounded p-2 text-sm h-16"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600">Short Desc (EN)</label>
                                <textarea
                                    value={formData.descriptionEn}
                                    onChange={e => setFormData({ ...formData, descriptionEn: e.target.value })}
                                    className="w-full border rounded p-2 text-sm h-16 bg-blue-50/20"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div>
                                <label className="text-xs font-semibold text-gray-600">Konten Detail (ID - HTML)</label>
                                <textarea
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full border rounded p-2 text-sm font-mono h-24"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600">Content Detail (EN - HTML)</label>
                                <textarea
                                    value={formData.contentEn}
                                    onChange={e => setFormData({ ...formData, contentEn: e.target.value })}
                                    className="w-full border rounded p-2 text-sm font-mono h-24 bg-blue-50/20"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full py-2 bg-unaicNavy text-white rounded font-medium hover:bg-blue-900 disabled:opacity-50 flex justify-center gap-2"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                Simpan Kriteria
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
