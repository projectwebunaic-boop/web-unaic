"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Search, Calendar, MapPin, Trash2, Edit2, Upload, X, Loader2, Sparkles, Wand2 } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface Activity {
    id: string;
    title: string;
    titleEn?: string;
    description: string;
    descriptionEn?: string;
    content: string;
    contentEn?: string;
    date: string;
    dateEn?: string;
    location: string;
    locationEn?: string;
    image: string;
    category: string;
    slug: string;
}

export default function AdminActivitiesPage() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isTranslating, setIsTranslating] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        titleEn: "",
        description: "",
        descriptionEn: "",
        content: "",
        contentEn: "",
        date: "",
        dateEn: "",
        location: "",
        locationEn: "",
        category: "Seminar",
    });
    const [file, setFile] = useState<File | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const res = await fetch("/api/admin/activities");
            if (res.ok) {
                const data = await res.json();
                setActivities(data);
            }
        } catch (error) {
            console.error("Failed to fetch activities");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleTranslate = async (text: string, field: string, targetStateSetter: any, currentState: any) => {
        if (!text) return;
        setIsTranslating(true);
        try {
            const res = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, targetLanguage: 'English' })
            });
            const data = await res.json();
            if (data.translatedText) {
                targetStateSetter({ ...currentState, [field]: data.translatedText });
            }
        } catch (error) {
            console.error("Translation failed", error);
            alert("Translation failed");
        } finally {
            setIsTranslating(false);
        }
    };

    const TranslateBtn = ({ onClick }: { onClick: () => void }) => (
        <button
            type="button"
            onClick={onClick}
            disabled={isTranslating}
            className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded transition disabled:opacity-50"
        >
            {isTranslating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
            Auto Translate
        </button>
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const submitData = new FormData();
            if (editingId) submitData.append('id', editingId);

            submitData.append('title', formData.title);
            submitData.append('titleEn', formData.titleEn);
            submitData.append('description', formData.description);
            submitData.append('descriptionEn', formData.descriptionEn);
            submitData.append('content', formData.content || `<p>${formData.description}</p>`);
            submitData.append('contentEn', formData.contentEn || `<p>${formData.descriptionEn}</p>`);
            submitData.append('date', formData.date);
            submitData.append('dateEn', formData.dateEn);
            submitData.append('location', formData.location);
            submitData.append('locationEn', formData.locationEn);
            submitData.append('category', formData.category);

            if (file) {
                submitData.append('file', file);
            }

            const method = editingId ? "PUT" : "POST";
            const res = await fetch("/api/admin/activities", {
                method: method,
                body: submitData,
            });

            if (res.ok) {
                fetchActivities();
                closeModal();
                alert(editingId ? "Kegiatan berhasil diperbarui!" : "Kegiatan berhasil ditambahkan!");
            } else {
                alert("Gagal menyimpan kegiatan.");
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus kegiatan "${title}"?`)) return;

        try {
            const res = await fetch(`/api/admin/activities?id=${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                alert("Kegiatan berhasil dihapus.");
                fetchActivities();
            } else {
                alert("Gagal menghapus kegiatan.");
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan sistem.");
        }
    };

    const handleEdit = (item: Activity) => {
        setFormData({
            title: item.title,
            titleEn: item.titleEn || "",
            description: item.description,
            descriptionEn: item.descriptionEn || "",
            content: item.content,
            contentEn: item.contentEn || "",
            date: item.date,
            dateEn: item.dateEn || "",
            location: item.location,
            locationEn: item.locationEn || "",
            category: item.category,
        });
        setEditingId(item.id);
        setFile(null);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingId(null);
        setFormData({
            title: "",
            titleEn: "",
            description: "",
            descriptionEn: "",
            content: "",
            contentEn: "",
            date: "",
            dateEn: "",
            location: "",
            locationEn: "",
            category: "Seminar",
        });
        setFile(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({
            title: "",
            titleEn: "",
            description: "",
            descriptionEn: "",
            content: "",
            contentEn: "",
            date: "",
            dateEn: "",
            location: "",
            locationEn: "",
            category: "Seminar",
        });
        setFile(null);
    };

    const filteredActivities = activities.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Kegiatan Mahasiswa</h1>
                    <p className="text-gray-500">Kelola daftar kegiatan dan acara kemahasiswaan.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2 bg-unaicNavy text-white rounded-lg hover:bg-unaicBlue transition shadow-lg"
                >
                    <Plus size={20} /> Tambah Kegiatan
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Cari kegiatan..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-unaicBlue focus:border-transparent outline-none transition"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Activities List */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-unaicBlue" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredActivities.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition group">
                            <div className="relative h-48 rounded-xl overflow-hidden mb-4 bg-gray-100">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition duration-500"
                                />
                                <div className="absolute top-2 right-2 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-unaicNavy shadow-sm">
                                    {item.category}
                                </div>
                            </div>

                            <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">{item.title}</h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.description}</p>

                            <div className="space-y-2 mb-4 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} /> {item.date}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} /> {item.location}
                                </div>
                            </div>

                            <div className="flex gap-2 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="flex-1 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id, item.title)}
                                    className="p-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredActivities.length === 0 && (
                        <div className="col-span-full py-20 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-300">
                            <p>Belum ada kegiatan yang ditambahkan.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Add Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">{editingId ? "Edit Kegiatan" : "Tambah Kegiatan Baru"}</h2>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Image Upload */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 hover:border-unaicBlue hover:text-unaicBlue hover:bg-blue-50 transition cursor-pointer"
                            >
                                {file ? (
                                    <div className="text-center">
                                        <p className="font-medium text-gray-800 mb-1">{file.name}</p>
                                        <p className="text-xs">Klik untuk ganti gambar</p>
                                    </div>
                                ) : (
                                    <>
                                        <Upload size={32} className="mb-2" />
                                        <p className="font-medium">Klik untuk upload gambar cover</p>
                                        <p className="text-xs mt-1">Format: JPG, PNG (Max 2MB)</p>
                                        {/* Show existing image preview if editing */}
                                        {editingId && !file && (
                                            <div className="text-xs text-blue-500 mt-2">Gambar saat ini akan dipertahankan jika tidak diganti.</div>
                                        )}
                                    </>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Title ID */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Judul Kegiatan (ID)</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-unaicBlue focus:border-unaicBlue outline-none"
                                        placeholder="Contoh: Seminar Nasional..."
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                {/* Title EN */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-bold text-gray-700">Judul Kegiatan (EN)</label>
                                        <TranslateBtn onClick={() => handleTranslate(formData.title, 'titleEn', setFormData, formData)} />
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-unaicBlue outline-none"
                                        placeholder="English Title..."
                                        value={formData.titleEn}
                                        onChange={e => setFormData({ ...formData, titleEn: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Kategori</label>
                                    <select
                                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-unaicBlue outline-none"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="Seminar">Seminar</option>
                                        <option value="Workshop">Workshop</option>
                                        <option value="Kompetisi">Kompetisi</option>
                                        <option value="Sosial">Sosial</option>
                                        <option value="Festival">Festival</option>
                                        <option value="Lainnya">Lainnya</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    {/* Spacer/Placeholder for grid alignment if needed */}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Tanggal Pelaksanaan</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-unaicBlue outline-none"
                                        placeholder="Contoh: 25 Oktober 2025"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-bold text-gray-700">Tanggal (EN)</label>
                                        <TranslateBtn onClick={() => handleTranslate(formData.date, 'dateEn', setFormData, formData)} />
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-unaicBlue outline-none"
                                        placeholder="October 25, 2025"
                                        value={formData.dateEn}
                                        onChange={e => setFormData({ ...formData, dateEn: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Lokasi</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-unaicBlue outline-none"
                                        placeholder="Contoh: Aula UNAIC"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-bold text-gray-700">Location (EN)</label>
                                        <TranslateBtn onClick={() => handleTranslate(formData.location, 'locationEn', setFormData, formData)} />
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-unaicBlue outline-none"
                                        placeholder="UNAIC Hall"
                                        value={formData.locationEn}
                                        onChange={e => setFormData({ ...formData, locationEn: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Deskripsi Singkat (ID)</label>
                                    <textarea
                                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-unaicBlue outline-none h-24"
                                        placeholder="Ringkasan singkat..."
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-bold text-gray-700">Description (EN)</label>
                                        <TranslateBtn onClick={() => handleTranslate(formData.description, 'descriptionEn', setFormData, formData)} />
                                    </div>
                                    <textarea
                                        className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-unaicBlue outline-none h-24"
                                        placeholder="Short summary..."
                                        value={formData.descriptionEn}
                                        onChange={e => setFormData({ ...formData, descriptionEn: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Konten Lengkap (ID)</label>
                                    <textarea
                                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-unaicBlue outline-none h-40 font-mono text-sm"
                                        placeholder="Isi detail kegiatan (HTML support)..."
                                        value={formData.content}
                                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    ></textarea>
                                    <p className="text-xs text-gray-400">Tips: Gunakan tag &lt;p&gt;, &lt;br&gt;, &lt;ul&gt; untuk format teks.</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-bold text-gray-700">Content (EN)</label>
                                        <TranslateBtn onClick={() => handleTranslate(formData.content, 'contentEn', setFormData, formData)} />
                                    </div>
                                    <textarea
                                        className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-unaicBlue outline-none h-40 font-mono text-sm"
                                        placeholder="Full content (HTML support)..."
                                        value={formData.contentEn}
                                        onChange={e => setFormData({ ...formData, contentEn: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-3 rounded-xl font-bold bg-unaicNavy text-white hover:bg-unaicBlue transition shadow-lg disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" /> Menyimpan...
                                        </>
                                    ) : (
                                        "Simpan Kegiatan"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
