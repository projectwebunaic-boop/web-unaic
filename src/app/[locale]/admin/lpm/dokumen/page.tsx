"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, ArrowLeft, Loader2, Upload, Pencil, X } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function AdminLPMDokumen() {
    const [docs, setDocs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadingId, setUploadingId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: "", titleEn: "",
        year: new Date().getFullYear(),
        url: "",
        category: "Umum"
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/lpm/documents');
            const data = await res.json();
            setDocs(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ title: "", titleEn: "", year: new Date().getFullYear(), url: "", category: "Umum" });
        setEditingId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/lpm/documents', {
                method: 'POST',
                body: JSON.stringify({
                    id: editingId,
                    ...formData
                })
            });
            if (res.ok) {
                await loadData();
                resetForm();
            } else {
                alert("Gagal menyimpan dokumen");
            }
        } catch (e) {
            alert("Gagal menyimpan dokumen");
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = (item: any) => {
        setEditingId(item.id);
        setFormData({
            title: item.title,
            titleEn: item.titleEn || "",
            year: item.year,
            url: item.url || "",
            category: item.category || "Umum"
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Hapus dokumen ini?")) return;
        try {
            await fetch(`/api/admin/lpm/documents?id=${id}`, { method: 'DELETE' });
            loadData();
        } catch (e) {
            alert("Gagal menghapus");
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        setUploadingId('new');
        const fileFormData = new FormData();
        fileFormData.append('file', e.target.files[0]);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: fileFormData
            });
            const data = await res.json();

            if (data.success) {
                setFormData({ ...formData, url: data.url });
            } else {
                alert('Upload gagal: ' + data.error);
            }
        } catch (error) {
            alert('Terjadi kesalahan saat upload.');
        } finally {
            setUploadingId(null);
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-6 flex items-center gap-4">
                <Link href="/admin/lpm" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Dokumen Mutu</h1>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* LIST */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 order-2 lg:order-1">
                    <h2 className="font-bold text-lg mb-4">Daftar Dokumen</h2>
                    {isLoading ? <div className="text-center p-4">Loading...</div> : (
                        <div className="space-y-4">
                            {docs.map((item) => (
                                <div key={item.id} className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${editingId === item.id ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500/20' : 'bg-gray-50'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 text-orange-600 font-bold">
                                            {item.year}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-sm">{item.title}</h3>
                                            <p className="text-xs text-gray-500 italic">{item.titleEn}</p>
                                            <span className="text-[10px] uppercase font-bold bg-gray-200 px-2 py-0.5 rounded text-gray-600 mt-1 inline-block">{item.category}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className={`p-2 rounded transition-colors ${editingId === item.id ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-50'}`}
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {docs.length === 0 && <p className="text-center text-gray-400">Belum ada dokumen.</p>}
                        </div>
                    )}
                </div>

                {/* FORM */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit lg:sticky lg:top-4 order-1 lg:order-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-lg">{editingId ? "Edit Dokumen" : "Upload Dokumen Baru"}</h2>
                        {editingId && (
                            <button onClick={resetForm} className="text-gray-400 hover:text-red-500 transition-colors">
                                <X size={20} />
                            </button>
                        )}
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-600">Tahun</label>
                            <input
                                type="number"
                                required
                                value={formData.year}
                                onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                className="w-full border rounded p-2 text-sm"
                            />
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-semibold text-gray-600">Judul Dokumen (ID)</label>
                                <input
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full border rounded p-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600">Document Title (EN)</label>
                                <input
                                    value={formData.titleEn}
                                    onChange={e => setFormData({ ...formData, titleEn: e.target.value })}
                                    className="w-full border rounded p-2 text-sm bg-blue-50/20"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-600">Kategori</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full p-2 border rounded text-sm bg-white"
                            >
                                <option value="VMTS">VMTS</option>
                                <option value="Tata Pamong">Tata Pamong</option>
                                <option value="Kemahasiswaan">Kemahasiswaan</option>
                                <option value="SDM">SDM</option>
                                <option value="Keuangan">Keuangan</option>
                                <option value="Pendidikan">Pendidikan</option>
                                <option value="Penelitian">Penelitian</option>
                                <option value="PkM">PkM</option>
                                <option value="Luaran">Luaran</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-600 mb-2 block">File / URL</label>
                            <div className="flex gap-2">
                                <input
                                    value={formData.url}
                                    onChange={e => setFormData({ ...formData, url: e.target.value })}
                                    className="flex-1 border rounded p-2 text-sm"
                                    placeholder="https://..."
                                />
                                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 p-2 rounded border flex items-center justify-center w-10 relative overflow-hidden">
                                    {uploadingId === 'new' ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleFileUpload}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="pt-2 flex gap-2">
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 py-2 bg-gray-100 text-gray-600 rounded font-medium hover:bg-gray-200"
                                >
                                    Batal
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={isSaving}
                                className={`flex-[2] py-2 text-white rounded font-medium disabled:opacity-50 flex justify-center gap-2 ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-unaicNavy hover:bg-blue-900'}`}
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                {editingId ? "Update Dokumen" : "Simpan Dokumen"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
