"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, BarChart3, Briefcase, Users2, Award, Plus, Trash2, Upload, HeartHandshake, Sparkles } from "lucide-react";

interface StatItem {
    id: string;
    number: string;
    label: string;
    labelEn?: string;
}

interface ServiceItem {
    id: string;
    title: string;
    titleEn?: string;
    description: string;
    descriptionEn?: string;
    features: string;
    featuresEn?: string;
}

interface CommunityItem {
    id: string;
    name: string;
    activity: string;
    activityEn?: string;
    contact: string;
}

interface ContributionItem {
    id: string;
    title: string;
    titleEn?: string;
    description: string;
    descriptionEn?: string;
    link: string;
}

interface FeaturedItem {
    id: string;
    name: string;
    graduation: string;
    graduationEn?: string;
    position: string;
    positionEn?: string;
    company: string;
    image: string;
    testimonial: string;
    testimonialEn?: string;
    achievements: string;
    achievementsEn?: string;
}

interface StoryItem {
    id: string;
    title: string;
    alumni: string;
    position: string;
    company: string;
    story: string;
    image: string;
}

interface AlumniData {
    stats: StatItem[];
    services: ServiceItem[];
    communities: CommunityItem[];
    contributions: ContributionItem[];
    featured: FeaturedItem[];
    stories: StoryItem[];
}

