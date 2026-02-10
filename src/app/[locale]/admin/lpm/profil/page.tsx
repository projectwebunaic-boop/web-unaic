"use client";

import { useState, useEffect } from "react";
import { Save, Globe, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useRouter } from "@/i18n/routing";

export default function AdminLPMProfil() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [data, setData] = useState({
        about: "",
        aboutEn: "",
    });

    useEffect(() => {
        fetch('/api/admin/lpm/profile')
            .then(res => res.json())
            .then(data => {
                // Parse activityCycle JSON strings to lists
                let acList = [];
                let acListEn = [];
                try {
                    acList = data.activityCycle ? JSON.parse(data.activityCycle) : [];
                    if (!Array.isArray(acList)) acList = [];
                } catch (e) { acList = []; }

                try {
                    acListEn = data.activityCycleEn ? JSON.parse(data.activityCycleEn) : [];
                    if (!Array.isArray(acListEn)) acListEn = [];
                } catch (e) { acListEn = []; }

                setData({ ...data, activityCycleList: acList, activityCycleListEn: acListEn });
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const payload = {
                ...data,
                activityCycle: JSON.stringify((data as any).activityCycleList || []),
                activityCycleEn: JSON.stringify((data as any).activityCycleListEn || [])
            };

            await fetch('/api/admin/lpm/profile', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            alert("Berhasil disimpan!");
            router.refresh();
        } catch (error) {
            alert("Gagal menyimpan.");
        } finally {
            setIsSaving(false);
        }
    };

    // --- ACTIVITY CYCLE HANDLERS ---
    const handleActivityCycleChange = (index: number, value: string, lang: 'id' | 'en') => {
        const key = lang === 'en' ? 'activityCycleListEn' : 'activityCycleList';
        const newList = [...((data as any)[key] || [])];
        newList[index] = value;
        setData({ ...data, [key]: newList } as any);
    };

    const addActivityCycle = (lang: 'id' | 'en') => {
        const key = lang === 'en' ? 'activityCycleListEn' : 'activityCycleList';
        setData({ ...data, [key]: [...((data as any)[key] || []), ""] } as any);
    };

    const removeActivityCycle = (index: number, lang: 'id' | 'en') => {
        const key = lang === 'en' ? 'activityCycleListEn' : 'activityCycleList';
        const newList = [...((data as any)[key] || [])];
        newList.splice(index, 1);
        setData({ ...data, [key]: newList } as any);
    };



    if (isLoading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-6 flex items-center gap-4">
                <Link href="/admin/lpm" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Edit Profil LJM</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-8">
                {/* ABOUT SECTION */}
                <section>
                    <h2 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">Profil</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-2">Bahasa Indonesia</label>
                            <textarea
                                className="w-full h-40 border rounded-lg p-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                value={data.about || ""}
                                onChange={e => setData({ ...data, about: e.target.value })}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Globe size={16} className="text-blue-500" />
                                <label className="block text-sm font-semibold text-gray-600">English</label>
                            </div>
                            <textarea
                                className="w-full h-40 border rounded-lg p-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                value={data.aboutEn || ""}
                                onChange={e => setData({ ...data, aboutEn: e.target.value })}
                            />
                        </div>
                    </div>
                </section>



                {/* TUGAS POKOK SECTION */}
                <section>
                    <h2 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">Tugas Pokok</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-2">Bahasa Indonesia</label>
                            <textarea
                                className="w-full h-32 border rounded-lg p-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                value={(data as any).mainDuties || ""}
                                onChange={e => setData({ ...data, mainDuties: e.target.value } as any)}
                                placeholder="HTML Allowed"
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Globe size={16} className="text-blue-500" />
                                <label className="block text-sm font-semibold text-gray-600">English</label>
                            </div>
                            <textarea
                                className="w-full h-32 border rounded-lg p-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                value={(data as any).mainDutiesEn || ""}
                                onChange={e => setData({ ...data, mainDutiesEn: e.target.value } as any)}
                                placeholder="HTML Allowed"
                            />
                        </div>
                    </div>
                </section>

                {/* SIKLUS KEGIATAN SECTION */}
                <section>
                    <h2 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">Siklus Kegiatan (PPEPP)</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* INDONESIA */}
                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-gray-600">Bahasa Indonesia</label>
                            {((data as any).activityCycleList || []).map((item: string, idx: number) => (
                                <div key={idx} className="flex gap-2">
                                    <input
                                        className="flex-1 border rounded-lg px-3 py-2 text-sm"
                                        value={item}
                                        onChange={e => handleActivityCycleChange(idx, e.target.value, 'id')}
                                        placeholder={`Point ${idx + 1}`}
                                    />
                                    <button onClick={() => removeActivityCycle(idx, 'id')} className="text-red-500 hover:text-red-700 px-2">x</button>
                                </div>
                            ))}
                            <button onClick={() => addActivityCycle('id')} className="text-sm text-blue-600 font-medium hover:underline">+ Tambah Point Siklus</button>
                        </div>

                        {/* ENGLISH */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Globe size={16} className="text-blue-500" />
                                <label className="block text-sm font-semibold text-gray-600">English</label>
                            </div>
                            {((data as any).activityCycleListEn || []).map((item: string, idx: number) => (
                                <div key={idx} className="flex gap-2">
                                    <input
                                        className="flex-1 border rounded-lg px-3 py-2 text-sm"
                                        value={item}
                                        onChange={e => handleActivityCycleChange(idx, e.target.value, 'en')}
                                        placeholder={`Point ${idx + 1}`}
                                    />
                                    <button onClick={() => removeActivityCycle(idx, 'en')} className="text-red-500 hover:text-red-700 px-2">x</button>
                                </div>
                            ))}
                            <button onClick={() => addActivityCycle('en')} className="text-sm text-blue-600 font-medium hover:underline">+ Add Cycle Point</button>
                        </div>
                    </div>
                </section>

                <div className="flex justify-end pt-4">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Simpan Perubahan
                    </button>
                </div>
            </div>
        </div>
    );
}
