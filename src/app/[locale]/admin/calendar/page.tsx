"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Loader2, Calendar, AlertCircle, ListPlus, Upload, FileText as FileIcon, ExternalLink } from "lucide-react";

interface CalendarItem {
    id?: string;
    semester: string;
    semesterEn: string;
    activity: string;
    activityEn: string;
    date: string;
    dateEn: string;
    year: string;
    order: number;
}

export default function AdminCalendarPage() {
    const [items, setItems] = useState<CalendarItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [config, setConfig] = useState({ pdfUrl: "", pdfUrlEn: "" });
    const [isUploading, setIsUploading] = useState<{ id: string; type: 'id' | 'en' } | null>(null);

    useEffect(() => {
        fetchCalendar();
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await fetch("/api/admin/calendar/config");
            if (res.ok) {
                const data = await res.json();
                setConfig({ pdfUrl: data.pdfUrl || "", pdfUrlEn: data.pdfUrlEn || "" });
            }
        } catch (error) {
            console.error("Failed to fetch config", error);
        }
    };

    const fetchCalendar = async () => {
        try {
            const res = await fetch("/api/admin/calendar");
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            }
        } catch (error) {
            console.error("Failed to fetch calendar", error);
        } finally {
            setIsLoading(false);
        }
    };

    const addItem = () => {
        const newItem: CalendarItem = {
            semester: "Ganjil",
            semesterEn: "Odd",
            activity: "",
            activityEn: "",
            date: "",
            dateEn: "",
            year: new Date().getFullYear().toString(),
            order: items.length
        };
        setItems([...items, newItem]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: keyof CalendarItem, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage({ type: "", text: "" });
        try {
            const res = await fetch("/api/admin/calendar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items })
            });
            const result = await res.json();
            if (result.success) {
                setItems(result.data);
                setMessage({ type: "success", text: "Kalender berhasil disimpan!" });
                setTimeout(() => setMessage({ type: "", text: "" }), 3000);
            } else {
                setMessage({ type: "error", text: result.error || "Gagal menyimpan kalender." });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Terjadi kesalahan saat menyimpan." });
        } finally {
            setIsSaving(false);
        }

        // Save config
        try {
            await fetch("/api/admin/calendar/config", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(config)
            });
        } catch (error) {
            console.error("Failed to save config", error);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'id' | 'en') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading({ id: 'config', type });
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.url) {
                setConfig(prev => ({
                    ...prev,
                    [type === 'id' ? 'pdfUrl' : 'pdfUrlEn']: data.url
                }));
            }
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setIsUploading(null);
        }
    };

    const translateRow = async (index: number) => {
        const item = items[index];
        if (!item.activity && !item.date && !item.semester) return;

        try {
            // Translate Activity
            if (item.activity) {
                const res = await fetch('/api/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: item.activity, targetLanguage: 'English' })
                });
                const data = await res.json();
                if (data.translatedText) updateItem(index, 'activityEn', data.translatedText);
            }

            // Translate Date
            if (item.date) {
                const res = await fetch('/api/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: item.date, targetLanguage: 'English' })
                });
                const data = await res.json();
                if (data.translatedText) updateItem(index, 'dateEn', data.translatedText);
            }

            // Translate Semester
            if (item.semester === "Ganjil") updateItem(index, 'semesterEn', "Odd Semester");
            if (item.semester === "Genap") updateItem(index, 'semesterEn', "Even Semester");

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
                        <Calendar className="text-unaicBlue" /> Kalender Akademik
                    </h1>
                    <p className="text-sm text-gray-500 font-medium">Kelola jadwal kegiatan akademik universitas.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={addItem}
                        className="flex items-center gap-2 bg-blue-50 text-unaicNavy px-5 py-2.5 rounded-2xl font-bold hover:bg-blue-100 transition shadow-sm"
                    >
                        <Plus size={18} /> Tambah Agenda
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

            {/* Global Config / PDF Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-gray-800 flex items-center gap-2">
                            <FileIcon size={18} className="text-unaicBlue" /> Kalender PDF (Indonesia)
                        </h2>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="flex-1">
                            <input
                                className="w-full p-2.5 rounded-xl border border-gray-100 text-sm focus:ring-2 focus:ring-unaicBlue outline-none bg-gray-50"
                                value={config.pdfUrl}
                                readOnly
                                placeholder="/docs/kalender.pdf"
                            />
                        </div>
                        <label className="cursor-pointer bg-blue-50 text-unaicNavy px-4 py-2 rounded-xl font-bold text-sm hover:bg-blue-100 transition whitespace-nowrap flex items-center gap-2">
                            {isUploading?.type === 'id' ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                            Upload
                            <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileUpload(e, 'id')} />
                        </label>
                        {config.pdfUrl && (
                            <a href={config.pdfUrl} target="_blank" className="p-2 text-gray-400 hover:text-unaicBlue transition">
                                <ExternalLink size={20} />
                            </a>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-gray-800 flex items-center gap-2">
                            <FileIcon size={18} className="text-unaicBlue" /> Academic Calendar PDF (English)
                        </h2>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="flex-1">
                            <input
                                className="w-full p-2.5 rounded-xl border border-gray-100 text-sm focus:ring-2 focus:ring-unaicBlue outline-none bg-gray-50"
                                value={config.pdfUrlEn}
                                readOnly
                                placeholder="/docs/calendar-en.pdf"
                            />
                        </div>
                        <label className="cursor-pointer bg-blue-50 text-unaicNavy px-4 py-2 rounded-xl font-bold text-sm hover:bg-blue-100 transition whitespace-nowrap flex items-center gap-2">
                            {isUploading?.type === 'en' ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                            Upload
                            <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileUpload(e, 'en')} />
                        </label>
                        {config.pdfUrlEn && (
                            <a href={config.pdfUrlEn} target="_blank" className="p-2 text-gray-400 hover:text-unaicBlue transition">
                                <ExternalLink size={20} />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-400 uppercase text-[10px] font-black tracking-widest border-b border-gray-100">
                                <th className="p-4 text-left w-20 text-center">No</th>
                                <th className="p-4 text-left">Semester (ID / EN)</th>
                                <th className="p-4 text-left">Kegiatan (ID / EN)</th>
                                <th className="p-4 text-left">Tanggal (ID / EN)</th>
                                <th className="p-4 text-left w-32">Tahun</th>
                                <th className="p-4 text-center w-24">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {items.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="p-4 text-center font-bold text-gray-400">{idx + 1}</td>
                                    <td className="p-4 space-y-2">
                                        <input
                                            className="w-full p-2.5 rounded-xl border border-gray-100 text-sm focus:ring-2 focus:ring-unaicBlue outline-none"
                                            value={item.semester}
                                            onChange={e => updateItem(idx, 'semester', e.target.value)}
                                            placeholder="Ganjil / Genap"
                                        />
                                        <input
                                            className="w-full p-2.5 rounded-xl border border-gray-100 text-sm focus:ring-2 focus:ring-unaicBlue outline-none bg-blue-50/20"
                                            value={item.semesterEn || ""}
                                            onChange={e => updateItem(idx, 'semesterEn', e.target.value)}
                                            placeholder="Odd / Even"
                                        />
                                    </td>
                                    <td className="p-4 space-y-2">
                                        <div className="flex gap-2">
                                            <textarea
                                                className="flex-1 p-2.5 rounded-xl border border-gray-100 text-sm focus:ring-2 focus:ring-unaicBlue outline-none resize-none h-20"
                                                value={item.activity}
                                                onChange={e => updateItem(idx, 'activity', e.target.value)}
                                                placeholder="Kegiatan..."
                                            />
                                            <button
                                                onClick={() => translateRow(idx)}
                                                className="p-2 self-start text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="Terjemahkan otomatis"
                                            >
                                                <ListPlus size={18} />
                                            </button>
                                        </div>
                                        <textarea
                                            className="w-full p-2.5 rounded-xl border border-gray-100 text-sm focus:ring-2 focus:ring-unaicBlue outline-none resize-none h-20 bg-blue-50/20"
                                            value={item.activityEn || ""}
                                            onChange={e => updateItem(idx, 'activityEn', e.target.value)}
                                            placeholder="Activity..."
                                        />
                                    </td>
                                    <td className="p-4 space-y-2">
                                        <input
                                            className="w-full p-2.5 rounded-xl border border-gray-100 text-sm focus:ring-2 focus:ring-unaicBlue outline-none"
                                            value={item.date}
                                            onChange={e => updateItem(idx, 'date', e.target.value)}
                                            placeholder="Tanggal..."
                                        />
                                        <input
                                            className="w-full p-2.5 rounded-xl border border-gray-100 text-sm focus:ring-2 focus:ring-unaicBlue outline-none bg-blue-50/20"
                                            value={item.dateEn || ""}
                                            onChange={e => updateItem(idx, 'dateEn', e.target.value)}
                                            placeholder="Date..."
                                        />
                                    </td>
                                    <td className="p-4">
                                        <input
                                            className="w-full p-2.5 rounded-xl border border-gray-100 text-sm focus:ring-2 focus:ring-unaicBlue outline-none"
                                            value={item.year}
                                            onChange={e => updateItem(idx, 'year', e.target.value)}
                                            placeholder="2025/2026"
                                        />
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => removeItem(idx)}
                                            className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-400 font-medium italic">
                                        Belum ada agenda. Klik "Tambah Agenda" untuk memulai.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