const TranslateBtn = ({ onClick, isTranslating }: { onClick: () => void, isTranslating?: boolean }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={isTranslating}
        className="text-[10px] flex items-center gap-1 text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded transition disabled:opacity-50 font-bold uppercase tracking-wider whitespace-nowrap"
    >
        {isTranslating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
        Auto Translate
    </button>
);

export default function AdminAlumniPage() {
    const [activeTab, setActiveTab] = useState<'stats' | 'services' | 'others' | 'featured'>('stats');
    const [data, setData] = useState<AlumniData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadingState, setUploadingState] = useState<{ [key: string]: boolean }>({});
    const [translatingState, setTranslatingState] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/alumni', { cache: 'no-store' });
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
            const res = await fetch('/api/admin/alumni', {
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

    const handleTranslate = async (text: string, field: string, idx: number, type: 'stats' | 'services' | 'communities' | 'contributions' | 'featured') => {
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
                const newList = [...(data[type] as any[])];
                newList[idx][field] = result.translatedText;
                setData({ ...data, [type]: newList });
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
                alert("Gambar berhasil diupload. Klik Simpan!");
            }
        } catch (error) {
            alert('Upload gagal.');
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
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Alumni & Karir</h1>

            <div className="flex overflow-x-auto pb-2 gap-2 bg-white rounded-xl p-2 shadow-sm border border-gray-100 w-full sm:w-fit scrollbar-hide">
                {renderTabButton('stats', 'Statistik & Layanan', BarChart3)}
                {renderTabButton('others', 'Komunitas & Sumbangan', HeartHandshake)}
                {renderTabButton('featured', 'Alumni Profile', Award)}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[500px]">

                {/* STATS & SERVICES TAB */}
                {activeTab === 'stats' && (
                    <div className="space-y-8">
                        {/* STATS */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg text-unaicNavy border-b pb-2">Statistik Alumni</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {data.stats.map((stat, idx) => (
                                    <div key={stat.id} className="p-3 border rounded-lg bg-gray-50 space-y-2">
                                        <div className="space-y-1">
                                            <input
                                                className="w-full font-bold text-lg bg-transparent border-b border-dashed border-gray-300 focus:border-unaicBlue focus:outline-none"
                                                value={stat.number}
                                                onChange={e => {
                                                    const newData = [...data.stats];
                                                    newData[idx].number = e.target.value;
                                                    setData({ ...data, stats: newData });
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] text-gray-400 uppercase font-semibold">Label (ID)</label>
                                            <input
                                                className="w-full text-xs text-gray-700 bg-white border rounded p-1"
                                                value={stat.label}
                                                onChange={e => {
                                                    const newData = [...data.stats];
                                                    newData[idx].label = e.target.value;
                                                    setData({ ...data, stats: newData });
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] text-gray-400 uppercase font-semibold">Label (EN)</label>
                                                <TranslateBtn onClick={() => handleTranslate(stat.label, 'labelEn', idx, 'stats')} isTranslating={translatingState[`stats-${idx}-labelEn`]} />
                                            </div>
                                            <input
                                                className="w-full text-xs text-gray-700 bg-blue-50/50 border rounded p-1"
                                                value={stat.labelEn || ""}
                                                onChange={e => {
                                                    const newData = [...data.stats];
                                                    newData[idx].labelEn = e.target.value;
                                                    setData({ ...data, stats: newData });
                                                }}
                                                placeholder="Translate..."
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => handleSave('update_stats', { stats: data.stats })} disabled={isSaving} className="btn-primary text-xs bg-unaicNavy text-white px-3 py-2 rounded flex items-center gap-2">
                                <Save size={14} /> Simpan Statistik
                            </button>
                        </div>

                        {/* SERVICES */}
                        <div className="space-y-4 pt-4">
                            <div className="flex justify-between items-center border-b pb-2">
                                <h3 className="font-bold text-lg text-unaicNavy">Layanan Karir</h3>
                                <button onClick={() => setData({ ...data, services: [...data.services, { id: crypto.randomUUID(), title: "", description: "", features: "" }] })} className="text-green-600 hover:bg-green-50 px-2 py-1 rounded flex items-center gap-1 text-xs border border-green-200"><Plus size={14} /> Tambah</button>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {data.services.map((svc, idx) => (
                                    <div key={svc.id} className="p-4 border rounded-xl bg-white relative group space-y-3">
                                        <button onClick={() => {
                                            const newSvc = data.services.filter((_, i) => i !== idx);
                                            setData({ ...data, services: newSvc });
                                        }} className="absolute top-2 right-2 text-red-300 hover:text-red-500 bg-white rounded-full p-1"><Trash2 size={16} /></button>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase">Judul (ID & EN)</label>
                                            <input className="w-full font-bold border rounded p-1 text-sm mb-1" placeholder="Judul (ID)" value={svc.title} onChange={e => { const n = [...data.services]; n[idx].title = e.target.value; setData({ ...data, services: n }); }} />
                                            <div className="flex gap-1">
                                                <input className="w-full font-bold border rounded p-1 text-sm bg-blue-50/30" placeholder="Title (EN)" value={svc.titleEn || ""} onChange={e => { const n = [...data.services]; n[idx].titleEn = e.target.value; setData({ ...data, services: n }); }} />
                                                <TranslateBtn onClick={() => handleTranslate(svc.title, 'titleEn', idx, 'services')} isTranslating={translatingState[`services-${idx}-titleEn`]} />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase">Deskripsi (ID & EN)</label>
                                            <textarea className="w-full text-xs border rounded p-1 h-16 mb-1" placeholder="Deskripsi (ID)" value={svc.description} onChange={e => { const n = [...data.services]; n[idx].description = e.target.value; setData({ ...data, services: n }); }} />
                                            <div className="relative">
                                                <textarea className="w-full text-xs border rounded p-1 h-16 bg-blue-50/30" placeholder="Description (EN)" value={svc.descriptionEn || ""} onChange={e => { const n = [...data.services]; n[idx].descriptionEn = e.target.value; setData({ ...data, services: n }); }} />
                                                <div className="absolute bottom-1 right-1">
                                                    <TranslateBtn onClick={() => handleTranslate(svc.description, 'descriptionEn', idx, 'services')} isTranslating={translatingState[`services-${idx}-descriptionEn`]} />
                                                </div>
                                            </div>

                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase">Fitur (Pisahkan Koma)</label>
                                            <input className="w-full text-xs border rounded p-1 mb-1" placeholder="Fitur (ID)" value={svc.features} onChange={e => { const n = [...data.services]; n[idx].features = e.target.value; setData({ ...data, services: n }); }} />
                                            <div className="flex gap-1">
                                                <input className="w-full text-xs border rounded p-1 bg-blue-50/30" placeholder="Features (EN)" value={svc.featuresEn || ""} onChange={e => { const n = [...data.services]; n[idx].featuresEn = e.target.value; setData({ ...data, services: n }); }} />
                                                <TranslateBtn onClick={() => handleTranslate(svc.features, 'featuresEn', idx, 'services')} isTranslating={translatingState[`services-${idx}-featuresEn`]} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => handleSave('update_services', { services: data.services })} disabled={isSaving} className="btn-primary text-xs bg-unaicNavy text-white px-3 py-2 rounded flex items-center gap-2">
                                <Save size={14} /> Simpan Layanan
                            </button>
                        </div>
                    </div>
                )}

                {/* COMMUNITIES & CONTRIBUTIONS TAB */}
                {activeTab === 'others' && (
                    <div className="space-y-8">
                        {/* COMMUNITIES */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b pb-2">
                                <h3 className="font-bold text-lg text-unaicNavy">Komunitas Alumni</h3>
                                <button onClick={() => setData({ ...data, communities: [...data.communities, { id: crypto.randomUUID(), name: "", activity: "", contact: "" }] })} className="text-green-600 hover:bg-green-50 px-2 py-1 rounded flex items-center gap-1 text-xs border border-green-200"><Plus size={14} /> Tambah</button>
                            </div>
                            <div className="space-y-3">
                                {data.communities.map((com, idx) => (
                                    <div key={com.id} className="border p-4 rounded-lg bg-gray-50 relative">
                                        <button onClick={() => { const n = data.communities.filter((_, i) => i !== idx); setData({ ...data, communities: n }); }} className="absolute top-2 right-2 text-red-400 p-1 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Nama Komunitas</label>
                                                    <input className="w-full border rounded p-2 text-sm" placeholder="Nama Komunitas" value={com.name} onChange={e => { const n = [...data.communities]; n[idx].name = e.target.value; setData({ ...data, communities: n }); }} />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Kontak</label>
                                                    <input className="w-full border rounded p-2 text-sm" placeholder="Kontak" value={com.contact} onChange={e => { const n = [...data.communities]; n[idx].contact = e.target.value; setData({ ...data, communities: n }); }} />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Aktivitas (ID)</label>
                                                    <input className="w-full border rounded p-2 text-sm" placeholder="Aktivitas" value={com.activity} onChange={e => { const n = [...data.communities]; n[idx].activity = e.target.value; setData({ ...data, communities: n }); }} />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between items-center">
                                                        <label className="text-[10px] font-bold text-gray-500 uppercase">Activity (EN)</label>
                                                        <TranslateBtn onClick={() => handleTranslate(com.activity, 'activityEn', idx, 'communities')} isTranslating={translatingState[`communities-${idx}-activityEn`]} />
                                                    </div>
                                                    <input className="w-full border rounded p-2 text-sm bg-blue-50/30" placeholder="Activity (EN)" value={com.activityEn || ""} onChange={e => { const n = [...data.communities]; n[idx].activityEn = e.target.value; setData({ ...data, communities: n }); }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => handleSave('update_communities', { communities: data.communities })} disabled={isSaving} className="btn-primary text-xs bg-unaicNavy text-white px-3 py-2 rounded flex items-center gap-2">
                                <Save size={14} /> Simpan Komunitas
                            </button>
                        </div>

                        {/* CONTRIBUTIONS */}
                        <div className="space-y-4 pt-4">
                            <div className="flex justify-between items-center border-b pb-2">
                                <h3 className="font-bold text-lg text-unaicNavy">Sumbangan & Kontribusi</h3>
                                <button onClick={() => setData({ ...data, contributions: [...data.contributions, { id: crypto.randomUUID(), title: "", description: "", link: "" }] })} className="text-green-600 hover:bg-green-50 px-2 py-1 rounded flex items-center gap-1 text-xs border border-green-200"><Plus size={14} /> Tambah</button>
                            </div>
                            <div className="space-y-3">
                                {data.contributions.map((ctr, idx) => (
                                    <div key={ctr.id} className="border p-4 rounded-lg bg-blue-50 relative">
                                        <button onClick={() => { const n = data.contributions.filter((_, i) => i !== idx); setData({ ...data, contributions: n }); }} className="absolute top-2 right-2 text-red-400 p-1 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Judul (ID)</label>
                                                    <input className="w-full border rounded p-2 text-sm" placeholder="Judul Program" value={ctr.title} onChange={e => { const n = [...data.contributions]; n[idx].title = e.target.value; setData({ ...data, contributions: n }); }} />
                                                </div>
                                                <div>
                                                    <div className="flex justify-between items-center">
                                                        <label className="text-[10px] font-bold text-gray-500 uppercase">Title (EN)</label>
                                                        <TranslateBtn onClick={() => handleTranslate(ctr.title, 'titleEn', idx, 'contributions')} isTranslating={translatingState[`contributions-${idx}-titleEn`]} />
                                                    </div>
                                                    <input className="w-full border rounded p-2 text-sm bg-white/50" placeholder="Title (EN)" value={ctr.titleEn || ""} onChange={e => { const n = [...data.contributions]; n[idx].titleEn = e.target.value; setData({ ...data, contributions: n }); }} />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Deskripsi (ID)</label>
                                                    <input className="w-full border rounded p-2 text-sm" placeholder="Deskripsi Singkat" value={ctr.description} onChange={e => { const n = [...data.contributions]; n[idx].description = e.target.value; setData({ ...data, contributions: n }); }} />
                                                </div>
                                                <div>
                                                    <div className="flex justify-between items-center">
                                                        <label className="text-[10px] font-bold text-gray-500 uppercase">Description (EN)</label>
                                                        <TranslateBtn onClick={() => handleTranslate(ctr.description, 'descriptionEn', idx, 'contributions')} isTranslating={translatingState[`contributions-${idx}-descriptionEn`]} />
                                                    </div>
                                                    <input className="w-full border rounded p-2 text-sm bg-white/50" placeholder="Description (EN)" value={ctr.descriptionEn || ""} onChange={e => { const n = [...data.contributions]; n[idx].descriptionEn = e.target.value; setData({ ...data, contributions: n }); }} />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Link</label>
                                                    <input className="w-full border rounded p-2 text-sm text-blue-600" placeholder="Link Eksternal" value={ctr.link} onChange={e => { const n = [...data.contributions]; n[idx].link = e.target.value; setData({ ...data, contributions: n }); }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => handleSave('update_contributions', { contributions: data.contributions })} disabled={isSaving} className="btn-primary text-xs bg-unaicNavy text-white px-3 py-2 rounded flex items-center gap-2">
                                <Save size={14} /> Simpan Sumbangan
                            </button>
                        </div>
                    </div>
                )}

                {/* FEATURED TAB */}
                {activeTab === 'featured' && (
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b pb-2">
                                <h3 className="font-bold text-lg text-unaicNavy">Profil Alumni Berprestasi</h3>
                                <button onClick={() => setData({ ...data, featured: [...data.featured, { id: crypto.randomUUID(), name: "", graduation: "", position: "", company: "", image: "", testimonial: "", achievements: "" }] })} className="text-green-600 hover:bg-green-50 px-2 py-1 rounded flex items-center gap-1 text-xs border border-green-200"><Plus size={14} /> Tambah</button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                {data.featured.map((item, idx) => (
                                    <div key={item.id} className="border p-4 rounded-xl bg-white space-y-4 relative shadow-sm">
                                        <button onClick={() => { const n = data.featured.filter((_, i) => i !== idx); setData({ ...data, featured: n }); }} className="absolute top-2 right-2 text-red-300 hover:text-red-500"><Trash2 size={16} /></button>

                                        <div className="flex gap-4 items-start">
                                            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative group cursor-pointer border">
                                                {item.image ? <img src={item.image} className="w-full h-full object-cover" alt="Foto" /> : <Users2 className="m-auto text-gray-400 mt-8" />}
                                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, `feat_${idx}`, url => { const n = [...data.featured]; n[idx].image = url; setData({ ...data, featured: n }); })} />
                                                {uploadingState[`feat_${idx}`] && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Loader2 className="animate-spin text-white w-4 h-4" /></div>}
                                            </div>

                                            <div className="flex-1 space-y-2">
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Nama</label>
                                                    <input className="w-full border rounded p-1 text-sm font-bold" placeholder="Nama" value={item.name} onChange={e => { const n = [...data.featured]; n[idx].name = e.target.value; setData({ ...data, featured: n }); }} />
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="text-[10px] font-bold text-gray-500 uppercase">Lulusan (ID)</label>
                                                        <input className="w-full border rounded p-1 text-xs" placeholder="e.g Alumni Keperawatan 2015" value={item.graduation} onChange={e => { const n = [...data.featured]; n[idx].graduation = e.target.value; setData({ ...data, featured: n }); }} />
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between items-center">
                                                            <label className="text-[10px] font-bold text-gray-500 uppercase">Graduation (EN)</label>
                                                            <TranslateBtn onClick={() => handleTranslate(item.graduation, 'graduationEn', idx, 'featured')} isTranslating={translatingState[`featured-${idx}-graduationEn`]} />
                                                        </div>
                                                        <input className="w-full border rounded p-1 text-xs bg-blue-50/30" placeholder="EN Translation" value={item.graduationEn || ""} onChange={e => { const n = [...data.featured]; n[idx].graduationEn = e.target.value; setData({ ...data, featured: n }); }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase">Posisi (ID)</label>
                                                <input className="w-full border rounded p-1 text-xs" placeholder="Posisi" value={item.position} onChange={e => { const n = [...data.featured]; n[idx].position = e.target.value; setData({ ...data, featured: n }); }} />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Position (EN)</label>
                                                    <TranslateBtn onClick={() => handleTranslate(item.position, 'positionEn', idx, 'featured')} isTranslating={translatingState[`featured-${idx}-positionEn`]} />
                                                </div>
                                                <input className="w-full border rounded p-1 text-xs bg-blue-50/30" placeholder="Position (EN)" value={item.positionEn || ""} onChange={e => { const n = [...data.featured]; n[idx].positionEn = e.target.value; setData({ ...data, featured: n }); }} />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-bold text-gray-500 uppercase">Perusahaan</label>
                                            <input className="w-full border rounded p-1 text-xs" placeholder="Perusahaan" value={item.company} onChange={e => { const n = [...data.featured]; n[idx].company = e.target.value; setData({ ...data, featured: n }); }} />
                                        </div>

                                        <div className="space-y-2">
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-500 uppercase">Testimoni (ID)</label>
                                                <textarea className="w-full border rounded p-2 text-xs h-16" placeholder="Testimoni" value={item.testimonial} onChange={e => { const n = [...data.featured]; n[idx].testimonial = e.target.value; setData({ ...data, featured: n }); }} />
                                            </div>
                                            <div>
                                                <div className="flex justify-between items-center">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Testimonial (EN)</label>
                                                    <TranslateBtn onClick={() => handleTranslate(item.testimonial, 'testimonialEn', idx, 'featured')} isTranslating={translatingState[`featured-${idx}-testimonialEn`]} />
                                                </div>
                                                <textarea className="w-full border rounded p-2 text-xs h-16 bg-blue-50/30" placeholder="Testimonial (EN)" value={item.testimonialEn || ""} onChange={e => { const n = [...data.featured]; n[idx].testimonialEn = e.target.value; setData({ ...data, featured: n }); }} />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-500 uppercase">Prestasi (ID)</label>
                                                <input className="w-full border rounded p-1 text-xs" placeholder="Prestasi" value={item.achievements} onChange={e => { const n = [...data.featured]; n[idx].achievements = e.target.value; setData({ ...data, featured: n }); }} />
                                            </div>
                                            <div>
                                                <div className="flex justify-between items-center">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Achievements (EN)</label>
                                                    <TranslateBtn onClick={() => handleTranslate(item.achievements, 'achievementsEn', idx, 'featured')} isTranslating={translatingState[`featured-${idx}-achievementsEn`]} />
                                                </div>
                                                <input className="w-full border rounded p-1 text-xs bg-blue-50/30" placeholder="Achievements (EN)" value={item.achievementsEn || ""} onChange={e => { const n = [...data.featured]; n[idx].achievementsEn = e.target.value; setData({ ...data, featured: n }); }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => handleSave('update_featured', { featured: data.featured })} disabled={isSaving} className="btn-primary text-xs bg-unaicNavy text-white px-3 py-2 rounded flex items-center gap-2">
                                <Save size={14} /> Simpan Profil
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
