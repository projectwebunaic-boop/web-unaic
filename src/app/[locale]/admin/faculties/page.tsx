"use client";

import { useState, useEffect } from "react";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    X,
    Loader2,
    Save,
    Globe,
    GraduationCap,
    Building,
    BookOpen,
    Trash
} from "lucide-react";
import Image from "next/image";

interface CurriculumSubject {
    id?: string;
    semester: string;
    name: string;
    nameEn: string;
    credits: number | string;
}

interface Program {
    id?: string;
    name: string;
    nameEn: string;
    slug: string;
    level: string;
    accreditation: string;
    description: string;
    descriptionEn: string;
    advantages: { title: string; desc: string }[];
    advantagesEn: { title: string; desc: string }[];
    careerProspects: string[];
    careerProspectsEn: string[];
    websiteUrl: string;
    curriculumPdf: string;
    duration: string;
    durationEn: string;
    degree: string;
    degreeEn: string;
    icon: string;
    subjects: CurriculumSubject[];
}

interface Facility {
    id?: string;
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    image: string;
    order: number;
}

interface Faculty {
    id: string;
    name: string;
    nameEn: string;
    slug: string;
    key: string;
    icon: string;
    deanName: string;
    deanTitle: string;
    deanTitleEn: string;
    deanMessage: string;
    deanMessageEn: string;
    deanImage: string;
    vision: string;
    visionEn: string;
    missions: string[];
    missionsEn: string[];
    heroImage: string;
    deanId?: string;
    dean?: any;
    programs: Program[];
    facilities: Facility[];
}

