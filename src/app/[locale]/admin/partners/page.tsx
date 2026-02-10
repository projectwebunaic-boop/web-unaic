
"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Handshake, List, Plus, Trash2, Upload, ExternalLink } from "lucide-react";
import Image from "next/image";

interface CategoryItem {
    id: string;
    name: string;
    nameEn?: string;
    iconName: string;
    description: string;
    descriptionEn?: string;
}

interface PartnerItem {
    id: string;
    slug: string;
    name: string;
    category: string;
    description: string;
    descriptionEn?: string;
    profile: string;
    profileEn?: string;
    images: string[];
    website?: string;
}

interface PartnersData {
    categories: CategoryItem[];
    items: PartnerItem[];
}

export default function AdminPartnersPage() {
    const [activeTab, setActiveTab] = useState<'categories' | 'items'>('items');
    const [data, setData] = useState<PartnersData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadingState, setUploadingState] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/partners', { cache: 'no-store' });
            const json = await res.json();
            setData(json);
        } catch (error) {
            console.error("Failed to fetch partners data", error);
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
            const res = await fetch('/api/admin/partners', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, ...payload })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Gagal menyimpan data');
            }

            alert('Perubahan berhasil disimpan!');
            fetchData();
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
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Mitra & Kerjasama</h1>

            <div className="flex flex-wrap gap-2 bg-white rounded-xl p-2 shadow-sm border border-gray-100 w-full sm:w-fit">
                {renderTabButton('items', 'Daftar Mitra', List)}
                {renderTabButton('categories', 'Kategori Mitra', Handshake)}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[500px]">

                {/* ITEMS TAB */}
                {activeTab === 'items' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg text-unaicNavy">Daftar Mitra Kerjasama</h3>
                            <button
                                onClick={() => setData({ ...data, items: [...data.items, { id: crypto.randomUUID(), slug: "", name: "", category: data.categories[0]?.name || "", description: "", profile: "", images: [] }] })}
                                className="text-sm text-green-600 hover:bg-green-50 px-3 py-1 rounded-lg flex items-center gap-1 border border-green-200"
                            >
                                <Plus size={16} /> Tambah Mitra
                            </button>
                        </div>

                        <div className="space-y-8">
                            {data.items.map((item, idx) => (
                                <div key={item.id} className="border border-gray-200 p-6 rounded-xl bg-gray-50 shadow-sm relative group transition hover:shadow-md">
                                    <button onClick={() => {
                                        const newItems = data.items.filter((_, i) => i !== idx);
                                        setData({ ...data, items: newItems });
                                    }} className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition p-2 hover:bg-red-50 rounded-full bg-white shadow-sm z-10">
                                        <Trash2 size={20} />
                                    </button>

                                    <div className="grid lg:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-gray-500 uppercase">Nama Mitra</label>
                                                    <input
                                                        className="w-full p-2 border rounded-lg font-semibold"
                                                        value={item.name}
                                                        onChange={e => {
                                                            const newItems = [...data.items];
                                                            newItems[idx].name = e.target.value;
                                                            // Auto-generate slug from name if empty
                                                            if (!newItems[idx].slug) {
                                                                newItems[idx].slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                                                            }
                                                            setData({ ...data, items: newItems });
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-gray-500 uppercase">Slug (URL)</label>
                                                    <input
                                                        className="w-full p-2 border rounded-lg font-mono text-sm text-gray-600"
                                                        value={item.slug}
                                                        onChange={e => {
                                                            const newItems = [...data.items];
                                                            newItems[idx].slug = e.target.value;
                                                            setData({ ...data, items: newItems });
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-gray-500 uppercase">Kategori</label>
                                                    <select
                                                        className="w-full p-2 border rounded-lg"
                                                        value={item.category}
                                                        onChange={e => {
                                                            const newItems = [...data.items];
                                                            newItems[idx].category = e.target.value;
                                                            setData({ ...data, items: newItems });
                                                        }}
                                                    >
                                                        <option value="">Pilih Kategori</option>
                                                        {data.categories.map(cat => (
                                                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-gray-500 uppercase">Website (Opsional)</label>
                                                    <input
                                                        className="w-full p-2 border rounded-lg"
                                                        value={item.website || ''}
                                                        placeholder="https://..."
                                                        onChange={e => {
                                                            const newItems = [...data.items];
                                                            newItems[idx].website = e.target.value;
                                                            setData({ ...data, items: newItems });
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Deskripsi Singkat (ID)</label>
                                                <div className="flex gap-2">
                                                    <textarea
                                                        className="w-full p-2 border rounded-lg h-20 text-sm"
                                                        value={item.description}
                                                        onChange={e => {
                                                            const newItems = [...data.items];
                                                            newItems[idx].description = e.target.value;
                                                            setData({ ...data, items: newItems });
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => translateText(item.description, (t) => {
                                                            const newItems = [...data.items];
                                                            newItems[idx].descriptionEn = t;
                                                            setData({ ...data, items: newItems });
                                                        })}
                                                        className="text-xs bg-blue-100 text-blue-600 px-2 rounded hover:bg-blue-200 h-fit"
                                                    >
                                                        EN
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Deskripsi Singkat (EN)</label>
                                                <textarea
                                                    className="w-full p-2 border rounded-lg h-20 text-sm bg-blue-50/50"
                                                    value={item.descriptionEn || ''}
                                                    onChange={e => {
                                                        const newItems = [...data.items];
                                                        newItems[idx].descriptionEn = e.target.value;
                                                        setData({ ...data, items: newItems });
                                                    }}
                                                    placeholder="English Short Description"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Profil Lengkap (ID)</label>
                                                <div className="flex gap-2">
                                                    <textarea
                                                        className="w-full p-2 border rounded-lg h-32 text-sm"
                                                        value={item.profile}
                                                        onChange={e => {
                                                            const newItems = [...data.items];
                                                            newItems[idx].profile = e.target.value;
                                                            setData({ ...data, items: newItems });
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => translateText(item.profile, (t) => {
                                                            const newItems = [...data.items];
                                                            newItems[idx].profileEn = t;
                                                            setData({ ...data, items: newItems });
                                                        })}
                                                        className="text-xs bg-blue-100 text-blue-600 px-2 rounded hover:bg-blue-200 h-fit"
                                                    >
                                                        EN
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Profil Lengkap (EN)</label>
                                                <textarea
                                                    className="w-full p-2 border rounded-lg h-32 text-sm bg-blue-50/50"
                                                    value={item.profileEn || ''}
                                                    onChange={e => {
                                                        const newItems = [...data.items];
                                                        newItems[idx].profileEn = e.target.value;
                                                        setData({ ...data, items: newItems });
                                                    }}
                                                    placeholder="English Full Profile"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Galeri Foto</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {item.images.map((src, imgIdx) => (
                                                    <div key={imgIdx} className="relative aspect-video rounded-lg overflow-hidden group/img">
                                                        <Image src={src} alt="" fill className="object-cover" />
                                                        <button
                                                            onClick={() => {
                                                                const newItems = [...data.items];
                                                                newItems[idx].images = newItems[idx].images.filter((_, i) => i !== imgIdx);
                                                                setData({ ...data, items: newItems });
                                                            }}
                                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover/img:opacity-100 transition"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                                <label className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 aspect-video">
                                                    {uploadingState[`item_${idx}`] ? <Loader2 className="animate-spin text-gray-400" /> : <Plus className="text-gray-400" size={20} />}
                                                    <span className="text-[10px] text-gray-500 mt-1">Tambah Foto</span>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={e => handleFileUpload(e, `item_${idx}`, url => {
                                                            const newItems = [...data.items];
                                                            newItems[idx].images.push(url);
                                                            setData({ ...data, items: newItems });
                                                        })}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleSave('update_items', { items: data.items })} disabled={isSaving} className="btn-primary bg-unaicNavy text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            <Save size={16} /> Simpan Daftar Mitra
                        </button>
                    </div>
                )}

                {/* CATEGORIES TAB */}
                {activeTab === 'categories' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg text-unaicNavy">Kategori Mitra</h3>
                            <button
                                onClick={() => setData({ ...data, categories: [...data.categories, { id: crypto.randomUUID(), name: "", iconName: "Handshake", description: "" }] })}
                                className="text-sm text-green-600 hover:bg-green-50 px-3 py-1 rounded-lg flex items-center gap-1 border border-green-200"
                            >
                                <Plus size={16} /> Tambah Kategori
                            </button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            {data.categories.map((cat, idx) => (
                                <div key={cat.id} className="border border-gray-200 p-4 rounded-xl bg-gray-50 relative group space-y-3">
                                    <button onClick={() => {
                                        const newCats = data.categories.filter((_, i) => i !== idx);
                                        setData({ ...data, categories: newCats });
                                    }} className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition p-1 hover:bg-red-50 rounded">
                                        <Trash2 size={16} />
                                    </button>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500">Nama Kategori (ID)</label>
                                        <div className="flex gap-2">
                                            <input
                                                className="w-full p-2 border rounded font-semibold"
                                                value={cat.name}
                                                onChange={(e) => {
                                                    const newCats = [...data.categories];
                                                    newCats[idx].name = e.target.value;
                                                    setData({ ...data, categories: newCats });
                                                }}
                                            />
                                            <button
                                                onClick={() => translateText(cat.name, (t) => {
                                                    const newCats = [...data.categories];
                                                    newCats[idx].nameEn = t;
                                                    setData({ ...data, categories: newCats });
                                                })}
                                                className="text-xs bg-blue-100 text-blue-600 px-2 rounded hover:bg-blue-200"
                                            >
                                                EN
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500">Nama Kategori (EN)</label>
                                        <input
                                            className="w-full p-2 border rounded font-semibold bg-blue-50/50"
                                            value={cat.nameEn || ''}
                                            onChange={(e) => {
                                                const newCats = [...data.categories];
                                                newCats[idx].nameEn = e.target.value;
                                                setData({ ...data, categories: newCats });
                                            }}
                                            placeholder="English Category Name"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500">Icon (Lucide)</label>
                                        <input
                                            className="w-full p-2 border rounded font-mono text-xs"
                                            value={cat.iconName}
                                            onChange={(e) => {
                                                const newCats = [...data.categories];
                                                newCats[idx].iconName = e.target.value;
                                                setData({ ...data, categories: newCats });
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500">Deskripsi (ID)</label>
                                        <div className="flex gap-2">
                                            <textarea
                                                className="w-full p-2 border rounded text-sm h-16"
                                                value={cat.description}
                                                onChange={(e) => {
                                                    const newCats = [...data.categories];
                                                    newCats[idx].description = e.target.value;
                                                    setData({ ...data, categories: newCats });
                                                }}
                                            />
                                            <button
                                                onClick={() => translateText(cat.description, (t) => {
                                                    const newCats = [...data.categories];
                                                    newCats[idx].descriptionEn = t;
                                                    setData({ ...data, categories: newCats });
                                                })}
                                                className="text-xs bg-blue-100 text-blue-600 px-2 rounded hover:bg-blue-200 h-fit"
                                            >
                                                EN
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500">Deskripsi (EN)</label>
                                        <textarea
                                            className="w-full p-2 border rounded text-sm h-16 bg-blue-50/50"
                                            value={cat.descriptionEn || ''}
                                            onChange={(e) => {
                                                const newCats = [...data.categories];
                                                newCats[idx].descriptionEn = e.target.value;
                                                setData({ ...data, categories: newCats });
                                            }}
                                            placeholder="English Description"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleSave('update_categories', { categories: data.categories })} disabled={isSaving} className="btn-primary bg-unaicNavy text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            <Save size={16} /> Simpan Kategori
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
