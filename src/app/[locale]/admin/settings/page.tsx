"use client";

import { Save, User, Lock, Bell, Globe, Settings, Loader2, Phone } from "lucide-react";
import { useState, useEffect } from "react";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [settings, setSettings] = useState({
        profile: { name: "", email: "" },
        security: { pin: "" },
        notifications: { emailAlerts: true, newComplaint: true, reportBundling: false },
        general: { language: "id", maintenanceMode: false },
        contact: { phone: "", email: "", address: "" }
    });

    // Temp state for password change
    const [newPin, setNewPin] = useState("");

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/admin/settings");
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
            }
        } catch (error) {
            console.error("Failed to load settings");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Include PIN change if needed
            const payload = { ...settings };
            if (activeTab === 'security' && newPin.length === 4) {
                payload.security.pin = newPin;
                setNewPin(""); // Reset after save
            }

            const res = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Pengaturan berhasil disimpan!");
                fetchSettings(); // Refresh
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

    const TabButton = ({ id, label, icon: Icon }: any) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 border
                ${activeTab === id
                    ? "bg-white text-unaicNavy shadow-sm border-blue-100 font-bold ring-2 ring-blue-50"
                    : "text-gray-600 border-transparent hover:bg-white hover:text-gray-800 hover:shadow-sm"
                }
            `}
        >
            <Icon size={18} className={activeTab === id ? "text-unaicGold" : "text-gray-400"} />
            {label}
        </button>
    );

    if (isLoading) {
        return <div className="p-12 text-center text-gray-500 flex flex-col items-center"><Loader2 className="animate-spin mb-2" /> Memuat Pengaturan...</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <div className="p-2 bg-unaicNavy rounded-lg text-white">
                    <Settings size={24} />
                </div>
                Pengaturan Sistem
            </h1>

            <div className="grid md:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="md:col-span-1 space-y-2">
                    <TabButton id="profile" label="Profil Admin" icon={User} />
                    <TabButton id="security" label="Keamanan & PIN" icon={Lock} />
                    <TabButton id="notifications" label="Notifikasi" icon={Bell} />
                    <TabButton id="contact" label="Kontak Publik" icon={Phone} />
                    <TabButton id="general" label="Umum" icon={Globe} />
                </div>

                {/* Content Area */}
                <div className="md:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[500px] relative">

                    {/* Header per Tab */}
                    <div className="border-b pb-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-800">
                            {activeTab === 'profile' && "Edit Profil Administrator"}
                            {activeTab === 'security' && "Keamanan Akun & PIN"}
                            {activeTab === 'notifications' && "Preferensi Notifikasi"}
                            {activeTab === 'contact' && "Informasi Kontak Publik"}
                            {activeTab === 'general' && "Pengaturan Umum"}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {activeTab === 'profile' && "Atur informasi identitas akun admin universitas."}
                            {activeTab === 'security' && "Jaga keamanan akses dashboard dengan PIN yang kuat."}
                            {activeTab === 'notifications' && "Tentukan kapan sistem harus mengirim pemberitahuan."}
                            {activeTab === 'contact' && "Atur nomor telepon, email, dan alamat yang tampil di website."}
                            {activeTab === 'general' && "Konfigurasi dasar sistem dan preferensi bahasa."}
                        </p>
                    </div>

                    {/* PROFILE TAB */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        value={settings.profile.name}
                                        onChange={(e) => setSettings({ ...settings, profile: { ...settings.profile, name: e.target.value } })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-unaicBlue outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Resmi</label>
                                    <input
                                        type="email"
                                        value={settings.profile.email}
                                        onChange={(e) => setSettings({ ...settings, profile: { ...settings.profile, email: e.target.value } })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-unaicBlue outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SECURITY TAB */}
                    {activeTab === 'security' && (
                        <div className="max-w-xl">
                            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl mb-6 flex gap-3">
                                <Lock className="text-yellow-600 shrink-0 mt-0.5" size={20} />
                                <div className="text-sm text-yellow-800">
                                    <p className="font-bold">Penting:</p>
                                    Gunakan 4 digit angka untuk PIN. Jangan gunakan kombinasi yang mudah ditebak seperti "1234" atau "0000".
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2">PIN Admin Saat Ini</label>
                                <input type="text" value={settings.security.pin} disabled className="w-full px-4 py-3 border border-gray-200 bg-gray-100 rounded-xl text-gray-500 font-mono tracking-widest" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Ganti PIN Baru</label>
                                <input
                                    type="text"
                                    maxLength={4}
                                    placeholder="----"
                                    value={newPin}
                                    onChange={(e) => setNewPin(e.target.value.replace(/\D/, ''))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-unaicBlue outline-none transition-all font-mono tracking-widest text-lg"
                                />
                                <p className="text-xs text-gray-400 mt-2">Biarkan kosong jika tidak ingin mengubah PIN.</p>
                            </div>
                        </div>
                    )}

                    {/* NOTIFICATIONS TAB */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition">
                                <div>
                                    <h4 className="font-bold text-gray-800">Notifikasi Email</h4>
                                    <p className="text-sm text-gray-500">Terima ringkasan laporan via email.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={settings.notifications.emailAlerts}
                                        onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, emailAlerts: e.target.checked } })}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-unaicBlue"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition">
                                <div>
                                    <h4 className="font-bold text-gray-800">Laporan Baru Masuk</h4>
                                    <p className="text-sm text-gray-500">Beritahu langsung saat ada aduan baru.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={settings.notifications.newComplaint}
                                        onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, newComplaint: e.target.checked } })}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-unaicBlue"></div>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* CONTACT TAB */}
                    {activeTab === 'contact' && (
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Nomor Telepon</label>
                                    <input
                                        type="text"
                                        placeholder="(0282) 532975"
                                        value={settings.contact?.phone || ""}
                                        onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, phone: e.target.value } })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-unaicBlue outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Publik</label>
                                    <input
                                        type="email"
                                        placeholder="info@universitasalirsyad.ac.id"
                                        value={settings.contact?.email || ""}
                                        onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, email: e.target.value } })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-unaicBlue outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Alamat Kampus</label>
                                <textarea
                                    rows={3}
                                    placeholder="Jl. Cerme No. 24, Sidanegara, Cilacap"
                                    value={settings.contact?.address || ""}
                                    onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, address: e.target.value } })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-unaicBlue outline-none transition-all"
                                />
                            </div>
                        </div>
                    )}

                    {/* GENERAL TAB */}
                    {activeTab === 'general' && (
                        <div className="max-w-xl space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Bahasa Sistem</label>
                                <select
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-unaicBlue outline-none"
                                    value={settings.general.language}
                                    onChange={(e) => setSettings({ ...settings, general: { ...settings.general, language: e.target.value } })}
                                >
                                    <option value="id">Bahasa Indonesia (Default)</option>
                                    <option value="en">English (US)</option>
                                </select>
                            </div>

                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                                <h4 className="font-bold text-red-800 mb-2">Mode Pemeliharaan (Maintenance)</h4>
                                <p className="text-sm text-red-600 mb-4">Jika diaktifkan, halaman publik akan menampilkan pesan "Sedang dalam perbaikan" dan form aduan tidak dapat diakses.</p>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                                        checked={settings.general.maintenanceMode}
                                        onChange={(e) => setSettings({ ...settings, general: { ...settings.general, maintenanceMode: e.target.checked } })}
                                    />
                                    <span className="font-medium text-gray-700">Aktifkan Mode Maintenance</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* SAVE BUTTON */}
                    <div className="absolute bottom-8 right-8">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95
                                ${isSaving ? "bg-gray-400 cursor-wait" : "bg-unaicNavy hover:bg-unaicBlue hover:shadow-unaicBlue/30"}
                            `}
                        >
                            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
