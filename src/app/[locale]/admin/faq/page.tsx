"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2, Edit, Search, HelpCircle, ChevronDown, ChevronUp, Sparkles } from "lucide-react";

interface FAQItem {
    id: string;
    question: string;
    questionEn?: string;
    answer: string;
    answerEn?: string;
    category: string;
    categoryEn?: string; // Optional if categories are fixed/translatable via keys, but easy to store for now
}

const CATEGORIES = ["Akademik", "Pendaftaran", "Beasiswa", "Fasilitas", "Lainnya"];

// Translation Button Component
const TranslateBtn = ({ onClick, isTranslating }: { onClick: () => void, isTranslating?: boolean }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={isTranslating}
        className="text-[10px] flex items-center gap-1 text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded transition disabled:opacity-50 font-bold uppercase tracking-wider whitespace-nowrap"
    >
        {isTranslating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
        Auto Translate
    </button>
);

export default function AdminFAQPage() {
    const [faqs, setFaqs] = useState<FAQItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [filterCategory, setFilterCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    // Translation state
    const [translatingState, setTranslatingState] = useState<Record<string, boolean>>({});

    // Form State
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<FAQItem>>({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/faq', { cache: 'no-store' });
            const json = await res.json();
            setFaqs(json);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTranslate = async (text: string, field: 'question' | 'answer') => {
        if (!text) return;
        const targetField = field === 'question' ? 'questionEn' : 'answerEn';

        setTranslatingState(prev => ({ ...prev, [targetField]: true }));

        try {
            const res = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, targetLanguage: 'English' })
            });
            const data = await res.json();
            if (data.translatedText) {
                setFormData(prev => ({ ...prev, [targetField]: data.translatedText }));
            }
        } catch (error) {
            console.error("Translation failed", error);
            alert("Gagal menerjemahkan.");
        } finally {
            setTranslatingState(prev => ({ ...prev, [targetField]: false }));
        }
    };

    const handleSave = async () => {
        if (!formData.question || !formData.answer || !formData.category) {
            alert("Pertanyaan, Jawaban, dan Kategori wajib diisi.");
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/faq', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Gagal menyimpan data');
            alert('FAQ berhasil disimpan!');
            setIsEditing(false);
            setFormData({});
            fetchData();
        } catch (e: any) {
            alert('Gagal menyimpan: ' + e.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus pertanyaan ini?")) return;
        try {
            const res = await fetch(`/api/admin/faq?id=${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Gagal menghapus');
            fetchData();
        } catch (e: any) {
            alert('Gagal menghapus: ' + e.message);
        }
    }

    // Filtered data
    const filteredFaqs = faqs.filter(item => {
        const matchCategory = filterCategory === "All" || item.category === filterCategory;
        const matchSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    if (isEditing) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-xl font-bold text-unaicNavy">{formData.id ? "Edit FAQ" : "Tambah FAQ Baru"}</h2>
                    <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">Kembali</button>
                </div>

                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Kategori</label>
                            <select className="w-full border rounded-lg p-3 text-sm" value={formData.category || "Akademik"} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        {/* Question Section */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Pertanyaan (ID)</label>
                                    <TranslateBtn onClick={() => handleTranslate(formData.question || "", 'question')} isTranslating={translatingState.questionEn} />
                                </div>
                                <input
                                    className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-unaicBlue"
                                    placeholder="Tulis pertanyaan..."
                                    value={formData.question || ""}
                                    onChange={e => setFormData({ ...formData, question: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Pertanyaan (EN)</label>
                                <input
                                    className="w-full border rounded-lg p-3 text-sm bg-blue-50/20"
                                    placeholder="English question..."
                                    value={formData.questionEn || ""}
                                    onChange={e => setFormData({ ...formData, questionEn: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Answer Section */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Jawaban (ID)</label>
                                    <TranslateBtn onClick={() => handleTranslate(formData.answer || "", 'answer')} isTranslating={translatingState.answerEn} />
                                </div>
                                <textarea
                                    className="w-full border rounded-lg p-3 text-sm h-40 focus:ring-2 focus:ring-unaicBlue"
                                    placeholder="Tulis jawaban lengkap..."
                                    value={formData.answer || ""}
                                    onChange={e => setFormData({ ...formData, answer: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Answer (EN)</label>
                                <textarea
                                    className="w-full border rounded-lg p-3 text-sm h-40 bg-blue-50/20"
                                    placeholder="English answer..."
                                    value={formData.answerEn || ""}
                                    onChange={e => setFormData({ ...formData, answerEn: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button onClick={() => setIsEditing(false)} className="px-6 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200">Batal</button>
                        <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 rounded-lg text-white bg-unaicNavy hover:bg-unaicBlue disabled:opacity-50 flex items-center gap-2">
                            {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />} Simpan FAQ
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Manajemen FAQ</h1>

            <div className="flex flex-col sm:flex-row justify-between gap-4">
                {/* Filter Tabs */}
                <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
                    {["All", ...CATEGORIES].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilterCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${filterCategory === cat ? 'bg-unaicNavy text-white shadow' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'}`}
                        >
                            {cat === 'All' ? 'Semua' : cat}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-unaicBlue/20"
                            placeholder="Cari pertanyaan..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button onClick={() => { setFormData({ category: "Akademik" }); setIsEditing(true); }} className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm hover:bg-green-700 shadow-sm whitespace-nowrap">
                        <Plus size={16} /> Tambah
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredFaqs.map(item => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2 flex-1">
                                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded uppercase mb-1">
                                    {item.category}
                                </span>
                                <h3 className="font-bold text-gray-800 text-lg flex items-start gap-2">
                                    <HelpCircle className="w-5 h-5 text-unaicBlue flex-shrink-0 mt-1" />
                                    {item.question}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <p className="text-gray-600 text-sm pl-7 line-clamp-2">{item.answer}</p>
                                    {item.answerEn && <p className="text-gray-400 text-sm pl-7 line-clamp-2 italic border-l-2 border-gray-200">{item.answerEn}</p>}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button onClick={() => { setFormData(item); setIsEditing(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition">
                                    <Edit size={18} />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {filteredFaqs.length === 0 && <div className="text-center py-20 text-gray-400">Tidak ada FAQ ditemukan.</div>}
        </div>
    );
}
