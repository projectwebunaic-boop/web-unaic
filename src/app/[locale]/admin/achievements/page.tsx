
"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Award, Star, Globe, History, Plus, Trash2, Upload } from "lucide-react";
import Image from "next/image";

interface StatItem {
    id: string;
    label: string;
    labelEn?: string;
    count: number;
    icon: string;
}

interface HighlightItem {
    id: string;
    title: string;
    titleEn?: string;
    category: string;
    categoryEn?: string;
    year: number;
    description: string;
    descriptionEn?: string;
    photo: string;
}

interface CarouselItem {
    id: string;
    title: string;
    titleEn?: string;
    photo: string;
}

interface TimelineItem {
    id: string;
    year: number;
    description: string;
    descriptionEn?: string;
    icon: string;
}

interface AchievementsData {
    stats: StatItem[];
    highlights: HighlightItem[];
    carousel: CarouselItem[];
    timeline: TimelineItem[];
}

export default function AdminAchievementsPage() {
    const [activeTab, setActiveTab] = useState<'stats' | 'highlights' | 'carousel' | 'timeline'>('stats');
    const [data, setData] = useState<AchievementsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadingState, setUploadingState] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/achievements', { cache: 'no-store' });
            const json = await res.json();
            setData(json);
        } catch (error) {
            console.error("Failed to fetch achievements data", error);
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
            const res = await fetch('/api/admin/achievements', {
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
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Prestasi</h1>

            <div className="flex flex-wrap gap-2 bg-white rounded-xl p-2 shadow-sm border border-gray-100 w-full sm:w-fit">
                {renderTabButton('stats', 'Statistik', Award)}
                {renderTabButton('highlights', 'Prestasi Unggulan', Star)}
                {renderTabButton('carousel', 'Carousel Internasional', Globe)}
                {renderTabButton('timeline', 'Timeline', History)}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[500px]">

                {/* STATS TAB */}
                {activeTab === 'stats' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg text-unaicNavy">Statistik Prestasi</h3>
                            <button
                                onClick={() => setData({ ...data, stats: [...data.stats, { id: crypto.randomUUID(), label: "", count: 0, icon: "Award" }] })}
                                className="text-sm text-green-600 hover:bg-green-50 px-3 py-1 rounded-lg flex items-center gap-1 border border-green-200"
                            >
                                <Plus size={16} /> Tambah Statistik
                            </button>
                        </div>
                        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {data.stats.map((item, idx) => (
                                <div key={item.id} className="border border-gray-200 p-4 rounded-xl bg-gray-50 relative group space-y-3">
                                    <button onClick={() => {
                                        const newStats = data.stats.filter((_, i) => i !== idx);
                                        setData({ ...data, stats: newStats });
                                    }} className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"><Trash2 size={16} /></button>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500">Label (ID)</label>
                                        <div className="flex gap-2">
                                            <input
                                                className="w-full p-2 border rounded"
                                                value={item.label}
                                                onChange={(e) => {
                                                    const newStats = [...data.stats];
                                                    newStats[idx].label = e.target.value;
                                                    setData({ ...data, stats: newStats });
                                                }}
                                            />
                                            <button
                                                onClick={() => translateText(item.label, (t) => {
                                                    const newStats = [...data.stats];
                                                    newStats[idx].labelEn = t;
                                                    setData({ ...data, stats: newStats });
                                                })}
                                                className="text-xs bg-blue-100 text-blue-600 px-2 rounded hover:bg-blue-200"
                                            >
                                                EN
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500">Label (EN)</label>
                                        <input
                                            className="w-full p-2 border rounded bg-blue-50/50"
                                            value={item.labelEn || ''}
                                            onChange={(e) => {
                                                const newStats = [...data.stats];
                                                newStats[idx].labelEn = e.target.value;
                                                setData({ ...data, stats: newStats });
                                            }}
                                            placeholder="English Label"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500">Jumlah</label>
                                        <input
                                            className="w-full p-2 border rounded"
                                            value={item.count}
                                            type="number"
                                            onChange={(e) => {
                                                const newStats = [...data.stats];
                                                newStats[idx].count = parseInt(e.target.value) || 0;
                                                setData({ ...data, stats: newStats });
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500">Icon (Lucide)</label>
                                        <input
                                            className="w-full p-2 border rounded font-mono text-xs"
                                            value={item.icon}
                                            onChange={(e) => {
                                                const newStats = [...data.stats];
                                                newStats[idx].icon = e.target.value;
                                                setData({ ...data, stats: newStats });
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleSave('update_stats', { stats: data.stats })} disabled={isSaving} className="btn-primary bg-unaicNavy text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            <Save size={16} /> Simpan Statistik
                        </button>
                    </div>
                )}

                {/* HIGHLIGHTS TAB */}
                {activeTab === 'highlights' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg text-unaicNavy">Prestasi Unggulan</h3>
                            <button
                                onClick={() => setData({ ...data, highlights: [...data.highlights, { id: crypto.randomUUID(), title: "", category: "", year: new Date().getFullYear(), description: "", photo: "" }] })}
                                className="text-sm text-green-600 hover:bg-green-50 px-3 py-1 rounded-lg flex items-center gap-1 border border-green-200"
                            >
                                <Plus size={16} /> Tambah Prestasi
                            </button>
                        </div>
                        <div className="space-y-6">
                            {data.highlights.map((item, idx) => (
                                <div key={item.id} className="border border-gray-200 p-6 rounded-xl bg-gray-50 shadow-sm relative group transition hover:shadow-md">
                                    <button onClick={() => {
                                        const newItems = data.highlights.filter((_, i) => i !== idx);
                                        setData({ ...data, highlights: newItems });
                                    }} className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition p-2 hover:bg-red-50 rounded-full">
                                        <Trash2 size={20} />
                                    </button>

                                    <div className="grid md:grid-cols-12 gap-6">
                                        <div className="md:col-span-4">
                                            <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden mb-2">
                                                {item.photo ? (
                                                    <Image src={item.photo} alt={item.title} fill className="object-cover" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                                                )}
                                            </div>
                                            <label className="cursor-pointer bg-white border border-gray-300 px-3 py-1.5 rounded text-xs font-medium flex items-center justify-center gap-2 hover:bg-gray-50 w-full">
                                                {uploadingState[`highlight_${idx}`] ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
                                                Upload Foto
                                                <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, `highlight_${idx}`, url => {
                                                    const newItems = [...data.highlights];
                                                    newItems[idx].photo = url;
                                                    setData({ ...data, highlights: newItems });
                                                })} />
                                            </label>
                                        </div>
                                        <div className="md:col-span-8 space-y-4">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-gray-500 uppercase">Judul (ID)</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            className="w-full p-2 border rounded-lg font-semibold"
                                                            value={item.title}
                                                            onChange={e => {
                                                                const newItems = [...data.highlights];
                                                                newItems[idx].title = e.target.value;
                                                                setData({ ...data, highlights: newItems });
                                                            }}
                                                        />
                                                        <button
                                                            onClick={() => translateText(item.title, (t) => {
                                                                const newItems = [...data.highlights];
                                                                newItems[idx].titleEn = t;
                                                                setData({ ...data, highlights: newItems });
                                                            })}
                                                            className="text-xs bg-blue-100 text-blue-600 px-2 rounded hover:bg-blue-200"
                                                        >
                                                            EN
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-gray-500 uppercase">Judul (EN)</label>
                                                    <input
                                                        className="w-full p-2 border rounded-lg bg-blue-50/50"
                                                        value={item.titleEn || ''}
                                                        onChange={e => {
                                                            const newItems = [...data.highlights];
                                                            newItems[idx].titleEn = e.target.value;
                                                            setData({ ...data, highlights: newItems });
                                                        }}
                                                        placeholder="English Title"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-gray-500 uppercase">Kategori (ID)</label>
                                                    <input
                                                        className="w-full p-2 border rounded-lg"
                                                        value={item.category}
                                                        onChange={e => {
                                                            const newItems = [...data.highlights];
                                                            newItems[idx].category = e.target.value;
                                                            setData({ ...data, highlights: newItems });
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-gray-500 uppercase">Kategori (EN)</label>
                                                    <input
                                                        className="w-full p-2 border rounded-lg bg-blue-50/50"
                                                        value={item.categoryEn || ''}
                                                        onChange={e => {
                                                            const newItems = [...data.highlights];
                                                            newItems[idx].categoryEn = e.target.value;
                                                            setData({ ...data, highlights: newItems });
                                                        }}
                                                        placeholder="English Category"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Tahun</label>
                                                <input
                                                    type="number"
                                                    className="w-full p-2 border rounded-lg"
                                                    value={item.year}
                                                    onChange={e => {
                                                        const newItems = [...data.highlights];
                                                        newItems[idx].year = parseInt(e.target.value);
                                                        setData({ ...data, highlights: newItems });
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Deskripsi (ID)</label>
                                                <div className="flex gap-2">
                                                    <textarea
                                                        className="w-full p-2 border rounded-lg h-20 text-sm"
                                                        value={item.description}
                                                        onChange={e => {
                                                            const newItems = [...data.highlights];
                                                            newItems[idx].description = e.target.value;
                                                            setData({ ...data, highlights: newItems });
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => translateText(item.description, (t) => {
                                                            const newItems = [...data.highlights];
                                                            newItems[idx].descriptionEn = t;
                                                            setData({ ...data, highlights: newItems });
                                                        })}
                                                        className="text-xs bg-blue-100 text-blue-600 px-2 rounded hover:bg-blue-200 h-fit"
                                                    >
                                                        EN
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Deskripsi (EN)</label>
                                                <textarea
                                                    className="w-full p-2 border rounded-lg h-20 text-sm bg-blue-50/50"
                                                    value={item.descriptionEn || ''}
                                                    onChange={e => {
                                                        const newItems = [...data.highlights];
                                                        newItems[idx].descriptionEn = e.target.value;
                                                        setData({ ...data, highlights: newItems });
                                                    }}
                                                    placeholder="English Description"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleSave('update_highlights', { highlights: data.highlights })} disabled={isSaving} className="btn-primary bg-unaicNavy text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            <Save size={16} /> Simpan Prestasi
                        </button>
                    </div>
                )}

                {/* CAROUSEL TAB */}
                {activeTab === 'carousel' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg text-unaicNavy">Carousel Prestasi Internasional</h3>
                            <button
                                onClick={() => setData({ ...data, carousel: [...data.carousel, { id: crypto.randomUUID(), title: "", photo: "" }] })}
                                className="text-sm text-green-600 hover:bg-green-50 px-3 py-1 rounded-lg flex items-center gap-1 border border-green-200"
                            >
                                <Plus size={16} /> Tambah Slide
                            </button>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data.carousel.map((item, idx) => (
                                <div key={item.id} className="border border-gray-200 p-4 rounded-xl bg-gray-50 relative group">
                                    <button onClick={() => {
                                        const newItems = data.carousel.filter((_, i) => i !== idx);
                                        setData({ ...data, carousel: newItems });
                                    }} className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition bg-white rounded-full p-1 shadow-sm  z-10">
                                        <Trash2 size={16} />
                                    </button>

                                    <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden mb-3">
                                        {item.photo ? (
                                            <Image src={item.photo} alt={item.title} fill className="object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400 px-4 text-center text-sm">No Image</div>
                                        )}
                                    </div>
                                    <label className="cursor-pointer bg-white border border-gray-300 w-full py-1.5 rounded text-xs font-medium flex items-center justify-center gap-2 hover:bg-gray-50 mb-3">
                                        {uploadingState[`carousel_${idx}`] ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
                                        Upload
                                        <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, `carousel_${idx}`, url => {
                                            const newItems = [...data.carousel];
                                            newItems[idx].photo = url;
                                            setData({ ...data, carousel: newItems });
                                        })} />
                                    </label>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500">Judul / Caption (ID)</label>
                                        <div className="flex gap-2">
                                            <textarea
                                                className="w-full p-2 border rounded-lg h-16 text-sm resize-none"
                                                value={item.title}
                                                onChange={e => {
                                                    const newItems = [...data.carousel];
                                                    newItems[idx].title = e.target.value;
                                                    setData({ ...data, carousel: newItems });
                                                }}
                                            />
                                            <button
                                                onClick={() => translateText(item.title, (t) => {
                                                    const newItems = [...data.carousel];
                                                    newItems[idx].titleEn = t;
                                                    setData({ ...data, carousel: newItems });
                                                })}
                                                className="text-xs bg-blue-100 text-blue-600 px-2 rounded hover:bg-blue-200 h-fit"
                                            >
                                                EN
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500">Judul / Caption (EN)</label>
                                        <textarea
                                            className="w-full p-2 border rounded-lg h-16 text-sm resize-none bg-blue-50/50"
                                            value={item.titleEn || ''}
                                            onChange={e => {
                                                const newItems = [...data.carousel];
                                                newItems[idx].titleEn = e.target.value;
                                                setData({ ...data, carousel: newItems });
                                            }}
                                            placeholder="English Caption"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleSave('update_carousel', { carousel: data.carousel })} disabled={isSaving} className="btn-primary bg-unaicNavy text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            <Save size={16} /> Simpan Carousel
                        </button>
                    </div>
                )}

                {/* TIMELINE TAB */}
                {activeTab === 'timeline' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg text-unaicNavy">Timeline Prestasi</h3>
                            <button
                                onClick={() => setData({ ...data, timeline: [...data.timeline, { id: crypto.randomUUID(), year: new Date().getFullYear(), description: "", icon: "Award" }] })}
                                className="text-sm text-green-600 hover:bg-green-50 px-3 py-1 rounded-lg flex items-center gap-1 border border-green-200"
                            >
                                <Plus size={16} /> Tambah Timeline
                            </button>
                        </div>
                        <div className="space-y-4">
                            {data.timeline.map((item, idx) => (
                                <div key={item.id} className="border border-gray-200 p-4 rounded-xl bg-gray-50 relative group flex flex-col md:flex-row gap-4 items-start">
                                    <button onClick={() => {
                                        const newItems = data.timeline.filter((_, i) => i !== idx);
                                        setData({ ...data, timeline: newItems });
                                    }} className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition p-1 hover:bg-red-50 rounded">
                                        <Trash2 size={16} />
                                    </button>

                                    <div className="w-24 shrink-0 space-y-1">
                                        <label className="text-xs font-bold text-gray-500">Tahun</label>
                                        <input
                                            type="number"
                                            className="w-full p-2 border rounded font-bold"
                                            value={item.year}
                                            onChange={(e) => {
                                                const newItems = [...data.timeline];
                                                newItems[idx].year = parseInt(e.target.value) || 0;
                                                setData({ ...data, timeline: newItems });
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1 w-full">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Deskripsi (ID)</label>
                                        <div className="flex gap-2">
                                            <input
                                                className="w-full p-2 border rounded"
                                                value={item.description}
                                                onChange={(e) => {
                                                    const newItems = [...data.timeline];
                                                    newItems[idx].description = e.target.value;
                                                    setData({ ...data, timeline: newItems });
                                                }}
                                            />
                                            <button
                                                onClick={() => translateText(item.description, (t) => {
                                                    const newItems = [...data.timeline];
                                                    newItems[idx].descriptionEn = t;
                                                    setData({ ...data, timeline: newItems });
                                                })}
                                                className="text-xs bg-blue-100 text-blue-600 px-2 rounded hover:bg-blue-200"
                                            >
                                                EN
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-1 w-full">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Deskripsi (EN)</label>
                                        <input
                                            className="w-full p-2 border rounded bg-blue-50/50"
                                            value={item.descriptionEn || ''}
                                            onChange={(e) => {
                                                const newItems = [...data.timeline];
                                                newItems[idx].descriptionEn = e.target.value;
                                                setData({ ...data, timeline: newItems });
                                            }}
                                            placeholder="English Description"
                                        />
                                    </div>
                                    <div className="w-32 shrink-0 space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Icon</label>
                                        <input
                                            className="w-full p-2 border rounded font-mono text-xs"
                                            value={item.icon}
                                            onChange={(e) => {
                                                const newItems = [...data.timeline];
                                                newItems[idx].icon = e.target.value;
                                                setData({ ...data, timeline: newItems });
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleSave('update_timeline', { timeline: data.timeline })} disabled={isSaving} className="btn-primary bg-unaicNavy text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            <Save size={16} /> Simpan Timeline
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
