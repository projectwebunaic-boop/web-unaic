"use client";

import { useState, useEffect } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { 
    BookOpen, 
    Plus, 
    Pencil, 
    Trash2, 
    FileText, 
    ExternalLink, 
    Download, 
    Users, 
    Calendar,
    Search,
    Loader2,
    X,
    Save
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

interface Publication {
    id: string;
    type: "JOURNAL" | "PROCEEDING" | "ARTICLE";
    title: string;
    titleEn?: string;
    link?: string;
    pdfUrl?: string;
    authors?: string;
    year?: string;
    description?: string;
    descriptionEn?: string;
}

export default function AdminPublicationsPage() {
    const t = useTranslations("Publication");
    const router = useRouter();
    
    // State
    const [publications, setPublications] = useState<Publication[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"JOURNAL" | "PROCEEDING" | "ARTICLE">("JOURNAL");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Publication | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Initial Form State
    const initialFormState: Partial<Publication> = {
        title: "",
        titleEn: "",
        link: "",
        pdfUrl: "",
        authors: "",
        year: new Date().getFullYear().toString(),
        description: "",
        descriptionEn: ""
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchPublications();
    }, []);

    const fetchPublications = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/publications');
            const data = await res.json();
            
            // Allow backward compatibility with the structure returned by API
            // The API returns { journals: [], proceedings: [], articles: [] }
            // We need to flatten this or handle it. 
            // Ideally the API we wrote returns grouped data, but let's check.
            // Wait, I wrote the API to match the old structure for the public page consuption.
            // But for Admin, it's easier if we have a raw list.
            // Actually, the API returns grouped data. Let's flatten it for easier management here
            // OR simply process it into a single list with 'type' property.
            
            // The API returns: { journals: [...], proceedings: [...], articles: [...] }
            // Let's normalize it back to a flat list for local state management
            const flatList: Publication[] = [
                ...(data.journals || []).map((j: any) => ({ ...j, type: 'JOURNAL', title: j.name || j.title })),
                ...(data.proceedings || []).map((p: any) => ({ ...p, type: 'PROCEEDING' })),
                ...(data.articles || []).map((a: any) => ({ ...a, type: 'ARTICLE' }))
            ];
            
            setPublications(flatList);
        } catch (error) {
            console.error("Failed to fetch publications", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (item?: Publication) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                title: item.title,
                titleEn: item.titleEn || "",
                link: item.link || "",
                pdfUrl: item.pdfUrl || "",
                authors: item.authors || "",
                year: item.year || "",
                description: item.description || "",
                descriptionEn: item.descriptionEn || ""
            });
        } else {
            setEditingItem(null);
            setFormData(initialFormState);
        }
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        try {
            const res = await fetch('/api/admin/publications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'delete', id })
            });

            if (res.ok) {
                fetchPublications();
            }
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const payload = {
                ...formData,
                id: editingItem?.id,
                category: activeTab // Passed as 'category' to match API expected 'type' logic? 
                // Wait, my API expects 'category' which maps to 'type'.
            };

            const res = await fetch('/api/admin/publications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchPublications();
            } else {
                alert("Failed to save");
            }
        } catch (error) {
            console.error("Error saving", error);
        } finally {
            setIsSaving(false);
        }
    };

    const filteredPublications = publications.filter(p => 
        p.type === activeTab && 
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 md:p-8 space-y-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <BookOpen className="text-unaicBlue" />
                        {t('title')}
                    </h1>
                    <p className="text-gray-500 mt-1">{t('subtitle')}</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-unaicBlue text-white rounded-xl hover:bg-unaicBlue/90 transition shadow-lg shadow-blue-900/10 font-medium"
                >
                    <Plus size={18} />
                    Tambah Data
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-white rounded-xl border border-gray-100 w-fit">
                {(['JOURNAL', 'PROCEEDING', 'ARTICLE'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            activeTab === tab
                                ? "bg-unaicBlue text-white shadow-md"
                                : "text-gray-500 hover:text-unaicBlue hover:bg-blue-50"
                        }`}
                    >
                        {tab === 'JOURNAL' ? t('tabs.journal') : 
                         tab === 'PROCEEDING' ? t('tabs.proceeding') : 
                         t('tabs.article')}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-unaicBlue/20 transition shadow-sm"
                />
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-unaicBlue" />
                </div>
            ) : filteredPublications.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-600">Belum ada data</h3>
                    <p className="text-gray-400">{t('noData')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPublications.map((item) => (
                        <div key={item.id} className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2 rounded-lg ${
                                    item.type === 'JOURNAL' ? 'bg-amber-50 text-amber-600' :
                                    item.type === 'PROCEEDING' ? 'bg-purple-50 text-purple-600' :
                                    'bg-cyan-50 text-cyan-600'
                                }`}>
                                    {item.type === 'JOURNAL' ? <BookOpen size={20} /> : 
                                     item.type === 'PROCEEDING' ? <Users size={20} /> : 
                                     <FileText size={20} />}
                                </div>
                                <div className="flex gap-1">
                                    <button 
                                        onClick={() => handleOpenModal(item)}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="font-bold text-gray-800 mb-2 line-clamp-2" title={item.title}>
                                {item.title}
                            </h3>

                            {item.authors && (
                                <p className="text-sm text-gray-500 mb-3 line-clamp-1">
                                    <Users size={14} className="inline mr-1" /> {item.authors}
                                </p>
                            )}

                            <div className="mt-auto space-y-3 pt-4 border-t border-gray-50">
                                {item.year && (
                                    <div className="flex items-center text-xs text-gray-400 font-medium">
                                        <Calendar size={14} className="mr-1.5" />
                                        {item.year}
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    {item.link && (
                                        <a href={item.link} target="_blank" className="flex-1 text-xs text-center py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-1.5">
                                            <ExternalLink size={12} /> Link
                                        </a>
                                    )}
                                    {item.pdfUrl && (
                                        <a href={item.pdfUrl} target="_blank" className="flex-1 text-xs text-center py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex items-center justify-center gap-1.5">
                                            <Download size={12} /> PDF
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
                        >
                            <form onSubmit={handleSubmit}>
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                                    <h2 className="text-xl font-bold text-gray-800">
                                        {editingItem ? 'Edit Data' : 'Tambah Data'} - {activeTab}
                                    </h2>
                                    <button 
                                        type="button" 
                                        onClick={() => setIsModalOpen(false)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="p-6 space-y-4">
                                    {/* Titles */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Judul (Indonesia)</label>
                                            <input
                                                required
                                                className="w-full p-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-unaicBlue/20 focus:border-unaicBlue outline-none transition"
                                                value={formData.title}
                                                onChange={e => setFormData({...formData, title: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Title (English)</label>
                                            <input
                                                className="w-full p-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-unaicBlue/20 focus:border-unaicBlue outline-none transition bg-gray-50"
                                                value={formData.titleEn}
                                                onChange={e => setFormData({...formData, titleEn: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    {/* Authors & Year */}
                                    {activeTab !== 'JOURNAL' && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="md:col-span-2 space-y-1">
                                                <label className="text-sm font-medium text-gray-700">Penulis / Authors</label>
                                                <input
                                                    className="w-full p-2.5 rounded-lg border border-gray-200"
                                                    value={formData.authors}
                                                    onChange={e => setFormData({...formData, authors: e.target.value})}
                                                    placeholder="Nama Penulis 1, Penulis 2, dst"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-gray-700">Tahun</label>
                                                <input
                                                    className="w-full p-2.5 rounded-lg border border-gray-200"
                                                    value={formData.year}
                                                    onChange={e => setFormData({...formData, year: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Links */}
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Link Eksternal / Website</label>
                                            <input
                                                className="w-full p-2.5 rounded-lg border border-gray-200"
                                                value={formData.link}
                                                onChange={e => setFormData({...formData, link: e.target.value})}
                                                placeholder="https://..."
                                            />
                                        </div>
                                        {activeTab !== 'JOURNAL' && (
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-gray-700">Link PDF / Download</label>
                                                <input
                                                    className="w-full p-2.5 rounded-lg border border-gray-200"
                                                    value={formData.pdfUrl}
                                                    onChange={e => setFormData({...formData, pdfUrl: e.target.value})}
                                                    placeholder="https://... (Google Drive / Direct Link)"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Descriptions */}
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Deskripsi</label>
                                        <textarea
                                            rows={3}
                                            className="w-full p-2.5 rounded-lg border border-gray-200"
                                            value={formData.description}
                                            onChange={e => setFormData({...formData, description: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Description (EN)</label>
                                        <textarea
                                            rows={3}
                                            className="w-full p-2.5 rounded-lg border border-gray-200 bg-gray-50"
                                            value={formData.descriptionEn}
                                            onChange={e => setFormData({...formData, descriptionEn: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="px-5 py-2.5 bg-unaicBlue text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-900/10 flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                        Simpan Data
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
