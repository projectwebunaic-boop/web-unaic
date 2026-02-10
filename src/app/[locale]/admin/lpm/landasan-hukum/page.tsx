"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, ArrowLeft, Loader2, Globe, FileText, Link as LinkIcon, Pencil } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useRouter } from "@/i18n/routing";

interface LegalBasis {
    id?: string;
    title: string;
    titleEn: string;
    category: string;
    description: string;
    descriptionEn: string;
    url: string;
    order: number;
}

export default function AdminLegalBasis() {
    const router = useRouter();
    const [data, setData] = useState<LegalBasis[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [editingItem, setEditingItem] = useState<LegalBasis | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/lpm/landasan-hukum');
            const items = await res.json();
            setData(items);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (item: LegalBasis) => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/lpm/landasan-hukum', {
                method: 'POST',
                body: JSON.stringify(item)
            });
            if (res.ok) {
                setEditingItem(null);
                fetchData();
                router.refresh();
            }
        } catch (e) {
            alert("Gagal menyimpan.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Hapus dokumen ini?")) return;
        try {
            await fetch(`/api/admin/lpm/landasan-hukum?id=${id}`, { method: 'DELETE' });
            fetchData();
        } catch (e) {
            alert("Gagal menghapus.");
        }
    };

    if (isLoading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/lpm" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Manajemen Landasan Hukum</h1>
                </div>
                <button
                    onClick={() => setEditingItem({ title: "", titleEn: "", category: "Nasional", description: "", descriptionEn: "", url: "", order: 0 })}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus size={20} /> Tambah Dokumen
                </button>
            </div>

            {/* Editor Modal/Overlay */}
            {editingItem && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-6">{editingItem.id ? "Edit Dokumen" : "Tambah Dokumen Baru"}</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Kategori</label>
                                <select
                                    className="w-full border rounded-lg p-2 bg-white"
                                    value={editingItem.category || "Nasional"}
                                    onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                                >
                                    <option value="Nasional">Nasional</option>
                                    <option value="Perguruan Tinggi">Perguruan Tinggi</option>
                                    <option value="LJM">LJM</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Judul (ID)</label>
                                    <input
                                        className="w-full border rounded-lg p-2"
                                        value={editingItem.title}
                                        onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Globe size={14} className="text-blue-500" />
                                        <label className="block text-sm font-semibold text-gray-600">Judul (EN)</label>
                                    </div>
                                    <input
                                        className="w-full border rounded-lg p-2"
                                        value={editingItem.titleEn}
                                        onChange={e => setEditingItem({ ...editingItem, titleEn: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Deskripsi (ID)</label>
                                    <textarea
                                        className="w-full border rounded-lg p-2 h-24"
                                        value={editingItem.description}
                                        onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Globe size={14} className="text-blue-500" />
                                        <label className="block text-sm font-semibold text-gray-600">Deskripsi (EN)</label>
                                    </div>
                                    <textarea
                                        className="w-full border rounded-lg p-2 h-24"
                                        value={editingItem.descriptionEn}
                                        onChange={e => setEditingItem({ ...editingItem, descriptionEn: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                    <FileText size={16} /> File Dokumen (PDF)
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            const formData = new FormData();
                                            formData.append('file', file);

                                            try {
                                                const res = await fetch('/api/upload/landasan-hukum', {
                                                    method: 'POST',
                                                    body: formData
                                                });
                                                const result = await res.json();
                                                if (result.url) {
                                                    setEditingItem({ ...editingItem, url: result.url });
                                                    alert("File berhasil diupload!");
                                                }
                                            } catch (err) {
                                                alert("Gagal upload file.");
                                            }
                                        }}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <LinkIcon size={14} className="text-gray-400" />
                                        <label className="block text-sm font-semibold text-gray-600">Atau Gunakan URL Luar</label>
                                    </div>
                                    <input
                                        className="w-full border rounded-lg p-2"
                                        value={editingItem.url}
                                        onChange={e => setEditingItem({ ...editingItem, url: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Urutan</label>
                                    <input
                                        type="number"
                                        className="w-full border rounded-lg p-2"
                                        value={editingItem.order}
                                        onChange={e => setEditingItem({ ...editingItem, order: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button
                                    onClick={() => setEditingItem(null)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={() => handleSave(editingItem)}
                                    disabled={isSaving}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-sm font-bold text-gray-600">Urutan</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-600">Kategori</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-600">Dokumen</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-600">Link</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-600 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">{item.order}</td>
                                <td className="px-6 py-4">
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${item.category === 'Nasional' ? 'bg-green-50 text-green-600' :
                                        item.category === 'Perguruan Tinggi' ? 'bg-purple-50 text-purple-600' :
                                            'bg-blue-50 text-blue-600'
                                        }`}>
                                        {item.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <FileText className="text-blue-500" size={18} />
                                        <div>
                                            <p className="font-bold text-gray-800">{item.title}</p>
                                            <p className="text-xs text-blue-500 italic">{item.titleEn}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {item.url ? (
                                        <a href={item.url} target="_blank" className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:underline">
                                            Open Link
                                        </a>
                                    ) : (
                                        <span className="text-xs text-gray-400">No Link</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => setEditingItem(item)}
                                            className="flex items-center gap-1 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100"
                                        >
                                            <Pencil size={16} />
                                            <span className="text-xs font-bold">Edit</span>
                                        </button>
                                        <button
                                            onClick={() => item.id && handleDelete(item.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {data.length === 0 && (
                    <div className="p-12 text-center text-gray-400 italic">
                        Belum ada data landasan hukum.
                    </div>
                )}
            </div>
        </div>
    );
}
