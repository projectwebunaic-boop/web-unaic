"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Loader2, LayoutGrid, CheckSquare, FileText, X, Eye, BarChart3, Phone } from "lucide-react";

interface Service {
    id: string;
    title: string;
    titleEn?: string;
    description: string;
    descriptionEn?: string;
    link: string;
    icon: string;
    slug?: string;
    content?: string;
    contentEn?: string;
    category?: string;
}

interface Question {
    text: string;
}

interface Contact {
    address: string;
    whatsapp: string;
    email: string;
}

interface Response {
    id: string;
    name: string;
    submittedAt: string;
    responses: Record<string, string>;
    suggestions: string;
}

export default function AdminBAAKPage() {
    const [activeTab, setActiveTab] = useState<'services' | 'questions' | 'responses' | 'analysis' | 'contact'>('services');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Data States
    const [services, setServices] = useState<Service[]>([]);
    const [questions, setQuestions] = useState<string[]>([]);
    const [responses, setResponses] = useState<Response[]>([]);
    const [contact, setContact] = useState<Contact>({ address: "", whatsapp: "", email: "" });

    // Detail Modal State
    const [selectedResponse, setSelectedResponse] = useState<Response | null>(null);

    const translateField = async (text: string, callback: (translated: string) => void) => {
        if (!text) return;
        try {
            const res = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, targetLanguage: 'English' })
            });
            const data = await res.json();
            if (data.translatedText) {
                callback(data.translatedText);
            }
        } catch (error) {
            console.error("Translation failed", error);
            alert("Gagal menerjemahkan.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [settingsRes, responsesRes] = await Promise.all([
                fetch('/api/admin/baak'),
                fetch('/api/admin/baak?type=responses')
            ]);

            const settingsData = await settingsRes.json();
            const responsesData = await responsesRes.json();

            setServices(settingsData.services || []);
            setQuestions(settingsData.questions || []);
            setContact(settingsData.contact || { address: "", whatsapp: "", email: "" });
            setResponses(responsesData || []);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveServices = async () => {
        setIsSaving(true);
        try {
            await fetch('/api/admin/baak', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'update_services', services })
            });
            alert('Layanan berhasil disimpan!');
        } catch (e) {
            alert('Gagal menyimpan.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveQuestions = async () => {
        setIsSaving(true);
        try {
            await fetch('/api/admin/baak', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'update_questions', questions })
            });
            alert('Pertanyaan berhasil disimpan!');
        } catch (e) {
            alert('Gagal menyimpan.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveContact = async () => {
        setIsSaving(true);
        try {
            await fetch('/api/admin/baak', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'update_contact', contact })
            });
            alert('Kontak berhasil disimpan!');
        } catch (e) {
            alert('Gagal menyimpan.');
        } finally {
            setIsSaving(false);
        }
    };

    // Analysis Helpers
    const getAnalysis = () => {
        const stats: Record<string, { K: number, C: number, B: number, BS: number }> = {};

        questions.forEach((q, idx) => {
            stats[idx] = { K: 0, C: 0, B: 0, BS: 0 };
        });

        responses.forEach(r => {
            Object.entries(r.responses).forEach(([qIdx, answer]) => {
                if (stats[qIdx] && stats[qIdx][answer as keyof typeof stats[typeof qIdx]]) {
                    stats[qIdx][answer as keyof typeof stats[typeof qIdx]]++;
                }
            });
        });

        return stats;
    };

    const stats = getAnalysis();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Manajemen BAAK (Updated)</h1>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 bg-white rounded-xl p-2 shadow-sm border border-gray-100 w-full sm:w-fit">
                <button
                    onClick={() => setActiveTab('services')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'services' ? 'bg-unaicNavy text-white shadow' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <LayoutGrid size={16} /> Layanan
                </button>
                <button
                    onClick={() => setActiveTab('questions')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'questions' ? 'bg-unaicNavy text-white shadow' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <CheckSquare size={16} /> Kuisioner
                </button>
                <button
                    onClick={() => setActiveTab('contact')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'contact' ? 'bg-unaicNavy text-white shadow' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Phone size={16} /> Kontak
                </button>
                <button
                    onClick={() => setActiveTab('responses')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'responses' ? 'bg-unaicNavy text-white shadow' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <FileText size={16} /> Data Respon
                </button>
                <button
                    onClick={() => setActiveTab('analysis')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'analysis' ? 'bg-unaicNavy text-white shadow' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <BarChart3 size={16} /> Analisis & Evaluasi
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-unaicBlue" /></div>
            ) : (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[500px]">
                    {/* SERVICES TAB */}
                    {
                        activeTab === 'services' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-gray-800">Daftar Layanan</h3>
                                    <button
                                        onClick={() => setServices([...services, { id: crypto.randomUUID(), title: "", description: "", link: "#", icon: "FileText", slug: "", content: "", category: "Lainnya" }])}
                                        className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-sm font-medium flex items-center gap-1"
                                    >
                                        <Plus size={16} /> Tambah Layanan
                                    </button>
                                </div>

                                <div className="grid gap-6">
                                    {services.map((service, idx) => (
                                        <div key={service.id} className="p-4 border border-gray-200 rounded-xl space-y-3 bg-gray-50/50">
                                            <div className="flex justify-between">
                                                <span className="text-xs font-bold text-gray-400 uppercase">Layanan {idx + 1}</span>
                                                <button onClick={() => setServices(services.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <label className="text-xs font-semibold text-gray-500">Judul Layanan (ID)</label>
                                                        <button
                                                            onClick={() => translateField(service.title, (val) => {
                                                                const newServices = [...services];
                                                                newServices[idx].titleEn = val;
                                                                setServices(newServices);
                                                            })}
                                                            className="text-[10px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-0.5"
                                                        >
                                                            Auto-Translate ➔ EN
                                                        </button>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={service.title}
                                                        onChange={(e) => {
                                                            const newServices = [...services];
                                                            newServices[idx].title = e.target.value;
                                                            // Auto-slug if empty
                                                            if (!newServices[idx].slug) {
                                                                newServices[idx].slug = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
                                                            }
                                                            setServices(newServices);
                                                        }}
                                                        className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                                                        placeholder="Nama Layanan (Indonesian)"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-gray-500">Judul Layanan (EN)</label>
                                                    <input
                                                        type="text"
                                                        value={service.titleEn || ""}
                                                        onChange={(e) => {
                                                            const newServices = [...services];
                                                            newServices[idx].titleEn = e.target.value;
                                                            setServices(newServices);
                                                        }}
                                                        className="w-full p-2 rounded-lg border border-gray-300 text-sm bg-blue-50/30"
                                                        placeholder="Service Title (English)"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-gray-500">Kategori</label>
                                                    <select
                                                        value={service.category || "Lainnya"}
                                                        onChange={(e) => {
                                                            const newServices = [...services];
                                                            newServices[idx].category = e.target.value;
                                                            setServices(newServices);
                                                        }}
                                                        className="w-full p-2 rounded-lg border border-gray-300 text-sm bg-white"
                                                    >
                                                        <option value="Akademik">Layanan Akademik</option>
                                                        <option value="Kemahasiswaan">Layanan Kemahasiswaan</option>
                                                        <option value="Administrasi">Administrasi & Umum</option>
                                                        <option value="Lainnya">Lainnya</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-gray-500">Slug (URL)</label>
                                                    <input
                                                        type="text"
                                                        value={service.slug || ""}
                                                        onChange={(e) => {
                                                            const newServices = [...services];
                                                            newServices[idx].slug = e.target.value;
                                                            setServices(newServices);
                                                        }}
                                                        className="w-full p-2 rounded-lg border border-gray-300 text-sm font-mono text-gray-600"
                                                        placeholder="pelayanan-akademik"
                                                    />
                                                </div>
                                                <div className="col-span-full grid md:grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <label className="text-xs font-semibold text-gray-500">Deskripsi Singkat (ID)</label>
                                                            <button
                                                                onClick={() => translateField(service.description, (val) => {
                                                                    const newServices = [...services];
                                                                    newServices[idx].descriptionEn = val;
                                                                    setServices(newServices);
                                                                })}
                                                                className="text-[10px] text-blue-600 hover:text-blue-800 font-bold"
                                                            >
                                                                Auto-Translate ➔ EN
                                                            </button>
                                                        </div>
                                                        <textarea
                                                            value={service.description}
                                                            onChange={(e) => {
                                                                const newServices = [...services];
                                                                newServices[idx].description = e.target.value;
                                                                setServices(newServices);
                                                            }}
                                                            className="w-full p-2 rounded-lg border border-gray-300 text-sm h-20"
                                                            placeholder="Deskripsi layanan (ID)..."
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-semibold text-gray-500">Deskripsi Singkat (EN)</label>
                                                        <textarea
                                                            value={service.descriptionEn || ""}
                                                            onChange={(e) => {
                                                                const newServices = [...services];
                                                                newServices[idx].descriptionEn = e.target.value;
                                                                setServices(newServices);
                                                            }}
                                                            className="w-full p-2 rounded-lg border border-gray-300 text-sm h-20 bg-blue-50/30"
                                                            placeholder="Short Description (EN)..."
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-span-full grid md:grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <label className="text-xs font-semibold text-gray-500">Konten Detail (ID)</label>
                                                            <button
                                                                onClick={() => translateField(service.content || "", (val) => {
                                                                    const newServices = [...services];
                                                                    newServices[idx].contentEn = val;
                                                                    setServices(newServices);
                                                                })}
                                                                className="text-[10px] text-blue-600 hover:text-blue-800 font-bold"
                                                            >
                                                                Auto-Translate ➔ EN
                                                            </button>
                                                        </div>
                                                        <textarea
                                                            value={service.content || ""}
                                                            onChange={(e) => {
                                                                const newServices = [...services];
                                                                newServices[idx].content = e.target.value;
                                                                setServices(newServices);
                                                            }}
                                                            className="w-full p-2 rounded-lg border border-gray-300 text-sm h-40 font-mono"
                                                            placeholder="<p>Isi detail (ID)...</p>"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-semibold text-gray-500">Konten Detail (EN)</label>
                                                        <textarea
                                                            value={service.contentEn || ""}
                                                            onChange={(e) => {
                                                                const newServices = [...services];
                                                                newServices[idx].contentEn = e.target.value;
                                                                setServices(newServices);
                                                            }}
                                                            className="w-full p-2 rounded-lg border border-gray-300 text-sm h-40 font-mono bg-blue-50/30"
                                                            placeholder="<p>Detail content (EN)...</p>"
                                                        />
                                                    </div>
                                                </div>
                                                <p className="col-span-full text-xs text-gray-400">Gunakan tag HTML sederhana untuk format teks.</p>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-gray-500">Link Eksternal (Opsional)</label>
                                                    <input
                                                        type="text"
                                                        value={service.link}
                                                        onChange={(e) => {
                                                            const newServices = [...services];
                                                            newServices[idx].link = e.target.value;
                                                            setServices(newServices);
                                                        }}
                                                        className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                                                        placeholder="https://... (jika kosong akan mengarah ke detail)"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex justify-end">
                                    <button
                                        onClick={handleSaveServices}
                                        disabled={isSaving}
                                        className="px-6 py-2.5 bg-unaicNavy text-white rounded-xl hover:bg-unaicBlue transition shadow-lg flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Simpan Perubahan
                                    </button>
                                </div>
                            </div>
                        )
                    }

                    {/* QUESTIONS TAB */}
                    {
                        activeTab === 'questions' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-gray-800">Daftar Pertanyaan Survei</h3>
                                    <button
                                        onClick={() => setQuestions([...questions, ""])}
                                        className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-sm font-medium flex items-center gap-1"
                                    >
                                        <Plus size={16} /> Tambah Pertanyaan
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {questions.map((q, idx) => (
                                        <div key={idx} className="flex gap-2 items-center">
                                            <span className="w-6 text-sm text-gray-400 font-mono text-center">{idx + 1}.</span>
                                            <input
                                                type="text"
                                                value={q}
                                                onChange={(e) => {
                                                    const newQ = [...questions];
                                                    newQ[idx] = e.target.value;
                                                    setQuestions(newQ);
                                                }}
                                                className="flex-1 p-2.5 rounded-lg border border-gray-300 text-sm"
                                            />
                                            <button onClick={() => setQuestions(questions.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600 p-2">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex justify-end">
                                    <button
                                        onClick={handleSaveQuestions}
                                        disabled={isSaving}
                                        className="px-6 py-2.5 bg-unaicNavy text-white rounded-xl hover:bg-unaicBlue transition shadow-lg flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Simpan Pertanyaan
                                    </button>
                                </div>
                            </div>
                        )
                    }

                    {/* CONTACT TAB */}
                    {
                        activeTab === 'contact' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-800">Pengaturan Kontak BAAK</h3>

                                <div className="grid gap-6 max-w-2xl">
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-600">Alamat Lengkap</label>
                                        <textarea
                                            value={contact.address}
                                            onChange={(e) => setContact({ ...contact, address: e.target.value })}
                                            className="w-full p-3 rounded-lg border border-gray-300 text-sm h-24 focus:ring-2 focus:ring-unaicBlue focus:border-transparent outline-none transition"
                                            placeholder="Alamat kantor..."
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-600">Nomor WhatsApp</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">+</span>
                                            <input
                                                type="text"
                                                value={contact.whatsapp}
                                                onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                                                className="w-full pl-6 p-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-unaicBlue focus:border-transparent outline-none transition"
                                                placeholder="628..."
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400">Gunakan format internasional (contoh: 62812345678)</p>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-600">Email Resmi</label>
                                        <input
                                            type="email"
                                            value={contact.email}
                                            onChange={(e) => setContact({ ...contact, email: e.target.value })}
                                            className="w-full p-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-unaicBlue focus:border-transparent outline-none transition"
                                            placeholder="baak@..."
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex justify-end">
                                    <button
                                        onClick={handleSaveContact}
                                        disabled={isSaving}
                                        className="px-6 py-2.5 bg-unaicNavy text-white rounded-xl hover:bg-unaicBlue transition shadow-lg flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Simpan Kontak
                                    </button>
                                </div>
                            </div>
                        )
                    }

                    {/* RESPONSES TAB */}
                    {
                        activeTab === 'responses' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-800">Data Respon Masuk ({responses.length})</h3>

                                {responses.length === 0 ? (
                                    <div className="text-center py-10 text-gray-400">Belum ada respon masuk.</div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-gray-500 bg-gray-50 uppercase text-xs">
                                                <tr>
                                                    <th className="px-4 py-3 rounded-tl-lg">Tanggal</th>
                                                    <th className="px-4 py-3">Nama</th>
                                                    <th className="px-4 py-3">Saran</th>
                                                    <th className="px-4 py-3 rounded-tr-lg">Detail</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {responses.map((resp) => (
                                                    <tr key={resp.id} className="hover:bg-gray-50 transition">
                                                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                                                            {new Date(resp.submittedAt).toLocaleDateString('id-ID')}
                                                        </td>
                                                        <td className="px-4 py-3 font-medium text-gray-800">{resp.name}</td>
                                                        <td className="px-4 py-3 text-gray-600 max-w-xs truncate" title={resp.suggestions}>
                                                            {resp.suggestions || "-"}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <button
                                                                onClick={() => setSelectedResponse(resp)}
                                                                className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded hover:bg-blue-100 transition"
                                                            >
                                                                <Eye size={14} /> Lihat Detail
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )
                    }

                    {/* ANALYSIS TAB */}
                    {
                        activeTab === 'analysis' && (
                            <div className="space-y-8">
                                {/* Global Summary Calculation */}
                                {(() => {
                                    let totalValue = 0;
                                    let totalAnswers = 0;

                                    responses.forEach(r => {
                                        Object.values(r.responses).forEach(val => {
                                            if (val === 'K') totalValue += 1;
                                            if (val === 'C') totalValue += 2;
                                            if (val === 'B') totalValue += 3;
                                            if (val === 'BS') totalValue += 4;
                                            totalAnswers++;
                                        });
                                    });

                                    const globalScore = totalAnswers > 0 ? (totalValue / totalAnswers) : 0;
                                    let predicate = "Belum Ada Data";
                                    let color = "text-gray-400";
                                    let bg = "bg-gray-50";

                                    if (totalAnswers > 0) {
                                        if (globalScore >= 3.5) { predicate = "Sangat Baik"; color = "text-green-600"; bg = "bg-green-50"; }
                                        else if (globalScore >= 3.0) { predicate = "Baik"; color = "text-blue-600"; bg = "bg-blue-50"; }
                                        else if (globalScore >= 2.5) { predicate = "Cukup"; color = "text-yellow-600"; bg = "bg-yellow-50"; }
                                        else { predicate = "Kurang"; color = "text-red-600"; bg = "bg-red-50"; }
                                    }

                                    return (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
                                                <span className="text-gray-500 font-medium text-sm uppercase tracking-wider">Total Responden</span>
                                                <span className="text-4xl font-bold text-gray-800">{responses.length}</span>
                                                <span className="text-xs text-gray-400">Mahasiswa / Dosen / Umum</span>
                                            </div>

                                            <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
                                                <span className="text-gray-500 font-medium text-sm uppercase tracking-wider">Indeks Kepuasan</span>
                                                <div className="flex items-end gap-1">
                                                    <span className={`text-4xl font-bold ${color}`}>{globalScore.toFixed(2)}</span>
                                                    <span className="text-sm text-gray-400 mb-1">/ 4.00</span>
                                                </div>
                                                <span className="text-xs text-gray-400">Rata-rata tertimbang</span>
                                            </div>

                                            <div className={`p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center space-y-2 ${bg}`}>
                                                <span className="text-gray-500 font-medium text-sm uppercase tracking-wider">Predikat Mutu</span>
                                                <span className={`text-2xl font-bold ${color}`}>{predicate}</span>
                                                <span className="text-xs text-gray-400">Berdasarkan hasil survei</span>
                                            </div>
                                        </div>
                                    );
                                })()}

                                <div className="flex flex-col gap-4">
                                    <h3 className="text-lg font-bold text-gray-800">Analisis Per Pertanyaan</h3>
                                    <p className="text-gray-600 text-sm">
                                        Detail statistik jawaban untuk setiap poin pertanyaan survei.
                                    </p>
                                </div>

                                <div className="grid gap-6">
                                    {questions.map((q, idx) => {
                                        const qStats = stats[idx] || { K: 0, C: 0, B: 0, BS: 0 };
                                        const total = Object.values(qStats).reduce((a, b) => a + b, 0);

                                        // Calculate simplistic score (1-4 scale)
                                        const score = total === 0 ? 0 :
                                            ((qStats.K * 1) + (qStats.C * 2) + (qStats.B * 3) + (qStats.BS * 4)) / total;

                                        const scoreColor = score >= 3.5 ? 'text-green-600' : score >= 3 ? 'text-blue-600' : score >= 2.5 ? 'text-yellow-600' : 'text-red-600';

                                        return (
                                            <div key={idx} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                                                    <div className="flex gap-3">
                                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-unaicBlue text-white text-xs font-bold">{idx + 1}</span>
                                                        <h4 className="font-medium text-gray-800">{q}</h4>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg border border-gray-100 shadow-sm shrink-0">
                                                        <span className="text-xs text-gray-500 uppercase font-bold">Rata-rata</span>
                                                        <span className={`font-bold text-lg ${scoreColor}`}>{score.toFixed(1)}</span>
                                                        <span className="text-xs text-gray-400">/ 4.0</span>
                                                    </div>
                                                </div>

                                                {/* Progress Bars */}
                                                <div className="space-y-2">
                                                    {[
                                                        { label: 'Sangat Baik (BS)', key: 'BS', color: 'bg-green-500' },
                                                        { label: 'Baik (B)', key: 'B', color: 'bg-blue-500' },
                                                        { label: 'Cukup (C)', key: 'C', color: 'bg-yellow-500' },
                                                        { label: 'Kurang (K)', key: 'K', color: 'bg-red-500' },
                                                    ].map((opt) => (
                                                        <div key={opt.key} className="flex items-center gap-3 text-sm">
                                                            <span className="w-28 text-gray-600 truncate">{opt.label}</span>
                                                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full ${opt.color}`}
                                                                    style={{ width: `${total ? (qStats[opt.key as keyof typeof qStats] / total) * 100 : 0}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="w-12 text-right font-medium text-gray-700">
                                                                {qStats[opt.key as keyof typeof qStats]}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )
                    }


                    {/* DETAIL MODAL */}
                    {
                        selectedResponse && (
                            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedResponse(null)}>
                                <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                                    <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex justify-between items-center z-10">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800">Detail Respon</h3>
                                            <p className="text-sm text-gray-500">{new Date(selectedResponse.submittedAt).toLocaleString('id-ID')}</p>
                                        </div>
                                        <button onClick={() => setSelectedResponse(null)} className="p-2 hover:bg-gray-100 rounded-full">
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase">Nama Responden</label>
                                                <p className="font-medium text-gray-800">{selectedResponse.name}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase">Waktu Submit</label>
                                                <p className="font-medium text-gray-800">{new Date(selectedResponse.submittedAt).toLocaleTimeString('id-ID')}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-bold text-gray-800 border-b pb-2">Jawaban Kuisioner</h4>
                                            <div className="space-y-3">
                                                {questions.map((q, idx) => (
                                                    <div key={idx} className="flex gap-4 items-start justify-between border-b border-gray-50 pb-2 last:border-0">
                                                        <div className="flex gap-3">
                                                            <span className="text-sm font-bold text-gray-400 min-w-[20px]">{idx + 1}.</span>
                                                            <p className="text-sm text-gray-700">{q}</p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${selectedResponse.responses[idx] === 'BS' ? 'bg-green-100 text-green-700' :
                                                            selectedResponse.responses[idx] === 'B' ? 'bg-blue-100 text-blue-700' :
                                                                selectedResponse.responses[idx] === 'C' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                            }`}>
                                                            {selectedResponse.responses[idx] || '-'}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 p-4 rounded-xl">
                                            <h4 className="font-bold text-blue-800 mb-2 text-sm uppercase">Saran & Masukan</h4>
                                            <p className="text-gray-700 italic">"{selectedResponse.suggestions || 'Tidak ada saran.'}"</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            )}
        </div>
    );
}
