
"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Building, BookOpen, Image as ImageIcon, Plus, Trash2, Award, Globe, Car, Home, Coffee, Hospital, Star } from "lucide-react";
import Image from "next/image";

interface FacilityItem {
    id: string;
    title: string;
    description: string;
    image: string;
    icon?: string;
    titleEn?: string;
    descriptionEn?: string;
}

interface StatItem {
    id: string;
    label: string;
    value: number | string;
    icon: string;
    labelEn?: string;
}

interface FacilitiesData {
    academic: FacilityItem[];
    public: FacilityItem[];
    gallery: string[];
    stats: StatItem[];
}

const IconMap: { [key: string]: any } = {
    Building, BookOpen, Coffee, Hospital, Home, Car, Star
};

const availableIcons = Object.keys(IconMap);

export default function AdminFacilitiesPage() {
    const [activeTab, setActiveTab] = useState<'academic' | 'public' | 'gallery' | 'stats'>('academic');
    const [data, setData] = useState<FacilitiesData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/facilities', { cache: 'no-store' });
            const json = await res.json();
            // Initialize defaults if missing
            if (!json.academic) json.academic = [];
            if (!json.public) json.public = [];
            if (!json.gallery) json.gallery = [];
            if (!json.stats) json.stats = [];
            setData(json);
        } catch (error) {
            console.error("Failed to fetch facilities data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const translateText = async (text: string, callback: (translated: string) => void) => {
        if (!text) return alert("Text is empty");
        try {
            document.body.style.cursor = 'wait';
            const res = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, targetLanguage: 'English' })
            });
            const result = await res.json();
            document.body.style.cursor = 'default';
            if (result.translatedText) callback(result.translatedText);
            else alert("Translation failed");
        } catch (error) {
            document.body.style.cursor = 'default';
            alert("Translation error");
        }
    };

    const handleSave = async (type: string, payload: any) => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/facilities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, ...payload })
            });
            if (!res.ok) throw new Error('Failed to save');
            alert('Data saved successfully!');
            fetchData();
        } catch (e: any) {
            alert(e.message);
        } finally {
            setIsSaving(false);
        }
    };

    // Generic handler to update item in list
    const updateItem = (section: 'academic' | 'public' | 'stats', index: number, field: string, value: any) => {
        if (!data) return;
        const newData = { ...data };
        (newData[section] as any)[index][field] = value;
        setData(newData);
    };

    const addItem = (section: 'academic' | 'public' | 'stats') => {
        if (!data) return;
        const newData = { ...data };
        const id = Math.random().toString(36).substr(2, 9);

        if (section === 'stats') {
            newData.stats.push({ id, label: '', value: 0, icon: 'Star', labelEn: '' });
        } else {
            newData[section].push({ id, title: '', description: '', image: '', icon: 'Building', titleEn: '', descriptionEn: '' });
        }
        setData(newData);
    };

    const deleteItem = (section: 'academic' | 'public' | 'stats' | 'gallery', index: number) => {
        if (!data) return;
        if (!confirm('Are you sure?')) return;
        const newData = { ...data };
        if (section === 'gallery') {
            newData.gallery.splice(index, 1);
        } else {
            (newData[section] as any[]).splice(index, 1);
        }
        setData(newData);
    };

    if (isLoading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;
    if (!data) return <div className="p-10 text-center">No data found.</div>;

    const tabs = [
        { id: 'academic', label: 'Fasilitas Akademik', icon: BookOpen },
        { id: 'public', label: 'Fasilitas Umum', icon: Building },
        { id: 'gallery', label: 'Galeri Foto', icon: ImageIcon },
        { id: 'stats', label: 'Statistik', icon: Award },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-unaicNavy">Manajemen Fasilitas</h1>
                    <p className="text-gray-500">Kelola data fasilitas akademik, umum, dan galeri.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-white p-2 rounded-xl shadow-sm overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${activeTab === tab.id ? 'bg-unaicNavy text-white shadow' : 'hover:bg-gray-100 text-gray-600'}`}
                    >
                        <tab.icon size={18} />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">

                {/* Academic & Public Tabs (Similar Structure) */}
                {(activeTab === 'academic' || activeTab === 'public') && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-unaicNavy">
                                {activeTab === 'academic' ? 'Daftar Fasilitas Akademik' : 'Daftar Fasilitas Umum'}
                            </h2>
                            <button onClick={() => addItem(activeTab)} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                                <Plus size={18} /> Tambah Item
                            </button>
                        </div>

                        <div className="grid gap-6">
                            {data[activeTab].map((item, idx) => (
                                <div key={item.id || idx} className="border rounded-xl p-4 bg-gray-50 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Setup Image & Icon */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Gambar URL</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={item.image}
                                                    onChange={(e) => updateItem(activeTab, idx, 'image', e.target.value)}
                                                    className="w-full px-3 py-2 border rounded-lg"
                                                    placeholder="/images/..."
                                                />
                                            </div>
                                            {item.image && (
                                                <div className="relative h-32 w-full rounded-lg overflow-hidden border">
                                                    <Image src={item.image} alt="Preview" fill className="object-cover" />
                                                </div>
                                            )}
                                            {activeTab === 'academic' && (
                                                <div className="mt-2">
                                                    <label className="text-sm font-medium text-gray-700">Icon</label>
                                                    <select
                                                        value={item.icon}
                                                        onChange={(e) => updateItem(activeTab, idx, 'icon', e.target.value)}
                                                        className="w-full px-3 py-2 border rounded-lg mt-1"
                                                    >
                                                        {availableIcons.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                                                    </select>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Fields */}
                                        <div className="space-y-3">
                                            {/* ID Title */}
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">Judul (ID)</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={item.title}
                                                        onChange={(e) => updateItem(activeTab, idx, 'title', e.target.value)}
                                                        className="w-full px-3 py-2 border rounded-lg"
                                                    />
                                                    <button
                                                        onClick={() => translateText(item.title, (t) => updateItem(activeTab, idx, 'titleEn', t))}
                                                        className="text-xs bg-blue-100 text-blue-600 px-2 rounded hover:bg-blue-200"
                                                    >
                                                        Translate
                                                    </button>
                                                </div>
                                            </div>

                                            {/* EN Title */}
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">Judul (EN)</label>
                                                <input
                                                    type="text"
                                                    value={item.titleEn || ''}
                                                    onChange={(e) => updateItem(activeTab, idx, 'titleEn', e.target.value)}
                                                    className="w-full px-3 py-2 border rounded-lg bg-blue-50/50"
                                                    placeholder="English Title"
                                                />
                                            </div>

                                            {/* ID Desc */}
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">Deskripsi (ID)</label>
                                                <div className="flex gap-2">
                                                    <textarea
                                                        value={item.description}
                                                        onChange={(e) => updateItem(activeTab, idx, 'description', e.target.value)}
                                                        className="w-full px-3 py-2 border rounded-lg h-20"
                                                    />
                                                    <button
                                                        onClick={() => translateText(item.description, (t) => updateItem(activeTab, idx, 'descriptionEn', t))}
                                                        className="text-xs bg-blue-100 text-blue-600 px-2 rounded hover:bg-blue-200 h-fit self-start py-1"
                                                    >
                                                        Translate
                                                    </button>
                                                </div>
                                            </div>

                                            {/* EN Desc */}
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">Deskripsi (EN)</label>
                                                <textarea
                                                    value={item.descriptionEn || ''}
                                                    onChange={(e) => updateItem(activeTab, idx, 'descriptionEn', e.target.value)}
                                                    className="w-full px-3 py-2 border rounded-lg bg-blue-50/50 h-20"
                                                    placeholder="English Description"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-2 border-t mt-2">
                                        <button
                                            onClick={() => deleteItem(activeTab, idx)}
                                            className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                                        >
                                            <Trash2 size={16} /> Hapus Item
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end sticky bottom-0 bg-white p-4 border-t shadow-lg rounded-xl">
                            <button
                                onClick={() => handleSave(activeTab === 'academic' ? 'update_academic' : 'update_public', { [activeTab]: data[activeTab] })}
                                disabled={isSaving}
                                className="flex items-center gap-2 bg-unaicNavy text-white px-6 py-3 rounded-xl font-bold hover:bg-unaicBlue transition shadow-lg disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                Simpan Perubahan
                            </button>
                        </div>
                    </div>
                )}

                {/* Gallery Tab */}
                {activeTab === 'gallery' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-unaicNavy">Galeri Foto Fasilitas</h2>
                            <button
                                onClick={() => {
                                    const newData = { ...data };
                                    newData.gallery.push("");
                                    setData(newData);
                                }}
                                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                            >
                                <Plus size={18} /> Tambah Foto
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {data.gallery.map((src, idx) => (
                                <div key={idx} className="border rounded-xl p-4 space-y-3 relative group">
                                    <div className="relative h-40 w-full bg-gray-100 rounded-lg overflow-hidden">
                                        {src ? (
                                            <Image src={src} alt="Gallery" fill className="object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        value={src}
                                        onChange={(e) => {
                                            const newData = { ...data };
                                            newData.gallery[idx] = e.target.value;
                                            setData(newData);
                                        }}
                                        className="w-full px-3 py-2 border rounded-lg text-sm"
                                        placeholder="/images/..."
                                    />
                                    <button
                                        onClick={() => deleteItem('gallery', idx)}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end mt-8">
                            <button
                                onClick={() => handleSave('update_gallery', { gallery: data.gallery })}
                                disabled={isSaving}
                                className="flex items-center gap-2 bg-unaicNavy text-white px-6 py-3 rounded-xl font-bold hover:bg-unaicBlue transition shadow-lg disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                Simpan Galeri
                            </button>
                        </div>
                    </div>
                )}

                {/* Stats Tab */}
                {activeTab === 'stats' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-unaicNavy">Data Statistik</h2>
                            <button onClick={() => addItem('stats')} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                                <Plus size={18} /> Tambah Statistik
                            </button>
                        </div>

                        <div className="grid gap-4">
                            {data.stats.map((item, idx) => (
                                <div key={idx} className="border rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start">
                                    <div className="p-3 bg-gray-100 rounded-lg">
                                        <Star className="text-unaicGold" />
                                    </div>
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Label (ID)</label>
                                            <div className="flex gap-2">
                                                <input
                                                    value={item.label}
                                                    onChange={(e) => updateItem('stats', idx, 'label', e.target.value)}
                                                    className="w-full px-3 py-2 border rounded-lg"
                                                />
                                                <button
                                                    onClick={() => translateText(item.label, (t) => updateItem('stats', idx, 'labelEn', t))}
                                                    className="text-xs bg-blue-100 text-blue-600 px-2 rounded hover:bg-blue-200"
                                                >
                                                    EN
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Label (EN)</label>
                                            <input
                                                value={item.labelEn || ''}
                                                onChange={(e) => updateItem('stats', idx, 'labelEn', e.target.value)}
                                                className="w-full px-3 py-2 border rounded-lg bg-blue-50/50"
                                            />
                                        </div>
                                        <div className="md:col-span-2 flex gap-4">
                                            <div className="flex-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Nilai / Angka</label>
                                                <input
                                                    value={item.value}
                                                    onChange={(e) => updateItem('stats', idx, 'value', e.target.value)}
                                                    className="w-full px-3 py-2 border rounded-lg"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Icon</label>
                                                <select
                                                    value={item.icon}
                                                    onChange={(e) => updateItem('stats', idx, 'icon', e.target.value)}
                                                    className="w-full px-3 py-2 border rounded-lg"
                                                >
                                                    {availableIcons.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => deleteItem('stats', idx)} className="text-red-500 hover:text-red-700 p-2">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end mt-8">
                            <button
                                onClick={() => handleSave('update_stats', { stats: data.stats })}
                                disabled={isSaving}
                                className="flex items-center gap-2 bg-unaicNavy text-white px-6 py-3 rounded-xl font-bold hover:bg-unaicBlue transition shadow-lg disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                Simpan Statistik
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
