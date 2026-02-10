"use client";

import { useState, useEffect } from "react";
import {
    Plus, Edit, Trash2, X, Target, Info, Globe,
    Save, Loader2, Users, FileText, Send,
    Image as ImageIcon, MoreVertical, Check, ListChecks
} from "lucide-react";

interface StaffMember {
    id: number;
    name: string;
    position: string;
    positionEn: string | null;
    image: string | null;
    order: number;
}

interface LPPMData {
    vision: string | null;
    visionEn: string | null;
    mission: string[];
    missionEn: string[];
    tasks: string[];
    tasksEn: string[];
    ctaTitle: string | null;
    ctaTitleEn: string | null;
    ctaDescription: string | null;
    ctaDescriptionEn: string | null;
    ctaButtonText: string | null;
    ctaButtonTextEn: string | null;
    ctaButtonLink: string | null;
    staff: StaffMember[];
}

export default function AdminLPPMPage() {
    const [activeTab, setActiveTab] = useState<'profile' | 'staff'>('profile');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Data State
    const [data, setData] = useState<LPPMData>({
        vision: "",
        visionEn: "",
        mission: [],
        missionEn: [],
        tasks: [],
        tasksEn: [],
        ctaTitle: "",
        ctaTitleEn: "",
        ctaDescription: "",
        ctaDescriptionEn: "",
        ctaButtonText: "",
        ctaButtonTextEn: "",
        ctaButtonLink: "",
        staff: []
    });

    // Staff Modal State
    const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
    const [editStaff, setEditStaff] = useState<StaffMember | null>(null);
    const [staffForm, setStaffForm] = useState({
        name: "",
        position: "",
        positionEn: "",
        image: "",
        order: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const res = await fetch('/api/admin/lppm');
            const json = await res.json();
            if (json.error) throw new Error(json.error);
            setData({
                ...json,
                mission: Array.isArray(json.mission) ? json.mission : [],
                missionEn: Array.isArray(json.missionEn) ? json.missionEn : [],
                tasks: Array.isArray(json.tasks) ? json.tasks : [],
                tasksEn: Array.isArray(json.tasksEn) ? json.tasksEn : []
            });
        } catch (error) {
            console.error("Failed to fetch LPPM data", error);
        } finally {
            setLoading(false);
        }
    }

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/admin/lppm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'update_profile',
                    data: data
                })
            });
            if (res.ok) {
                alert("Profil LPPM berhasil diperbarui!");
            } else {
                alert("Gagal memperbarui profil");
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan saat menyimpan");
        } finally {
            setSaving(false);
        }
    };

    const handleStaffModal = (member?: StaffMember) => {
        if (member) {
            setEditStaff(member);
            setStaffForm({
                name: member.name,
                position: member.position,
                positionEn: member.positionEn || "",
                image: member.image || "",
                order: member.order
            });
        } else {
            setEditStaff(null);
            setStaffForm({
                name: "",
                position: "",
                positionEn: "",
                image: "",
                order: data.staff.length + 1
            });
        }
        setIsStaffModalOpen(true);
    };

    const handleStaffSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/lppm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: editStaff ? 'update_staff' : 'create_staff',
                    data: editStaff ? { ...staffForm, id: editStaff.id } : staffForm
                })
            });
            if (res.ok) {
                fetchData();
                setIsStaffModalOpen(false);
            } else {
                alert("Gagal menyimpan data staff");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteStaff = async (id: number) => {
        if (!confirm("Hapus anggota organisasi ini?")) return;
        try {
            const res = await fetch('/api/admin/lppm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'delete_staff',
                    data: { id }
                })
            });
            if (res.ok) fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleArrayInput = (field: 'mission' | 'missionEn' | 'tasks' | 'tasksEn', index: number, value: string) => {
        const newList = [...data[field]];
        newList[index] = value;
        setData({ ...data, [field]: newList });
    };

    const addArrayItem = (field: 'mission' | 'missionEn' | 'tasks' | 'tasksEn') => {
        setData({ ...data, [field]: [...data[field], ""] });
    };

    const removeArrayItem = (field: 'mission' | 'missionEn' | 'tasks' | 'tasksEn', index: number) => {
        const newList = data[field].filter((_, i) => i !== index);
        setData({ ...data, [field]: newList });
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
                        <Target className="text-unaicNavy" /> Manajemen LPPM
                    </h1>
                    <p className="text-sm text-gray-500 font-medium tracking-wide">Kelola visi, misi, tugas pokok, dan struktur organisasi LPPM.</p>
                </div>
                {activeTab === 'staff' && (
                    <button
                        onClick={() => handleStaffModal()}
                        className="flex items-center gap-2 bg-unaicNavy text-white px-8 py-2.5 rounded-2xl font-bold hover:bg-unaicBlue transition shadow-lg transform hover:-translate-y-0.5 duration-200"
                    >
                        <Plus size={18} /> Tambah Staff
                    </button>
                )}
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-2 bg-white/50 p-1.5 rounded-2xl border border-gray-100 w-fit backdrop-blur-sm">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-6 py-2.5 rounded-xl transition-all font-bold flex items-center gap-2 text-sm ${activeTab === 'profile'
                        ? 'bg-white text-unaicNavy shadow-sm border border-gray-100'
                        : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <FileText size={18} /> Profil & Konten
                </button>
                <button
                    onClick={() => setActiveTab('staff')}
                    className={`px-6 py-2.5 rounded-xl transition-all font-bold flex items-center gap-2 text-sm ${activeTab === 'staff'
                        ? 'bg-white text-unaicNavy shadow-sm border border-gray-100'
                        : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Users size={18} /> Struktur Organisasi
                </button>
            </div>

            {/* Profile Tab Content */}
            {activeTab === 'profile' && (
                <form onSubmit={handleSaveProfile} className="space-y-8">
                    {/* Vision & Mission Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* ID Section */}
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-8">
                            <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
                                <Globe className="text-unaicBlue" size={24} />
                                <h2 className="text-xl font-bold text-gray-800">Konten Indonesia</h2>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Visi LPPM</label>
                                <textarea
                                    className="w-full p-4 rounded-2xl border border-gray-200 text-sm focus:ring-2 focus:ring-unaicBlue outline-none h-32 resize-none transition-all"
                                    value={data.vision || ""}
                                    onChange={(e) => setData({ ...data, vision: e.target.value })}
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Misi LPPM</label>
                                    <button type="button" onClick={() => addArrayItem('mission')} className="text-unaicBlue hover:text-unaicNavy p-1"><Plus size={18} /></button>
                                </div>
                                <div className="space-y-3">
                                    {data.mission.map((m, i) => (
                                        <div key={i} className="flex gap-2">
                                            <input
                                                className="flex-1 p-3 rounded-xl border border-gray-200 text-sm outline-none"
                                                value={m}
                                                onChange={(e) => handleArrayInput('mission', i, e.target.value)}
                                            />
                                            <button type="button" onClick={() => removeArrayItem('mission', i)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Tugas Pokok</label>
                                    <button type="button" onClick={() => addArrayItem('tasks')} className="text-unaicBlue hover:text-unaicNavy p-1"><Plus size={18} /></button>
                                </div>
                                <div className="space-y-3">
                                    {data.tasks.map((t, i) => (
                                        <div key={i} className="flex gap-2">
                                            <input
                                                className="flex-1 p-3 rounded-xl border border-gray-200 text-sm outline-none"
                                                value={t}
                                                onChange={(e) => handleArrayInput('tasks', i, e.target.value)}
                                            />
                                            <button type="button" onClick={() => removeArrayItem('tasks', i)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* EN Section */}
                        <div className="bg-blue-50/20 p-8 rounded-[2rem] border border-blue-50 space-y-8">
                            <div className="flex items-center gap-3 border-b border-blue-100/50 pb-6">
                                <Globe className="text-blue-500" size={24} />
                                <h2 className="text-xl font-bold text-blue-800">Konten English</h2>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-bold text-blue-600 uppercase tracking-widest">Vision (EN)</label>
                                <textarea
                                    className="w-full p-4 rounded-2xl border border-blue-100 bg-white text-sm focus:ring-2 focus:ring-unaicBlue outline-none h-32 resize-none transition-all"
                                    value={data.visionEn || ""}
                                    onChange={(e) => setData({ ...data, visionEn: e.target.value })}
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="block text-xs font-bold text-blue-600 uppercase tracking-widest">Mission (EN)</label>
                                    <button type="button" onClick={() => addArrayItem('missionEn')} className="text-blue-500 hover:text-blue-700 p-1"><Plus size={18} /></button>
                                </div>
                                <div className="space-y-3">
                                    {data.missionEn.map((m, i) => (
                                        <div key={i} className="flex gap-2">
                                            <input
                                                className="flex-1 p-3 rounded-xl border border-blue-100 bg-white text-sm outline-none"
                                                value={m}
                                                onChange={(e) => handleArrayInput('missionEn', i, e.target.value)}
                                            />
                                            <button type="button" onClick={() => removeArrayItem('missionEn', i)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="block text-xs font-bold text-blue-600 uppercase tracking-widest">Main Tasks (EN)</label>
                                    <button type="button" onClick={() => addArrayItem('tasksEn')} className="text-blue-500 hover:text-blue-700 p-1"><Plus size={18} /></button>
                                </div>
                                <div className="space-y-3">
                                    {data.tasksEn.map((t, i) => (
                                        <div key={i} className="flex gap-2">
                                            <input
                                                className="flex-1 p-3 rounded-xl border border-blue-100 bg-white text-sm outline-none"
                                                value={t}
                                                onChange={(e) => handleArrayInput('tasksEn', i, e.target.value)}
                                            />
                                            <button type="button" onClick={() => removeArrayItem('tasksEn', i)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-8">
                        <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
                            <Send className="text-green-600" size={24} />
                            <h2 className="text-xl font-bold text-gray-800">Call to Action (CTA)</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Judul CTA (ID)</label>
                                    <input
                                        className="w-full p-3.5 rounded-2xl border border-gray-200 text-sm outline-none"
                                        value={data.ctaTitle || ""}
                                        onChange={(e) => setData({ ...data, ctaTitle: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Deskripsi CTA (ID)</label>
                                    <textarea
                                        className="w-full p-4 rounded-2xl border border-gray-200 text-sm h-24 resize-none outline-none"
                                        value={data.ctaDescription || ""}
                                        onChange={(e) => setData({ ...data, ctaDescription: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Teks Tombol (ID)</label>
                                    <input
                                        className="w-full p-3.5 rounded-2xl border border-gray-200 text-sm outline-none"
                                        value={data.ctaButtonText || ""}
                                        onChange={(e) => setData({ ...data, ctaButtonText: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-6 bg-blue-50/20 p-6 rounded-3xl border border-blue-50">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-blue-600 uppercase tracking-widest">CTA Title (EN)</label>
                                    <input
                                        className="w-full p-3.5 rounded-2xl border border-blue-100 bg-white text-sm outline-none"
                                        value={data.ctaTitleEn || ""}
                                        onChange={(e) => setData({ ...data, ctaTitleEn: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-blue-600 uppercase tracking-widest">CTA Description (EN)</label>
                                    <textarea
                                        className="w-full p-4 rounded-2xl border border-blue-100 bg-white text-sm h-24 resize-none outline-none"
                                        value={data.ctaDescriptionEn || ""}
                                        onChange={(e) => setData({ ...data, ctaDescriptionEn: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-blue-600 uppercase tracking-widest">Button Text (EN)</label>
                                    <input
                                        className="w-full p-3.5 rounded-2xl border border-blue-100 bg-white text-sm outline-none"
                                        value={data.ctaButtonTextEn || ""}
                                        onChange={(e) => setData({ ...data, ctaButtonTextEn: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-gray-50">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Link Tombol (WA / URL)</label>
                            <input
                                className="w-full p-3.5 rounded-2xl border border-gray-200 text-sm outline-none"
                                value={data.ctaButtonLink || ""}
                                onChange={(e) => setData({ ...data, ctaButtonLink: e.target.value })}
                                placeholder="https://wa.me/..."
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-unaicNavy text-white py-5 rounded-[2rem] font-black uppercase tracking-widest hover:bg-unaicBlue transition shadow-2xl disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
                    >
                        {saving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
                        Simpan Semua Perubahan Profil
                    </button>
                </form>
            )}

            {/* Staff Tab Content */}
            {activeTab === 'staff' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data.staff.map((member) => (
                        <div key={member.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group relative">
                            <div className="h-48 bg-gray-100 relative overflow-hidden">
                                {member.image ? (
                                    <img src={member.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <ImageIcon size={64} />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-300">
                                    <button onClick={() => handleStaffModal(member)} className="bg-white/90 backdrop-blur-md p-2.5 rounded-2xl shadow-lg hover:text-blue-600"><Edit size={18} /></button>
                                    <button onClick={() => handleDeleteStaff(member.id)} className="bg-white/90 backdrop-blur-md p-2.5 rounded-2xl shadow-lg hover:text-red-600"><Trash2 size={18} /></button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="mb-1">
                                    <h3 className="font-black text-unaicNavy uppercase tracking-tight leading-tight">{member.name}</h3>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded border border-gray-100">ORDER: {member.order}</span>
                                </div>
                                <div className="space-y-1 mt-3">
                                    <p className="text-xs font-bold text-gray-500 leading-snug">{member.position}</p>
                                    {member.positionEn && <p className="text-[10px] font-bold text-blue-500/70 italic leading-snug">{member.positionEn}</p>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Staff Modal */}
            {isStaffModalOpen && (
                <div className="fixed inset-0 bg-unaicNavy/40 z-50 flex items-center justify-center p-4 backdrop-blur-md">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
                        <div className="flex justify-between items-center p-8 border-b border-gray-50">
                            <div>
                                <h2 className="text-2xl font-black text-unaicNavy uppercase tracking-tight">
                                    {editStaff ? "Edit Anggota" : "Tambah Anggota LPPM"}
                                </h2>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Struktur Organisasi Lembaga</p>
                            </div>
                            <button onClick={() => setIsStaffModalOpen(false)} className="bg-white text-gray-400 hover:text-red-500 p-2 rounded-2xl shadow-sm border border-gray-100 transition-all">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleStaffSubmit} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Nama Lengkap & Gelar</label>
                                <input
                                    className="w-full p-3.5 rounded-2xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-unaicBlue"
                                    value={staffForm.name}
                                    onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Jabatan (ID)</label>
                                    <input
                                        className="w-full p-3.5 rounded-2xl border border-gray-200 text-sm outline-none"
                                        value={staffForm.position}
                                        onChange={(e) => setStaffForm({ ...staffForm, position: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-xs font-bold text-blue-600 uppercase tracking-widest">Position (EN)</label>
                                    <input
                                        className="w-full p-3.5 rounded-2xl border border-blue-100 bg-blue-50/10 text-sm outline-none"
                                        value={staffForm.positionEn}
                                        onChange={(e) => setStaffForm({ ...staffForm, positionEn: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                                <div className="space-y-4">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">No. Urut Organisasi</label>
                                    <input
                                        type="number"
                                        className="w-full p-3.5 rounded-2xl border border-gray-200 text-sm outline-none"
                                        value={staffForm.order}
                                        onChange={(e) => setStaffForm({ ...staffForm, order: parseInt(e.target.value) })}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-unaicNavy text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-unaicBlue transition shadow-xl"
                                >
                                    {editStaff ? "Simpan Perubahan" : "Simpan Anggota"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
