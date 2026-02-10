"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Loader2, LayoutGrid, FileText, Type, Upload, BookOpen, Phone, Languages, Sparkles } from "lucide-react";

interface Hero {
    title: string;
    titleEn?: string;
    subtitle: string;
    subtitleEn?: string;
}

interface TextContent {
    title: string;
    titleEn?: string;
    content: string;
    contentEn?: string;
}

interface Section {
    id: string;
    title: string;
    titleEn?: string;
    content: string;
    contentEn?: string;
    icon: string;
    slug: string;
    detail_content: string;
    detail_contentEn?: string;
}

interface Document {
    id: string;
    title: string;
    titleEn?: string;
    url: string;
}

interface Contact {
    whatsapp: string;
    email: string;
    address: string;
    addressEn?: string;
}

export default function AdminKemahasiswaanBagianPage() {
    const [activeTab, setActiveTab] = useState<'hero' | 'profile' | 'layanan' | 'sections' | 'documents' | 'contact'>('hero');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [uploadingId, setUploadingId] = useState<string | null>(null);

    // Data States
    const [hero, setHero] = useState<Hero>({ title: "", titleEn: "", subtitle: "", subtitleEn: "" });
    // Keep 'profile' and 'layananUmum' simple for now, can extend if needed
    const [profile, setProfile] = useState<TextContent>({ title: "", titleEn: "", content: "", contentEn: "" });
    const [layananUmum, setLayananUmum] = useState<TextContent>({ title: "", titleEn: "", content: "", contentEn: "" });
    const [sections, setSections] = useState<Section[]>([]);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [contact, setContact] = useState<Contact>({ whatsapp: "", email: "", address: "", addressEn: "" });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/kemahasiswaan-bagian');
            const data = await res.json();

            setHero(data.hero || { title: "", titleEn: "", subtitle: "", subtitleEn: "" });
            setProfile(data.profile || { title: "", titleEn: "", content: "", contentEn: "" });
            setLayananUmum(data.layanan_umum || { title: "", titleEn: "", content: "", contentEn: "" });
            // Ensure sections have new fields fallback
            setSections((data.sections || []).map((s: any) => ({
                ...s,
                titleEn: s.titleEn || "",
                contentEn: s.contentEn || "",
                detail_contentEn: s.detail_contentEn || ""
            })));
            setDocuments((data.documents || []).map((d: any) => ({ ...d, titleEn: d.titleEn || "" })));
            setContact(data.contact || { whatsapp: "", email: "", address: "", addressEn: "" });
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (type: string, payload: any) => {
        setIsSaving(true);
        try {
            await fetch('/api/admin/kemahasiswaan-bagian', {
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

    const handleTranslate = async (text: string, targetField: string, setter: Function, currentObj: any) => {
        if (!text) {
            alert("Isi teks bahasa Indonesia terlebih dahulu.");
            return;
        }
        setIsTranslating(true);
        try {
            const res = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, targetLanguage: 'English' })
            });
            const data = await res.json();
            if (data.translatedText) {
                setter({ ...currentObj, [targetField]: data.translatedText });
            }
        } catch (error) {
            console.error("Translation failed", error);
            alert("Gagal menerjemahkan.");
        } finally {
            setIsTranslating(false);
        }
    };

    // For handling section array translations
    const handleTranslateSection = async (text: string, index: number, field: keyof Section) => {
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
                const newSections = [...sections];
                // @ts-ignore
                newSections[index][field] = data.translatedText;
                setSections(newSections);
            }
        } finally {
            setIsTranslating(false);
        }
    };

    // For documents
    const handleTranslateDoc = async (text: string, index: number, field: keyof Document) => {
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
                const newDocs = [...documents];
                // @ts-ignore
                newDocs[index][field] = data.translatedText;
                setDocuments(newDocs);
            }
        } finally {
            setIsTranslating(false);
        }
    };


    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        if (!e.target.files?.[0]) return;

        setUploadingId(id);
        const formData = new FormData();
        formData.append('file', e.target.files[0]);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                const newDocs = [...documents];
                const index = newDocs.findIndex(d => d.id === id);
                if (index !== -1) {
                    newDocs[index].url = data.url;
                    setDocuments(newDocs);
                }
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

    if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Bagian Kemahasiswaan</h1>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 bg-white rounded-xl p-2 shadow-sm border border-gray-100 w-full sm:w-fit">
                {renderTabButton('hero', 'Hero', Type)}
                {renderTabButton('profile', 'Profil', FileText)}
                {renderTabButton('layanan', 'Layanan Umum', LayoutGrid)}
                {renderTabButton('sections', 'Seksi Layanan', BookOpen)}
                {renderTabButton('documents', 'Dokumen', FileText)}
                {renderTabButton('contact', 'Kontak', Phone)}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[500px]">

                {/* HERO TAB */}
                {activeTab === 'hero' && (
                    <div className="space-y-6 max-w-4xl">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600">Judul Hero (ID)</label>
                                <input
                                    type="text"
                                    value={hero.title}
                                    onChange={(e) => setHero({ ...hero, title: e.target.value })}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-gray-600">Judul Hero (EN)</label>
                                    <TranslateBtn onClick={() => handleTranslate(hero.title, 'titleEn', setHero, hero)} />
                                </div>
                                <input
                                    type="text"
                                    value={hero.titleEn || ""}
                                    onChange={(e) => setHero({ ...hero, titleEn: e.target.value })}
                                    className="w-full p-2 border rounded-lg bg-gray-50"
                                    placeholder="English Title"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600">Sub-Judul (ID)</label>
                                <textarea
                                    value={hero.subtitle}
                                    onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                                    className="w-full p-2 border rounded-lg h-24"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-gray-600">Sub-Judul (EN)</label>
                                    <TranslateBtn onClick={() => handleTranslate(hero.subtitle, 'subtitleEn', setHero, hero)} />
                                </div>
                                <textarea
                                    value={hero.subtitleEn || ""}
                                    onChange={(e) => setHero({ ...hero, subtitleEn: e.target.value })}
                                    className="w-full p-2 border rounded-lg h-24 bg-gray-50"
                                    placeholder="English Subtitle"
                                />
                            </div>
                        </div>
                        <button onClick={() => handleSave('update_hero', { hero })} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 bg-unaicNavy text-white rounded-lg hover:bg-opacity-90 transition">
                            <Save size={16} /> Simpan Hero
                        </button>
                    </div>
                )}

                {/* PROFILE TAB */}
                {activeTab === 'profile' && (
                    <div className="space-y-6 max-w-4xl">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600">Judul Profil (ID)</label>
                                <input
                                    type="text"
                                    value={profile.title}
                                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-gray-600">Judul Profil (EN)</label>
                                    <TranslateBtn onClick={() => handleTranslate(profile.title, 'titleEn', setProfile, profile)} />
                                </div>
                                <input
                                    type="text"
                                    value={profile.titleEn || ""}
                                    onChange={(e) => setProfile({ ...profile, titleEn: e.target.value })}
                                    className="w-full p-2 border rounded-lg bg-gray-50"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600">Konten Profil (ID)</label>
                                <textarea
                                    value={profile.content}
                                    onChange={(e) => setProfile({ ...profile, content: e.target.value })}
                                    className="w-full p-2 border rounded-lg h-40"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-gray-600">Konten Profil (EN)</label>
                                    <TranslateBtn onClick={() => handleTranslate(profile.content, 'contentEn', setProfile, profile)} />
                                </div>
                                <textarea
                                    value={profile.contentEn || ""}
                                    onChange={(e) => setProfile({ ...profile, contentEn: e.target.value })}
                                    className="w-full p-2 border rounded-lg h-40 bg-gray-50"
                                />
                            </div>
                        </div>
                        <button onClick={() => handleSave('update_profile', { profile })} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 bg-unaicNavy text-white rounded-lg hover:bg-opacity-90 transition">
                            <Save size={16} /> Simpan Profil
                        </button>
                    </div>
                )}

                {/* LAYANAN UMUM TAB */}
                {activeTab === 'layanan' && (
                    <div className="space-y-6 max-w-4xl">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600">Judul Layanan (ID)</label>
                                <input
                                    type="text"
                                    value={layananUmum.title}
                                    onChange={(e) => setLayananUmum({ ...layananUmum, title: e.target.value })}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-gray-600">Judul Layanan (EN)</label>
                                    <TranslateBtn onClick={() => handleTranslate(layananUmum.title, 'titleEn', setLayananUmum, layananUmum)} />
                                </div>
                                <input
                                    type="text"
                                    value={layananUmum.titleEn || ""}
                                    onChange={(e) => setLayananUmum({ ...layananUmum, titleEn: e.target.value })}
                                    className="w-full p-2 border rounded-lg bg-gray-50"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600">Paragraf Singkat (ID)</label>
                                <textarea
                                    value={layananUmum.content}
                                    onChange={(e) => setLayananUmum({ ...layananUmum, content: e.target.value })}
                                    className="w-full p-2 border rounded-lg h-32"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-gray-600">Paragraf Singkat (EN)</label>
                                    <TranslateBtn onClick={() => handleTranslate(layananUmum.content, 'contentEn', setLayananUmum, layananUmum)} />
                                </div>
                                <textarea
                                    value={layananUmum.contentEn || ""}
                                    onChange={(e) => setLayananUmum({ ...layananUmum, contentEn: e.target.value })}
                                    className="w-full p-2 border rounded-lg h-32 bg-gray-50"
                                />
                            </div>
                        </div>
                        <button onClick={() => handleSave('update_layanan_umum', { layanan_umum: layananUmum })} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 bg-unaicNavy text-white rounded-lg hover:bg-opacity-90 transition">
                            <Save size={16} /> Simpan Layanan Umum
                        </button>
                    </div>
                )}

                {/* SECTIONS TAB */}
                {activeTab === 'sections' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-gray-700">Daftar Seksi Layanan</h3>
                            <button
                                onClick={() => setSections([...sections, { id: crypto.randomUUID(), title: "", titleEn: "", content: "", contentEn: "", icon: "Users", slug: "", detail_content: "", detail_contentEn: "" }])}
                                className="text-sm text-green-600 hover:bg-green-50 px-3 py-1 rounded-lg flex items-center gap-1 border border-green-200"
                            >
                                <Plus size={16} /> Tambah Seksi
                            </button>
                        </div>
                        <div className="grid gap-8">
                            {sections.map((sect, idx) => (
                                <div key={sect.id} className="border p-6 rounded-2xl space-y-4 bg-gray-50 flex flex-col shadow-sm">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-unaicBlue text-white text-xs font-bold">{idx + 1}</span>
                                            <h4 className="font-bold text-gray-800">{sect.title || "Seksi Baru"}</h4>
                                        </div>
                                        <button onClick={() => setSections(sections.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700 transition p-2 bg-white rounded-lg border border-red-50 shadow-sm"><Trash2 size={16} /></button>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-400">Judul Seksi (ID)</label>
                                            <input
                                                placeholder="Judul Seksi (misal: Pengembangan Softskill)"
                                                value={sect.title}
                                                onChange={(e) => {
                                                    const newSect = [...sections];
                                                    newSect[idx].title = e.target.value;
                                                    if (!newSect[idx].slug) {
                                                        newSect[idx].slug = e.target.value.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
                                                    }
                                                    setSections(newSect);
                                                }}
                                                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold shadow-sm focus:ring-2 focus:ring-blue-100 outline-none"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-bold text-gray-400">Judul Seksi (EN)</label>
                                                <TranslateBtn onClick={() => handleTranslateSection(sect.title, idx, 'titleEn')} />
                                            </div>
                                            <input
                                                placeholder="Section Title (EN)"
                                                value={sect.titleEn || ""}
                                                onChange={(e) => {
                                                    const newSect = [...sections];
                                                    newSect[idx].titleEn = e.target.value;
                                                    setSections(newSect);
                                                }}
                                                className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm font-bold shadow-sm outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-400">Slug (URL)</label>
                                            <input
                                                placeholder="pengembangan-softskill"
                                                value={sect.slug}
                                                onChange={(e) => {
                                                    const newSect = [...sections];
                                                    newSect[idx].slug = e.target.value;
                                                    setSections(newSect);
                                                }}
                                                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-mono text-blue-600 shadow-sm focus:ring-2 focus:ring-blue-100 outline-none"
                                            />
                                        </div>
                                        <div className="space-y-1 md:col-span-2">
                                            <label className="text-xs font-bold text-gray-400">Icon (Lucide Name)</label>
                                            <input
                                                placeholder="Users, Star, Home, etc."
                                                value={sect.icon}
                                                onChange={(e) => {
                                                    const newSect = [...sections];
                                                    newSect[idx].icon = e.target.value;
                                                    setSections(newSect);
                                                }}
                                                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm shadow-sm focus:ring-2 focus:ring-blue-100 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-400">Ringkasan (ID)</label>
                                            <input
                                                placeholder="Deskripsi singkat..."
                                                value={sect.content}
                                                onChange={(e) => {
                                                    const newSect = [...sections];
                                                    newSect[idx].content = e.target.value;
                                                    setSections(newSect);
                                                }}
                                                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm shadow-sm focus:ring-2 focus:ring-blue-100 outline-none"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-bold text-gray-400">Summary (EN)</label>
                                                <TranslateBtn onClick={() => handleTranslateSection(sect.content, idx, 'contentEn')} />
                                            </div>
                                            <input
                                                placeholder="Short summary..."
                                                value={sect.contentEn || ""}
                                                onChange={(e) => {
                                                    const newSect = [...sections];
                                                    newSect[idx].contentEn = e.target.value;
                                                    setSections(newSect);
                                                }}
                                                className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm shadow-sm outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-400">Konten Detail (ID) [HTML Support]</label>
                                            <textarea
                                                placeholder="<p>Jelaskan secara detail mengenai layanan ini...</p>"
                                                value={sect.detail_content}
                                                onChange={(e) => {
                                                    const newSect = [...sections];
                                                    newSect[idx].detail_content = e.target.value;
                                                    setSections(newSect);
                                                }}
                                                className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm h-48 font-mono shadow-sm focus:ring-2 focus:ring-blue-100 outline-none"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-bold text-gray-400">Detail Content (EN)</label>
                                                <TranslateBtn onClick={() => handleTranslateSection(sect.detail_content, idx, 'detail_contentEn')} />
                                            </div>
                                            <textarea
                                                placeholder="<p>Detailed explanation in English...</p>"
                                                value={sect.detail_contentEn || ""}
                                                onChange={(e) => {
                                                    const newSect = [...sections];
                                                    newSect[idx].detail_contentEn = e.target.value;
                                                    setSections(newSect);
                                                }}
                                                className="w-full p-4 bg-gray-100 border border-gray-200 rounded-xl text-sm h-48 font-mono shadow-sm outline-none"
                                            />
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleSave('update_sections', { sections })} disabled={isSaving} className="flex items-center gap-2 px-8 py-3 bg-unaicNavy text-white rounded-2xl hover:bg-blue-800 transition shadow-xl shadow-blue-900/10 font-bold">
                            <Save size={18} /> Simpan Semua Seksi
                        </button>
                    </div>
                )}

                {/* DOCUMENTS TAB */}
                {activeTab === 'documents' && (
                    <div className="space-y-6 max-w-4xl">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-gray-700">Daftar Dokumen Unduhan</h3>
                            <button
                                onClick={() => setDocuments([...documents, { id: crypto.randomUUID(), title: "", titleEn: "", url: "" }])}
                                className="text-sm text-green-600 hover:bg-green-50 px-3 py-1 rounded-lg flex items-center gap-1 border border-green-200"
                            >
                                <Plus size={16} /> Tambah Dokumen
                            </button>
                        </div>
                        <div className="space-y-3">
                            {documents.map((doc, idx) => (
                                <div key={doc.id} className="flex flex-col gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <input
                                            placeholder="Nama Dokumen (ID)"
                                            value={doc.title}
                                            onChange={(e) => {
                                                const newDocs = [...documents];
                                                newDocs[idx].title = e.target.value;
                                                setDocuments(newDocs);
                                            }}
                                            className="p-2 border rounded text-sm font-medium"
                                        />
                                        <div className="flex gap-2">
                                            <input
                                                placeholder="Document Title (EN)"
                                                value={doc.titleEn || ""}
                                                onChange={(e) => {
                                                    const newDocs = [...documents];
                                                    newDocs[idx].titleEn = e.target.value;
                                                    setDocuments(newDocs);
                                                }}
                                                className="flex-1 p-2 border rounded text-sm font-medium bg-white"
                                            />
                                            <TranslateBtn onClick={() => handleTranslateDoc(doc.title, idx, 'titleEn')} />
                                        </div>
                                    </div>

                                    <div className="flex gap-2 w-full">
                                        <input
                                            placeholder="URL File"
                                            value={doc.url}
                                            onChange={(e) => {
                                                const newDocs = [...documents];
                                                newDocs[idx].url = e.target.value;
                                                setDocuments(newDocs);
                                            }}
                                            className="flex-1 p-2 border rounded text-xs text-blue-600"
                                        />
                                        <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg flex items-center gap-2 transition overflow-hidden relative shadow-sm">
                                            {uploadingId === doc.id ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                            <span className="text-xs font-medium">Upload</span>
                                            <input
                                                type="file"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={(e) => handleFileUpload(e, doc.id)}
                                            />
                                        </label>
                                    </div>
                                    <button onClick={() => setDocuments(documents.filter((_, i) => i !== idx))} className="self-end text-red-500 hover:text-red-700 transition p-2 flex items-center gap-1 text-xs"><Trash2 size={14} /> Hapus</button>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleSave('update_documents', { documents })} disabled={isSaving} className="flex items-center gap-2 px-6 py-2 bg-unaicNavy text-white rounded-lg hover:bg-opacity-90 transition shadow-lg">
                            <Save size={16} /> Simpan Dokumen
                        </button>
                    </div>
                )}

                {/* CONTACT TAB */}
                {activeTab === 'contact' && (
                    <div className="space-y-6 max-w-2xl">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600">Nomor WhatsApp</label>
                                <input
                                    type="text"
                                    value={contact.whatsapp}
                                    onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                                    className="w-full p-2 border rounded-lg"
                                    placeholder="628xxxxxxxx"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600">Email Kontak</label>
                                <input
                                    type="email"
                                    value={contact.email}
                                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-600">Alamat (ID)</label>
                                    <textarea
                                        value={contact.address}
                                        onChange={(e) => setContact({ ...contact, address: e.target.value })}
                                        className="w-full p-2 border rounded-lg h-24"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-bold text-gray-600">Address (EN)</label>
                                        <TranslateBtn onClick={() => handleTranslate(contact.address, 'addressEn', setContact, contact)} />
                                    </div>
                                    <textarea
                                        value={contact.addressEn || ""}
                                        onChange={(e) => setContact({ ...contact, addressEn: e.target.value })}
                                        className="w-full p-2 border rounded-lg h-24 bg-gray-50"
                                    />
                                </div>
                            </div>
                        </div>
                        <button onClick={() => handleSave('update_contact', { contact })} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 bg-unaicNavy text-white rounded-lg hover:bg-opacity-90 transition">
                            <Save size={16} /> Simpan Kontak
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
