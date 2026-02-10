"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, History, Building2, GraduationCap, Plus, Trash2, FileCheck, Upload } from "lucide-react";

interface HistoryItem {
    id: string;
    year: string;
    institutionName: string;
    institutionNameEn?: string;
    description: string;
    descriptionEn?: string;
    docTitle: string;
    docTitleEn?: string;
    docNumber: string;
    downloadUrl: string;
    status: "current" | "archived";
}

interface FacultyItem {
    id: string;
    name: string;
    nameEn?: string;
}

interface ProgramItem {
    id: string;
    facultyId: string;
    program: string;
    programEn?: string;
    level: "D3" | "D4" | "S1" | "Profesi";
    rank: "Unggul" | "A" | "Baik Sekali" | "B" | "Baik";
    skNumber: string;
    expiryDate: string;
    downloadUrl: string;
}

interface AccreditationData {
    history: HistoryItem[];
    faculties: FacultyItem[];
    programs: ProgramItem[];
}

export default function AdminAccreditationPage() {
    const [activeTab, setActiveTab] = useState<'history' | 'faculties' | 'programs'>('programs');
    const [data, setData] = useState<AccreditationData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadingState, setUploadingState] = useState<{ [key: string]: boolean }>({});

    const translateField = async (text: string, callback: (translated: string) => void) => {
        if (!text) return;
        try {
            const res = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, targetLanguage: 'English' })
            });
            const data = await res.json();
            if (data.translatedText) {
                callback(data.translatedText);
            }
        } catch (error) {
            console.error("Translation failed", error);
            alert("Gagal menerjemahkan.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/accreditation', { cache: 'no-store' });
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
            const res = await fetch('/api/admin/accreditation', {
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
                alert("Dokumen berhasil diupload. Jangan lupa klik tombol Simpan!");
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
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Akreditasi</h1>

            <div className="flex overflow-x-auto pb-2 gap-2 bg-white rounded-xl p-2 shadow-sm border border-gray-100 w-full sm:w-fit scrollbar-hide">
                {renderTabButton('programs', 'Data Prodi', GraduationCap)}
                {renderTabButton('history', 'Sejarah Institusi', History)}
                {renderTabButton('faculties', 'Kategori Fakultas', Building2)}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[500px]">

                {/* HISTORY TAB */}
                {activeTab === 'history' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg text-unaicNavy">Sejarah Akreditasi Institusi</h3>
                            <button
                                onClick={() => setData({ ...data, history: [{ id: crypto.randomUUID(), year: "", institutionName: "", description: "", docTitle: "", docNumber: "", downloadUrl: "#", status: "archived" }, ...data.history] })}
                                className="text-sm text-green-600 hover:bg-green-50 px-3 py-1 rounded-lg flex items-center gap-1 border border-green-200"
                            >
                                <Plus size={16} /> Tambah Sejarah
                            </button>
                        </div>
                        <div className="space-y-4">
                            {data.history.map((item, idx) => (
                                <div key={item.id} className="border border-gray-200 p-4 rounded-xl bg-gray-50 relative group">
                                    <button onClick={() => {
                                        const newHist = data.history.filter((_, i) => i !== idx);
                                        setData({ ...data, history: newHist });
                                    }} className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition p-2 hover:bg-red-50 rounded-full bg-white shadow-sm z-10">
                                        <Trash2 size={16} />
                                    </button>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-4">
                                            <div className="space-y-1">
                                                <div className="flex justify-between items-center mb-1">
                                                    <label className="text-xs font-semibold text-gray-500">Nama Institusi (ID)</label>
                                                    <button
                                                        onClick={() => translateField(item.institutionName, (val) => {
                                                            const newData = [...data.history];
                                                            newData[idx].institutionNameEn = val;
                                                            setData({ ...data, history: newData });
                                                        })}
                                                        className="text-[10px] text-blue-600 hover:text-blue-800 font-bold"
                                                    >
                                                        Auto-Translate ➔ EN
                                                    </button>
                                                </div>
                                                <input
                                                    className="w-full p-2 border rounded font-bold"
                                                    placeholder="Nama Institusi (ID)"
                                                    value={item.institutionName}
                                                    onChange={e => {
                                                        const newData = [...data.history];
                                                        newData[idx].institutionName = e.target.value;
                                                        setData({ ...data, history: newData });
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-gray-500">Nama Institusi (EN)</label>
                                                <input
                                                    className="w-full p-2 border rounded font-bold bg-blue-50/30"
                                                    placeholder="Institution Name (EN)"
                                                    value={item.institutionNameEn || ""}
                                                    onChange={e => {
                                                        const newData = [...data.history];
                                                        newData[idx].institutionNameEn = e.target.value;
                                                        setData({ ...data, history: newData });
                                                    }}
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    className="w-1/2 p-2 border rounded text-sm"
                                                    placeholder="Tahun (cth: 2021-Sekarang)"
                                                    value={item.year}
                                                    onChange={e => {
                                                        const newData = [...data.history];
                                                        newData[idx].year = e.target.value;
                                                        setData({ ...data, history: newData });
                                                    }}
                                                />
                                                <select
                                                    className="w-1/2 p-2 border rounded text-sm"
                                                    value={item.status}
                                                    onChange={e => {
                                                        const newData = [...data.history];
                                                        newData[idx].status = e.target.value as any;
                                                        setData({ ...data, history: newData });
                                                    }}
                                                >
                                                    <option value="current">Current</option>
                                                    <option value="archived">Archived</option>
                                                </select>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <label className="text-xs font-semibold text-gray-500">Deskripsi (ID)</label>
                                                        <button
                                                            onClick={() => translateField(item.description, (val) => {
                                                                const newData = [...data.history];
                                                                newData[idx].descriptionEn = val;
                                                                setData({ ...data, history: newData });
                                                            })}
                                                            className="text-[10px] text-blue-600 hover:text-blue-800 font-bold"
                                                        >
                                                            Auto-Translate ➔ EN
                                                        </button>
                                                    </div>
                                                    <textarea
                                                        className="w-full p-2 border rounded text-sm h-20"
                                                        placeholder="Deskripsi (ID)"
                                                        value={item.description}
                                                        onChange={e => {
                                                            const newData = [...data.history];
                                                            newData[idx].description = e.target.value;
                                                            setData({ ...data, history: newData });
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-gray-500">Deskripsi (EN)</label>
                                                    <textarea
                                                        className="w-full p-2 border rounded text-sm h-20 bg-blue-50/30"
                                                        placeholder="Description (EN)"
                                                        value={item.descriptionEn || ""}
                                                        onChange={e => {
                                                            const newData = [...data.history];
                                                            newData[idx].descriptionEn = e.target.value;
                                                            setData({ ...data, history: newData });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-3 bg-white p-3 rounded border border-gray-100">
                                            <p className="text-xs font-bold text-gray-500 uppercase">Dokumen Legalitas</p>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <label className="text-xs font-semibold text-gray-500">Judul Dokumen (ID)</label>
                                                        <button
                                                            onClick={() => translateField(item.docTitle, (val) => {
                                                                const newData = [...data.history];
                                                                newData[idx].docTitleEn = val;
                                                                setData({ ...data, history: newData });
                                                            })}
                                                            className="text-[10px] text-blue-600 hover:text-blue-800 font-bold"
                                                        >
                                                            Auto-Translate ➔ EN
                                                        </button>
                                                    </div>
                                                    <input
                                                        className="w-full p-2 border rounded text-sm"
                                                        placeholder="Judul Dokumen (ID)"
                                                        value={item.docTitle}
                                                        onChange={e => {
                                                            const newData = [...data.history];
                                                            newData[idx].docTitle = e.target.value;
                                                            setData({ ...data, history: newData });
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-gray-500">Judul Dokumen (EN)</label>
                                                    <input
                                                        className="w-full p-2 border rounded text-sm bg-blue-50/30"
                                                        placeholder="Document Title (EN)"
                                                        value={item.docTitleEn || ""}
                                                        onChange={e => {
                                                            const newData = [...data.history];
                                                            newData[idx].docTitleEn = e.target.value;
                                                            setData({ ...data, history: newData });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <input
                                                className="w-full p-2 border rounded text-sm"
                                                placeholder="Nomor SK"
                                                value={item.docNumber}
                                                onChange={e => {
                                                    const newData = [...data.history];
                                                    newData[idx].docNumber = e.target.value;
                                                    setData({ ...data, history: newData });
                                                }}
                                            />
                                            <div className="flex gap-2">
                                                <input
                                                    className="flex-1 p-2 border rounded text-sm font-mono text-xs text-blue-600"
                                                    placeholder="Link Download / Upload File"
                                                    value={item.downloadUrl}
                                                    onChange={e => {
                                                        const newData = [...data.history];
                                                        newData[idx].downloadUrl = e.target.value;
                                                        setData({ ...data, history: newData });
                                                    }}
                                                />
                                                <label className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded px-3 flex items-center justify-center cursor-pointer transition w-10">
                                                    {uploadingState[`hist_${idx}`] ? <Loader2 className="animate-spin w-4 h-4" /> : <Upload className="w-4 h-4 text-gray-600" />}
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                                        onChange={e => handleFileUpload(e, `hist_${idx}`, url => {
                                                            const newData = [...data.history];
                                                            newData[idx].downloadUrl = url;
                                                            setData({ ...data, history: newData });
                                                        })}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleSave('update_history', { history: data.history })} disabled={isSaving} className="btn-primary bg-unaicNavy text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            <Save size={16} /> Simpan Sejarah
                        </button>
                    </div>
                )}

                {/* FACULTIES TAB */}
                {activeTab === 'faculties' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg text-unaicNavy">Kategori Fakultas</h3>
                            <button
                                onClick={() => setData({ ...data, faculties: [...data.faculties, { id: crypto.randomUUID(), name: "" }] })}
                                className="text-sm text-green-600 hover:bg-green-50 px-3 py-1 rounded-lg flex items-center gap-1 border border-green-200"
                            >
                                <Plus size={16} /> Tambah Fakultas
                            </button>
                        </div>
                        <div className="space-y-2 max-w-2xl">
                            {data.faculties.map((fac, idx) => (
                                <div key={fac.id} className="grid grid-cols-2 gap-4 items-center mb-2">
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-xs font-semibold text-gray-500">Nama Fakultas (ID)</label>
                                            <button
                                                onClick={() => translateField(fac.name, (val) => {
                                                    const newFacs = [...data.faculties];
                                                    newFacs[idx].nameEn = val;
                                                    setData({ ...data, faculties: newFacs });
                                                })}
                                                className="text-[10px] text-blue-600 hover:text-blue-800 font-bold"
                                            >
                                                Auto-Translate ➔ EN
                                            </button>
                                        </div>
                                        <input
                                            className="w-full p-2 border rounded-lg"
                                            placeholder="Nama Fakultas (ID)"
                                            value={fac.name}
                                            onChange={e => {
                                                const newFacs = [...data.faculties];
                                                newFacs[idx].name = e.target.value;
                                                setData({ ...data, faculties: newFacs });
                                            }}
                                        />
                                    </div>
                                    <div className="flex gap-2 items-end">
                                        <div className="flex-1 space-y-1">
                                            <label className="text-xs font-semibold text-gray-500">Nama Fakultas (EN)</label>
                                            <input
                                                className="w-full p-2 border rounded-lg bg-blue-50/30"
                                                placeholder="Faculty Name (EN)"
                                                value={fac.nameEn || ""}
                                                onChange={e => {
                                                    const newFacs = [...data.faculties];
                                                    newFacs[idx].nameEn = e.target.value;
                                                    setData({ ...data, faculties: newFacs });
                                                }}
                                            />
                                        </div>
                                        <button onClick={() => {
                                            const newFacs = data.faculties.filter((_, i) => i !== idx);
                                            setData({ ...data, faculties: newFacs });
                                        }} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded mb-1">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleSave('update_faculties', { faculties: data.faculties })} disabled={isSaving} className="btn-primary bg-unaicNavy text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            <Save size={16} /> Simpan Fakultas
                        </button>
                    </div>
                )}

                {/* PROGRAMS TAB */}
                {activeTab === 'programs' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg text-unaicNavy">Data Program Studi</h3>
                            <button
                                onClick={() => setData({
                                    ...data,
                                    programs: [{
                                        id: crypto.randomUUID(),
                                        facultyId: data.faculties[0]?.id || "",
                                        program: "",
                                        level: "S1",
                                        rank: "Baik",
                                        skNumber: "",
                                        expiryDate: "",
                                        downloadUrl: "#"
                                    }, ...data.programs]
                                })}
                                className="text-sm text-green-600 hover:bg-green-50 px-3 py-1 rounded-lg flex items-center gap-1 border border-green-200"
                            >
                                <Plus size={16} /> Tambah Prodi
                            </button>
                        </div>

                        <div className="space-y-4">
                            {data.programs.map((prog, idx) => (
                                <div key={prog.id} className="border border-gray-200 p-4 rounded-xl bg-gray-50 relative group">
                                    <button onClick={() => {
                                        const newProgs = data.programs.filter((_, i) => i !== idx);
                                        setData({ ...data, programs: newProgs });
                                    }} className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition p-2 hover:bg-red-50 rounded-full bg-white shadow-sm z-10">
                                        <Trash2 size={16} />
                                    </button>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <div className="flex justify-between items-center mb-1">
                                                    <label className="text-xs font-bold text-gray-500 uppercase">Program Studi (ID)</label>
                                                    <button
                                                        onClick={() => translateField(prog.program, (val) => {
                                                            const newData = [...data.programs];
                                                            newData[idx].programEn = val;
                                                            setData({ ...data, programs: newData });
                                                        })}
                                                        className="text-[10px] text-blue-600 hover:text-blue-800 font-bold"
                                                    >
                                                        Auto-Translate ➔ EN
                                                    </button>
                                                </div>
                                                <input
                                                    className="w-full p-2 border rounded font-semibold"
                                                    value={prog.program}
                                                    onChange={e => {
                                                        const newData = [...data.programs];
                                                        newData[idx].program = e.target.value;
                                                        setData({ ...data, programs: newData });
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Program Studi (EN)</label>
                                                <input
                                                    className="w-full p-2 border rounded font-semibold bg-blue-50/30"
                                                    value={prog.programEn || ""}
                                                    onChange={e => {
                                                        const newData = [...data.programs];
                                                        newData[idx].programEn = e.target.value;
                                                        setData({ ...data, programs: newData });
                                                    }}
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="w-1/2 space-y-1">
                                                    <label className="text-xs font-bold text-gray-500 uppercase">Fakultas</label>
                                                    <select
                                                        className="w-full p-2 border rounded text-sm"
                                                        value={prog.facultyId}
                                                        onChange={e => {
                                                            const newData = [...data.programs];
                                                            newData[idx].facultyId = e.target.value;
                                                            setData({ ...data, programs: newData });
                                                        }}
                                                    >
                                                        {data.faculties.map(f => (
                                                            <option key={f.id} value={f.id}>{f.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="w-1/4 space-y-1">
                                                    <label className="text-xs font-bold text-gray-500 uppercase">Jenjang</label>
                                                    <select
                                                        className="w-full p-2 border rounded text-sm"
                                                        value={prog.level}
                                                        onChange={e => {
                                                            const newData = [...data.programs];
                                                            newData[idx].level = e.target.value as any;
                                                            setData({ ...data, programs: newData });
                                                        }}
                                                    >
                                                        {["D3", "D4", "S1", "Profesi"].map(l => <option key={l} value={l}>{l}</option>)}
                                                    </select>
                                                </div>
                                                <div className="w-1/4 space-y-1">
                                                    <label className="text-xs font-bold text-gray-500 uppercase">Peringkat</label>
                                                    <select
                                                        className="w-full p-2 border rounded text-sm"
                                                        value={prog.rank}
                                                        onChange={e => {
                                                            const newData = [...data.programs];
                                                            newData[idx].rank = e.target.value as any;
                                                            setData({ ...data, programs: newData });
                                                        }}
                                                    >
                                                        {["Unggul", "A", "Baik Sekali", "B", "Baik"].map(r => <option key={r} value={r}>{r}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 bg-white p-3 rounded border border-gray-100">
                                            <p className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><FileCheck size={12} /> Info SK</p>
                                            <div className="space-y-1">
                                                <label className="text-[10px] text-gray-400">Nomor SK</label>
                                                <input
                                                    className="w-full p-2 border rounded text-sm font-mono"
                                                    value={prog.skNumber}
                                                    onChange={e => {
                                                        const newData = [...data.programs];
                                                        newData[idx].skNumber = e.target.value;
                                                        setData({ ...data, programs: newData });
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] text-gray-400">Berlaku Sampai</label>
                                                <input
                                                    className="w-full p-2 border rounded text-sm"
                                                    value={prog.expiryDate}
                                                    type="date"
                                                    onChange={e => {
                                                        const newData = [...data.programs];
                                                        newData[idx].expiryDate = e.target.value;
                                                        setData({ ...data, programs: newData });
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] text-gray-400">Dokumen Sertifikat</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        className="flex-1 p-2 border rounded text-xs text-blue-600 font-mono"
                                                        placeholder="Link Download / Upload File"
                                                        value={prog.downloadUrl}
                                                        onChange={e => {
                                                            const newData = [...data.programs];
                                                            newData[idx].downloadUrl = e.target.value;
                                                            setData({ ...data, programs: newData });
                                                        }}
                                                    />
                                                    <label className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded px-2 flex items-center justify-center cursor-pointer transition w-8">
                                                        {uploadingState[`prog_${idx}`] ? <Loader2 className="animate-spin w-3 h-3" /> : <Upload className="w-3 h-3 text-gray-600" />}
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                                            onChange={e => handleFileUpload(e, `prog_${idx}`, url => {
                                                                const newData = [...data.programs];
                                                                newData[idx].downloadUrl = url;
                                                                setData({ ...data, programs: newData });
                                                            })}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleSave('update_programs', { programs: data.programs })} disabled={isSaving} className="btn-primary bg-unaicNavy text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            <Save size={16} /> Simpan Data Prodi
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
