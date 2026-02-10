"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Save, ArrowLeft, Loader2, Calendar } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function AdminLPMAgenda() {
    const [agendas, setAgendas] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [editing, setEditing] = useState<any | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: "", titleEn: "",
        slug: "",
        date: "",
        description: "", descriptionEn: "",
        location: "", locationEn: "",
        thumbnail: ""
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/lpm/agenda');
            const data = await res.json();
            // Ensure dates are stringified for input
            setAgendas(data);
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
                date: new Date(formData.date).toISOString(), // Parse date string
                slug: editing ? editing.slug : formData.title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now()
            };

            await fetch('/api/admin/lpm/agenda', {
                method: 'POST',
                body: JSON.stringify(editing ? { id: editing.id, ...payload } : payload)
            });
            await loadData();
            setEditing(null);
            setFormData({ title: "", titleEn: "", slug: "", date: "", description: "", descriptionEn: "", location: "", locationEn: "", thumbnail: "" });
        } catch (e) {
            alert("Gagal menyimpan agenda");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Hapus agenda ini?")) return;
        try {
            await fetch(`/api/admin/lpm/agenda?id=${id}`, { method: 'DELETE' });
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
            slug: item.slug,
            date: item.date ? new Date(item.date).toISOString().split('T')[0] : "",
            description: item.description || "",
            descriptionEn: item.descriptionEn || "",
            location: item.location || "",
            locationEn: item.locationEn || "",
            thumbnail: item.thumbnail || ""
        });
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-6 flex items-center gap-4">
                <Link href="/admin/lpm" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Agenda Mutu</h1>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* LIST */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-bold text-lg mb-4">Daftar Agenda</h2>
                    {isLoading ? <div className="text-center p-4">Loading...</div> : (
                        <div className="space-y-4">
                            {agendas.map((item) => (
                                <div key={item.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border">
                                    <div className="flex gap-4">
                                        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 text-blue-600 font-bold text-xs text-center p-1">
                                            {new Date(item.date).toLocaleDateString()}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800">{item.title}</h3>
                                            <p className="text-xs text-gray-500 mb-1">{item.location}</p>
                                            <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => startEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit size={16} /></button>
                                        <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                            {agendas.length === 0 && <p className="text-center text-gray-400">Belum ada agenda.</p>}
                        </div>
                    )}
                </div>

                {/* FORM */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit sticky top-4">
                    <h2 className="font-bold text-lg mb-4">{editing ? "Edit Agenda" : "Buat Agenda Baru"}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-semibold text-gray-600">Judul Agenda (ID)</label>
                                <input
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full border rounded p-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600">Title (EN)</label>
                                <input
                                    value={formData.titleEn}
                                    onChange={e => setFormData({ ...formData, titleEn: e.target.value })}
                                    className="w-full border rounded p-2 text-sm bg-blue-50/20"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-600 flex items-center gap-2"><Calendar size={14} /> Tanggal</label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                className="w-full border rounded p-2 text-sm"
                            />
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-semibold text-gray-600">Lokasi (ID)</label>
                                <input
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full border rounded p-2 text-sm"
                                    placeholder="Contoh: Gedung A"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600">Location (EN)</label>
                                <input
                                    value={formData.locationEn}
                                    onChange={e => setFormData({ ...formData, locationEn: e.target.value })}
                                    className="w-full border rounded p-2 text-sm bg-blue-50/20"
                                    placeholder="e.g., Building A"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-semibold text-gray-600">Deskripsi (ID)</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full border rounded p-2 text-sm h-24"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600">Description (EN)</label>
                                <textarea
                                    value={formData.descriptionEn}
                                    onChange={e => setFormData({ ...formData, descriptionEn: e.target.value })}
                                    className="w-full border rounded p-2 text-sm h-24 bg-blue-50/20"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-600">URL Gambar/Thumbnail</label>
                            <input
                                value={formData.thumbnail}
                                onChange={e => setFormData({ ...formData, thumbnail: e.target.value })}
                                className="w-full border rounded p-2 text-sm"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="flex gap-2 pt-2">
                            {editing && (
                                <button
                                    type="button"
                                    onClick={() => { setEditing(null); setFormData({ title: "", titleEn: "", slug: "", date: "", description: "", descriptionEn: "", location: "", locationEn: "", thumbnail: "" }); }}
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
                                {editing ? "Update Agenda" : "Simpan Agenda"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
