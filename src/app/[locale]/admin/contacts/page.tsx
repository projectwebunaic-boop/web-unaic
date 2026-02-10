"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Globe, MapPin, Phone, Mail, Clock, Plus, Trash2, ArrowLeft, Facebook, Twitter, Instagram, Youtube, Linkedin, MessageCircle } from "lucide-react";
import { Link, useRouter } from "@/i18n/routing";

interface SocialMedia {
    name: string;
    url: string;
}

interface Department {
    id: string;
    name: string;
    nameEn: string;
    description: string;
    descriptionEn: string;
    email: string;
    phone: string;
    head: string;
}

interface ContactData {
    address: string;
    phone: string;
    whatsapp: string;
    email: string;
    operationalHours: string;
    operationalHoursEn: string;
    mapsUrl: string;
    socialMedia: SocialMedia[];
    departments: Department[];
}

export default function AdminContacts() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'info' | 'social' | 'departments'>('info');

    const [data, setData] = useState<ContactData>({
        address: "",
        phone: "",
        whatsapp: "",
        email: "",
        operationalHours: "",
        operationalHoursEn: "",
        mapsUrl: "",
        socialMedia: [],
        departments: []
    });

    useEffect(() => {
        fetch("/api/admin/contacts")
            .then(res => res.json())
            .then(data => {
                setData(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    }, []);

    const handleSave = async (type: string, payload: any) => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/admin/contacts", {
                method: "POST",
                body: JSON.stringify({ type, ...payload })
            });
            if (res.ok) {
                alert("Berhasil disimpan!");
                router.refresh();
            } else {
                alert("Gagal menyimpan.");
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan.");
        } finally {
            setIsSaving(false);
        }
    };

    const addSocial = () => {
        setData({ ...data, socialMedia: [...data.socialMedia, { name: "", url: "" }] });
    };

    const removeSocial = (idx: number) => {
        const newList = [...data.socialMedia];
        newList.splice(idx, 1);
        setData({ ...data, socialMedia: newList });
    };

    const addDepartment = () => {
        const newDept: Department = {
            id: Date.now().toString(),
            name: "",
            nameEn: "",
            description: "",
            descriptionEn: "",
            email: "",
            phone: "",
            head: ""
        };
        setData({ ...data, departments: [...data.departments, newDept] });
    };

    const removeDepartment = (idx: number) => {
        const newList = [...data.departments];
        newList.splice(idx, 1);
        setData({ ...data, departments: newList });
    };

    if (isLoading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Manajemen Kontak & Lokasi</h1>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100 mb-8 w-fit">
                <button
                    onClick={() => setActiveTab('info')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'info' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    <Phone size={18} /> Informasi Utama
                </button>
                <button
                    onClick={() => setActiveTab('social')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'social' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    <Globe size={18} /> Media Sosial
                </button>
                <button
                    onClick={() => setActiveTab('departments')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'departments' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    <Mail size={18} /> Bagian & Unit
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                {activeTab === 'info' && (
                    <div className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                        <MapPin size={16} className="text-blue-500" /> Alamat Lengkap
                                    </label>
                                    <textarea
                                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none h-24"
                                        value={data.address}
                                        onChange={e => setData({ ...data, address: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                            <Phone size={16} className="text-blue-500" /> Telepon
                                        </label>
                                        <input
                                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={data.phone}
                                            onChange={e => setData({ ...data, phone: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                            <MessageCircle size={16} className="text-green-500" /> WhatsApp (Hanya Angka)
                                        </label>
                                        <input
                                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={data.whatsapp}
                                            onChange={e => setData({ ...data, whatsapp: e.target.value })}
                                            placeholder="628..."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                        <Mail size={16} className="text-blue-500" /> Email Resmi
                                    </label>
                                    <input
                                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={data.email}
                                        onChange={e => setData({ ...data, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Clock size={16} className="text-blue-500" />
                                        <label className="block text-sm font-semibold text-gray-700">Jam Operasional (ID)</label>
                                    </div>
                                    <input
                                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={data.operationalHours}
                                        onChange={e => setData({ ...data, operationalHours: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Clock size={16} className="text-blue-500" />
                                        <Globe size={14} className="text-gray-400" />
                                        <label className="block text-sm font-semibold text-gray-700">Operational Hours (EN)</label>
                                    </div>
                                    <input
                                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={data.operationalHoursEn}
                                        onChange={e => setData({ ...data, operationalHoursEn: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Google Maps Embed URL (src only)</label>
                                    <textarea
                                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none h-20 text-xs font-mono"
                                        value={data.mapsUrl}
                                        onChange={e => setData({ ...data, mapsUrl: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t flex justify-end">
                            <button
                                onClick={() => handleSave('update_info', {
                                    address: data.address,
                                    phone: data.phone,
                                    whatsapp: data.whatsapp,
                                    email: data.email,
                                    operationalHours: data.operationalHours,
                                    operationalHoursEn: data.operationalHoursEn,
                                    mapsUrl: data.mapsUrl
                                })}
                                disabled={isSaving}
                                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-blue-100"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                Simpan Informasi Utama
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'social' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.socialMedia.map((sm, idx) => (
                                <div key={idx} className="flex gap-2 items-end bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="flex-1 space-y-3">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Platform Name</label>
                                            <input
                                                className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                                value={sm.name}
                                                onChange={e => {
                                                    const newList = [...data.socialMedia];
                                                    newList[idx].name = e.target.value;
                                                    setData({ ...data, socialMedia: newList });
                                                }}
                                                placeholder="e.g. Instagram"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Profile URL</label>
                                            <input
                                                className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                                value={sm.url}
                                                onChange={e => {
                                                    const newList = [...data.socialMedia];
                                                    newList[idx].url = e.target.value;
                                                    setData({ ...data, socialMedia: newList });
                                                }}
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeSocial(idx)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors mb-0.5"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={addSocial}
                            className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 font-medium hover:border-blue-400 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={20} /> Tambah Media Sosial
                        </button>

                        <div className="pt-6 border-t flex justify-end">
                            <button
                                onClick={() => handleSave('update_social', { socialMedia: data.socialMedia })}
                                disabled={isSaving}
                                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-blue-100"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                Simpan Media Sosial
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'departments' && (
                    <div className="space-y-6">
                        {data.departments.map((dept, idx) => (
                            <div key={dept.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 relative group">
                                <button
                                    onClick={() => removeDepartment(idx)}
                                    className="absolute top-4 right-4 p-2 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-lg transition-all"
                                >
                                    <Trash2 size={20} />
                                </button>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wider">Nama Bagian (ID)</label>
                                            <input
                                                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={dept.name}
                                                onChange={e => {
                                                    const newList = [...data.departments];
                                                    newList[idx].name = e.target.value;
                                                    setData({ ...data, departments: newList });
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Globe size={14} className="text-gray-400" />
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Department Name (EN)</label>
                                            </div>
                                            <input
                                                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={dept.nameEn}
                                                onChange={e => {
                                                    const newList = [...data.departments];
                                                    newList[idx].nameEn = e.target.value;
                                                    setData({ ...data, departments: newList });
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wider">Deskripsi (ID)</label>
                                            <textarea
                                                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none h-20"
                                                value={dept.description}
                                                onChange={e => {
                                                    const newList = [...data.departments];
                                                    newList[idx].description = e.target.value;
                                                    setData({ ...data, departments: newList });
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Globe size={14} className="text-gray-400" />
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Description (EN)</label>
                                            </div>
                                            <textarea
                                                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none h-20"
                                                value={dept.descriptionEn}
                                                onChange={e => {
                                                    const newList = [...data.departments];
                                                    newList[idx].descriptionEn = e.target.value;
                                                    setData({ ...data, departments: newList });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wider">Kepala Bagian</label>
                                            <input
                                                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={dept.head}
                                                onChange={e => {
                                                    const newList = [...data.departments];
                                                    newList[idx].head = e.target.value;
                                                    setData({ ...data, departments: newList });
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wider">Email</label>
                                            <input
                                                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={dept.email}
                                                onChange={e => {
                                                    const newList = [...data.departments];
                                                    newList[idx].email = e.target.value;
                                                    setData({ ...data, departments: newList });
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wider">Telepon</label>
                                            <input
                                                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={dept.phone}
                                                onChange={e => {
                                                    const newList = [...data.departments];
                                                    newList[idx].phone = e.target.value;
                                                    setData({ ...data, departments: newList });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={addDepartment}
                            className="w-full py-6 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 font-medium hover:border-blue-400 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={24} /> Tambah Bagian/Unit Baru
                        </button>

                        <div className="pt-6 border-t flex justify-end">
                            <button
                                onClick={() => handleSave('update_departments', { departments: data.departments })}
                                disabled={isSaving}
                                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-blue-100"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                Simpan Daftar Bagian
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
