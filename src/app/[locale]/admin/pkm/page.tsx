"use client";

import { useState, useEffect } from "react";
import {
    Plus, Edit, Trash2, X, Users, Info, Globe,
    Save, Loader2, FileText, Send,
    Image as ImageIcon, MoreVertical, Check, ListChecks,
    Search, Calendar, User, LayoutGrid, Handshake, Rocket
} from "lucide-react";

interface PkmProject {
    id: number;
    title: string;
    titleEn: string | null;
    leader: string;
    year: string;
    status: string;
    description: string;
    descriptionEn: string | null;
    reportUrl: string | null;
    order: number;
}

interface PkmProgram {
    id: number;
    title: string;
    titleEn: string | null;
    description: string;
    descriptionEn: string | null;
    icon: string;
    features: string | null; // JSON string of array
    featuresEn: string | null; // JSON string of array
    order: number;
}

interface PkmConfig {
    title: string | null;
    titleEn: string | null;
    subtitle: string | null;
    subtitleEn: string | null;
    impactTitle: string | null;
    impactTitleEn: string | null;
    impactDesc: string | null;
    impactDescEn: string | null;
}

export default function AdminPKMPage() {
    const [activeTab, setActiveTab] = useState<'projects' | 'programs' | 'config'>('projects');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Data State
    const [projects, setProjects] = useState<PkmProject[]>([]);
    const [programs, setPrograms] = useState<PkmProgram[]>([]);
    const [config, setConfig] = useState<PkmConfig>({
        title: "",
        titleEn: "",
        subtitle: "",
        subtitleEn: "",
        impactTitle: "",
        impactTitleEn: "",
        impactDesc: "",
        impactDescEn: ""
    });

    // Project Modal State
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [editProject, setEditProject] = useState<PkmProject | null>(null);
    const [projectForm, setProjectForm] = useState({
        title: "",
        titleEn: "",
        leader: "",
        year: "",
        status: "Selesai",
        description: "",
        descriptionEn: "",
        reportUrl: "",
        order: 0
    });

    // Program Modal State
    const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
    const [editProgram, setEditProgram] = useState<PkmProgram | null>(null);
    const [programForm, setProgramForm] = useState({
        title: "",
        titleEn: "",
        description: "",
        descriptionEn: "",
        icon: "Rocket",
        features: "", // Comma separated for editing
        featuresEn: "", // Comma separated for editing
        order: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const res = await fetch('/api/admin/pkm');
            const json = await res.json();
            if (json.error) throw new Error(json.error);
            setProjects(json.projects || []);
            setPrograms(json.programs || []);
            setConfig(json.config || {});
        } catch (error) {
            console.error("Failed to fetch PKM data", error);
        } finally {
            setLoading(false);
        }
    }

    const handleSaveConfig = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/admin/pkm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'update_config',
                    data: config
                })
            });
            if (res.ok) {
                alert("Konfigurasi PKM berhasil diperbarui!");
            } else {
                alert("Gagal memperbarui konfigurasi");
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan saat menyimpan");
        } finally {
            setSaving(false);
        }
    };

    const handleProjectModal = (project?: PkmProject) => {
        if (project) {
            setEditProject(project);
            setProjectForm({
                title: project.title,
                titleEn: project.titleEn || "",
                leader: project.leader,
                year: project.year,
                status: project.status,
                description: project.description,
                descriptionEn: project.descriptionEn || "",
                reportUrl: project.reportUrl || "",
                order: project.order
            });
        } else {
            setEditProject(null);
            setProjectForm({
                title: "",
                titleEn: "",
                leader: "",
                year: new Date().getFullYear().toString(),
                status: "Selesai",
                description: "",
                descriptionEn: "",
                reportUrl: "",
                order: projects.length + 1
            });
        }
        setIsProjectModalOpen(true);
    };

    const handleProjectSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/pkm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: editProject ? 'update_project' : 'create_project',
                    data: editProject ? { ...projectForm, id: editProject.id } : projectForm
                })
            });
            if (res.ok) {
                fetchData();
                setIsProjectModalOpen(false);
            } else {
                alert("Gagal menyimpan data PKM");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteProject = async (id: number) => {
        if (!confirm("Hapus data pengabdian ini?")) return;
        try {
            const res = await fetch('/api/admin/pkm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'delete_project',
                    data: { id }
                })
            });
            if (res.ok) fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleProgramModal = (program?: PkmProgram) => {
        if (program) {
            setEditProgram(program);
            setProgramForm({
                title: program.title,
                titleEn: program.titleEn || "",
                description: program.description,
                descriptionEn: program.descriptionEn || "",
                icon: program.icon,
                features: program.features ? JSON.parse(program.features).join(', ') : "",
                featuresEn: program.featuresEn ? JSON.parse(program.featuresEn).join(', ') : "",
                order: program.order
            });
        } else {
            setEditProgram(null);
            setProgramForm({
                title: "",
                titleEn: "",
                description: "",
                descriptionEn: "",
                icon: "Rocket",
                features: "",
                featuresEn: "",
                order: programs.length + 1
            });
        }
        setIsProgramModalOpen(true);
    };

    const handleProgramSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            ...programForm,
            features: JSON.stringify(programForm.features.split(',').map(s => s.trim()).filter(s => s)),
            featuresEn: JSON.stringify(programForm.featuresEn.split(',').map(s => s.trim()).filter(s => s)),
        };

        try {
            const res = await fetch('/api/admin/pkm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: editProgram ? 'update_program' : 'create_program',
                    data: editProgram ? { ...data, id: editProgram.id } : data
                })
            });
            if (res.ok) {
                fetchData();
                setIsProgramModalOpen(false);
            } else {
                alert("Gagal menyimpan program");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteProgram = async (id: number) => {
        if (!confirm("Hapus program unggulan ini?")) return;
        try {
            const res = await fetch('/api/admin/pkm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'delete_program',
                    data: { id }
                })
            });
            if (res.ok) fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="animate-spin text-unaicBlue" size={48} />
        </div>
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-20">
            {/* Header section */}
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-3">
                        <Handshake className="text-unaicNavy" /> Manajemen Pengabdian Masyarakat
                    </h1>
                    <p className="text-sm text-gray-500 font-medium tracking-wide">Kelola daftar PKM, program unggulan, dan konfigurasi halaman pengabdian.</p>
                </div>
                {activeTab === 'projects' && (
                    <button
                        onClick={() => handleProjectModal()}
                        className="flex items-center gap-2 bg-unaicNavy text-white px-8 py-2.5 rounded-2xl font-bold hover:bg-unaicBlue transition shadow-lg transform hover:-translate-y-0.5 duration-200"
                    >
                        <Plus size={18} /> Tambah PKM
                    </button>
                )}
                {activeTab === 'programs' && (
                    <button
                        onClick={() => handleProgramModal()}
                        className="flex items-center gap-2 bg-unaicBlue text-white px-8 py-2.5 rounded-2xl font-bold hover:bg-unaicNavy transition shadow-lg transform hover:-translate-y-0.5 duration-200"
                    >
                        <Plus size={18} /> Tambah Program
                    </button>
                )}
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-2 bg-white/50 p-1.5 rounded-2xl border border-gray-100 w-fit backdrop-blur-sm">
                <button
                    onClick={() => setActiveTab('projects')}
                    className={`px-6 py-2.5 rounded-xl transition-all font-bold flex items-center gap-2 text-sm ${activeTab === 'projects'
                        ? 'bg-white text-unaicNavy shadow-sm border border-gray-100'
                        : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <LayoutGrid size={18} /> Daftar Kegiatan
                </button>
                <button
                    onClick={() => setActiveTab('programs')}
                    className={`px-6 py-2.5 rounded-xl transition-all font-bold flex items-center gap-2 text-sm ${activeTab === 'programs'
                        ? 'bg-white text-unaicNavy shadow-sm border border-gray-100'
                        : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Rocket size={18} /> Program Unggulan
                </button>
                <button
                    onClick={() => setActiveTab('config')}
                    className={`px-6 py-2.5 rounded-xl transition-all font-bold flex items-center gap-2 text-sm ${activeTab === 'config'
                        ? 'bg-white text-unaicNavy shadow-sm border border-gray-100'
                        : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Info size={18} /> Konfigurasi Halaman
                </button>
            </div>

            {/* Projects Tab Content */}
            {activeTab === 'projects' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                            <p className="text-gray-400 font-medium">Belum ada data kegiatan penelitian.</p>
                        </div>
                    )}
                    {projects.map((project) => (
                        <div key={project.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group relative flex flex-col">
                            <div className="bg-amber-100/30 p-6 border-b border-gray-50">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{project.status}</span>
                                    <span className="text-xs font-bold text-unaicNavy">{project.year}</span>
                                </div>
                                <h3 className="font-bold text-unaicNavy leading-snug line-clamp-2 min-h-[44px]">{project.title}</h3>
                            </div>
                            <div className="p-6 flex-grow space-y-4">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Ketua Tim</p>
                                    <p className="text-sm font-semibold text-gray-700">{project.leader}</p>
                                </div>
                                <p className="text-xs text-gray-500 line-clamp-3 italic">"{project.description}"</p>
                            </div>
                            <div className="p-4 bg-gray-50 flex justify-end gap-2 text-gray-600">
                                <button onClick={() => handleProjectModal(project)} className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 hover:text-blue-600 transition-colors"><Edit size={16} /></button>
                                <button onClick={() => handleDeleteProject(project.id)} className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Programs Tab Content */}
            {activeTab === 'programs' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {programs.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                            <p className="text-gray-400 font-medium">Belum ada program unggulan.</p>
                        </div>
                    )}
                    {programs.map((program) => (
                        <div key={program.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group relative flex flex-col">
                            <div className="p-8 border-b border-gray-50 flex gap-6 items-start">
                                <div className="p-4 bg-unaicBlue/10 rounded-2xl text-unaicNavy">
                                    <Rocket size={32} />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-xl font-black text-unaicNavy mb-2">{program.title}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">{program.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {program.features && JSON.parse(program.features).slice(0, 3).map((f: string, i: number) => (
                                            <span key={i} className="text-[10px] font-bold bg-gray-50 text-gray-500 px-3 py-1 rounded-full uppercase tracking-widest border border-gray-100">{f}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 flex justify-end gap-2 text-gray-600">
                                <button onClick={() => handleProgramModal(program)} className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 hover:text-blue-600 transition-colors"><Edit size={16} /></button>
                                <button onClick={() => handleDeleteProgram(program.id)} className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Config Tab Content */}
            {activeTab === 'config' && (
                <form onSubmit={handleSaveConfig} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* ID Section */}
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
                            <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
                                <Globe className="text-unaicBlue" size={24} />
                                <h2 className="text-xl font-bold text-gray-800">Konten Indonesia</h2>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Judul Halaman</label>
                                <input
                                    className="w-full p-4 rounded-2xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-unaicBlue"
                                    value={config.title || ""}
                                    onChange={(e) => setConfig({ ...config, title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Subjudul Hero</label>
                                <textarea
                                    className="w-full p-4 rounded-2xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-unaicBlue h-24 resize-none"
                                    value={config.subtitle || ""}
                                    onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                                />
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-50">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Judul Dampak Sosial</label>
                                <input
                                    className="w-full p-4 rounded-2xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-unaicBlue"
                                    value={config.impactTitle || ""}
                                    onChange={(e) => setConfig({ ...config, impactTitle: e.target.value })}
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Deskripsi Dampak Sosial</label>
                                <textarea
                                    className="w-full p-4 rounded-2xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-unaicBlue h-40 resize-none"
                                    value={config.impactDesc || ""}
                                    onChange={(e) => setConfig({ ...config, impactDesc: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* EN Section */}
                        <div className="bg-blue-50/20 p-8 rounded-[2rem] border border-blue-50 space-y-6">
                            <div className="flex items-center gap-3 border-b border-blue-100/50 pb-6">
                                <Globe className="text-blue-500" size={24} />
                                <h2 className="text-xl font-bold text-blue-800">Konten English</h2>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-bold text-blue-600 uppercase tracking-widest">Page Title (EN)</label>
                                <input
                                    className="w-full p-4 rounded-2xl border border-blue-100 bg-white text-sm outline-none focus:ring-2 focus:ring-unaicBlue"
                                    value={config.titleEn || ""}
                                    onChange={(e) => setConfig({ ...config, titleEn: e.target.value })}
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-bold text-blue-600 uppercase tracking-widest">Hero Subtitle (EN)</label>
                                <textarea
                                    className="w-full p-4 rounded-2xl border border-blue-100 bg-white text-sm outline-none focus:ring-2 focus:ring-unaicBlue h-24 resize-none"
                                    value={config.subtitleEn || ""}
                                    onChange={(e) => setConfig({ ...config, subtitleEn: e.target.value })}
                                />
                            </div>

                            <div className="space-y-4 pt-4 border-t border-blue-100/50">
                                <label className="block text-xs font-bold text-blue-600 uppercase tracking-widest">Impact Title (EN)</label>
                                <input
                                    className="w-full p-4 rounded-2xl border border-blue-100 bg-white text-sm outline-none focus:ring-2 focus:ring-unaicBlue"
                                    value={config.impactTitleEn || ""}
                                    onChange={(e) => setConfig({ ...config, impactTitleEn: e.target.value })}
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-bold text-blue-600 uppercase tracking-widest">Impact Description (EN)</label>
                                <textarea
                                    className="w-full p-4 rounded-2xl border border-blue-100 bg-white text-sm outline-none focus:ring-2 focus:ring-unaicBlue h-40 resize-none"
                                    value={config.impactDescEn || ""}
                                    onChange={(e) => setConfig({ ...config, impactDescEn: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-unaicNavy text-white py-5 rounded-[2rem] font-black uppercase tracking-widest hover:bg-unaicBlue transition shadow-2xl disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
                    >
                        {saving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
                        Simpan Perubahan Konfigurasi PKM
                    </button>
                </form>
            )}

            {/* Project Modal */}
            {isProjectModalOpen && (
                <div className="fixed inset-0 bg-unaicNavy/40 z-50 flex items-center justify-center p-4 backdrop-blur-md">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-3xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
                        <div className="flex justify-between items-center p-8 border-b border-gray-50">
                            <div>
                                <h2 className="text-2xl font-black text-unaicNavy uppercase tracking-tight">
                                    {editProject ? "Edit Kegiatan PKM" : "Tambah Kegiatan PKM"}
                                </h2>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Data Pengabdian Masyarakat UNAIC</p>
                            </div>
                            <button onClick={() => setIsProjectModalOpen(false)} className="bg-white text-gray-400 hover:text-red-500 p-2 rounded-2xl shadow-sm border border-gray-100 transition-all">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleProjectSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar text-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Judul Kegiatan (ID)</label>
                                    <textarea
                                        className="w-full p-3.5 rounded-2xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-unaicBlue resize-none h-24"
                                        value={projectForm.title}
                                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-xs font-bold text-blue-600 uppercase tracking-widest">Project Title (EN)</label>
                                    <textarea
                                        className="w-full p-3.5 rounded-2xl border border-blue-100 bg-blue-50/10 text-sm outline-none resize-none h-24"
                                        value={projectForm.titleEn}
                                        onChange={(e) => setProjectForm({ ...projectForm, titleEn: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-4">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Ketua Tim</label>
                                    <input
                                        className="w-full p-3.5 rounded-2xl border border-gray-200 text-sm outline-none"
                                        value={projectForm.leader}
                                        onChange={(e) => setProjectForm({ ...projectForm, leader: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Tahun</label>
                                    <input
                                        className="w-full p-3.5 rounded-2xl border border-gray-200 text-sm outline-none"
                                        value={projectForm.year}
                                        onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Status</label>
                                    <select
                                        className="w-full p-3.5 rounded-2xl border border-gray-200 text-sm outline-none"
                                        value={projectForm.status}
                                        onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                                    >
                                        <option value="Selesai">Selesai</option>
                                        <option value="Berjalan">Berjalan</option>
                                        <option value="Rencana">Rencana</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Deskripsi Singkat (ID)</label>
                                    <textarea
                                        className="w-full p-3.5 rounded-2xl border border-gray-200 text-sm outline-none h-32"
                                        value={projectForm.description}
                                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-xs font-bold text-blue-600 uppercase tracking-widest">Short Description (EN)</label>
                                    <textarea
                                        className="w-full p-3.5 rounded-2xl border border-blue-100 bg-blue-50/10 text-sm outline-none h-32"
                                        value={projectForm.descriptionEn}
                                        onChange={(e) => setProjectForm({ ...projectForm, descriptionEn: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">URL Laporan</label>
                                    <input
                                        className="w-full p-3.5 rounded-2xl border border-gray-200 text-sm outline-none"
                                        value={projectForm.reportUrl}
                                        onChange={(e) => setProjectForm({ ...projectForm, reportUrl: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">No. Urut</label>
                                    <input
                                        type="number"
                                        className="w-full p-3.5 rounded-2xl border border-gray-200 text-sm outline-none"
                                        value={projectForm.order}
                                        onChange={(e) => setProjectForm({ ...projectForm, order: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-unaicNavy text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-unaicBlue transition shadow-xl mt-4"
                            >
                                {editProject ? "Simpan Perubahan PKM" : "Tambahkan PKM"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Program Modal */}
            {isProgramModalOpen && (
                <div className="fixed inset-0 bg-unaicNavy/40 z-50 flex items-center justify-center p-4 backdrop-blur-md">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-3xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
                        <div className="flex justify-between items-center p-8 border-b border-gray-50">
                            <div>
                                <h2 className="text-2xl font-black text-unaicBlue uppercase tracking-tight">
                                    {editProgram ? "Edit Program Unggulan" : "Tambah Program Unggulan"}
                                </h2>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Layanan Strategis PKM UNAIC</p>
                            </div>
                            <button onClick={() => setIsProgramModalOpen(false)} className="bg-white text-gray-400 hover:text-red-500 p-2 rounded-2xl shadow-sm border border-gray-100 transition-all">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleProgramSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar text-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Judul Program (ID)</label>
                                    <input
                                        className="w-full p-3.5 rounded-2xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-unaicBlue"
                                        value={programForm.title}
                                        onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-xs font-bold text-blue-600 uppercase tracking-widest">Program Title (EN)</label>
                                    <input
                                        className="w-full p-3.5 rounded-2xl border border-blue-100 bg-blue-50/10 text-sm outline-none"
                                        value={programForm.titleEn}
                                        onChange={(e) => setProgramForm({ ...programForm, titleEn: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Deskripsi (ID)</label>
                                    <textarea
                                        className="w-full p-3.5 rounded-2xl border border-gray-200 text-sm outline-none h-32"
                                        value={programForm.description}
                                        onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-xs font-bold text-blue-600 uppercase tracking-widest">Description (EN)</label>
                                    <textarea
                                        className="w-full p-3.5 rounded-2xl border border-blue-100 bg-blue-50/10 text-sm outline-none h-32"
                                        value={programForm.descriptionEn}
                                        onChange={(e) => setProgramForm({ ...programForm, descriptionEn: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Fitur/Poin Layanan (ID - pisahkan koma)</label>
                                    <textarea
                                        className="w-full p-3.5 rounded-2xl border border-gray-200 text-sm outline-none h-24"
                                        value={programForm.features}
                                        onChange={(e) => setProgramForm({ ...programForm, features: e.target.value })}
                                        placeholder="Contoh: Mentoring, Akses Modal, Jaringan"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-xs font-bold text-blue-600 uppercase tracking-widest">Features (EN - comma separated)</label>
                                    <textarea
                                        className="w-full p-3.5 rounded-2xl border border-blue-100 bg-blue-50/10 text-sm outline-none h-24"
                                        value={programForm.featuresEn}
                                        onChange={(e) => setProgramForm({ ...programForm, featuresEn: e.target.value })}
                                        placeholder="Example: Mentoring, Funding Access, Networking"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Icon (Lucide Name)</label>
                                    <input
                                        className="w-full p-3.5 rounded-2xl border border-gray-200 text-sm outline-none"
                                        value={programForm.icon}
                                        onChange={(e) => setProgramForm({ ...programForm, icon: e.target.value })}
                                        placeholder="Rocket, Handshake, Users, etc."
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">No. Urut</label>
                                    <input
                                        type="number"
                                        className="w-full p-3.5 rounded-2xl border border-gray-200 text-sm outline-none"
                                        value={programForm.order}
                                        onChange={(e) => setProgramForm({ ...programForm, order: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-unaicBlue text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-unaicNavy transition shadow-xl mt-4"
                            >
                                {editProgram ? "Simpan Perubahan Program" : "Tambahkan Program"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
