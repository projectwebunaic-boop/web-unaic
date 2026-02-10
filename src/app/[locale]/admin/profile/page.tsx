"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Type, History, Info, Sparkles, Image as ImageIcon, Plus, Trash2, Upload, Calendar, Award, MapPin, Milestone, Building, GraduationCap, Users, Eye } from "lucide-react";
import Image from "next/image";

interface ProfileData {
    hero: { title: string; subtitle: string; titleEn?: string; subtitleEn?: string };
    history: { title: string; content: string; image: string; titleEn?: string; contentEn?: string };
    identity: { id: string; title: string; value: string; icon: string; titleEn?: string; valueEn?: string }[];
    values: { id: string; title: string; description: string; icon: string; titleEn?: string; descriptionEn?: string }[];
    media: {
        gallery: { src: string; alt: string }[];
        video: { src: string; poster: string };
    };
    timeline: { id: string; year: string; title: string; description: string; icon: string; titleEn?: string; descriptionEn?: string }[];
    stats: { id: string; label: string; value: number | string; suffix: string; labelEn?: string }[];
    vision: { content: string; contentEn?: string };
    mission: { id: string; title: string; description: string; icon: string; titleEn?: string; descriptionEn?: string }[];
    archiveGallery?: string[];
}

export default function AdminProfilePage() {
    const [activeTab, setActiveTab] = useState<'hero' | 'history' | 'identity' | 'values' | 'media' | 'timeline' | 'stats' | 'archive' | 'vision' | 'mission'>('hero');
    const [data, setData] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadingState, setUploadingState] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/profile', { cache: 'no-store' });
            const json = await res.json();
            // Initialize if missing
            if (!json.vision) json.vision = { content: "" };
            if (!json.mission) json.mission = [];
            if (!json.hero) json.hero = { title: "", subtitle: "" };
            if (!json.history) json.history = { title: "", content: "", image: "" };
            if (!json.archiveGallery) json.archiveGallery = [];
            setData(json);
        } catch (error) {
            console.error("Failed to fetch profile data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const translateField = async (text: string, callback: (translated: string) => void) => {
        if (!text) {
            alert("Teks kosong. Mohon isi teks bahasa Indonesia terlebih dahulu.");
            return;
        }
        try {
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
            console.error("Translation failed", error);
            alert("Gagal menerjemahkan. Periksa koneksi atau kuota API.");
        }
    };

    const handleSave = async (type: string, payload: any) => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, ...payload })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Gagal menyimpan data');
            }

            alert('Perubahan berhasil disimpan!');
            fetchData(); // Refresh data
        } catch (e: any) {
            console.error(e);
            alert('Gagal menyimpan: ' + e.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string, callback: (url: string) => void) => {
        if (!e.target.files?.[0]) return;
        setUploadingState(prev => ({ ...prev, [key]: true }));

        const formData = new FormData();
        formData.append('file', e.target.files[0]);

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const result = await res.json();
            if (result.url) {
                callback(result.url);
                alert("Gambar berhasil diupload. Jangan lupa klik tombol Simpan!");
            } else {
                alert('Upload gagal: ' + (result.error || 'Terjadi kesalahan'));
            }
        } catch (error) {
            alert('Terjadi kesalahan saat upload.');
        } finally {
            setUploadingState(prev => ({ ...prev, [key]: false }));
        }
    };

    if (isLoading || !data) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    const renderTabButton = (id: typeof activeTab, label: string, Icon: any) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === id ? 'bg-unaicNavy text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
        >
            <Icon size={16} /> {label}
        </button>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Profil Kampus</h1>

            <div className="flex flex-wrap gap-2 bg-white rounded-xl p-2 shadow-sm border border-gray-100 w-full sm:w-fit">
                {renderTabButton('hero', 'Hero', Type)}
                {renderTabButton('history', 'Sejarah', History)}
                {renderTabButton('vision', 'Visi', Eye)}
                {renderTabButton('mission', 'Misi', Milestone)}
                {renderTabButton('identity', 'Identitas', Info)}
                {renderTabButton('values', 'Nilai Inti', Sparkles)}
                {renderTabButton('media', 'Media', ImageIcon)}
                {renderTabButton('timeline', 'Timeline', Calendar)}
                {renderTabButton('stats', 'Statistik', Award)}
                {renderTabButton('archive', 'Arsip Galeri', MapPin)}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[500px]">

                {/* HERO TAB */}
                {activeTab === 'hero' && (
                    <div className="space-y-6 max-w-2xl">
                        <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-gray-600">Judul Utama (ID)</label>
                                    <button type="button" onClick={() => translateField(data.hero.title, (val) => setData({ ...data, hero: { ...data.hero, titleEn: val } }))} className="text-xs text-blue-600 font-bold hover:underline">Translate ➔ EN</button>
                                </div>
                                <input
                                    className="input-field w-full p-2 border rounded-lg"
                                    value={data.hero.title}
                                    onChange={e => setData({ ...data, hero: { ...data.hero, title: e.target.value } })}
                                />
                                <input
                                    className="input-field w-full p-2 border rounded-lg bg-blue-50/50"
                                    placeholder="Judul Utama (EN)"
                                    value={data.hero.titleEn || ''}
                                    onChange={e => setData({ ...data, hero: { ...data.hero, titleEn: e.target.value } })}
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-gray-600">Sub-Judul (ID)</label>
                                    <button type="button" onClick={() => translateField(data.hero.subtitle, (val) => setData({ ...data, hero: { ...data.hero, subtitleEn: val } }))} className="text-xs text-blue-600 font-bold hover:underline">Translate ➔ EN</button>
                                </div>
                                <textarea
                                    className="input-field w-full p-2 border rounded-lg h-24"
                                    value={data.hero.subtitle}
                                    onChange={e => setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } })}
                                />
                                <textarea
                                    className="input-field w-full p-2 border rounded-lg h-24 bg-blue-50/50"
                                    placeholder="Sub-Judul (EN)"
                                    value={data.hero.subtitleEn || ''}
                                    onChange={e => setData({ ...data, hero: { ...data.hero, subtitleEn: e.target.value } })}
                                />
                            </div>
                        </div>
                        <button onClick={() => handleSave('update_hero', { hero: data.hero })} disabled={isSaving} className="btn-primary bg-unaicNavy text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            <Save size={16} /> Simpan Hero
                        </button>
                    </div>
                )}

                {/* HISTORY TAB */}
                {activeTab === 'history' && (
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-bold text-gray-600">Judul Sejarah (ID)</label>
                                        <button type="button" onClick={() => translateField(data.history.title, (val) => setData({ ...data, history: { ...data.history, titleEn: val } }))} className="text-xs text-blue-600 font-bold hover:underline">Translate ➔ EN</button>
                                    </div>
                                    <input
                                        className="input-field w-full p-2 border rounded-lg"
                                        value={data.history.title}
                                        onChange={e => setData({ ...data, history: { ...data.history, title: e.target.value } })}
                                    />
                                    <input
                                        className="input-field w-full p-2 border rounded-lg bg-blue-50/50"
                                        placeholder="Judul Sejarah (EN)"
                                        value={data.history.titleEn || ''}
                                        onChange={e => setData({ ...data, history: { ...data.history, titleEn: e.target.value } })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-bold text-gray-600">Konten Sejarah (HTML ID)</label>
                                        <button type="button" onClick={() => translateField(data.history.content, (val) => setData({ ...data, history: { ...data.history, contentEn: val } }))} className="text-xs text-blue-600 font-bold hover:underline">Translate ➔ EN</button>
                                    </div>
                                    <textarea
                                        className="input-field w-full p-3 border rounded-lg h-60 font-mono text-sm"
                                        value={data.history.content}
                                        onChange={e => setData({ ...data, history: { ...data.history, content: e.target.value } })}
                                    />
                                    <label className="text-sm font-bold text-gray-600 block mt-2">Konten Sejarah (HTML EN)</label>
                                    <textarea
                                        className="input-field w-full p-3 border rounded-lg h-60 font-mono text-sm bg-blue-50/50"
                                        placeholder="History Content (EN)"
                                        value={data.history.contentEn || ''}
                                        onChange={e => setData({ ...data, history: { ...data.history, contentEn: e.target.value } })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-gray-600">Gambar Sejarah</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                                    {data.history.image && (
                                        <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                                            <Image src={data.history.image} alt="History" fill className="object-cover" />
                                        </div>
                                    )}
                                    <label className="cursor-pointer bg-unaicBlue/10 text-unaicBlue px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2 hover:bg-unaicBlue/20 transition">
                                        {uploadingState['history_img'] ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                                        Upload Gambar
                                        <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'history_img', url => setData(prev => (!prev ? null : { ...prev, history: { ...prev.history, image: url } })))} />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => handleSave('update_history', { history: data.history })} disabled={isSaving} className="btn-primary bg-unaicNavy text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            <Save size={16} /> Simpan Sejarah
                        </button>
                    </div>
                )}

                {/* VISION TAB */}
                {activeTab === 'vision' && (
                    <div className="space-y-6 max-w-3xl">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-lg font-bold text-unaicNavy">Visi Universitas (ID)</label>
                                    <button type="button" onClick={() => translateField(data.vision.content, (val) => setData({ ...data, vision: { ...data.vision, contentEn: val } }))} className="text-sm font-bold text-blue-600 hover:underline">Translate ➔ EN</button>
                                </div>
                                <textarea
                                    className="input-field w-full p-4 border rounded-lg h-40 text-lg leading-relaxed"
                                    value={data.vision?.content}
                                    onChange={e => setData({ ...data, vision: { ...data.vision, content: e.target.value } })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-lg font-bold text-unaicNavy">Visi Universitas (EN)</label>
                                <textarea
                                    className="input-field w-full p-4 border rounded-lg h-40 text-lg leading-relaxed bg-blue-50/50"
                                    placeholder="Vision (EN)"
                                    value={data.vision?.contentEn || ''}
                                    onChange={e => setData({ ...data, vision: { ...data.vision, contentEn: e.target.value } })}
                                />
                            </div>
                        </div>
                        <button onClick={() => handleSave('update_vision', { vision: data.vision })} disabled={isSaving} className="btn-primary bg-unaicNavy text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            <Save size={16} /> Simpan Visi
                        </button>
                    </div>
                )}

                {/* MISSION TAB */}
                {activeTab === 'mission' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg text-unaicNavy">Misi Universitas</h3>
                            <button
                                onClick={() => setData({ ...data, mission: [...data.mission, { id: crypto.randomUUID(), title: "", description: "", icon: "BookOpen" }] })}
                                className="text-sm text-green-600 hover:bg-green-50 px-3 py-1 rounded-lg flex items-center gap-1 border border-green-200"
                            >
                                <Plus size={16} /> Tambah Misi
                            </button>
                        </div>
                        <div className="grid gap-6">
                            {data.mission.map((item, idx) => (
                                <div key={item.id} className="border border-gray-200 p-6 rounded-xl bg-gray-50 shadow-sm relative group transition hover:shadow-md">
                                    <button onClick={() => {
                                        const newMission = data.mission.filter((_, i) => i !== idx);
                                        setData({ ...data, mission: newMission });
                                    }} className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition p-2 hover:bg-red-50 rounded-full">
                                        <Trash2 size={20} />
                                    </button>

                                    <div className="flex gap-4 items-start">
                                        <div className="flex-none w-12 h-12 bg-white rounded-lg flex items-center justify-center border font-bold text-xl text-gray-400">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex justify-between items-center">
                                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Judul Misi (ID)</label>
                                                        <button type="button" onClick={() => translateField(item.title, (val) => { const newM = [...data.mission]; newM[idx].titleEn = val; setData({ ...data, mission: newM }); })} className="text-[10px] text-blue-600 font-bold hover:underline">Translate ➔ EN</button>
                                                    </div>
                                                    <input
                                                        placeholder="Contoh: Pendidikan Berkualitas"
                                                        className="w-full p-2 border rounded-lg font-semibold"
                                                        value={item.title}
                                                        onChange={e => {
                                                            const newMission = [...data.mission];
                                                            newMission[idx].title = e.target.value;
                                                            setData({ ...data, mission: newMission });
                                                        }}
                                                    />
                                                    <input
                                                        placeholder="Title (EN)"
                                                        className="w-full p-2 border rounded-lg font-semibold bg-blue-50/50 mt-1"
                                                        value={item.titleEn || ''}
                                                        onChange={e => {
                                                            const newMission = [...data.mission];
                                                            newMission[idx].titleEn = e.target.value;
                                                            setData({ ...data, mission: newMission });
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Icon (Lucide React)</label>
                                                    <input
                                                        placeholder="Contoh: BookOpen"
                                                        className="w-full p-2 border rounded-lg font-mono text-sm"
                                                        value={item.icon}
                                                        onChange={e => {
                                                            const newMission = [...data.mission];
                                                            newMission[idx].icon = e.target.value;
                                                            setData({ ...data, mission: newMission });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Deskripsi Misi (ID)</label>
                                                    <button type="button" onClick={() => translateField(item.description, (val) => { const newM = [...data.mission]; newM[idx].descriptionEn = val; setData({ ...data, mission: newM }); })} className="text-[10px] text-blue-600 font-bold hover:underline">Translate ➔ EN</button>
                                                </div>
                                                <textarea
                                                    placeholder="Jelaskan misi secara detail..."
                                                    className="w-full p-2 border rounded-lg h-24 text-sm"
                                                    value={item.description}
                                                    onChange={e => {
                                                        const newMission = [...data.mission];
                                                        newMission[idx].description = e.target.value;
                                                        setData({ ...data, mission: newMission });
                                                    }}
                                                />
                                                <textarea
                                                    placeholder="Mission Description (EN)"
                                                    className="w-full p-2 border rounded-lg h-24 text-sm bg-blue-50/50 mt-1"
                                                    value={item.descriptionEn || ''}
                                                    onChange={e => {
                                                        const newMission = [...data.mission];
                                                        newMission[idx].descriptionEn = e.target.value;
                                                        setData({ ...data, mission: newMission });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleSave('update_mission', { mission: data.mission })} disabled={isSaving} className="btn-primary bg-unaicNavy text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            <Save size={16} /> Simpan Misi
                        </button>
                    </div>
                )}

                {/* IDENTITY TAB */}
                {activeTab === 'identity' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold">Identitas Kampus</h3>
                            <button
                                onClick={() => setData({ ...data, identity: [...data.identity, { id: crypto.randomUUID(), title: "", value: "", icon: "Start" }] })}
                                className="text-sm text-green-600 hover:bg-green-50 px-3 py-1 rounded-lg flex items-center gap-1"
                            >
                                <Plus size={16} /> Tambah Item
                            </button>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {data.identity.map((item, idx) => (
                                <div key={item.id} className="border p-4 rounded-xl bg-gray-50 space-y-3 relative group">
                                    <button onClick={() => {
                                        const newIdentity = data.identity.filter((_, i) => i !== idx);
                                        setData({ ...data, identity: newIdentity });
                                    }} className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"><Trash2 size={16} /></button>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-bold text-gray-400">Title (ID)</label>
                                                <button type="button" onClick={() => translateField(item.title, (val) => { const newId = [...data.identity]; newId[idx].titleEn = val; setData({ ...data, identity: newId }); })} className="text-[10px] text-blue-600 font-bold hover:underline">Translate</button>
                                            </div>
                                            <input
                                                placeholder="Judul (ex: Akreditasi)"
                                                className="p-2 border rounded text-sm w-full"
                                                value={item.title}
                                                onChange={e => {
                                                    const newId = [...data.identity];
                                                    newId[idx].title = e.target.value;
                                                    setData({ ...data, identity: newId });
                                                }}
                                            />
                                            <input
                                                placeholder="Title (EN)"
                                                className="p-2 border rounded text-sm w-full bg-blue-50/50"
                                                value={item.titleEn || ''}
                                                onChange={e => {
                                                    const newId = [...data.identity];
                                                    newId[idx].titleEn = e.target.value;
                                                    setData({ ...data, identity: newId });
                                                }}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold text-gray-400">Icon</label>
                                            <input
                                                placeholder="Icon (Lucide Name)"
                                                className="p-2 border rounded text-sm w-full"
                                                value={item.icon}
                                                onChange={e => {
                                                    const newId = [...data.identity];
                                                    newId[idx].icon = e.target.value;
                                                    setData({ ...data, identity: newId });
                                                }}
                                            />
                                        </div>
                                        <div className="col-span-2 flex flex-col gap-1">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-bold text-gray-400">Value (ID)</label>
                                                <button type="button" onClick={() => translateField(item.value, (val) => { const newId = [...data.identity]; newId[idx].valueEn = val; setData({ ...data, identity: newId }); })} className="text-[10px] text-blue-600 font-bold hover:underline">Translate</button>
                                            </div>
                                            <input
                                                placeholder="Nilai (ex: Baik Sekali)"
                                                className="p-2 border rounded text-sm w-full font-bold"
                                                value={item.value}
                                                onChange={e => {
                                                    const newId = [...data.identity];
                                                    newId[idx].value = e.target.value;
                                                    setData({ ...data, identity: newId });
                                                }}
                                            />
                                            <input
                                                placeholder="Value (EN)"
                                                className="p-2 border rounded text-sm w-full font-bold bg-blue-50/50"
                                                value={item.valueEn || ''}
                                                onChange={e => {
                                                    const newId = [...data.identity];
                                                    newId[idx].valueEn = e.target.value;
                                                    setData({ ...data, identity: newId });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleSave('update_identity', { identity: data.identity })} disabled={isSaving} className="btn-primary bg-unaicNavy text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            <Save size={16} /> Simpan Identitas
                        </button>
                    </div>
                )}

                {/* VALUES TAB */}
                {activeTab === 'values' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold">Nilai Inti</h3>
                            <button
                                onClick={() => setData({ ...data, values: [...data.values, { id: crypto.randomUUID(), title: "", description: "", icon: "Star" }] })}
                                className="text-sm text-green-600 hover:bg-green-50 px-3 py-1 rounded-lg flex items-center gap-1"
                            >
                                <Plus size={16} /> Tambah Nilai
                            </button>
                        </div>
                        <div className="grid gap-4">
                            {data.values.map((val, idx) => (
                                <div key={val.id} className="border p-4 rounded-xl bg-gray-50 flex gap-4 items-start relative group">
                                    <button onClick={() => {
                                        const newVal = data.values.filter((_, i) => i !== idx);
                                        setData({ ...data, values: newVal });
                                    }} className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"><Trash2 size={16} /></button>

                                    <div className="flex-1 space-y-2">
                                        <div className="flex gap-2">
                                            <div className="w-1/2 space-y-1">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-[10px] font-bold text-gray-400">Title (ID)</label>
                                                    <button type="button" onClick={() => translateField(val.title, (res) => { const newVal = [...data.values]; newVal[idx].titleEn = res; setData({ ...data, values: newVal }); })} className="text-[10px] text-blue-600 font-bold hover:underline">Translate</button>
                                                </div>
                                                <input
                                                    placeholder="Judul Nilai"
                                                    className="p-2 border rounded font-bold text-sm w-full"
                                                    value={val.title}
                                                    onChange={e => {
                                                        const newVal = [...data.values];
                                                        newVal[idx].title = e.target.value;
                                                        setData({ ...data, values: newVal });
                                                    }}
                                                />
                                                <input
                                                    placeholder="Title (EN)"
                                                    className="p-2 border rounded font-bold text-sm bg-blue-50/50 w-full"
                                                    value={val.titleEn || ''}
                                                    onChange={e => {
                                                        const newVal = [...data.values];
                                                        newVal[idx].titleEn = e.target.value;
                                                        setData({ ...data, values: newVal });
                                                    }}
                                                />
                                            </div>
                                            <div className="w-1/4 space-y-1">
                                                <label className="text-[10px] font-bold text-gray-400">Icon</label>
                                                <input
                                                    placeholder="Icon"
                                                    className="p-2 border rounded text-sm w-full"
                                                    value={val.icon}
                                                    onChange={e => {
                                                        const newVal = [...data.values];
                                                        newVal[idx].icon = e.target.value;
                                                        setData({ ...data, values: newVal });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-bold text-gray-400">Description (ID)</label>
                                                <button type="button" onClick={() => translateField(val.description, (res) => { const newVal = [...data.values]; newVal[idx].descriptionEn = res; setData({ ...data, values: newVal }); })} className="text-[10px] text-blue-600 font-bold hover:underline">Translate</button>
                                            </div>
                                            <textarea
                                                placeholder="Deskripsi"
                                                className="p-2 border rounded text-sm w-full h-16"
                                                value={val.description}
                                                onChange={e => {
                                                    const newVal = [...data.values];
                                                    newVal[idx].description = e.target.value;
                                                    setData({ ...data, values: newVal });
                                                }}
                                            />
                                            <textarea
                                                placeholder="Description (EN)"
                                                className="p-2 border rounded text-sm w-full h-16 bg-blue-50/50"
                                                value={val.descriptionEn || ''}
                                                onChange={e => {
                                                    const newVal = [...data.values];
                                                    newVal[idx].descriptionEn = e.target.value;
                                                    setData({ ...data, values: newVal });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleSave('update_values', { values: data.values })} disabled={isSaving} className="btn-primary bg-unaicNavy text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            <Save size={16} /> Simpan Nilai Inti
                        </button>
                    </div>
                )}

                {/* MEDIA TAB */}
                {activeTab === 'media' && (
                    <div className="space-y-8">
                        {/* Gallery Section */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-700 border-b pb-2">Galeri Foto</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {data.media.gallery.map((img, idx) => (
                                    <div key={idx} className="relative aspect-video rounded-lg overflow-hidden group">
                                        <Image src={img.src} alt={img.alt} fill className="object-cover" />
                                        <button
                                            onClick={() => {
                                                const newGallery = data.media.gallery.filter((_, i) => i !== idx);
                                                setData({ ...data, media: { ...data.media, gallery: newGallery } });
                                            }}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ))}
                                <label className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 aspect-video">
                                    {uploadingState['gallery'] ? <Loader2 className="animate-spin text-gray-400" /> : <Plus className="text-gray-400" />}
                                    <span className="text-xs text-gray-500 mt-1">Tambah Foto</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={e => handleFileUpload(e, 'gallery', url => setData(prev => (!prev ? null : { ...prev, media: { ...prev.media, gallery: [...prev.media.gallery, { src: url, alt: 'Gallery Image' }] } })))}
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Video Section */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-700 border-b pb-2">Video Profil</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Video Source (URL / Upload Path)</label>
                                    <input
                                        className="w-full p-2 border rounded"
                                        value={data.media.video.src}
                                        onChange={e => setData({ ...data, media: { ...data.media, video: { ...data.media.video, src: e.target.value } } })}
                                        placeholder="/video/hero/hero.mp4"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Poster Image</label>
                                    <div className="flex gap-2">
                                        <input
                                            className="flex-1 p-2 border rounded"
                                            value={data.media.video.poster}
                                            onChange={e => setData({ ...data, media: { ...data.media, video: { ...data.media.video, poster: e.target.value } } })}
                                        />
                                        <label className="bg-gray-100 border px-3 flex items-center justify-center rounded cursor-pointer hover:bg-gray-200">
                                            <Upload size={16} />
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={e => handleFileUpload(e, 'video_poster', url => setData(prev => (!prev ? null : { ...prev, media: { ...prev.media, video: { ...prev.media.video, poster: url } } })))}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button onClick={() => handleSave('update_media', { media: data.media })} disabled={isSaving} className="btn-primary bg-unaicNavy text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            <Save size={16} /> Simpan Media
                        </button>
                    </div>
                )}

                {/* TIMELINE TAB */}
                {activeTab === 'timeline' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold">Timeline Sejarah</h3>
                            <button
                                onClick={() => setData({ ...data, timeline: [...(data.timeline || []), { id: crypto.randomUUID(), year: "", title: "", description: "", icon: "Milestone" }] })}
                                className="text-sm text-green-600 hover:bg-green-50 px-3 py-1 rounded-lg flex items-center gap-1"
                            >
                                <Plus size={16} /> Tambah Tahun
                            </button>
                        </div>
                        <div className="space-y-4">
                            {data.timeline?.map((item, idx) => (
                                <div key={item.id} className="border p-4 rounded-xl bg-gray-50 relative group">
                                    <button onClick={() => {
                                        const newTimeline = data.timeline.filter((_, i) => i !== idx);
                                        setData({ ...data, timeline: newTimeline });
                                    }} className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"><Trash2 size={16} /></button>

                                    <div className="grid md:grid-cols-12 gap-4">
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-xs font-bold text-gray-500">Tahun</label>
                                            <input
                                                className="w-full p-2 border rounded"
                                                value={item.year}
                                                onChange={(e) => {
                                                    const newTimeline = [...data.timeline];
                                                    newTimeline[idx].year = e.target.value;
                                                    setData({ ...data, timeline: newTimeline });
                                                }}
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-xs font-bold text-gray-500">Icon</label>
                                            <input
                                                className="w-full p-2 border rounded"
                                                value={item.icon}
                                                onChange={(e) => {
                                                    const newTimeline = [...data.timeline];
                                                    newTimeline[idx].icon = e.target.value;
                                                    setData({ ...data, timeline: newTimeline });
                                                }}
                                            />
                                        </div>
                                        <div className="md:col-span-8 space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-bold text-gray-500">Judul Peristiwa (ID)</label>
                                                <button type="button" onClick={() => translateField(item.title, (res) => { const newT = [...data.timeline]; newT[idx].titleEn = res; setData({ ...data, timeline: newT }); })} className="text-[10px] text-blue-600 font-bold hover:underline">Translate ➔ EN</button>
                                            </div>
                                            <input
                                                className="w-full p-2 border rounded font-semibold"
                                                value={item.title}
                                                onChange={(e) => {
                                                    const newTimeline = [...data.timeline];
                                                    newTimeline[idx].title = e.target.value;
                                                    setData({ ...data, timeline: newTimeline });
                                                }}
                                            />
                                            <input
                                                className="w-full p-2 border rounded font-semibold bg-blue-50/50 mt-1"
                                                placeholder="Title (EN)"
                                                value={item.titleEn || ''}
                                                onChange={(e) => {
                                                    const newTimeline = [...data.timeline];
                                                    newTimeline[idx].titleEn = e.target.value;
                                                    setData({ ...data, timeline: newTimeline });
                                                }}
                                            />
                                        </div>
                                        <div className="md:col-span-12 space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-bold text-gray-500">Deskripsi (ID)</label>
                                                <button type="button" onClick={() => translateField(item.description, (res) => { const newT = [...data.timeline]; newT[idx].descriptionEn = res; setData({ ...data, timeline: newT }); })} className="text-[10px] text-blue-600 font-bold hover:underline">Translate ➔ EN</button>
                                            </div>
                                            <textarea
                                                className="w-full p-2 border rounded text-sm h-20"
                                                value={item.description}
                                                onChange={(e) => {
                                                    const newTimeline = [...data.timeline];
                                                    newTimeline[idx].description = e.target.value;
                                                    setData({ ...data, timeline: newTimeline });
                                                }}
                                            />
                                            <textarea
                                                className="w-full p-2 border rounded text-sm h-20 bg-blue-50/50 mt-1"
                                                placeholder="Description (EN)"
                                                value={item.descriptionEn || ''}
                                                onChange={(e) => {
                                                    const newTimeline = [...data.timeline];
                                                    newTimeline[idx].descriptionEn = e.target.value;
                                                    setData({ ...data, timeline: newTimeline });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleSave('update_timeline', { timeline: data.timeline })} disabled={isSaving} className="btn-primary bg-unaicNavy text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            <Save size={16} /> Simpan Timeline
                        </button>
                    </div>
                )}

                {/* STATS TAB */}
                {activeTab === 'stats' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold">Statistik Capaian</h3>
                            <button
                                onClick={() => setData({ ...data, stats: [...(data.stats || []), { id: crypto.randomUUID(), label: "", value: "", suffix: "" }] })}
                                className="text-sm text-green-600 hover:bg-green-50 px-3 py-1 rounded-lg flex items-center gap-1"
                            >
                                <Plus size={16} /> Tambah Statistik
                            </button>
                        </div>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {data.stats?.map((item, idx) => (
                                <div key={item.id} className="border p-4 rounded-xl bg-gray-50 relative group space-y-3">
                                    <button onClick={() => {
                                        const newStats = data.stats.filter((_, i) => i !== idx);
                                        setData({ ...data, stats: newStats });
                                    }} className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"><Trash2 size={16} /></button>

                                    <div>
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold text-gray-500">Label (ID)</label>
                                            <button type="button" onClick={() => translateField(item.label, (res) => { const newS = [...data.stats]; newS[idx].labelEn = res; setData({ ...data, stats: newS }); })} className="text-[10px] text-blue-600 font-bold hover:underline">Translate ➔ EN</button>
                                        </div>
                                        <input
                                            className="w-full p-2 border rounded"
                                            value={item.label}
                                            onChange={(e) => {
                                                const newStats = [...data.stats];
                                                newStats[idx].label = e.target.value;
                                                setData({ ...data, stats: newStats });
                                            }}
                                        />
                                        <input
                                            className="w-full p-2 border rounded bg-blue-50/50 mt-1"
                                            placeholder="Label (EN)"
                                            value={item.labelEn || ''}
                                            onChange={(e) => {
                                                const newStats = [...data.stats];
                                                newStats[idx].labelEn = e.target.value;
                                                setData({ ...data, stats: newStats });
                                            }}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <label className="text-xs font-bold text-gray-500">Nilai (Angka)</label>
                                            <input
                                                className="w-full p-2 border rounded"
                                                value={item.value}
                                                type="number"
                                                onChange={(e) => {
                                                    const newStats = [...data.stats];
                                                    newStats[idx].value = e.target.value;
                                                    setData({ ...data, stats: newStats });
                                                }}
                                            />
                                        </div>
                                        <div className="w-1/3">
                                            <label className="text-xs font-bold text-gray-500">Suffix</label>
                                            <input
                                                className="w-full p-2 border rounded"
                                                value={item.suffix}
                                                placeholder="+"
                                                onChange={(e) => {
                                                    const newStats = [...data.stats];
                                                    newStats[idx].suffix = e.target.value;
                                                    setData({ ...data, stats: newStats });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleSave('update_stats', { stats: data.stats })} disabled={isSaving} className="btn-primary bg-unaicNavy text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            <Save size={16} /> Simpan Statistik
                        </button>
                    </div>
                )}

                {/* ARCHIVE GALLERY TAB */}
                {activeTab === 'archive' && (
                    <div className="space-y-6">
                        <h3 className="font-bold">Galeri Arsip Sejarah</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {data.archiveGallery?.map((src, idx) => (
                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
                                    <Image src={src} alt={`Archive ${idx}`} fill className="object-cover" />
                                    <button
                                        onClick={() => {
                                            const newArchive = (data.archiveGallery || []).filter((_, i) => i !== idx);
                                            setData({ ...data, archiveGallery: newArchive });
                                        }}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                            <label className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 aspect-square">
                                {uploadingState['archive'] ? <Loader2 className="animate-spin text-gray-400" /> : <Plus className="text-gray-400" />}
                                <span className="text-xs text-gray-500 mt-1">Tambah Foto Arsip</span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={e => handleFileUpload(e, 'archive', url => setData(prev => (!prev ? null : { ...prev, archiveGallery: [...(prev.archiveGallery || []), url] })))}
                                />
                            </label>
                        </div>
                        <button onClick={() => handleSave('update_archive_gallery', { archiveGallery: data.archiveGallery })} disabled={isSaving} className="btn-primary bg-unaicNavy text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            <Save size={16} /> Simpan Galeri Arsip
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
