"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, GraduationCap, Grid, Plus, Trash2, Award, Sparkles } from "lucide-react";

interface Category {
    id: string;
    name: string;
    nameEn?: string;
}

interface ScholarshipItem {
    id: string;
    categoryId: string;
    title: string;
    titleEn?: string;
    description: string;
    descriptionEn?: string;
}

interface ScholarshipData {
    categories: Category[];
    items: ScholarshipItem[];
}

export default function AdminScholarshipPage() {
    const [activeTab, setActiveTab] = useState<'categories' | 'items'>('items');
    const [data, setData] = useState<ScholarshipData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/scholarships', { cache: 'no-store' });
            const json = await res.json();
            setData(json);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (type: string, payload: any) => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/scholarships', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, ...payload })
            });

            if (!res.ok) throw new Error('Gagal menyimpan data');
            alert('Perubahan berhasil disimpan!');
            fetchData();
        } catch (e: any) {
            alert('Gagal menyimpan: ' + e.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleTranslate = async (text: string, targetField: string, index: number, tab: 'categories' | 'items') => {
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
            const result = await res.json();
            if (result.translatedText) {
                if (tab === 'categories') {
                    const newCats = [...data!.categories];
                    (newCats[index] as any)[targetField] = result.translatedText;
                    setData({ ...data!, categories: newCats });
                } else {
                    const newItems = [...data!.items];
                    (newItems[index] as any)[targetField] = result.translatedText;
                    setData({ ...data!, items: newItems });
                }
            }
        } catch (error) {
            console.error("Translation failed", error);
            alert("Gagal menerjemahkan.");
        } finally {
            setIsTranslating(false);
        }
    };

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

    if (isLoading || !data) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    const renderTabButton = (id: typeof activeTab, label: string, Icon: any) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === id ? 'bg-unaicNavy text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
        >
            <Icon size={16} /> {label}
        </button>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Beasiswa</h1>

            <div className="flex overflow-x-auto pb-2 gap-2 bg-white rounded-xl p-2 shadow-sm border border-gray-100 w-full sm:w-fit scrollbar-hide">
                {renderTabButton('items', 'Daftar Beasiswa', Award)}
                {renderTabButton('categories', 'Kategori Beasiswa', Grid)}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[500px]">

                {/* CATEGORIES TAB */}
                {activeTab === 'categories' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg text-unaicNavy">Kategori Beasiswa</h3>
                            <button
                                onClick={() => setData({ ...data, categories: [...data.categories, { id: crypto.randomUUID(), name: "" }] })}
                                className="text-sm text-green-600 hover:bg-green-50 px-3 py-1 rounded-lg flex items-center gap-1 border border-green-200"
                            >
                                <Plus size={16} /> Tambah Kategori
                            </button>
                        </div>
                        <div className="space-y-4 max-w-4xl">
                            {data.categories.map((cat, idx) => (
                                <div key={cat.id} className="flex flex-col p-4 border rounded-xl bg-gray-50 gap-4 relative group">
                                    <button onClick={() => {
                                        const newCats = data.categories.filter((_, i) => i !== idx);
                                        setData({ ...data, categories: newCats });
                                    }} className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded">
                                        <Trash2 size={18} />
                                    </button>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase px-1">Nama Kategori (ID)</label>
                                            <input
                                                className="w-full p-2 border rounded-lg"
                                                placeholder="Nama Kategori..."
                                                value={cat.name}
                                                onChange={e => {
                                                    const newCats = [...data.categories];
                                                    newCats[idx].name = e.target.value;
                                                    setData({ ...data, categories: newCats });
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center px-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Nama Kategori (EN)</label>
                                                <TranslateBtn onClick={() => handleTranslate(cat.name, 'nameEn', idx, 'categories')} />
                                            </div>
                                            <input
                                                className="w-full p-2 border rounded-lg bg-white"
                                                placeholder="English Name..."
                                                value={cat.nameEn || ""}
                                                onChange={e => {
                                                    const newCats = [...data.categories];
                                                    newCats[idx].nameEn = e.target.value;
                                                    setData({ ...data, categories: newCats });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleSave('update_categories', { categories: data.categories })} disabled={isSaving} className="btn-primary bg-unaicNavy text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Simpan Kategori
                        </button>
                    </div>
                )}

                {/* ITEMS TAB */}
                {activeTab === 'items' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg text-unaicNavy">Daftar Beasiswa</h3>
                            <button
                                onClick={() => setData({
                                    ...data,
                                    items: [{
                                        id: crypto.randomUUID(),
                                        categoryId: data.categories[0]?.id || "",
                                        title: "",
                                        description: ""
                                    }, ...data.items]
                                })}
                                className="text-sm text-green-600 hover:bg-green-50 px-3 py-1 rounded-lg flex items-center gap-1 border border-green-200"
                            >
                                <Plus size={16} /> Tambah Beasiswa
                            </button>
                        </div>

                        <div className="space-y-4">
                            {data.items.map((item, idx) => (
                                <div key={item.id} className="border border-gray-200 p-4 rounded-xl bg-gray-50 relative group">
                                    <button onClick={() => {
                                        const newItems = data.items.filter((_, i) => i !== idx);
                                        setData({ ...data, items: newItems });
                                    }} className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition p-2 hover:bg-red-50 rounded-full bg-white shadow-sm z-10">
                                        <Trash2 size={16} />
                                    </button>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Nama Beasiswa (ID)</label>
                                                <input
                                                    className="w-full p-2 border rounded font-semibold"
                                                    value={item.title}
                                                    onChange={e => {
                                                        const newData = [...data.items];
                                                        newData[idx].title = e.target.value;
                                                        setData({ ...data, items: newData });
                                                    }}
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <div className="flex justify-between items-center px-1">
                                                    <label className="text-xs font-bold text-gray-500 uppercase">Nama Beasiswa (EN)</label>
                                                    <TranslateBtn onClick={() => handleTranslate(item.title, 'titleEn', idx, 'items')} />
                                                </div>
                                                <input
                                                    className="w-full p-2 border rounded font-semibold bg-white"
                                                    value={item.titleEn || ""}
                                                    onChange={e => {
                                                        const newData = [...data.items];
                                                        newData[idx].titleEn = e.target.value;
                                                        setData({ ...data, items: newData });
                                                    }}
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Kategori</label>
                                                <select
                                                    className="w-full p-2 border rounded text-sm"
                                                    value={item.categoryId}
                                                    onChange={e => {
                                                        const newData = [...data.items];
                                                        newData[idx].categoryId = e.target.value;
                                                        setData({ ...data, items: newData });
                                                    }}
                                                >
                                                    {data.categories.map(c => (
                                                        <option key={c.id} value={c.id}>{c.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Deskripsi (ID)</label>
                                                <textarea
                                                    className="w-full p-2 border rounded text-sm h-24"
                                                    value={item.description}
                                                    onChange={e => {
                                                        const newData = [...data.items];
                                                        newData[idx].description = e.target.value;
                                                        setData({ ...data, items: newData });
                                                    }}
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <div className="flex justify-between items-center px-1">
                                                    <label className="text-xs font-bold text-gray-500 uppercase">Deskripsi (EN)</label>
                                                    <TranslateBtn onClick={() => handleTranslate(item.description, 'descriptionEn', idx, 'items')} />
                                                </div>
                                                <textarea
                                                    className="w-full p-2 border rounded text-sm h-24 bg-white"
                                                    value={item.descriptionEn || ""}
                                                    onChange={e => {
                                                        const newData = [...data.items];
                                                        newData[idx].descriptionEn = e.target.value;
                                                        setData({ ...data, items: newData });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleSave('update_items', { items: data.items })} disabled={isSaving} className="btn-primary bg-unaicNavy text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Simpan Daftar Beasiswa
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
