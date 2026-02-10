"use client";

import { useState, useEffect } from "react";
import {
    Plus, Edit, Trash2, X, FlaskConical, Info, Globe,
    Save, Loader2, FileText, Send,
    Image as ImageIcon, MoreVertical, Check, ListChecks,
    Search, Calendar, User, LayoutGrid
} from "lucide-react";

interface ResearchProject {
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

interface ResearchConfig {
    title: string | null;
    titleEn: string | null;
    subtitle: string | null;
    subtitleEn: string | null;
    focusTitle: string | null;
    focusTitleEn: string | null;
    focusDesc: string | null;
    focusDescEn: string | null;
}

export default function AdminResearchPage() {
    const [activeTab, setActiveTab] = useState<'projects' | 'config'>('projects');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Data State
    const [projects, setProjects] = useState<ResearchProject[]>([]);
    const [config, setConfig] = useState<ResearchConfig>({
        title: "",
        titleEn: "",
        subtitle: "",
        subtitleEn: "",
        focusTitle: "",
        focusTitleEn: "",
        focusDesc: "",
        focusDescEn: ""
    });

    // Project Modal State
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [editProject, setEditProject] = useState<ResearchProject | null>(null);
    const [projectForm, setProjectForm] = useState({
        title: "",
        titleEn: "",
        leader: "",
        year: "",
        status: "Berjalan",
        description: "",
        descriptionEn: "",
        reportUrl: "",
        order: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const res = await fetch('/api/admin/research');
            const json = await res.json();
            if (json.error) throw new Error(json.error);
            setProjects(json.projects || []);
            setConfig(json.config || {});
        } catch (error) {
            console.error("Failed to fetch research data", error);
        } finally {
            setLoading(false);
        }
    }

    const handleSaveConfig = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/admin/research', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'update_config',
                    data: config
                })
            });
            if (res.ok) {
                alert("Konfigurasi Penelitian berhasil diperbarui!");
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

    const handleProjectModal = (project?: ResearchProject) => {
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
                status: "Berjalan",
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
            const res = await fetch('/api/admin/research', {
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
                alert("Gagal menyimpan data penelitian");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteProject = async (id: number) => {
        if (!confirm("Hapus data penelitian ini?")) return;
        try {
            const res = await fetch('/api/admin/research', {
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

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="animate-spin text-unaicBlue" size={48} />
        </div>
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header section */}
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-3">
                        <FlaskConical className="text-unaicNavy" /> Manajemen Penelitian
                    </h1>
                    <p className="text-sm text-gray-500 font-medium tracking-wide">Kelola daftar penelitian, inovasi, dan konfigurasi halaman riset.</p>
                </div>
                {activeTab === 'projects' && (
                    <button
                        onClick={() => handleProjectModal()}
                        className="flex items-center gap-2 bg-unaicNavy text-white px-8 py-2.5 rounded-2xl font-bold hover:bg-unaicBlue transition shadow-lg transform hover:-translate-y-0.5 duration-200"
                    >
                        <Plus size={18} /> Tambah Penelitian
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
                    <LayoutGrid size={18} /> Daftar Penelitian
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
                    {projects.map((project) => (
                        <div key={project.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group relative flex flex-col">
                            <div className="bg-unaicNavy/5 p-6 border-b border-gray-50">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="bg-unaicNavy text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{project.status}</span>
                                    <span className="text-xs font-bold text-gray-400">{project.year}</span>
                                </div>
                                <h3 className="font-bold text-unaicNavy leading-snug line-clamp-2 min-h-[44px]">{project.title}</h3>
                            </div>
                            <div className="p-6 flex-grow space-y-4">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Ketua Peneliti</p>
                                    <p className="text-sm font-semibold text-gray-700">{project.leader}</p>
                                </div>
                                <p className="text-xs text-gray-500 line-clamp-3 italic">"{project.description}"</p>
                            </div>
                            <div className="p-4 bg-gray-50 flex justify-end gap-2">
                                <button onClick={() => handleProjectModal(project)} className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 hover:text-blue-600 transition-colors"><Edit size={16} /></button>
                                <button onClick={() => handleDeleteProject(project.id)} className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
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
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Subjudul</label>
                                <textarea
                                    className="w-full p-4 rounded-2xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-unaicBlue h-24 resize-none"
                                    value={config.subtitle || ""}
                                    onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                                />
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-50">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Judul Fokus Penelitian</label>
                                <input
                                    className="w-full p-4 rounded-2xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-unaicBlue"
                                    value={config.focusTitle || ""}
                                    onChange={(e) => setConfig({ ...config, focusTitle: e.target.value })}
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Deskripsi Fokus Penelitian</label>
                                <textarea
                                    className="w-full p-4 rounded-2xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-unaicBlue h-40 resize-none"
                                    value={config.focusDesc || ""}
                                    onChange={(e) => setConfig({ ...config, focusDesc: e.target.value })}
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
                                <label className="block text-xs font-bold text-blue-600 uppercase tracking-widest">Subtitle (EN)</label>
                                <textarea
                                    className="w-full p-4 rounded-2xl border border-blue-100 bg-white text-sm outline-none focus:ring-2 focus:ring-unaicBlue h-24 resize-none"
                                    value={config.subtitleEn || ""}
                                    onChange={(e) => setConfig({ ...config, subtitleEn: e.target.value })}
                                />
                            </div>

                            <div className="space-y-4 pt-4 border-t border-blue-100/50">
                                <label className="block text-xs font-bold text-blue-600 uppercase tracking-widest">Research Focus Title (EN)</label>
                                <input
                                    className="w-full p-4 rounded-2xl border border-blue-100 bg-white text-sm outline-none focus:ring-2 focus:ring-unaicBlue"
                                    value={config.focusTitleEn || ""}
                                    onChange={(e) => setConfig({ ...config, focusTitleEn: e.target.value })}
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-bold text-blue-600 uppercase tracking-widest">Research Focus Description (EN)</label>
                                <textarea
                                    className="w-full p-4 rounded-2xl border border-blue-100 bg-white text-sm outline-none focus:ring-2 focus:ring-unaicBlue h-40 resize-none"
                                    value={config.focusDescEn || ""}
                                    onChange={(e) => setConfig({ ...config, focusDescEn: e.target.value })}
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
                        Simpan Perubahan Konfigurasi Riset
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
                                    {editProject ? "Edit Penelitian" : "Tambah Penelitian Baru"}
                                </h2>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Data Riset & Inovasi UNAIC</p>
                            </div>
                            <button onClick={() => setIsProjectModalOpen(false)} className="bg-white text-gray-400 hover:text-red-500 p-2 rounded-2xl shadow-sm border border-gray-100 transition-all">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleProjectSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Judul Penelitian (ID)</label>
                                    <textarea
                                        className="w-full p-3.5 rounded-2xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-unaicBlue resize-none h-24"
                                        value={projectForm.title}
                                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-xs font-bold text-blue-600 uppercase tracking-widest">Research Title (EN)</label>
                                    <textarea
                                        className="w-full p-3.5 rounded-2xl border border-blue-100 bg-blue-50/10 text-sm outline-none resize-none h-24"
                                        value={projectForm.titleEn}
                                        onChange={(e) => setProjectForm({ ...projectForm, titleEn: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-4">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Ketua Peneliti</label>
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
                                        <option value="Berjalan">Berjalan</option>
                                        <option value="Selesai">Selesai</option>
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
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">URL Laporan / File</label>
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
                                {editProject ? "Simpan Perubahan Penelitian" : "Tambahkan Penelitian"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