export default function AdminFacultiesPage() {
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [leaders, setLeaders] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<'general' | 'dean' | 'vision' | 'programs' | 'facilities'>('general');

    const [editingFaculty, setEditingFaculty] = useState<Partial<Faculty> | null>(null);

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
        }
    };

    const translateMissions = async () => {
        if (!editingFaculty?.missions) return;
        try {
            const translated = await Promise.all(editingFaculty.missions.map(async (m) => {
                const res = await fetch('/api/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: m, targetLanguage: 'English' })
                });
                const data = await res.json();
                return data.translatedText || m;
            }));
            updateField('missionsEn', translated);
        } catch (error) {
            console.error("Missions translation failed", error);
        }
    };

    useEffect(() => {
        fetchFaculties();
    }, []);

    const fetchFaculties = async () => {
        setIsLoading(true);
        try {
            const [facRes, leadRes] = await Promise.all([
                fetch("/api/admin/faculties"),
                fetch("/api/admin/leaders")
            ]);
            if (facRes.ok) setFaculties(await facRes.json());
            if (leadRes.ok) setLeaders(await leadRes.json());
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (faculty: Faculty) => {
        setEditingFaculty({ ...faculty });
        setActiveTab('general');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingFaculty(null);
    };

    const handleSave = async () => {
        if (!editingFaculty) return;
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/admin/faculties", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingFaculty)
            });
            if (res.ok) {
                const updated = await res.json();
                setFaculties(prev => prev.map(f => f.id === updated.data.id ? updated.data : f));
                closeModal();
            } else {
                alert("Gagal menyimpan data.");
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateField = (field: keyof Faculty, value: any) => {
        setEditingFaculty(prev => prev ? { ...prev, [field]: value } : null);
    };

    const addMission = (isEn: boolean) => {
        if (!editingFaculty) return;
        const field = isEn ? 'missionsEn' : 'missions';
        const current = editingFaculty[field] as string[] || [];
        updateField(field, [...current, ""]);
    };

    const removeMission = (index: number, isEn: boolean) => {
        if (!editingFaculty) return;
        const field = isEn ? 'missionsEn' : 'missions';
        const current = editingFaculty[field] as string[] || [];
        updateField(field, current.filter((_, i) => i !== index));
    };

    const updateMission = (index: number, value: string, isEn: boolean) => {
        if (!editingFaculty) return;
        const field = isEn ? 'missionsEn' : 'missions';
        const current = [...(editingFaculty[field] as string[] || [])];
        current[index] = value;
        updateField(field, current);
    };

    const addProgram = () => {
        if (!editingFaculty) return;
        const current = editingFaculty.programs || [];
        updateField('programs', [...current, {
            name: "",
            nameEn: "",
            slug: "",
            level: "S1",
            accreditation: "Baik",
            duration: "8 Semester",
            durationEn: "8 Semesters",
            degree: "S.Kom",
            degreeEn: "Bachelor of Computer Science",
            icon: "GraduationCap",
            curriculumPdf: "",
            subjects: []
        }]);
    };

    const removeProgram = (index: number) => {
        if (!editingFaculty) return;
        updateField('programs', editingFaculty.programs?.filter((_, i) => i !== index));
    };

    const updateProgram = (index: number, field: keyof Program, value: any) => {
        if (!editingFaculty) return;
        const current = [...(editingFaculty.programs || [])];
        current[index] = { ...current[index], [field]: value };
        updateField('programs', current);
    };

    const addSubject = (programIndex: number) => {
        if (!editingFaculty) return;
        const programs = [...(editingFaculty.programs || [])];
        const program = { ...programs[programIndex] };
        program.subjects = [...(program.subjects || []), { semester: "1", name: "", nameEn: "", credits: "3" }];
        programs[programIndex] = program;
        updateField('programs', programs);
    };

    const removeSubject = (programIndex: number, subjectIndex: number) => {
        if (!editingFaculty) return;
        const programs = [...(editingFaculty.programs || [])];
        const program = { ...programs[programIndex] };
        program.subjects = program.subjects.filter((_, i) => i !== subjectIndex);
        programs[programIndex] = program;
        updateField('programs', programs);
    };

    const updateSubject = (programIndex: number, subjectIndex: number, field: keyof CurriculumSubject, value: any) => {
        if (!editingFaculty) return;
        const programs = [...(editingFaculty.programs || [])];
        const program = { ...programs[programIndex] };
        const subjects = [...(program.subjects || [])];
        subjects[subjectIndex] = { ...subjects[subjectIndex], [field]: value };
        program.subjects = subjects;
        programs[programIndex] = program;
        updateField('programs', programs);
    };

    const [editingProgramIndex, setEditingProgramIndex] = useState<number | null>(null);

    const openProgramDetails = (index: number) => {
        setEditingProgramIndex(index);
    };

    const closeProgramDetails = () => {
        setEditingProgramIndex(null);
    };

    const addFacility = () => {
        if (!editingFaculty) return;
        const current = editingFaculty.facilities || [];
        updateField('facilities', [...current, { title: "", titleEn: "", description: "", descriptionEn: "", image: "", order: current.length }]);
    };

    const removeFacility = (index: number) => {
        if (!editingFaculty) return;
        updateField('facilities', editingFaculty.facilities?.filter((_, i) => i !== index));
    };

    const updateFacility = (index: number, field: keyof Facility, value: string) => {
        if (!editingFaculty) return;
        const current = [...(editingFaculty.facilities || [])];
        current[index] = { ...current[index], [field]: value };
        updateField('facilities', current);
    };

    const filteredFaculties = faculties.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Manajemen Fakultas</h1>
                    <p className="text-gray-500">Kelola detail fakultas, visi misi, prodi, dan fasilitas.</p>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Cari fakultas..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-unaicBlue transition"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-unaicBlue" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFaculties.map((f) => (
                        <div key={f.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
                            <div className="h-32 bg-unaicBlue relative">
                                <Image
                                    src={f.heroImage || '/images/hero-health.jpg'}
                                    alt={f.name}
                                    fill
                                    className="object-cover opacity-30 group-hover:opacity-50 transition-opacity"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-unaicBlue shadow-xl">
                                        <BookOpen size={32} />
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-1">{f.name}</h3>
                                <p className="text-sm text-gray-500 mb-4">{f.deanName}</p>
                                <div className="flex gap-4 mb-6">
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-unaicBlue">{f.programs.length}</p>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Prodi</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-unaicBlue">{f.facilities.length}</p>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Fasilitas</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleEdit(f)}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-gray-700 rounded-xl font-bold hover:bg-unaicBlue hover:text-white transition"
                                >
                                    <Edit2 size={16} /> Edit Fakultas
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && editingFaculty && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">{editingFaculty.name}</h2>
                                <p className="text-sm text-gray-500">Edit informasi detail fakultas</p>
                            </div>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Tabs */}
                        <div className="flex border-b border-gray-100 bg-gray-50/50">
                            {[
                                { id: 'general', label: 'Umum', icon: GraduationCap },
                                { id: 'dean', label: 'Sambutan Dekan', icon: Globe },
                                { id: 'vision', label: 'Visi Misi', icon: BookOpen },
                                { id: 'programs', label: 'Program Studi', icon: Trash2 },
                                { id: 'facilities', label: 'Fasilitas', icon: Building }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex items-center gap-2 px-6 py-3 text-sm font-bold transition whitespace-nowrap border-b-2 ${activeTab === tab.id
                                        ? 'text-unaicBlue border-unaicBlue bg-white'
                                        : 'text-gray-400 border-transparent hover:text-gray-600'
                                        }`}
                                >
                                    <tab.icon size={16} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {activeTab === 'general' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm font-bold text-gray-700 lowercase">Nama Fakultas (ID)</label>
                                            <button
                                                onClick={() => translateField(editingFaculty.name || "", val => updateField('nameEn', val))}
                                                className="text-[10px] text-blue-600 font-bold hover:underline"
                                            >
                                                Auto-Translate ➔ EN
                                            </button>
                                        </div>
                                        <input
                                            className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-unaicBlue"
                                            value={editingFaculty.name || ""}
                                            onChange={e => updateField('name', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 lowercase">Nama Fakultas (EN)</label>
                                        <input
                                            className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-unaicBlue"
                                            value={editingFaculty.nameEn || ""}
                                            onChange={e => updateField('nameEn', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 lowercase">Slug (URL)</label>
                                        <input
                                            className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-unaicBlue"
                                            value={editingFaculty.slug || ""}
                                            onChange={e => updateField('slug', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 lowercase">Icon (Fa Name)</label>
                                        <input
                                            className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-unaicBlue"
                                            value={editingFaculty.icon || ""}
                                            onChange={e => updateField('icon', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-full space-y-2">
                                        <label className="text-sm font-bold text-gray-700 lowercase">Hero Image URL</label>
                                        <input
                                            className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-unaicBlue"
                                            value={editingFaculty.heroImage || ""}
                                            onChange={e => updateField('heroImage', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'dean' && (
                                <div className="space-y-6">
                                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl mb-4">
                                        <label className="text-sm font-bold text-blue-800 block mb-2">Pilih dari Data Pimpinan (Sync)</label>
                                        <select
                                            className="w-full p-3 rounded-xl border border-blue-200 outline-none focus:ring-2 focus:ring-unaicBlue"
                                            value={editingFaculty.deanId || ""}
                                            onChange={(e) => {
                                                const id = e.target.value;
                                                updateField('deanId', id);
                                                const selected = leaders.find(l => l.id === id);
                                                if (selected) {
                                                    updateField('deanName', selected.name);
                                                    updateField('deanImage', selected.image);
                                                }
                                            }}
                                        >
                                            <option value="">-- Manual / Tidak tertaut --</option>
                                            {leaders.map(l => (
                                                <option key={l.id} value={l.id}>{l.name} ({l.category})</option>
                                            ))}
                                        </select>
                                        <p className="text-[10px] text-blue-600 mt-2 italic">* Memilih pimpinan akan otomatis memperbarui Nama dan Foto dekan di halaman fakultas.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 lowercase">Nama Dekan / Pimpinan</label>
                                            <input
                                                className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-unaicBlue"
                                                value={editingFaculty.deanName || ""}
                                                onChange={e => updateField('deanName', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 lowercase">Dean Portrait Image URL</label>
                                            <input
                                                className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-unaicBlue"
                                                value={editingFaculty.deanImage || ""}
                                                onChange={e => updateField('deanImage', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-bold text-gray-700 lowercase">Gelar/Jabatan (ID)</label>
                                                <button
                                                    onClick={() => translateField(editingFaculty.deanTitle || "", val => updateField('deanTitleEn', val))}
                                                    className="text-[10px] text-blue-600 font-bold hover:underline"
                                                >
                                                    Auto-Translate ➔ EN
                                                </button>
                                            </div>
                                            <input
                                                className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-unaicBlue"
                                                value={editingFaculty.deanTitle || ""}
                                                onChange={e => updateField('deanTitle', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 lowercase">Title (EN)</label>
                                            <input
                                                className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-unaicBlue"
                                                value={editingFaculty.deanTitleEn || ""}
                                                onChange={e => updateField('deanTitleEn', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm font-bold text-gray-700 lowercase">Pesan Sambutan (ID)</label>
                                            <button
                                                onClick={() => translateField(editingFaculty.deanMessage || "", val => updateField('deanMessageEn', val))}
                                                className="text-[10px] text-blue-600 font-bold hover:underline"
                                            >
                                                Auto-Translate ➔ EN
                                            </button>
                                        </div>
                                        <textarea
                                            className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-unaicBlue h-32"
                                            value={editingFaculty.deanMessage || ""}
                                            onChange={e => updateField('deanMessage', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 lowercase">Message (EN)</label>
                                        <textarea
                                            className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-unaicBlue h-32 bg-blue-50/20"
                                            value={editingFaculty.deanMessageEn || ""}
                                            onChange={e => updateField('deanMessageEn', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'vision' && (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-bold text-gray-700 lowercase">Visi Fakultas (ID)</label>
                                                <button
                                                    onClick={() => translateField(editingFaculty.vision || "", val => updateField('visionEn', val))}
                                                    className="text-[10px] text-blue-600 font-bold hover:underline"
                                                >
                                                    Auto-Translate ➔ EN
                                                </button>
                                            </div>
                                            <textarea
                                                className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-unaicBlue h-24"
                                                value={editingFaculty.vision || ""}
                                                onChange={e => updateField('vision', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 lowercase">Vision (EN)</label>
                                            <textarea
                                                className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-unaicBlue h-24 bg-blue-50/20"
                                                value={editingFaculty.visionEn || ""}
                                                onChange={e => updateField('visionEn', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Missions ID */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-bold text-gray-700 lowercase">Misi Fakultas (ID)</label>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={translateMissions}
                                                        className="text-[10px] text-blue-600 font-bold hover:underline"
                                                    >
                                                        Translate All ➔ EN
                                                    </button>
                                                    <button onClick={() => addMission(false)} className="text-xs bg-unaicBlue text-white px-2 py-1 rounded-lg flex items-center gap-1 font-bold">
                                                        <Plus size={14} /> Tambah Misi
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                {(editingFaculty.missions || []).map((m, idx) => (
                                                    <div key={idx} className="flex gap-2">
                                                        <textarea
                                                            className="flex-1 p-3 rounded-xl border border-gray-200 outline-none text-sm"
                                                            value={m}
                                                            onChange={e => updateMission(idx, e.target.value, false)}
                                                        />
                                                        <button onClick={() => removeMission(idx, false)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg h-fit">
                                                            <Trash size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Missions EN */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-bold text-gray-700 lowercase text-blue-600">Missions (EN)</label>
                                                <button onClick={() => addMission(true)} className="text-xs bg-blue-600 text-white px-2 py-1 rounded-lg flex items-center gap-1 font-bold">
                                                    <Plus size={14} /> Add Mission
                                                </button>
                                            </div>
                                            <div className="space-y-3">
                                                {(editingFaculty.missionsEn || []).map((m, idx) => (
                                                    <div key={idx} className="flex gap-2">
                                                        <textarea
                                                            className="flex-1 p-3 rounded-xl border border-gray-200 outline-none text-sm bg-blue-50/20"
                                                            value={m}
                                                            onChange={e => updateMission(idx, e.target.value, true)}
                                                        />
                                                        <button onClick={() => removeMission(idx, true)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg h-fit">
                                                            <Trash size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'programs' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-gray-800 lowercase">Daftar Program Studi</h3>
                                        <button onClick={addProgram} className="bg-unaicNavy text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm">
                                            <Plus size={16} /> Tambah Prodi
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {(editingFaculty.programs || []).map((p, idx) => (
                                            <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                                <div className="md:col-span-4 space-y-1">
                                                    <label className="text-[10px] uppercase font-bold text-gray-400">Nama Prodi (ID/EN)</label>
                                                    <input
                                                        className="w-full p-2.5 rounded-lg border border-gray-200 text-sm mb-1"
                                                        placeholder="Indonesian Name"
                                                        value={p.name}
                                                        onChange={e => updateProgram(idx, 'name', e.target.value)}
                                                    />
                                                    <input
                                                        className="w-full p-2.5 rounded-lg border border-gray-200 text-sm bg-blue-50/30"
                                                        placeholder="English Name"
                                                        value={p.nameEn}
                                                        onChange={e => updateProgram(idx, 'nameEn', e.target.value)}
                                                    />
                                                </div>
                                                <div className="md:col-span-3 space-y-1">
                                                    <label className="text-[10px] uppercase font-bold text-gray-400">Slug (ID unik)</label>
                                                    <input
                                                        className="w-full p-2.5 rounded-lg border border-gray-200 text-sm"
                                                        value={p.slug}
                                                        onChange={e => updateProgram(idx, 'slug', e.target.value)}
                                                    />
                                                </div>
                                                <div className="md:col-span-2 space-y-1">
                                                    <label className="text-[10px] uppercase font-bold text-gray-400">Jenjang</label>
                                                    <select
                                                        className="w-full p-2.5 rounded-lg border border-gray-200 text-sm"
                                                        value={p.level}
                                                        onChange={e => updateProgram(idx, 'level', e.target.value)}
                                                    >
                                                        <option value="D3">D3</option>
                                                        <option value="D4">D4</option>
                                                        <option value="S1">S1</option>
                                                        <option value="Profesi">Profesi</option>
                                                    </select>
                                                </div>
                                                <div className="md:col-span-2 space-y-1">
                                                    <label className="text-[10px] uppercase font-bold text-gray-400">Akreditasi</label>
                                                    <input
                                                        className="w-full p-2.5 rounded-lg border border-gray-200 text-sm"
                                                        value={p.accreditation || ""}
                                                        onChange={e => updateProgram(idx, 'accreditation', e.target.value)}
                                                    />
                                                </div>
                                                <div className="md:col-span-3 space-y-1">
                                                    <label className="text-[10px] uppercase font-bold text-gray-400">Icon (Lucide Name)</label>
                                                    <input
                                                        className="w-full p-2.5 rounded-lg border border-gray-200 text-sm"
                                                        placeholder="GraduationCap"
                                                        value={p.icon || ""}
                                                        onChange={e => updateProgram(idx, 'icon', e.target.value)}
                                                    />
                                                </div>
                                                <div className="md:col-span-4 space-y-1">
                                                    <label className="text-[10px] uppercase font-bold text-gray-400">Durasi (ID/EN)</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            className="flex-1 p-2.5 rounded-lg border border-gray-200 text-sm"
                                                            placeholder="8 Semester"
                                                            value={p.duration || ""}
                                                            onChange={e => updateProgram(idx, 'duration', e.target.value)}
                                                        />
                                                        <input
                                                            className="flex-1 p-2.5 rounded-lg border border-gray-200 text-sm bg-blue-50/30"
                                                            placeholder="8 Semesters"
                                                            value={p.durationEn || ""}
                                                            onChange={e => updateProgram(idx, 'durationEn', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="md:col-span-4 space-y-1">
                                                    <label className="text-[10px] uppercase font-bold text-gray-400">Gelar (ID/EN)</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            className="flex-1 p-2.5 rounded-lg border border-gray-200 text-sm"
                                                            placeholder="S.Kom"
                                                            value={p.degree || ""}
                                                            onChange={e => updateProgram(idx, 'degree', e.target.value)}
                                                        />
                                                        <input
                                                            className="flex-1 p-2.5 rounded-lg border border-gray-200 text-sm bg-blue-50/30"
                                                            placeholder="Bachelor of Computer Science"
                                                            value={p.degreeEn || ""}
                                                            onChange={e => updateProgram(idx, 'degreeEn', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="md:col-span-1">
                                                    <button onClick={() => removeProgram(idx)} className="p-2.5 text-red-500 bg-white border border-red-100 rounded-lg hover:bg-red-50 w-full flex justify-center">
                                                        <Trash size={18} />
                                                    </button>
                                                </div>
                                                <div className="md:col-span-full mt-2">
                                                    <button
                                                        onClick={() => openProgramDetails(idx)}
                                                        className="w-full flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold hover:bg-blue-100 transition border border-blue-100"
                                                    >
                                                        <Edit2 size={14} /> Edit Detail Konten (Deskripsi, Keunggulan, Khas)
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'facilities' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-gray-800 lowercase">Fasilitas Fakultas</h3>
                                        <button onClick={addFacility} className="bg-unaicNavy text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm">
                                            <Plus size={16} /> Tambah Fasilitas
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {(editingFaculty.facilities || []).map((f, idx) => (
                                            <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                                                <div className="flex justify-between font-bold text-xs text-gray-400 uppercase">
                                                    <span>Fasilitas #{idx + 1}</span>
                                                    <button onClick={() => removeFacility(idx)} className="text-red-500 hover:text-red-700">Hapus</button>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <input
                                                        className="p-2.5 rounded-lg border border-gray-200 text-sm"
                                                        placeholder="Judul (ID)"
                                                        value={f.title}
                                                        onChange={e => updateFacility(idx, 'title', e.target.value)}
                                                    />
                                                    <input
                                                        className="p-2.5 rounded-lg border border-gray-200 text-sm bg-blue-50/30"
                                                        placeholder="Title (EN)"
                                                        value={f.titleEn}
                                                        onChange={e => updateFacility(idx, 'titleEn', e.target.value)}
                                                    />
                                                </div>
                                                <textarea
                                                    className="w-full p-2.5 rounded-lg border border-gray-200 text-sm h-16"
                                                    placeholder="Deskripsi (ID)"
                                                    value={f.description}
                                                    onChange={e => updateFacility(idx, 'description', e.target.value)}
                                                />
                                                <textarea
                                                    className="w-full p-2.5 rounded-lg border border-gray-200 text-sm h-16 bg-blue-50/30"
                                                    placeholder="Description (EN)"
                                                    value={f.descriptionEn}
                                                    onChange={e => updateFacility(idx, 'descriptionEn', e.target.value)}
                                                />
                                                <input
                                                    className="w-full p-2.5 rounded-lg border border-gray-200 text-xs text-gray-500"
                                                    placeholder="Image URL"
                                                    value={f.image}
                                                    onChange={e => updateFacility(idx, 'image', e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white sticky bottom-0 z-10">
                            <button onClick={closeModal} className="px-6 py-3 rounded-2xl font-bold text-gray-600 hover:bg-gray-100 transition">
                                Batal
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSubmitting}
                                className="px-8 py-3 rounded-2xl font-bold bg-unaicNavy text-white hover:bg-unaicBlue transition shadow-lg flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Menyimpan...</> : <><Save size={18} /> Simpan Perubahan</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Sub-modal: Program Details */}
            {editingProgramIndex !== null && editingFaculty && editingFaculty.programs?.[editingProgramIndex] && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={closeProgramDetails}></div>
                    <div className="relative bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-gray-100">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Detail Konten: {editingFaculty.programs[editingProgramIndex].name}</h3>
                                <p className="text-xs text-gray-500">Edit deskripsi, keunggulan, dan prospek karir prodi ini.</p>
                            </div>
                            <button onClick={closeProgramDetails} className="p-2 hover:bg-gray-200 rounded-full transition">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Deskripsi */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm font-bold text-gray-700">Deskripsi (ID)</label>
                                            <button
                                                onClick={() => translateField(editingFaculty!.programs![editingProgramIndex].description || "", val => updateProgram(editingProgramIndex, 'descriptionEn', val))}
                                                className="text-[10px] text-blue-600 font-bold hover:underline"
                                            >
                                                Translate ➔ EN
                                            </button>
                                        </div>
                                        <textarea
                                            className="w-full p-3 rounded-xl border border-gray-200 text-sm h-32 outline-none focus:ring-2 focus:ring-unaicBlue"
                                            value={editingFaculty.programs[editingProgramIndex].description || ""}
                                            onChange={e => updateProgram(editingProgramIndex, 'description', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Description (EN)</label>
                                        <textarea
                                            className="w-full p-3 rounded-xl border border-gray-200 text-sm h-32 outline-none focus:ring-2 focus:ring-unaicBlue bg-blue-50/20"
                                            value={editingFaculty.programs[editingProgramIndex].descriptionEn || ""}
                                            onChange={e => updateProgram(editingProgramIndex, 'descriptionEn', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Keunggulan */}
                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-gray-700">Keunggulan Prodi</label>
                                    <button
                                        onClick={() => {
                                            if (!editingFaculty) return;
                                            const current = editingFaculty.programs![editingProgramIndex].advantages || [];
                                            updateProgram(editingProgramIndex, 'advantages', [...current, { title: "", desc: "" }]);
                                        }}
                                        className="text-xs bg-unaicBlue text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1"
                                    >
                                        <Plus size={14} /> Tambah Keunggulan
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {(editingFaculty.programs[editingProgramIndex].advantages || []).map((adv, aIdx) => (
                                        <div key={aIdx} className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2 relative group">
                                            <button
                                                onClick={() => {
                                                    if (!editingFaculty) return;
                                                    const current = editingFaculty.programs![editingProgramIndex].advantages.filter((_, i) => i !== aIdx);
                                                    updateProgram(editingProgramIndex, 'advantages', current);
                                                }}
                                                className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash size={14} />
                                            </button>
                                            <div className="grid grid-cols-2 gap-2">
                                                <input
                                                    className="w-full p-2 rounded-lg border border-gray-200 text-sm font-bold"
                                                    placeholder="Judul Keunggulan (ID)"
                                                    value={adv.title}
                                                    onChange={e => {
                                                        if (!editingFaculty) return;
                                                        const current = [...editingFaculty.programs![editingProgramIndex].advantages];
                                                        current[aIdx] = { ...current[aIdx], title: e.target.value };
                                                        updateProgram(editingProgramIndex, 'advantages', current);
                                                    }}
                                                />
                                                <input
                                                    className="w-full p-2 rounded-lg border border-gray-200 text-sm font-bold bg-blue-50/30"
                                                    placeholder="Advantage Title (EN)"
                                                    value={(editingFaculty.programs![editingProgramIndex].advantagesEn || [])[aIdx]?.title || ""}
                                                    onChange={e => {
                                                        if (!editingFaculty) return;
                                                        const current = [...(editingFaculty.programs![editingProgramIndex].advantagesEn || [])];
                                                        if (!current[aIdx]) current[aIdx] = { title: "", desc: "" };
                                                        current[aIdx] = { ...current[aIdx], title: e.target.value };
                                                        updateProgram(editingProgramIndex, 'advantagesEn', current);
                                                    }}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <textarea
                                                    className="w-full p-2 rounded-lg border border-gray-200 text-xs"
                                                    placeholder="Penjelasan singkat (ID)"
                                                    value={adv.desc}
                                                    onChange={e => {
                                                        if (!editingFaculty) return;
                                                        const current = [...editingFaculty.programs![editingProgramIndex].advantages];
                                                        current[aIdx] = { ...current[aIdx], desc: e.target.value };
                                                        updateProgram(editingProgramIndex, 'advantages', current);
                                                    }}
                                                />
                                                <textarea
                                                    className="w-full p-2 rounded-lg border border-gray-200 text-xs bg-blue-50/30"
                                                    placeholder="Brief explanation (EN)"
                                                    value={(editingFaculty.programs![editingProgramIndex].advantagesEn || [])[aIdx]?.desc || ""}
                                                    onChange={e => {
                                                        if (!editingFaculty) return;
                                                        const current = [...(editingFaculty.programs![editingProgramIndex].advantagesEn || [])];
                                                        if (!current[aIdx]) current[aIdx] = { title: "", desc: "" };
                                                        current[aIdx] = { ...current[aIdx], desc: e.target.value };
                                                        updateProgram(editingProgramIndex, 'advantagesEn', current);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Karir */}
                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-gray-700">Prospek Karir</label>
                                    <button
                                        onClick={() => {
                                            if (!editingFaculty) return;
                                            const current = editingFaculty.programs![editingProgramIndex].careerProspects || [];
                                            updateProgram(editingProgramIndex, 'careerProspects', [...current, ""]);
                                        }}
                                        className="text-xs bg-unaicBlue text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1"
                                    >
                                        <Plus size={14} /> Tambah Karir
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        {(editingFaculty.programs[editingProgramIndex].careerProspects || []).map((cp, cIdx) => (
                                            <div key={cIdx} className="flex gap-2">
                                                <input
                                                    className="flex-1 p-2 rounded-lg border border-gray-200 text-sm"
                                                    value={cp}
                                                    onChange={e => {
                                                        if (!editingFaculty) return;
                                                        const current = [...editingFaculty.programs![editingProgramIndex].careerProspects];
                                                        current[cIdx] = e.target.value;
                                                        updateProgram(editingProgramIndex, 'careerProspects', current);
                                                    }}
                                                />
                                                <button
                                                    onClick={() => {
                                                        if (!editingFaculty) return;
                                                        const current = editingFaculty.programs![editingProgramIndex].careerProspects.filter((_, i) => i !== cIdx);
                                                        updateProgram(editingProgramIndex, 'careerProspects', current);
                                                    }}
                                                    className="p-2 text-red-500"
                                                >
                                                    <Trash size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-2">
                                        {(editingFaculty.programs[editingProgramIndex].careerProspectsEn || []).map((cp, cIdx) => (
                                            <div key={cIdx} className="flex gap-2">
                                                <input
                                                    className="flex-1 p-2 rounded-lg border border-gray-200 text-sm bg-blue-50/20"
                                                    value={cp}
                                                    onChange={e => {
                                                        if (!editingFaculty) return;
                                                        const current = [...(editingFaculty.programs![editingProgramIndex].careerProspectsEn || [])];
                                                        current[cIdx] = e.target.value;
                                                        updateProgram(editingProgramIndex, 'careerProspectsEn', current);
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Kurikulum */}
                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-gray-700">Struktur Kurikulum</label>
                                    <button
                                        onClick={() => addSubject(editingProgramIndex)}
                                        className="text-xs bg-unaicBlue text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1"
                                    >
                                        <Plus size={14} /> Tambah Mata Kuliah
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="p-2 border text-left w-16">Sem</th>
                                                <th className="p-2 border text-left">Nama MK (ID)</th>
                                                <th className="p-2 border text-left">MK Name (EN)</th>
                                                <th className="p-2 border text-left w-16">SKS</th>
                                                <th className="p-2 border w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(editingFaculty.programs[editingProgramIndex].subjects || []).map((s, sIdx) => (
                                                <tr key={sIdx}>
                                                    <td className="p-1 border">
                                                        <input
                                                            className="w-full p-1.5 rounded border-none outline-none focus:ring-1 focus:ring-unaicBlue text-center"
                                                            value={s.semester}
                                                            onChange={e => updateSubject(editingProgramIndex, sIdx, 'semester', e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="p-1 border">
                                                        <input
                                                            className="w-full p-1.5 rounded border-none outline-none focus:ring-1 focus:ring-unaicBlue"
                                                            value={s.name}
                                                            onChange={e => updateSubject(editingProgramIndex, sIdx, 'name', e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="p-1 border">
                                                        <input
                                                            className="w-full p-1.5 rounded border-none outline-none focus:ring-1 focus:ring-unaicBlue bg-blue-50/20"
                                                            value={s.nameEn}
                                                            onChange={e => updateSubject(editingProgramIndex, sIdx, 'nameEn', e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="p-1 border">
                                                        <input
                                                            className="w-full p-1.5 rounded border-none outline-none focus:ring-1 focus:ring-unaicBlue text-center"
                                                            value={s.credits}
                                                            onChange={e => updateSubject(editingProgramIndex, sIdx, 'credits', e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="p-1 border text-center">
                                                        <button onClick={() => removeSubject(editingProgramIndex, sIdx)} className="text-red-500 hover:text-red-700">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {(!editingFaculty.programs[editingProgramIndex].subjects || editingFaculty.programs[editingProgramIndex].subjects.length === 0) && (
                                                <tr>
                                                    <td colSpan={5} className="p-4 text-center text-gray-400 italic">Belum ada mata kuliah.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Curriculum PDF */}
                            <div className="space-y-2 pt-4 border-t border-gray-100">
                                <label className="text-sm font-bold text-gray-700 lowercase">Dokumen Kurikulum Lengkap (PDF URL)</label>
                                <input
                                    className="w-full p-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-unaicBlue"
                                    placeholder="/docs/kurikulum/..."
                                    value={editingFaculty.programs[editingProgramIndex].curriculumPdf || ""}
                                    onChange={e => updateProgram(editingProgramIndex, 'curriculumPdf', e.target.value)}
                                />
                            </div>

                            {/* Website */}
                            <div className="space-y-2 pt-4 border-t border-gray-100">
                                <label className="text-sm font-bold text-gray-700">Website Resmi Prodi</label>
                                <input
                                    className="w-full p-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-unaicBlue"
                                    placeholder="https://..."
                                    value={editingFaculty.programs[editingProgramIndex].websiteUrl || ""}
                                    onChange={e => updateProgram(editingProgramIndex, 'websiteUrl', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                            <button
                                onClick={closeProgramDetails}
                                className="px-8 py-2.5 bg-unaicNavy text-white rounded-xl font-bold hover:bg-unaicBlue transition shadow-md"
                            >
                                Selesai
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
