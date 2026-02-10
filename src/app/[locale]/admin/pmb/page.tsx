"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Link as LinkIcon, FileText } from "lucide-react";

export default function PmbAdminPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Default state matching Prisma model
    const [config, setConfig] = useState({
        heroTitle: "",
        heroTitleEn: "",
        heroSubtitle: "",
        heroSubtitleEn: "",
        ctaTitle: "",
        ctaTitleEn: "",
        ctaDesc: "",
        ctaDescEn: "",
        registrationUrl: "",
        timelinePdfUrl: "",
        brochurePdfUrl: ""
    });

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await fetch("/api/admin/pmb");
            if (res.ok) {
                const data = await res.json();
                setConfig(data);
            }
        } catch (error) {
            console.error("Failed to load PMB config");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/admin/pmb", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(config)
            });

            if (res.ok) {
                const data = await res.json();
                setConfig(data);
                alert("Pengaturan PMB berhasil disimpan!");
            } else {
                alert("Gagal menyimpan pengaturan.");
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan sistem.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="p-12 text-center text-gray-500 flex flex-col items-center"><Loader2 className="animate-spin mb-2" /> Memuat Pengaturan PMB...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Halaman PMB</h1>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 ${isSaving ? "bg-gray-400 cursor-wait" : "bg-unaicNavy hover:bg-unaicBlue hover:shadow-unaicBlue/30"}`}
                >
                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Hero Section */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                    <h2 className="text-xl font-bold text-unaicNavy border-b pb-4">Hero Section</h2>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Judul Utama (ID)</label>
                        <input
                            type="text"
                            value={config.heroTitle || ""}
                            onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-unaicBlue outline-none"
                            placeholder="Contoh: Penerimaan Mahasiswa Baru"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Main Title (EN)</label>
                        <input
                            type="text"
                            value={config.heroTitleEn || ""}
                            onChange={(e) => setConfig({ ...config, heroTitleEn: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-unaicBlue outline-none"
                            placeholder="Example: New Student Admission"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Sub-Judul (ID)</label>
                        <textarea
                            rows={3}
                            value={config.heroSubtitle || ""}
                            onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-unaicBlue outline-none"
                            placeholder="Deskripsi singkat..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Sub-Title (EN)</label>
                        <textarea
                            rows={3}
                            value={config.heroSubtitleEn || ""}
                            onChange={(e) => setConfig({ ...config, heroSubtitleEn: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-unaicBlue outline-none"
                            placeholder="Short description..."
                        />
                    </div>
                </div>

                {/* Call To Action & Links */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                    <h2 className="text-xl font-bold text-unaicNavy border-b pb-4">Call To Action & URLs</h2>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Judul Ajakan (ID)</label>
                        <input
                            type="text"
                            value={config.ctaTitle || ""}
                            onChange={(e) => setConfig({ ...config, ctaTitle: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-unaicBlue outline-none"
                            placeholder="Siap untuk Memulai Masa Depan Gemilang?"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Call To Action Title (EN)</label>
                        <input
                            type="text"
                            value={config.ctaTitleEn || ""}
                            onChange={(e) => setConfig({ ...config, ctaTitleEn: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-unaicBlue outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi Ajakan (ID)</label>
                        <textarea
                            rows={2}
                            value={config.ctaDesc || ""}
                            onChange={(e) => setConfig({ ...config, ctaDesc: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-unaicBlue outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Call To Action Desc (EN)</label>
                        <textarea
                            rows={2}
                            value={config.ctaDescEn || ""}
                            onChange={(e) => setConfig({ ...config, ctaDescEn: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-unaicBlue outline-none"
                        />
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><LinkIcon size={16} /> Link Portal Pendaftaran</label>
                        <input
                            type="url"
                            value={config.registrationUrl || ""}
                            onChange={(e) => setConfig({ ...config, registrationUrl: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-unaicBlue outline-none font-mono text-sm text-blue-600"
                            placeholder="https://pmb.universitasalirsyad.ac.id"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
