"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Loader2, FileText, AlertCircle, ChevronDown, ChevronUp, Languages, Upload, ExternalLink } from "lucide-react";

interface AcademicPolicy {
    id?: string;
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    pdfUrl: string;
    purpose: string;
    purposeEn: string;
    scope: string;
    scopeEn: string;
    lastUpdate: string;
    responsible: string;
    responsibleEn: string;
    order: number;
}

export default function AdminPoliciesPage() {
    const [items, setItems] = useState<AcademicPolicy[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
    const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        try {
            const res = await fetch("/api/admin/policies");
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            }
        } catch (error) {
            console.error("Failed to fetch policies", error);
        } finally {
            setIsLoading(false);
        }
    };

    const addItem = () => {
        const newItem: AcademicPolicy = {
            title: "",
            titleEn: "",
            description: "",
            descriptionEn: "",
            pdfUrl: "",
            purpose: "",
            purposeEn: "",
            scope: "",
            scopeEn: "",
            lastUpdate: "",
            responsible: "",
            responsibleEn: "",
            order: items.length
        };
        setItems([...items, newItem]);
        setExpandedIdx(items.length); // Expand the new item
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
        if (expandedIdx === index) setExpandedIdx(null);
    };

    const updateItem = (index: number, field: keyof AcademicPolicy, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage({ type: "", text: "" });
        try {
            const res = await fetch("/api/admin/policies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items })
            });
            const result = await res.json();
            if (result.success) {
                setItems(result.data);
                setMessage({ type: "success", text: "Kebijakan berhasil disimpan!" });
                setTimeout(() => setMessage({ type: "", text: "" }), 3000);
            } else {
                setMessage({ type: "error", text: result.error || "Gagal menyimpan kebijakan." });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Terjadi kesalahan saat menyimpan." });
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingIdx(index);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.url) {
                updateItem(index, 'pdfUrl', data.url);
            }
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setUploadingIdx(null);
        }
    };

    const translateRow = async (index: number) => {
        const item = items[index];
        const fieldsToTranslate: (keyof AcademicPolicy)[] = [
            'title', 'description', 'purpose', 'scope', 'responsible'
        ];

        try {
            const newItems = [...items];
            for (const field of fieldsToTranslate) {
                const value = item[field] as string;
                if (value && !item[`${field}En` as keyof AcademicPolicy]) {
                    const res = await fetch('/api/translate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: value, targetLanguage: 'English' })
                    });
                    const data = await res.json();
                    if (data.translatedText) {
                        (newItems[index] as any)[`${field}En`] = data.translatedText;
                    }
                }
            }
            setItems(newItems);
        } catch (error) {
            console.error("Translation failed", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-unaicBlue" size={48} />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-3">
                        <FileText className="text-unaicBlue" /> Kebijakan Akademik
                    </h1>
                    <p className="text-sm text-gray-500 font-medium">Kelola dokumen standar dan aturan akademik.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={addItem}
                        className="flex items-center gap-2 bg-blue-50 text-unaicNavy px-5 py-2.5 rounded-2xl font-bold hover:bg-blue-100 transition shadow-sm"
                    >
                        <Plus size={18} /> Tambah Kebijakan
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-unaicNavy text-white px-8 py-2.5 rounded-2xl font-bold hover:bg-unaicBlue transition shadow-lg disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Simpan Perubahan
                    </button>
                </div>
            </div>

            {message.text && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
                    }`}>
                    {message.type === "success" ? <Save size={18} /> : <AlertCircle size={18} />}
                    {message.text}
                </div>
            )}

            <div className="space-y-4">
                {items.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div
                            className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-50 text-unaicNavy rounded-full flex items-center justify-center font-bold">
                                    {idx + 1}
                                </div>
                                <h3 className="font-bold text-gray-800">{item.title || "Kebijakan Baru"}</h3>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeItem(idx); }}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                                >
                                    <Trash2 size={18} />
                                </button>
                                {expandedIdx === idx ? <ChevronUp size={24} className="text-gray-400" /> : <ChevronDown size={24} className="text-gray-400" />}
                            </div>
                        </div>

                        {expandedIdx === idx && (
                            <div className="p-6 border-t border-gray-50 bg-gray-50/30 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* ID Fields */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Konten (Bahasa Indonesia)</span>
                                            <button
                                                onClick={() => translateRow(idx)}
                                                className="flex items-center gap-1 text-xs text-blue-600 font-bold hover:underline"
                                            >
                                                <Languages size={14} /> Terjemahkan ke EN
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="block text-xs font-bold text-gray-700">Judul Kebijakan</label>
                                            <input
                                                className="w-full p-3 rounded-2xl border border-gray-200 text-sm focus:ring-2 focus:ring-unaicBlue outline-none"
                                                value={item.title}
                                                onChange={e => updateItem(idx, 'title', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="block text-xs font-bold text-gray-700">Deskripsi Singkat</label>
                                            <textarea
                                                className="w-full p-3 rounded-2xl border border-gray-200 text-sm focus:ring-2 focus:ring-unaicBlue outline-none h-24"
                                                value={item.description}
                                                onChange={e => updateItem(idx, 'description', e.target.value)}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold text-gray-700">Tujuan</label>
                                                <input
                                                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-unaicBlue outline-none"
                                                    value={item.purpose || ""}
                                                    onChange={e => updateItem(idx, 'purpose', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold text-gray-700">Ruang Lingkup</label>
                                                <input
                                                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-unaicBlue outline-none"
                                                    value={item.scope || ""}
                                                    onChange={e => updateItem(idx, 'scope', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold text-gray-700">Penanggung Jawab</label>
                                            <input
                                                className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-unaicBlue outline-none"
                                                value={item.responsible || ""}
                                                onChange={e => updateItem(idx, 'responsible', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* EN Fields */}
                                    <div className="space-y-4">
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest block">Content (English)</span>
                                        <div className="space-y-3">
                                            <label className="block text-xs font-bold text-gray-700">Policy Title</label>
                                            <input
                                                className="w-full p-3 rounded-2xl border border-gray-200 text-sm focus:ring-2 focus:ring-unaicBlue outline-none bg-blue-50/10"
                                                value={item.titleEn || ""}
                                                onChange={e => updateItem(idx, 'titleEn', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="block text-xs font-bold text-gray-700">Short Description</label>
                                            <textarea
                                                className="w-full p-3 rounded-2xl border border-gray-200 text-sm focus:ring-2 focus:ring-unaicBlue outline-none h-24 bg-blue-50/10"
                                                value={item.descriptionEn || ""}
                                                onChange={e => updateItem(idx, 'descriptionEn', e.target.value)}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold text-gray-700">Purpose</label>
                                                <input
                                                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-unaicBlue outline-none bg-blue-50/10"
                                                    value={item.purposeEn || ""}
                                                    onChange={e => updateItem(idx, 'purposeEn', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold text-gray-700">Scope</label>
                                                <input
                                                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-unaicBlue outline-none bg-blue-50/10"
                                                    value={item.scopeEn || ""}
                                                    onChange={e => updateItem(idx, 'scopeEn', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold text-gray-700">Responsible Party</label>
                                            <input
                                                className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-unaicBlue outline-none bg-blue-50/10"
                                                value={item.responsibleEn || ""}
                                                onChange={e => updateItem(idx, 'responsibleEn', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-gray-700 uppercase">Dokumen PDF URL</label>
                                        <div className="flex gap-2">
                                            <input
                                                className="flex-1 p-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-unaicBlue outline-none bg-gray-50"
                                                value={item.pdfUrl}
                                                readOnly
                                                placeholder="/docs/policies/..."
                                            />
                                            <label className="cursor-pointer bg-blue-50 text-unaicNavy px-4 py-2 rounded-xl font-bold text-sm hover:bg-blue-100 transition whitespace-nowrap flex items-center gap-2">
                                                {uploadingIdx === idx ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                                Upload PDF
                                                <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileUpload(e, idx)} />
                                            </label>
                                            {item.pdfUrl && (
                                                <a href={item.pdfUrl} target="_blank" className="p-3 text-gray-400 hover:text-unaicBlue transition bg-gray-50 rounded-xl">
                                                    <ExternalLink size={20} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-gray-700 uppercase">Terakhir Diperbarui</label>
                                        <input
                                            className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-unaicBlue outline-none"
                                            value={item.lastUpdate || ""}
                                            onChange={e => updateItem(idx, 'lastUpdate', e.target.value)}
                                            placeholder="contoh: Januari 2025"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {items.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium italic">Belum ada kebijakan akademik. Klik "Tambah Kebijakan" untuk memulai.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
