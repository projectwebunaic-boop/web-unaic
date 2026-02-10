"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Loader2, LayoutGrid, HelpCircle, Phone, FileText, Type, Upload } from "lucide-react";

// Interfaces matching baukk.json
interface Hero {
    title: string;
    titleEn?: string;
    subtitle: string;
    subtitleEn?: string;
}

interface Service {
    id: string;
    title: string;
    titleEn?: string;
    description: string;
    descriptionEn?: string; // Corrected from subtitleEn
    icon: string;
    slug?: string;
    content?: string;
    contentEn?: string;
}

interface Audit {
    year: number;
    url: string;
    title: string;
    titleEn?: string;
}

interface FAQ {
    question: string;
    questionEn?: string;
    answer: string;
    answerEn?: string;
}

interface Contact {
    address: string;
    whatsapp: string;
    email: string;
}

export default function AdminBAUKKPage() {
    const [activeTab, setActiveTab] = useState<'hero' | 'services' | 'audits' | 'faqs' | 'contact'>('hero');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadingId, setUploadingId] = useState<string | null>(null);

    // Data States
    const [hero, setHero] = useState<Hero>({ title: "", subtitle: "" });
    const [services, setServices] = useState<Service[]>([]);
    const [audits, setAudits] = useState<Audit[]>([]);
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [contact, setContact] = useState<Contact>({ address: "", whatsapp: "", email: "" });

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
            const res = await fetch('/api/admin/baukk');
            const data = await res.json();

            setHero(data.hero || { title: "", subtitle: "" });
            setServices(data.services || []);
            setAudits(data.audits || []);
            setFaqs(data.faqs || []);
            setContact(data.contact || { address: "", whatsapp: "", email: "" });
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (type: string, payload: any) => {
        setIsSaving(true);
        try {
            await fetch('/api/admin/baukk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, ...payload })
            });
            alert('Perubahan berhasil disimpan!');
        } catch (e) {
            console.error(e);
            alert('Gagal menyimpan.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        if (!e.target.files?.[0]) return;

        setUploadingId(`audit-${idx}`);
        const formData = new FormData();
        formData.append('file', e.target.files[0]);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                const newAudits = [...audits];
                newAudits[idx].url = data.url;
                setAudits(newAudits);
            } else {
                alert('Upload gagal: ' + data.error);
            }
        } catch (error) {
            alert('Terjadi kesalahan saat upload.');
        } finally {
            setUploadingId(null);
        }
    };

    const renderTabButton = (id: typeof activeTab, label: string, Icon: any) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === id ? 'bg-unaicNavy text-white shadow' : 'text-gray-500 hover:text-gray-700'
                }`}
        >
            <Icon size={16} /> {label}
        </button>
    );

    if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Halaman BAUKK</h1>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 bg-white rounded-xl p-2 shadow-sm border border-gray-100 w-full sm:w-fit">
                {renderTabButton('hero', 'Hero Section', Type)}
                {renderTabButton('services', 'Layanan', LayoutGrid)}
                {renderTabButton('audits', 'Audit & Laporan', FileText)}
                {renderTabButton('faqs', 'FAQ', HelpCircle)}
                {renderTabButton('contact', 'Kontak', Phone)}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[500px]">

                {/* HERO TAB */}
                {activeTab === 'hero' && (
                    <div className="space-y-6 max-w-2xl">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-sm font-bold text-gray-600">Judul Utama (ID)</label>
                                <button type="button" onClick={() => translateField(hero.title, (val) => setHero({ ...hero, titleEn: val }))} className="text-[10px] text-blue-600 hover:text-blue-800 font-bold">Auto-Translate ➔ EN</button>
                            </div>
                            <input
                                type="text"
                                value={hero.title}
                                onChange={(e) => setHero({ ...hero, title: e.target.value })}
                                className="w-full p-2 border rounded-lg"
                            />
                            <input
                                type="text"
                                value={hero.titleEn || ""}
                                onChange={(e) => setHero({ ...hero, titleEn: e.target.value })}
                                className="w-full p-2 border rounded-lg bg-blue-50/20"
                                placeholder="Hero Title (EN)"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-sm font-bold text-gray-600">Sub-Judul (ID)</label>
                                <button type="button" onClick={() => translateField(hero.subtitle, (val) => setHero({ ...hero, subtitleEn: val }))} className="text-[10px] text-blue-600 hover:text-blue-800 font-bold">Auto-Translate ➔ EN</button>
                            </div>
                            <textarea
                                value={hero.subtitle}
                                onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                                className="w-full p-2 border rounded-lg h-20"
                            />
                            <textarea
                                value={hero.subtitleEn || ""}
                                onChange={(e) => setHero({ ...hero, subtitleEn: e.target.value })}
                                className="w-full p-2 border rounded-lg h-20 bg-blue-50/20"
                                placeholder="Hero Subtitle (EN)"
                            />
                        </div>
                        <button onClick={() => handleSave('update_hero', { hero })} disabled={isSaving} className="btn-primary flex items-center gap-2 px-4 py-2 bg-unaicNavy text-white rounded-lg">
                            <Save size={16} /> Simpan Hero
                        </button>
                    </div>
                )}

                {/* SERVICES TAB */}
                {activeTab === 'services' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold">Daftar Layanan</h3>
                            <button
                                onClick={() => setServices([...services, { id: crypto.randomUUID(), title: "", description: "", icon: "FileText", slug: "", content: "" }])}
                                className="text-sm text-green-600 hover:bg-green-50 px-3 py-1 rounded-lg flex items-center gap-1"
                            >
                                <Plus size={16} /> Tambah
                            </button>
                        </div>
                        <div className="grid gap-6">
                            {services.map((srv, idx) => (
                                <div key={srv.id} className="border p-4 rounded-xl space-y-3 bg-gray-50">
                                    <div className="flex justify-between">
                                        <span className="text-xs font-bold text-gray-400">Layanan {idx + 1}</span>
                                        <button onClick={() => setServices(services.filter((_, i) => i !== idx))} className="text-red-500"><Trash2 size={16} /></button>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-bold text-gray-400">Judul Layanan (ID)</label>
                                                <button type="button" onClick={() => translateField(srv.title, (val) => {
                                                    const newSrv = [...services];
                                                    newSrv[idx].titleEn = val;
                                                    setServices(newSrv);
                                                })} className="text-[10px] text-blue-600 font-bold">Auto-Translate ➔ EN</button>
                                            </div>
                                            <input
                                                placeholder="Judul"
                                                value={srv.title}
                                                onChange={(e) => {
                                                    const newSrv = [...services];
                                                    newSrv[idx].title = e.target.value;
                                                    if (!newSrv[idx].slug) {
                                                        newSrv[idx].slug = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
                                                    }
                                                    setServices(newSrv);
                                                }}
                                                className="w-full p-2 border rounded bg-white"
                                            />
                                            <input
                                                placeholder="Service Title (EN)"
                                                value={srv.titleEn || ""}
                                                onChange={(e) => {
                                                    const newSrv = [...services];
                                                    newSrv[idx].titleEn = e.target.value;
                                                    setServices(newSrv);
                                                }}
                                                className="w-full p-2 border rounded bg-blue-50/20"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400">Slug (URL)</label>
                                            <input
                                                placeholder="Slug (URL)"
                                                value={srv.slug || ""}
                                                onChange={(e) => {
                                                    const newSrv = [...services];
                                                    newSrv[idx].slug = e.target.value;
                                                    setServices(newSrv);
                                                }}
                                                className="w-full p-2 border rounded font-mono text-sm h-[84px]"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400">Icon Name (Lucide)</label>
                                            <input
                                                placeholder="Icon Name (Lucide)"
                                                value={srv.icon}
                                                onChange={(e) => {
                                                    const newSrv = [...services];
                                                    newSrv[idx].icon = e.target.value;
                                                    setServices(newSrv);
                                                }}
                                                className="w-full p-2 border rounded h-[84px]"
                                            />
                                        </div>
                                        <div className="col-span-1 space-y-1">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-bold text-gray-400">Deskripsi Singkat (ID)</label>
                                                <button type="button" onClick={() => translateField(srv.description, (val) => {
                                                    const newSrv = [...services];
                                                    newSrv[idx].descriptionEn = val;
                                                    setServices(newSrv);
                                                })} className="text-[10px] text-blue-600 font-bold">Auto-Translate ➔ EN</button>
                                            </div>
                                            <textarea
                                                placeholder="Deskripsi Singkat"
                                                value={srv.description}
                                                onChange={(e) => {
                                                    const newSrv = [...services];
                                                    newSrv[idx].description = e.target.value;
                                                    setServices(newSrv);
                                                }}
                                                className="w-full p-2 border rounded h-20"
                                            />
                                            <textarea
                                                placeholder="Short Description (EN)"
                                                value={srv.descriptionEn || ""}
                                                onChange={(e) => {
                                                    const newSrv = [...services];
                                                    newSrv[idx].descriptionEn = e.target.value;
                                                    setServices(newSrv);
                                                }}
                                                className="w-full p-2 border rounded h-20 bg-blue-50/20"
                                            />
                                        </div>
                                        <div className="col-span-2 space-y-1 mt-4">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-bold text-gray-400">Konten Detail (HTML - ID)</label>
                                                <button type="button" onClick={() => translateField(srv.content || "", (val) => {
                                                    const newSrv = [...services];
                                                    newSrv[idx].contentEn = val;
                                                    setServices(newSrv);
                                                })} className="text-[10px] text-blue-600 font-bold">Auto-Translate ➔ EN</button>
                                            </div>
                                            <textarea
                                                placeholder="<p>Isi detail layanan...</p>"
                                                value={srv.content || ""}
                                                onChange={(e) => {
                                                    const newSrv = [...services];
                                                    newSrv[idx].content = e.target.value;
                                                    setServices(newSrv);
                                                }}
                                                className="w-full p-2 border rounded h-32 font-mono text-sm"
                                            />
                                            <textarea
                                                placeholder="<p>Detailed service content (EN)...</p>"
                                                value={srv.contentEn || ""}
                                                onChange={(e) => {
                                                    const newSrv = [...services];
                                                    newSrv[idx].contentEn = e.target.value;
                                                    setServices(newSrv);
                                                }}
                                                className="w-full p-2 border rounded h-32 font-mono text-sm bg-blue-50/20 mt-1"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleSave('update_services', { services })} disabled={isSaving} className="btn-primary flex items-center gap-2 px-4 py-2 bg-unaicNavy text-white rounded-lg">
                            <Save size={16} /> Simpan Layanan
                        </button>
                    </div>
                )}

                {/* AUDITS TAB */}
                {activeTab === 'audits' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold">Laporan Audit</h3>
                            <button
                                onClick={() => setAudits([...audits, { year: new Date().getFullYear(), title: "Laporan Audit", url: "#" }])}
                                className="text-sm text-green-600 hover:bg-green-50 px-3 py-1 rounded-lg flex items-center gap-1"
                            >
                                <Plus size={16} /> Tambah Laporan
                            </button>
                        </div>
                        <div className="space-y-3">
                            {audits.map((audit, idx) => (
                                <div key={idx} className="flex flex-col md:flex-row gap-4 items-start md:items-center bg-gray-50 p-3 rounded-lg border">
                                    <input
                                        type="number"
                                        value={audit.year}
                                        onChange={(e) => {
                                            const newAudits = [...audits];
                                            newAudits[idx].year = parseInt(e.target.value);
                                            setAudits(newAudits);
                                        }}
                                        className="w-24 p-2 border rounded"
                                        placeholder="Tahun"
                                    />
                                    <div className="flex-1 space-y-1">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Judul (ID)</label>
                                            <button type="button" onClick={() => translateField(audit.title, (val) => {
                                                const newAudits = [...audits];
                                                newAudits[idx].titleEn = val;
                                                setAudits(newAudits);
                                            })} className="text-[10px] text-blue-600 font-bold">Auto-Translate ➔ EN</button>
                                        </div>
                                        <input
                                            type="text"
                                            value={audit.title}
                                            onChange={(e) => {
                                                const newAudits = [...audits];
                                                newAudits[idx].title = e.target.value;
                                                setAudits(newAudits);
                                            }}
                                            className="w-full p-2 border rounded"
                                            placeholder="Judul Laporan"
                                        />
                                        <input
                                            type="text"
                                            value={audit.titleEn || ""}
                                            onChange={(e) => {
                                                const newAudits = [...audits];
                                                newAudits[idx].titleEn = e.target.value;
                                                setAudits(newAudits);
                                            }}
                                            className="w-full p-2 border rounded bg-blue-50/20"
                                            placeholder="Report Title (EN)"
                                        />
                                    </div>
                                    <div className="flex-1 flex gap-2 w-full">
                                        <input
                                            type="text"
                                            value={audit.url}
                                            onChange={(e) => {
                                                const newAudits = [...audits];
                                                newAudits[idx].url = e.target.value;
                                                setAudits(newAudits);
                                            }}
                                            className="flex-1 p-2 border rounded text-blue-600 text-sm"
                                            placeholder="Link PDF / Upload"
                                        />
                                        <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg flex items-center gap-2 transition overflow-hidden relative">
                                            {uploadingId === `audit-${idx}` ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                            <span className="text-xs font-medium hidden sm:inline">Upload</span>
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={(e) => handleFileUpload(e, idx)}
                                            />
                                        </label>
                                    </div>
                                    <button onClick={() => setAudits(audits.filter((_, i) => i !== idx))} className="text-red-500 p-2"><Trash2 size={18} /></button>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleSave('update_audits', { audits })} disabled={isSaving} className="btn-primary flex items-center gap-2 px-4 py-2 bg-unaicNavy text-white rounded-lg">
                            <Save size={16} /> Simpan Laporan
                        </button>
                    </div>
                )}

                {/* FAQS TAB */}
                {activeTab === 'faqs' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold">Pertanyaan Umum (FAQ)</h3>
                            <button
                                onClick={() => setFaqs([...faqs, { question: "", answer: "" }])}
                                className="text-sm text-green-600 hover:bg-green-50 px-3 py-1 rounded-lg flex items-center gap-1"
                            >
                                <Plus size={16} /> Tambah FAQ
                            </button>
                        </div>
                        <div className="space-y-4">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="bg-gray-50 p-4 rounded-xl border space-y-2">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-xs font-bold text-gray-400">Pertanyaan {idx + 1}</span>
                                        <button onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))} className="text-red-500"><Trash2 size={16} /></button>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-bold text-gray-400">Pertanyaan (ID)</label>
                                            <button type="button" onClick={() => translateField(faq.question, (val) => {
                                                const newFaqs = [...faqs];
                                                newFaqs[idx].questionEn = val;
                                                setFaqs(newFaqs);
                                            })} className="text-[10px] text-blue-600 font-bold">Auto-Translate ➔ EN</button>
                                        </div>
                                        <input
                                            value={faq.question}
                                            onChange={(e) => {
                                                const newFaqs = [...faqs];
                                                newFaqs[idx].question = e.target.value;
                                                setFaqs(newFaqs);
                                            }}
                                            className="w-full p-2 border rounded font-semibold"
                                            placeholder="Pertanyaan?"
                                        />
                                        <input
                                            value={faq.questionEn || ""}
                                            onChange={(e) => {
                                                const newFaqs = [...faqs];
                                                newFaqs[idx].questionEn = e.target.value;
                                                setFaqs(newFaqs);
                                            }}
                                            className="w-full p-2 border rounded font-semibold bg-blue-50/20"
                                            placeholder="Question (EN)?"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-bold text-gray-400">Jawaban (ID)</label>
                                            <button type="button" onClick={() => translateField(faq.answer, (val) => {
                                                const newFaqs = [...faqs];
                                                newFaqs[idx].answerEn = val;
                                                setFaqs(newFaqs);
                                            })} className="text-[10px] text-blue-600 font-bold">Auto-Translate ➔ EN</button>
                                        </div>
                                        <textarea
                                            value={faq.answer}
                                            onChange={(e) => {
                                                const newFaqs = [...faqs];
                                                newFaqs[idx].answer = e.target.value;
                                                setFaqs(newFaqs);
                                            }}
                                            className="w-full p-2 border rounded h-20 text-sm"
                                            placeholder="Jawaban..."
                                        />
                                        <textarea
                                            value={faq.answerEn || ""}
                                            onChange={(e) => {
                                                const newFaqs = [...faqs];
                                                newFaqs[idx].answerEn = e.target.value;
                                                setFaqs(newFaqs);
                                            }}
                                            className="w-full p-2 border rounded h-20 text-sm bg-blue-50/20 mt-1"
                                            placeholder="Answer (EN)..."
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleSave('update_faqs', { faqs })} disabled={isSaving} className="btn-primary flex items-center gap-2 px-4 py-2 bg-unaicNavy text-white rounded-lg">
                            <Save size={16} /> Simpan FAQ
                        </button>
                    </div>
                )}

                {/* CONTACT TAB */}
                {activeTab === 'contact' && (
                    <div className="space-y-6 max-w-2xl">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-600">Alamat Kantor</label>
                            <textarea
                                value={contact.address}
                                onChange={(e) => setContact({ ...contact, address: e.target.value })}
                                className="w-full p-3 rounded-lg border h-24"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-600">Nomor WhatsApp</label>
                            <input
                                type="text"
                                value={contact.whatsapp}
                                onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                                className="w-full p-3 rounded-lg border"
                                placeholder="628..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-600">Email Kontak</label>
                            <input
                                type="email"
                                value={contact.email}
                                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                                className="w-full p-3 rounded-lg border"
                            />
                        </div>
                        <button onClick={() => handleSave('update_contact', { contact })} disabled={isSaving} className="btn-primary flex items-center gap-2 px-4 py-2 bg-unaicNavy text-white rounded-lg">
                            <Save size={16} /> Simpan Kontak
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
