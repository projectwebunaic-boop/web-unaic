"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, BookOpen, AlertCircle, ExternalLink, Clock, MapPin, Phone, Mail, Globe } from "lucide-react";

interface LibraryConfig {
    simpusUrl: string;
    phone: string;
    email: string;
    address: string;
    addressEn: string;
    weekdayHours: string;
    saturdayHours: string;
}

export default function AdminLibraryPage() {
    const [config, setConfig] = useState<LibraryConfig>({
        simpusUrl: "",
        phone: "",
        email: "",
        address: "",
        addressEn: "",
        weekdayHours: "",
        saturdayHours: ""
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await fetch("/api/admin/library/config");
            if (res.ok) {
                const data = await res.json();
                setConfig({
                    simpusUrl: data.simpusUrl || "",
                    phone: data.phone || "",
                    email: data.email || "",
                    address: data.address || "",
                    addressEn: data.addressEn || "",
                    weekdayHours: data.weekdayHours || "",
                    saturdayHours: data.saturdayHours || ""
                });
            }
        } catch (error) {
            console.error("Failed to fetch library config", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage({ type: "", text: "" });
        try {
            const res = await fetch("/api/admin/library/config", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(config)
            });
            const result = await res.json();
            if (result.success) {
                setConfig(result.data);
                setMessage({ type: "success", text: "Pengaturan perpustakaan berhasil disimpan!" });
                setTimeout(() => setMessage({ type: "", text: "" }), 3000);
            } else {
                setMessage({ type: "error", text: result.error || "Gagal menyimpan pengaturan." });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Terjadi kesalahan saat menyimpan." });
        } finally {
            setIsSaving(false);
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
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-3">
                        <BookOpen className="text-unaicBlue" /> Manajemen Perpustakaan
                    </h1>
                    <p className="text-sm text-gray-500 font-medium">Kelola informasi portal dan layanan perpustakaan.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-unaicNavy text-white px-8 py-2.5 rounded-2xl font-bold hover:bg-unaicBlue transition shadow-lg disabled:opacity-50"
                >
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Simpan Perubahan
                </button>
            </div>

            {message.text && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
                    }`}>
                    {message.type === "success" ? <Save size={18} /> : <AlertCircle size={18} />}
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Portal Section */}
                <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                        <Globe className="text-unaicGold" size={24} />
                        <h2 className="text-xl font-bold text-gray-800">Link Portal SIMPUS</h2>
                    </div>
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-gray-700">URL Website SIMPUS</label>
                        <div className="flex gap-3">
                            <input
                                className="flex-1 p-3 rounded-2xl border border-gray-200 text-sm focus:ring-2 focus:ring-unaicBlue outline-none"
                                value={config.simpusUrl}
                                onChange={e => setConfig({ ...config, simpusUrl: e.target.value })}
                                placeholder="https://simpus.universitasalirsyad.ac.id/"
                            />
                            <a
                                href={config.simpusUrl}
                                target="_blank"
                                className="p-3 bg-gray-50 text-unaicNavy rounded-2xl hover:bg-blue-50 transition border border-gray-100"
                            >
                                <ExternalLink size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Operations Section */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                        <Clock className="text-unaicGold" size={24} />
                        <h2 className="text-xl font-bold text-gray-800">Jam Operasional</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Senin - Jumat (ID & EN)</label>
                            <input
                                className="w-full p-3 rounded-2xl border border-gray-200 text-sm focus:ring-2 focus:ring-unaicBlue outline-none"
                                value={config.weekdayHours}
                                onChange={e => setConfig({ ...config, weekdayHours: e.target.value })}
                                placeholder="08:00 - 16:00"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Sabtu (ID & EN)</label>
                            <input
                                className="w-full p-3 rounded-2xl border border-gray-200 text-sm focus:ring-2 focus:ring-unaicBlue outline-none"
                                value={config.saturdayHours}
                                onChange={e => setConfig({ ...config, saturdayHours: e.target.value })}
                                placeholder="08:00 - 13:00"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                        <Phone className="text-unaicGold" size={24} />
                        <h2 className="text-xl font-bold text-gray-800">Kontak</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Nomor Telepon</label>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                <Phone size={18} className="text-gray-400" />
                                <input
                                    className="flex-1 bg-transparent text-sm outline-none"
                                    value={config.phone}
                                    onChange={e => setConfig({ ...config, phone: e.target.value })}
                                    placeholder="(0282) 532975"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Alamat Email</label>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                <Mail size={18} className="text-gray-400" />
                                <input
                                    className="flex-1 bg-transparent text-sm outline-none"
                                    value={config.email}
                                    onChange={e => setConfig({ ...config, email: e.target.value })}
                                    placeholder="perpustakaan@unaic.ac.id"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Location Section */}
                <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                        <MapPin className="text-unaicGold" size={24} />
                        <h2 className="text-xl font-bold text-gray-800">Alamat Perpustakaan</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Bahasa Indonesia</label>
                            <textarea
                                className="w-full p-4 rounded-2xl border border-gray-200 text-sm focus:ring-2 focus:ring-unaicBlue outline-none h-24 resize-none"
                                value={config.address}
                                onChange={e => setConfig({ ...config, address: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest text-blue-600">English Version</label>
                            <textarea
                                className="w-full p-4 rounded-2xl border border-gray-200 text-sm focus:ring-2 focus:ring-unaicBlue outline-none h-24 resize-none bg-blue-50/10"
                                value={config.addressEn}
                                onChange={e => setConfig({ ...config, addressEn: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
