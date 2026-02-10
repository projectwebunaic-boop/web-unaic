"use client";

import { useState, useEffect } from "react";
import { Save, Video, Type, Home } from "lucide-react";

export default function HomepageEditor() {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("hero");
    const [data, setData] = useState<any>({
        hero: { welcomePrefix: "", welcomePrefixEn: "", title: "", titleEn: "", subtitle: "", subtitleEn: "", videoUrl: "" },
        about: { title: "", titleEn: "", subtitle: "", subtitleEn: "", description: "", descriptionEn: "" },
        stats: { title: "", titleEn: "", subtitle: "", subtitleEn: "", description: "", descriptionEn: "" },
        joinUs: { title: "", titleEn: "", description: "", descriptionEn: "" },
        services: [],
        testimonials: { title: "", titleEn: "", subtitle: "", subtitleEn: "", description: "", descriptionEn: "" },
        gallery: { title: "", titleEn: "", subtitle: "", subtitleEn: "", description: "", descriptionEn: "", images: [] },
        partners: { title: "", titleEn: "", subtitle: "", subtitleEn: "", description: "", descriptionEn: "" },
        news: { title: "", titleEn: "", subtitle: "", subtitleEn: "", description: "", descriptionEn: "" }
    });

    const translateField = async (text: string, callback: (translated: string) => void) => {
        if (!text) {
            alert("Teks kosong. Mohon isi teks bahasa Indonesia terlebih dahulu.");
            return;
        }
        try {
            // Show a visual indicator (cursor wait)
            document.body.style.cursor = 'wait';

            const res = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, targetLanguage: 'English' })
            });
            const data = await res.json();

            document.body.style.cursor = 'default';

            if (data.translatedText) {
                callback(data.translatedText);
            } else {
                console.error("Translation API Error:", data);
                alert(`Gagal menerjemahkan: ${data.error || "Respon tidak valid."}`);
            }
        } catch (error) {
            document.body.style.cursor = 'default';
            console.error("Translation connection failed", error);
            alert("Gagal menerjemahkan. Periksa koneksi atau kuota API.");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/admin/homepage");
                if (res.ok) {
                    const jsonData = await res.json();
                    if (jsonData) {
                        setData((prev: any) => ({
                            ...prev,
                            ...jsonData,
                            // Ensure arrays are initialized
                            services: jsonData.services || [],
                            gallery: {
                                ...prev.gallery,
                                ...(jsonData.gallery || {}),
                                images: jsonData.gallery?.images || []
                            },
                        }));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch homepage data:", error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (section: string, key: string, value: string) => {
        setData((prev: any) => ({
            ...prev,
            [section]: {
                ...(prev[section] || {}),
                [key]: value
            }
        }));
    };

    const handleServiceChange = (index: number, key: string, value: string) => {
        const newServices = [...(data.services || [])];
        newServices[index] = { ...newServices[index], [key]: value };
        setData((prev: any) => ({ ...prev, services: newServices }));
    };

    const addService = () => {
        const newService = { title: "Layanan Baru", desc: "Deskripsi layanan", link: "#", iconName: "Star", color: "bg-gray-500", light: "bg-gray-50", text: "text-gray-600" };
        setData((prev: any) => ({ ...prev, services: [...(prev.services || []), newService] }));
    };

    const removeService = (index: number) => {
        const newServices = data.services.filter((_: any, i: number) => i !== index);
        setData((prev: any) => ({ ...prev, services: newServices }));
    };

    const handleGalleryImageChange = (index: number, key: string, value: string) => {
        const newImages = [...(data.gallery?.images || [])];
        newImages[index] = { ...newImages[index], [key]: value };
        setData((prev: any) => ({ ...prev, gallery: { ...prev.gallery, images: newImages } }));
    };

    const addGalleryImage = () => {
        setData((prev: any) => ({
            ...prev,
            gallery: {
                ...prev.gallery,
                images: [...(prev.gallery?.images || []), { src: "", alt: "" }]
            }
        }));
    };

    const removeGalleryImage = (index: number) => {
        const newImages = data.gallery.images.filter((_: any, i: number) => i !== index);
        setData((prev: any) => ({ ...prev, gallery: { ...prev.gallery, images: newImages } }));
    };


    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/homepage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                alert("Perubahan berhasil disimpan!");
            } else {
                const err = await res.json();
                alert(`Gagal menyimpan: ${err.error || "Kesalahan tidak diketahui"}`);
            }
        } catch (e) {
            alert("Terjadi kesalahan koneksi.");
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: "hero", label: "Hero Section", icon: Video },
        { id: "services", label: "Layanan (Quick Links)", icon: Type },
        { id: "about", label: "Tentang Kami", icon: Type },
        { id: "faculty", label: "Fakultas", icon: Type },
        { id: "stats", label: "Statistik", icon: Type },
        { id: "gallery", label: "Galeri Foto", icon: Video },
        { id: "testimonials", label: "Testimoni", icon: Type },
        { id: "partners", label: "Mitra", icon: Type },
        { id: "news", label: "Berita", icon: Type },
        { id: "joinUs", label: "Join Us", icon: Type },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Home className="text-unaicNavy" /> Editor Halaman Beranda
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-1 space-y-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors
                    ${activeTab === tab.id ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'}
                  `}
                            >
                                <tab.icon size={18} /> {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-xs text-blue-800">
                        <p>Edit konten per bagian, lalu klik <strong>Simpan</strong> di kanan bawah.</p>
                    </div>
                </div>

                {/* Editor Form */}
                <div className="lg:col-span-3 space-y-6">

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[400px]">

                        {/* HERO */}
                        {activeTab === 'hero' && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="font-bold text-gray-800 text-lg border-b pb-2 mb-4">Edit Hero Section</h3>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <label className="block text-sm font-medium text-gray-700">Prefix Judul (ID)</label>
                                                <button onClick={() => translateField(data.hero?.welcomePrefix, (val) => handleChange('hero', 'welcomePrefixEn', val))} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold hover:bg-blue-100 transition">Auto-Translate ➔ EN</button>
                                            </div>
                                            <input type="text" value={data.hero?.welcomePrefix || ""} onChange={(e) => handleChange('hero', 'welcomePrefix', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" placeholder="Ex: Welcome to" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Prefix Judul (EN)</label>
                                            <input type="text" value={data.hero?.welcomePrefixEn || ""} onChange={(e) => handleChange('hero', 'welcomePrefixEn', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-blue-50/30" placeholder="Ex: Welcome to" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <label className="block text-sm font-medium text-gray-700">Judul Utama (ID)</label>
                                                <button onClick={() => translateField(data.hero?.title, (val) => handleChange('hero', 'titleEn', val))} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold hover:bg-blue-100 transition">Auto-Translate ➔ EN</button>
                                            </div>
                                            <input type="text" value={data.hero?.title || ""} onChange={(e) => handleChange('hero', 'title', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 bg-white" placeholder="Ex: UNAIC" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Utama (EN)</label>
                                            <input type="text" value={data.hero?.titleEn || ""} onChange={(e) => handleChange('hero', 'titleEn', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 bg-blue-50/30" placeholder="Ex: UNAIC" />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-sm font-medium text-gray-700">Subtitle (ID)</label>
                                            <button onClick={() => translateField(data.hero?.subtitle, (val) => handleChange('hero', 'subtitleEn', val))} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold hover:bg-blue-100 transition">Auto-Translate ➔ EN</button>
                                        </div>
                                        <textarea rows={4} value={data.hero?.subtitle || ""} onChange={(e) => handleChange('hero', 'subtitle', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle (EN)</label>
                                        <textarea rows={4} value={data.hero?.subtitleEn || ""} onChange={(e) => handleChange('hero', 'subtitleEn', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-blue-50/30" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                                    <input type="text" value={data.hero?.videoUrl || ""} onChange={(e) => handleChange('hero', 'videoUrl', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" />
                                </div>
                            </div>
                        )}

                        {/* SERVICES */}
                        {activeTab === 'services' && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex justify-between items-center border-b pb-2 mb-4">
                                    <h3 className="font-bold text-gray-800 text-lg">Edit Layanan (Quick Links)</h3>
                                    <button onClick={addService} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200">+ Tambah</button>
                                </div>
                                <div className="space-y-4">
                                    {data.services?.map((service: any, idx: number) => (
                                        <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3 relative group">
                                            <button onClick={() => removeService(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">Hapus</button>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <label className="text-xs font-bold text-gray-500 uppercase">Judul (ID)</label>
                                                        <button type="button" onClick={() => translateField(service.title, (val) => handleServiceChange(idx, 'titleEn', val))} className="text-[10px] text-blue-600 font-bold hover:underline">Translate ➔ EN</button>
                                                    </div>
                                                    <input type="text" value={service.title} onChange={(e) => handleServiceChange(idx, 'title', e.target.value)} placeholder="Judul Layanan" className="px-3 py-2 border rounded-md w-full bg-white" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-gray-500 uppercase">Judul (EN)</label>
                                                    <input type="text" value={service.titleEn || ""} onChange={(e) => handleServiceChange(idx, 'titleEn', e.target.value)} placeholder="Service Title" className="px-3 py-2 border rounded-md w-full bg-blue-50/20" />
                                                </div>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <label className="text-xs font-bold text-gray-500 uppercase">Deskripsi (ID)</label>
                                                        <button type="button" onClick={() => translateField(service.desc, (val) => handleServiceChange(idx, 'descEn', val))} className="text-[10px] text-blue-600 font-bold hover:underline">Translate ➔ EN</button>
                                                    </div>
                                                    <input type="text" value={service.desc} onChange={(e) => handleServiceChange(idx, 'desc', e.target.value)} placeholder="Deskripsi Singkat" className="px-3 py-2 border rounded-md w-full bg-white" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-gray-500 uppercase">Deskripsi (EN)</label>
                                                    <input type="text" value={service.descEn || ""} onChange={(e) => handleServiceChange(idx, 'descEn', e.target.value)} placeholder="Short Description" className="px-3 py-2 border rounded-md w-full bg-blue-50/20" />
                                                </div>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <input type="text" value={service.link} onChange={(e) => handleServiceChange(idx, 'link', e.target.value)} placeholder="URL Link" className="px-3 py-2 border rounded-md w-full bg-white" />
                                                <input type="text" value={service.iconName} onChange={(e) => handleServiceChange(idx, 'iconName', e.target.value)} placeholder="Icon Name (Lucide)" className="px-3 py-2 border rounded-md w-full bg-white text-sm font-mono" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ABOUT */}
                        {activeTab === 'about' && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="font-bold text-gray-800 text-lg border-b pb-2 mb-4">Edit About Section</h3>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-sm font-medium text-gray-700">Judul Bagian (ID)</label>
                                            <button onClick={() => translateField(data.about?.title, (val) => handleChange('about', 'titleEn', val))} className="text-[10px] text-blue-600 font-bold">Translate ➔ EN</button>
                                        </div>
                                        <input type="text" value={data.about?.title || ""} onChange={(e) => handleChange('about', 'title', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Judul Bagian (EN)</label>
                                        <input type="text" value={data.about?.titleEn || ""} onChange={(e) => handleChange('about', 'titleEn', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-blue-50/30" />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-sm font-medium text-gray-700">Subtitle Kecil (ID)</label>
                                            <button onClick={() => translateField(data.about?.subtitle, (val) => handleChange('about', 'subtitleEn', val))} className="text-[10px] text-blue-600 font-bold">Translate ➔ EN</button>
                                        </div>
                                        <input type="text" value={data.about?.subtitle || ""} onChange={(e) => handleChange('about', 'subtitle', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle Kecil (EN)</label>
                                        <input type="text" value={data.about?.subtitleEn || ""} onChange={(e) => handleChange('about', 'subtitleEn', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-blue-50/30" />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-sm font-medium text-gray-700">Deskripsi Lengkap (ID)</label>
                                            <button onClick={() => translateField(data.about?.description, (val) => handleChange('about', 'descriptionEn', val))} className="text-[10px] text-blue-600 font-bold">Translate ➔ EN</button>
                                        </div>
                                        <textarea rows={5} value={data.about?.description || ""} onChange={(e) => handleChange('about', 'description', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Lengkap (EN)</label>
                                        <textarea rows={5} value={data.about?.descriptionEn || ""} onChange={(e) => handleChange('about', 'descriptionEn', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-blue-50/30" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* FACULTY */}
                        {activeTab === 'faculty' && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="font-bold text-gray-800 text-lg border-b pb-2 mb-4">Edit Fakultas Section</h3>
                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 mb-4">
                                    <strong>Info:</strong> Data Fakultas dan Prodi diambil dari database akademik. Di sini Anda hanya mengubah Judul dan Deskripsi bagiannya saja.
                                </div>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-sm font-medium text-gray-700">Judul Bagian (ID)</label>
                                            <button onClick={() => translateField(data.faculty?.title, (val) => handleChange('faculty', 'titleEn', val))} className="text-[10px] text-blue-600 font-bold">Translate ➔ EN</button>
                                        </div>
                                        <input type="text" value={data.faculty?.title || ""} onChange={(e) => handleChange('faculty', 'title', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Judul Bagian (EN)</label>
                                        <input type="text" value={data.faculty?.titleEn || ""} onChange={(e) => handleChange('faculty', 'titleEn', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-blue-50/30" />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-sm font-medium text-gray-700">Subtitle Kecil (ID)</label>
                                            <button onClick={() => translateField(data.faculty?.subtitle, (val) => handleChange('faculty', 'subtitleEn', val))} className="text-[10px] text-blue-600 font-bold">Translate ➔ EN</button>
                                        </div>
                                        <input type="text" value={data.faculty?.subtitle || ""} onChange={(e) => handleChange('faculty', 'subtitle', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle Kecil (EN)</label>
                                        <input type="text" value={data.faculty?.subtitleEn || ""} onChange={(e) => handleChange('faculty', 'subtitleEn', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-blue-50/30" />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-sm font-medium text-gray-700">Deskripsi (ID)</label>
                                            <button onClick={() => translateField(data.faculty?.description, (val) => handleChange('faculty', 'descriptionEn', val))} className="text-[10px] text-blue-600 font-bold">Translate ➔ EN</button>
                                        </div>
                                        <textarea rows={3} value={data.faculty?.description || ""} onChange={(e) => handleChange('faculty', 'description', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (EN)</label>
                                        <textarea rows={3} value={data.faculty?.descriptionEn || ""} onChange={(e) => handleChange('faculty', 'descriptionEn', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-blue-50/30" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STATS */}
                        {activeTab === 'stats' && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="font-bold text-gray-800 text-lg border-b pb-2 mb-4">Edit Stats Section</h3>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-sm font-medium text-gray-700">Judul Bagian (ID)</label>
                                            <button onClick={() => translateField(data.stats?.title, (val) => handleChange('stats', 'titleEn', val))} className="text-[10px] text-blue-600 font-bold">Translate ➔ EN</button>
                                        </div>
                                        <input type="text" value={data.stats?.title || ""} onChange={(e) => handleChange('stats', 'title', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Judul Bagian (EN)</label>
                                        <input type="text" value={data.stats?.titleEn || ""} onChange={(e) => handleChange('stats', 'titleEn', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-blue-50/30" />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-sm font-medium text-gray-700">Subtitle Kecil (ID)</label>
                                            <button onClick={() => translateField(data.stats?.subtitle, (val) => handleChange('stats', 'subtitleEn', val))} className="text-[10px] text-blue-600 font-bold">Translate ➔ EN</button>
                                        </div>
                                        <input type="text" value={data.stats?.subtitle || ""} onChange={(e) => handleChange('stats', 'subtitle', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle Kecil (EN)</label>
                                        <input type="text" value={data.stats?.subtitleEn || ""} onChange={(e) => handleChange('stats', 'subtitleEn', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-blue-50/30" />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-sm font-medium text-gray-700">Deskripsi (ID)</label>
                                            <button onClick={() => translateField(data.stats?.description, (val) => handleChange('stats', 'descriptionEn', val))} className="text-[10px] text-blue-600 font-bold">Translate ➔ EN</button>
                                        </div>
                                        <textarea rows={3} value={data.stats?.description || ""} onChange={(e) => handleChange('stats', 'description', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (EN)</label>
                                        <textarea rows={3} value={data.stats?.descriptionEn || ""} onChange={(e) => handleChange('stats', 'descriptionEn', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-blue-50/30" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* GALLERY */}
                        {activeTab === 'gallery' && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex justify-between items-center border-b pb-2 mb-4">
                                    <h3 className="font-bold text-gray-800 text-lg">Edit Galeri Foto</h3>
                                    <button onClick={addGalleryImage} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200">+ Tambah Foto</button>
                                </div>

                                <div className="space-y-4 mb-6 border-b pb-6">
                                    <h4 className="font-semibold text-sm text-gray-600">Judul & Deskripsi</h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <label className="block text-xs font-bold text-gray-500 uppercase">Judul (ID)</label>
                                                <button onClick={() => translateField(data.gallery?.title, (val) => handleChange('gallery', 'titleEn', val))} className="text-[10px] text-blue-600 font-bold">Translate ➔ EN</button>
                                            </div>
                                            <input type="text" value={data.gallery?.title || ""} onChange={(e) => handleChange('gallery', 'title', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Judul Galeri" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Judul (EN)</label>
                                            <input type="text" value={data.gallery?.titleEn || ""} onChange={(e) => handleChange('gallery', 'titleEn', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-blue-50/20" placeholder="Gallery Title" />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <label className="block text-xs font-bold text-gray-500 uppercase">Deskripsi (ID)</label>
                                                <button onClick={() => translateField(data.gallery?.description, (val) => handleChange('gallery', 'descriptionEn', val))} className="text-[10px] text-blue-600 font-bold">Translate ➔ EN</button>
                                            </div>
                                            <textarea rows={2} value={data.gallery?.description || ""} onChange={(e) => handleChange('gallery', 'description', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Deskripsi Galeri" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Deskripsi (EN)</label>
                                            <textarea rows={2} value={data.gallery?.descriptionEn || ""} onChange={(e) => handleChange('gallery', 'descriptionEn', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-blue-50/20" placeholder="Gallery Description" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {data.gallery?.images?.map((img: any, idx: number) => (
                                        <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200 relative group">
                                            <button onClick={() => removeGalleryImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">x</button>
                                            {img.src ? (
                                                <img src={img.src} alt={img.alt} className="w-full h-24 object-cover rounded-md mb-2 bg-gray-200" />
                                            ) : (
                                                <div className="w-full h-24 bg-gray-200 rounded-md mb-2 flex items-center justify-center text-gray-400 text-xs">No Image</div>
                                            )}
                                            <input type="text" value={img.src} onChange={(e) => handleGalleryImageChange(idx, 'src', e.target.value)} placeholder="/images/..." className="w-full text-xs px-2 py-1 border rounded mb-1" />
                                            <input type="text" value={img.alt} onChange={(e) => handleGalleryImageChange(idx, 'alt', e.target.value)} placeholder="Alt Text" className="w-full text-xs px-2 py-1 border rounded" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* GENERIC CONFIG SECTIONS (TESTIMONIALS, PARTNERS, NEWS) */}
                        {['testimonials', 'partners', 'news'].includes(activeTab) && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="font-bold text-gray-800 text-lg border-b pb-2 mb-4 capitalize">Edit {activeTab} Section</h3>
                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 mb-4">
                                    <strong>Info:</strong> Konten (item) untuk bagian ini diambil otomatis dari database {activeTab === 'testimonials' ? 'Alumni' : activeTab === 'partners' ? 'Mitra' : 'Berita'}. Di sini Anda hanya mengubah Judul dan Deskripsi bagiannya saja.
                                </div>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-sm font-medium text-gray-700">Judul Bagian (ID)</label>
                                            <button onClick={() => translateField(data[activeTab]?.title, (val) => handleChange(activeTab, 'titleEn', val))} className="text-[10px] text-blue-600 font-bold">Translate ➔ EN</button>
                                        </div>
                                        <input type="text" value={data[activeTab]?.title || ""} onChange={(e) => handleChange(activeTab, 'title', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Judul Bagian (EN)</label>
                                        <input type="text" value={data[activeTab]?.titleEn || ""} onChange={(e) => handleChange(activeTab, 'titleEn', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-blue-50/30" />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-sm font-medium text-gray-700">Subtitle Kecil (ID)</label>
                                            <button onClick={() => translateField(data[activeTab]?.subtitle, (val) => handleChange(activeTab, 'subtitleEn', val))} className="text-[10px] text-blue-600 font-bold">Translate ➔ EN</button>
                                        </div>
                                        <input type="text" value={data[activeTab]?.subtitle || ""} onChange={(e) => handleChange(activeTab, 'subtitle', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle Kecil (EN)</label>
                                        <input type="text" value={data[activeTab]?.subtitleEn || ""} onChange={(e) => handleChange(activeTab, 'subtitleEn', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-blue-50/30" />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-sm font-medium text-gray-700">Deskripsi (ID)</label>
                                            <button onClick={() => translateField(data[activeTab]?.description, (val) => handleChange(activeTab, 'descriptionEn', val))} className="text-[10px] text-blue-600 font-bold">Translate ➔ EN</button>
                                        </div>
                                        <textarea rows={3} value={data[activeTab]?.description || ""} onChange={(e) => handleChange(activeTab, 'description', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (EN)</label>
                                        <textarea rows={3} value={data[activeTab]?.descriptionEn || ""} onChange={(e) => handleChange(activeTab, 'descriptionEn', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-blue-50/30" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'joinUs' && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="font-bold text-gray-800 text-lg border-b pb-2 mb-4">Edit Join Us (CTA)</h3>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-sm font-medium text-gray-700">Judul Ajakan (ID)</label>
                                            <button onClick={() => translateField(data.joinUs?.title, (val) => handleChange('joinUs', 'titleEn', val))} className="text-[10px] text-blue-600 font-bold">Translate ➔ EN</button>
                                        </div>
                                        <input type="text" value={data.joinUs?.title || ""} onChange={(e) => handleChange('joinUs', 'title', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Judul Ajakan (EN)</label>
                                        <input type="text" value={data.joinUs?.titleEn || ""} onChange={(e) => handleChange('joinUs', 'titleEn', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-blue-50/20" />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-sm font-medium text-gray-700">Kalimat Ajakan (ID)</label>
                                            <button onClick={() => translateField(data.joinUs?.description, (val) => handleChange('joinUs', 'descriptionEn', val))} className="text-[10px] text-blue-600 font-bold">Translate ➔ EN</button>
                                        </div>
                                        <textarea rows={3} value={data.joinUs?.description || ""} onChange={(e) => handleChange('joinUs', 'description', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Kalimat Ajakan (EN)</label>
                                        <textarea rows={3} value={data.joinUs?.descriptionEn || ""} onChange={(e) => handleChange('joinUs', 'descriptionEn', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-blue-50/20" />
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Action Bar */}
                    <div className="flex justify-end pt-4">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className={`flex items-center gap-2 px-8 py-3 bg-unaicGold text-unaicNavy font-bold rounded-xl shadow-lg hover:shadow-xl transition-all ${loading ? 'opacity-70 cursor-wait' : 'hover:scale-105'}`}
                        >
                            <Save size={20} />
                            {loading ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
