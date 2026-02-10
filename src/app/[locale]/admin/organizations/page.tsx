"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Users, Grid, Plus, Trash2, Upload, Sparkles } from "lucide-react";

interface Category {
    id: string;
    name: string;
    nameEn?: string;
}

interface OrganizationItem {
    id: string;
    categoryId: string;
    name: string;
    nameEn?: string;
    fullName?: string;
    fullNameEn?: string;
    description: string;
    descriptionEn?: string;
    details?: string;
    detailsEn?: string;
    activities?: string;
    activitiesEn?: string;
    logo?: string;
}

interface OrganizationData {
    categories: Category[];
    items: OrganizationItem[];
}

const TranslateBtn = ({ onClick, isTranslating }: { onClick: () => void, isTranslating?: boolean }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={isTranslating}
        className="text-[10px] flex items-center gap-1 text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded transition disabled:opacity-50 font-bold uppercase tracking-wider"
    >
        {isTranslating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
        Auto Translate
    </button>
);

export default function AdminOrganizationsPage() {
    const [activeTab, setActiveTab] = useState<'categories' | 'items'>('items');
    const [data, setData] = useState<OrganizationData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadingState, setUploadingState] = useState<{ [key: string]: boolean }>({});
    const [translatingState, setTranslatingState] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/organizations', { cache: 'no-store' });
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
            const res = await fetch('/api/admin/organizations', {
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

    const handleTranslate = async (text: string, field: string, idx: number, type: 'categories' | 'items') => {
        if (!text) return alert("Teks sumber kosong.");
        const key = `${type}-${idx}-${field}`;
        setTranslatingState(prev => ({ ...prev, [key]: true }));

        try {
            const res = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, targetLanguage: 'English' })
            });
            const result = await res.json();
            if (result.translatedText && data) {
                if (type === 'categories') {
                    const newCats = [...data.categories];
                    (newCats[idx] as any)[field] = result.translatedText;
                    setData({ ...data, categories: newCats });
                } else {
                    const newItems = [...data.items];
                    (newItems[idx] as any)[field] = result.translatedText;
                    setData({ ...data, items: newItems });
                }
            } else {
                alert("Gagal menerjemahkan.");
            }
        } catch (e) {
            console.error("Translation error", e);
            alert("Error saat menerjemahkan.");
        } finally {
            setTranslatingState(prev => ({ ...prev, [key]: false }));
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
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === id ? 'bg-unaicNavy text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
        >
            <Icon size={16} /> {label}
        </button>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Organisasi</h1>

            <div className="flex overflow-x-auto pb-2 gap-2 bg-white rounded-xl p-2 shadow-sm border border-gray-100 w-full sm:w-fit scrollbar-hide">
                {renderTabButton('items', 'Daftar Organisasi', Users)}
                {renderTabButton('categories', 'Kategori Organisasi', Grid)}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[500px]">

                {/* CATEGORIES TAB */}
                {activeTab === 'categories' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg text-unaicNavy">Kategori Organisasi</h3>
                            <button
                                onClick={() => setData({ ...data, categories: [...data.categories, { id: crypto.randomUUID(), name: "" }] })}
                                className="text-sm text-green-600 hover:bg-green-50 px-3 py-1 rounded-lg flex items-center gap-1 border border-green-200"
                            >
                                <Plus size={16} /> Tambah Kategori
                            </button>
                        </div>
                        <div className="space-y-4 max-w-3xl">
                            {data.categories.map((cat, idx) => (
                                <div key={cat.id} className="flex gap-4 items-start p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                                    <div className="flex-1 grid md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase px-1">Nama Kategori (ID)</label>
                                            <input
                                                className="w-full p-2 border rounded-lg"
                                                placeholder="Nama Kategori"
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
                                                <label className="text-xs font-bold text-gray-500 uppercase">Nama (EN)</label>
                                                <TranslateBtn
                                                    isTranslating={translatingState[`categories-${idx}-nameEn`]}
                                                    onClick={() => handleTranslate(cat.name, 'nameEn', idx, 'categories')}
                                                />
                                            </div>
                                            <input
                                                className="w-full p-2 border rounded-lg bg-blue-50/30"
                                                placeholder="Category Name (EN)"
                                                value={cat.nameEn || ""}
                                                onChange={e => {
                                                    const newCats = [...data.categories];
                                                    newCats[idx].nameEn = e.target.value;
                                                    setData({ ...data, categories: newCats });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <button onClick={() => {
                                        const newCats = data.categories.filter((_, i) => i !== idx);
                                        setData({ ...data, categories: newCats });
                                    }} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded mt-6">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleSave('update_categories', { categories: data.categories })} disabled={isSaving} className="btn-primary bg-unaicNavy text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            <Save size={16} /> Simpan Kategori
                        </button>
                    </div>
                )}

                {/* ITEMS TAB */}
                {activeTab === 'items' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg text-unaicNavy">Daftar Organisasi</h3>
                            <button
                                onClick={() => setData({
                                    ...data,
                                    items: [{
                                        id: crypto.randomUUID(),
                                        categoryId: data.categories[0]?.id || "",
                                        name: "",
                                        description: ""
                                    }, ...data.items]
                                })}
                                className="text-sm text-green-600 hover:bg-green-50 px-3 py-1 rounded-lg flex items-center gap-1 border border-green-200"
                            >
                                <Plus size={16} /> Tambah Organisasi
                            </button>
                        </div>

                        <div className="space-y-4">
                            {data.items.map((item, idx) => (
                                <div key={item.id} className="border border-gray-200 p-6 rounded-xl bg-gray-50 relative group">
                                    <button onClick={() => {
                                        const newItems = data.items.filter((_, i) => i !== idx);
                                        setData({ ...data, items: newItems });
                                    }} className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition p-2 hover:bg-red-50 rounded-full bg-white shadow-sm z-10">
                                        <Trash2 size={16} />
                                    </button>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Left Column */}
                                        <div className="space-y-4">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-gray-500 uppercase px-1">Nama Organisasi (ID)</label>
                                                    <input
                                                        className="w-full p-2 border rounded font-semibold"
                                                        value={item.name}
                                                        onChange={e => {
                                                            const newData = [...data.items];
                                                            newData[idx].name = e.target.value;
                                                            setData({ ...data, items: newData });
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between items-center px-1">
                                                        <label className="text-xs font-bold text-gray-500 uppercase">Nama (EN)</label>
                                                        <TranslateBtn
                                                            isTranslating={translatingState[`items-${idx}-nameEn`]}
                                                            onClick={() => handleTranslate(item.name, 'nameEn', idx, 'items')}
                                                        />
                                                    </div>
                                                    <input
                                                        className="w-full p-2 border rounded bg-blue-50/30"
                                                        value={item.nameEn || ""}
                                                        onChange={e => {
                                                            const newData = [...data.items];
                                                            newData[idx].nameEn = e.target.value;
                                                            setData({ ...data, items: newData });
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase px-1">Kategori</label>
                                                <select
                                                    className="w-full p-2 border rounded text-sm bg-white"
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

                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-gray-500 uppercase px-1">Nama Lengkap (ID)</label>
                                                    <input
                                                        className="w-full p-2 border rounded text-sm"
                                                        value={item.fullName || ""}
                                                        onChange={e => {
                                                            const newData = [...data.items];
                                                            newData[idx].fullName = e.target.value;
                                                            setData({ ...data, items: newData });
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between items-center px-1">
                                                        <label className="text-xs font-bold text-gray-500 uppercase">Nama Lengkap (EN)</label>
                                                        <TranslateBtn
                                                            isTranslating={translatingState[`items-${idx}-fullNameEn`]}
                                                            onClick={() => handleTranslate(item.fullName || "", 'fullNameEn', idx, 'items')}
                                                        />
                                                    </div>
                                                    <input
                                                        className="w-full p-2 border rounded text-sm bg-blue-50/30"
                                                        value={item.fullNameEn || ""}
                                                        onChange={e => {
                                                            const newData = [...data.items];
                                                            newData[idx].fullNameEn = e.target.value;
                                                            setData({ ...data, items: newData });
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase px-1">Logo / Foto</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        className="flex-1 p-2 border rounded text-sm text-blue-600 font-mono"
                                                        placeholder="URL Logo"
                                                        value={item.logo || ""}
                                                        onChange={e => {
                                                            const newData = [...data.items];
                                                            newData[idx].logo = e.target.value;
                                                            setData({ ...data, items: newData });
                                                        }}
                                                    />
                                                    <label className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded px-2 flex items-center justify-center cursor-pointer transition w-10">
                                                        {uploadingState[`org_${idx}`] ? <Loader2 className="animate-spin w-4 h-4" /> : <Upload className="w-4 h-4 text-gray-600" />}
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={e => handleFileUpload(e, `org_${idx}`, url => {
                                                                const newData = [...data.items];
                                                                newData[idx].logo = url;
                                                                setData({ ...data, items: newData });
                                                            })}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column */}
                                        <div className="space-y-4">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex justify-between items-center px-1">
                                                        <label className="text-xs font-bold text-gray-500 uppercase">Deskripsi (ID)</label>
                                                    </div>
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
                                                        <TranslateBtn
                                                            isTranslating={translatingState[`items-${idx}-descriptionEn`]}
                                                            onClick={() => handleTranslate(item.description, 'descriptionEn', idx, 'items')}
                                                        />
                                                    </div>
                                                    <textarea
                                                        className="w-full p-2 border rounded text-sm h-24 bg-blue-50/30"
                                                        value={item.descriptionEn || ""}
                                                        onChange={e => {
                                                            const newData = [...data.items];
                                                            newData[idx].descriptionEn = e.target.value;
                                                            setData({ ...data, items: newData });
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex justify-between items-center px-1">
                                                        <label className="text-xs font-bold text-gray-500 uppercase">Detail / Kegiatan (ID)</label>
                                                    </div>
                                                    <textarea
                                                        className="w-full p-2 border rounded text-sm h-24"
                                                        placeholder="Detail or Activities..."
                                                        value={item.details || item.activities || ""}
                                                        onChange={e => {
                                                            const newData = [...data.items];
                                                            // Simplified logic: update both fields
                                                            newData[idx].details = e.target.value;
                                                            newData[idx].activities = e.target.value;
                                                            setData({ ...data, items: newData });
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between items-center px-1">
                                                        <label className="text-xs font-bold text-gray-500 uppercase">Detail / Kegiatan (EN)</label>
                                                        <TranslateBtn
                                                            isTranslating={translatingState[`items-${idx}-detailsEn`]}
                                                            onClick={() => handleTranslate(item.details || item.activities || "", 'detailsEn', idx, 'items')}
                                                        />
                                                    </div>
                                                    <textarea
                                                        className="w-full p-2 border rounded text-sm h-24 bg-blue-50/30"
                                                        placeholder="Detail or Activities (EN)..."
                                                        value={item.detailsEn || item.activitiesEn || ""}
                                                        onChange={e => {
                                                            const newData = [...data.items];
                                                            newData[idx].detailsEn = e.target.value;
                                                            newData[idx].activitiesEn = e.target.value;
                                                            setData({ ...data, items: newData });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleSave('update_items', { items: data.items })} disabled={isSaving} className="btn-primary bg-unaicNavy text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            <Save size={16} /> Simpan Daftar Organisasi
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
