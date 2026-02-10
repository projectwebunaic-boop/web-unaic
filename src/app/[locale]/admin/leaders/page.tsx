"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Search, Edit2, Trash2, X, Upload, Loader2, ListPlus, MinusCircle } from "lucide-react";
import Image from "next/image";

interface Leader {
    id: string;
    name: string;
    title: string;
    titleEn?: string;
    image: string;
    category: string;
    slug: string;
    education: string[];
    educationEn?: string[];
    career: string[];
    careerEn?: string[];
    research: string[];
    researchEn?: string[];
    email?: string;
    scholar?: string;
    vision?: string;
    visionEn?: string;
    order: number;
}

export default function AdminLeadersPage() {
    const [leaders, setLeaders] = useState<Leader[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form inputs
    const [formData, setFormData] = useState({
        name: "",
        title: "",
        titleEn: "",
        category: "Dekan",
        email: "",
        scholar: "",
        vision: "",
        visionEn: "",
        order: 0,
    });

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
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Dynamic Lists
    const [educationList, setEducationList] = useState<string[]>([]);
    const [educationEnList, setEducationEnList] = useState<string[]>([]);
    const [careerList, setCareerList] = useState<string[]>([]);
    const [careerEnList, setCareerEnList] = useState<string[]>([]);
    const [researchList, setResearchList] = useState<string[]>([]);
    const [researchEnList, setResearchEnList] = useState<string[]>([]);

    // Detailed Inputs
    const [educationInputs, setEducationInputs] = useState({ description: "", descriptionEn: "", startYear: "", endYear: "" });
    const [careerInputs, setCareerInputs] = useState({ description: "", descriptionEn: "", startYear: "", endYear: "" });
    const [researchInput, setResearchInput] = useState("");
    const [researchEnInput, setResearchEnInput] = useState("");

    useEffect(() => {
        fetchLeaders();
    }, []);

    const fetchLeaders = async () => {
        try {
            const res = await fetch("/api/admin/leaders");
            if (res.ok) {
                const data = await res.json();
                setLeaders(data);
            }
        } catch (error) {
            console.error("Failed to fetch leaders", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    // List Management Helpers
    // List Management Helpers
    const addItem = (listName: 'research', value: string, valueEn: string) => {
        if (!value.trim()) return;
        setResearchList([...researchList, value]);
        setResearchEnList([...researchEnList, valueEn || value]);
        setResearchInput("");
        setResearchEnInput("");
    };

    const addDetailedItem = (listName: 'education' | 'career') => {
        if (listName === 'education') {
            const { description, descriptionEn, startYear, endYear } = educationInputs;
            if (!description.trim()) return;

            let formattedString = description;
            let formattedStringEn = descriptionEn || description;
            if (startYear || endYear) {
                const yearSuffix = ` (${startYear || '?'}-${endYear || 'sekarang'})`;
                const yearSuffixEn = ` (${startYear || '?'}-${endYear || 'present'})`;
                formattedString += yearSuffix;
                formattedStringEn += yearSuffixEn;
            }

            setEducationList([...educationList, formattedString]);
            setEducationEnList([...educationEnList, formattedStringEn]);
            setEducationInputs({ description: "", descriptionEn: "", startYear: "", endYear: "" });
        } else {
            const { description, descriptionEn, startYear, endYear } = careerInputs;
            if (!description.trim()) return;

            let formattedString = description;
            let formattedStringEn = descriptionEn || description;
            if (startYear || endYear) {
                const yearSuffix = ` (${startYear || '?'}-${endYear || 'sekarang'})`;
                const yearSuffixEn = ` (${startYear || '?'}-${endYear || 'present'})`;
                formattedString += yearSuffix;
                formattedStringEn += yearSuffixEn;
            }

            setCareerList([...careerList, formattedString]);
            setCareerEnList([...careerEnList, formattedStringEn]);
            setCareerInputs({ description: "", descriptionEn: "", startYear: "", endYear: "" });
        }
    };

    const removeItem = (listName: 'education' | 'career' | 'research' | 'educationEn' | 'careerEn' | 'researchEn', index: number) => {
        if (listName === 'education') {
            setEducationList(educationList.filter((_, i) => i !== index));
        } else if (listName === 'educationEn') {
            setEducationEnList(educationEnList.filter((_, i) => i !== index));
        } else if (listName === 'career') {
            setCareerList(careerList.filter((_, i) => i !== index));
        } else if (listName === 'careerEn') {
            setCareerEnList(careerEnList.filter((_, i) => i !== index));
        } else if (listName === 'research') {
            setResearchList(researchList.filter((_, i) => i !== index));
        } else if (listName === 'researchEn') {
            setResearchEnList(researchEnList.filter((_, i) => i !== index));
        }
    };

    const updateListItemEn = (listName: 'educationEn' | 'careerEn' | 'researchEn', index: number, newValue: string) => {
        if (listName === 'educationEn') {
            const newList = [...educationEnList];
            newList[index] = newValue;
            setEducationEnList(newList);
        } else if (listName === 'careerEn') {
            const newList = [...careerEnList];
            newList[index] = newValue;
            setCareerEnList(newList);
        } else if (listName === 'researchEn') {
            const newList = [...researchEnList];
            newList[index] = newValue;
            setResearchEnList(newList);
        }
    };

    const translateList = async (list: string[], callback: (list: string[]) => void) => {
        if (list.length === 0) return;
        try {
            const translatedList = await Promise.all(list.map(async (item) => {
                const res = await fetch('/api/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: item, targetLanguage: 'English' })
                });
                const data = await res.json();
                return data.translatedText || item;
            }));
            callback(translatedList);
        } catch (error) {
            console.error("List translation failed", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('title', formData.title);
            submitData.append('category', formData.category);
            submitData.append('email', formData.email);
            submitData.append('scholar', formData.scholar);
            submitData.append('vision', formData.vision);
            submitData.append('education', JSON.stringify(educationList));
            submitData.append('educationEn', JSON.stringify(educationEnList));
            submitData.append('career', JSON.stringify(careerList));
            submitData.append('careerEn', JSON.stringify(careerEnList));
            submitData.append('research', JSON.stringify(researchList));
            submitData.append('researchEn', JSON.stringify(researchEnList));
            submitData.append('titleEn', formData.titleEn || "");
            submitData.append('visionEn', formData.visionEn || "");
            submitData.append('order', formData.order.toString());

            if (file) {
                submitData.append('image', file);
            }

            let url = "/api/admin/leaders";
            let method = "POST";

            if (editingId) {
                method = "PUT";
                submitData.append('id', editingId);
            }

            const res = await fetch(url, {
                method: method,
                body: submitData,
            });

            if (res.ok) {
                fetchLeaders();
                closeModal();
                alert(editingId ? "Data pimpinan berhasil diperbarui!" : "Pimpinan berhasil ditambahkan!");
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

    const handleEdit = (item: Leader) => {
        setFormData({
            name: item.name,
            title: item.title,
            titleEn: item.titleEn || "",
            category: item.category,
            email: item.email || "",
            scholar: item.scholar || "",
            vision: item.vision || "",
            visionEn: item.visionEn || "",
            order: item.order || 0,
        });
        setEducationList(item.education || []);
        setEducationEnList(item.educationEn || []);
        setCareerList(item.career || []);
        setCareerEnList(item.careerEn || []);
        setResearchList(item.research || []);
        setResearchEnList(item.researchEn || []);
        setEducationInputs({ description: "", descriptionEn: "", startYear: "", endYear: "" });
        setCareerInputs({ description: "", descriptionEn: "", startYear: "", endYear: "" });
        setResearchInput("");
        setResearchEnInput("");
        setEditingId(item.id);
        setFile(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Hapus "${name}" dari daftar pimpinan?`)) return;
        try {
            const res = await fetch(`/api/admin/leaders?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchLeaders();
            } else {
                alert("Gagal menghapus.");
            }
        } catch (e) {
            alert("Error deleting leader.");
        }
    };

    const openCreateModal = () => {
        setEditingId(null);
        setFormData({
            name: "",
            title: "",
            titleEn: "",
            category: "Dekan",
            email: "",
            scholar: "",
            vision: "",
            visionEn: "",
            order: 0
        });
        setEducationList([]);
        setEducationEnList([]);
        setCareerList([]);
        setCareerEnList([]);
        setResearchList([]);
        setResearchEnList([]);
        setEducationInputs({ description: "", descriptionEn: "", startYear: "", endYear: "" });
        setCareerInputs({ description: "", descriptionEn: "", startYear: "", endYear: "" });
        setResearchInput("");
        setResearchEnInput("");
        setFile(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setEducationInputs({ description: "", descriptionEn: "", startYear: "", endYear: "" });
        setCareerInputs({ description: "", descriptionEn: "", startYear: "", endYear: "" });
        setResearchInput("");
        setResearchEnInput("");
    };

    const filteredLeaders = leaders.filter(l =>
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Manajemen Pimpinan</h1>
                    <p className="text-gray-500">Kelola profil Rektorat dan Dekanat.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2 bg-unaicNavy text-white rounded-lg hover:bg-unaicBlue transition shadow-lg"
                >
                    <Plus size={20} /> Tambah Dosen/Pimpinan
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Cari nama atau jabatan..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-unaicBlue focus:border-transparent outline-none transition"
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
                    {filteredLeaders.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 line-clamp-1">{item.name}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-1">{item.title}</p>
                                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 mt-1 inline-block">{item.category}</span>
                                </div>
                            </div>
                            <div className="flex gap-2 pt-2 border-t border-gray-100">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="flex-1 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id, item.name)}
                                    className="p-1.5 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">{editingId ? "Edit Profil" : "Tambah Pimpinan Baru"}</h2>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Image Upload */}
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                {/* Image Upload */}
                                <div className="flex flex-col items-center gap-3">
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-28 h-28 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 cursor-pointer hover:border-unaicBlue hover:text-unaicBlue overflow-hidden relative bg-gray-50"
                                    >
                                        {file ? (
                                            <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <Upload size={32} />
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <p className="font-medium text-sm text-gray-700">Foto Profil</p>
                                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                                    </div>
                                </div>

                                {/* Basic Info */}
                                <div className="flex-1 grid grid-cols-1 gap-4 w-full">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700">Nama Lengkap & Gelar</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-unaicBlue outline-none"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700">Kategori</label>
                                            <select
                                                className="w-full p-2.5 rounded-lg border border-gray-300 outline-none"
                                                value={formData.category}
                                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            >
                                                <option value="Rektor">Rektor</option>
                                                <option value="Wakil Rektor">Wakil Rektor</option>
                                                <option value="Dekan">Dekan</option>
                                                <option value="Lainnya">Lainnya</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-sm font-bold text-gray-700">Jabatan Formal (ID)</label>
                                            <button
                                                type="button"
                                                onClick={() => translateField(formData.title, (val) => setFormData({ ...formData, titleEn: val }))}
                                                className="text-[10px] text-blue-600 hover:text-blue-800 font-bold"
                                            >
                                                Auto-Translate ➔ EN
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-unaicBlue outline-none"
                                            placeholder="Contoh: Wakil Rektor III Bidang Kemahasiswaan"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            className="w-full p-2.5 rounded-lg border border-gray-300 bg-blue-50/20 outline-none mt-1"
                                            placeholder="Formal Title (EN)..."
                                            value={formData.titleEn}
                                            onChange={e => setFormData({ ...formData, titleEn: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Urutan Tampil (Order)</label>
                                        <input
                                            type="number"
                                            className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-unaicBlue outline-none"
                                            placeholder="0"
                                            value={formData.order}
                                            onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact & Vision Section - New */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Email Kontak</label>
                                    <input
                                        type="email"
                                        className="w-full p-2.5 rounded-lg border border-gray-300 outline-none"
                                        placeholder="contoh@unaic.ac.id"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Link Google Scholar</label>
                                    <input
                                        type="url"
                                        className="w-full p-2.5 rounded-lg border border-gray-300 outline-none"
                                        placeholder="https://scholar.google.com/..."
                                        value={formData.scholar}
                                        onChange={e => setFormData({ ...formData, scholar: e.target.value })}
                                    />
                                </div>

                                <div className="col-span-full space-y-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-sm font-bold text-gray-700">Visi & Komitmen (ID)</label>
                                        <button
                                            type="button"
                                            onClick={() => translateField(formData.vision || "", (val) => setFormData({ ...formData, visionEn: val }))}
                                            className="text-[10px] text-blue-600 hover:text-blue-800 font-bold"
                                        >
                                            Auto-Translate ➔ EN
                                        </button>
                                    </div>
                                    <textarea
                                        className="w-full p-2.5 rounded-lg border border-gray-300 outline-none h-24"
                                        placeholder="Masukkan visi atau komitmen pimpinan..."
                                        value={formData.vision}
                                        onChange={e => setFormData({ ...formData, vision: e.target.value })}
                                    />
                                    <textarea
                                        className="w-full p-2.5 rounded-lg border border-gray-300 bg-blue-50/20 outline-none h-24 mt-1"
                                        placeholder="Vision & Commitment (EN)..."
                                        value={formData.visionEn}
                                        onChange={e => setFormData({ ...formData, visionEn: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Dynamic Lists */}
                            {/* Education Section */}
                            <div className="space-y-4 border-t border-gray-100 pt-6">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-sm font-bold text-gray-700">Riwayat Pendidikan</label>
                                    <button
                                        type="button"
                                        onClick={() => translateList(educationList, setEducationEnList)}
                                        className="text-[10px] text-blue-600 hover:text-blue-800 font-bold"
                                    >
                                        Translate List ➔ EN
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                                    <div className="md:col-span-6 space-y-2">
                                        <input
                                            type="text"
                                            className="w-full p-2.5 rounded-lg border border-gray-300 outline-none text-sm"
                                            placeholder="Institusi & Jurusan (ID)"
                                            value={educationInputs.description}
                                            onChange={e => setEducationInputs({ ...educationInputs, description: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            className="w-full p-2.5 rounded-lg border border-gray-300 bg-blue-50/20 outline-none text-sm"
                                            placeholder="Institution & Major (EN)"
                                            value={educationInputs.descriptionEn}
                                            onChange={e => setEducationInputs({ ...educationInputs, descriptionEn: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-4 grid grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            className="p-2.5 rounded-lg border border-gray-300 outline-none text-sm h-fit"
                                            placeholder="Thn Mulai"
                                            value={educationInputs.startYear}
                                            onChange={e => setEducationInputs({ ...educationInputs, startYear: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            className="p-2.5 rounded-lg border border-gray-300 outline-none text-sm h-fit"
                                            placeholder="Thn Selesai"
                                            value={educationInputs.endYear}
                                            onChange={e => setEducationInputs({ ...educationInputs, endYear: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => addDetailedItem('education')}
                                        className="md:col-span-2 p-2.5 bg-unaicNavy text-white rounded-lg hover:bg-unaicBlue transition shadow-md flex items-center justify-center h-fit"
                                        title="Tambahkan"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Daftar ID</p>
                                        <ul className="space-y-1">
                                            {educationList.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-[11px] bg-gray-50 p-1.5 rounded">
                                                    <button type="button" onClick={() => removeItem('education', idx)} className="text-red-400 hover:text-red-600 mt-0.5">
                                                        <MinusCircle size={14} />
                                                    </button>
                                                    <span className="flex-1 text-gray-600">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase mb-1 text-blue-600">Daftar EN</p>
                                        <ul className="space-y-1">
                                            {educationEnList.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-[11px] bg-blue-50/30 p-1.5 rounded border border-blue-100/50">
                                                    <button type="button" onClick={() => removeItem('educationEn', idx)} className="text-red-400 hover:text-red-600 mt-0.5">
                                                        <MinusCircle size={14} />
                                                    </button>
                                                    <input
                                                        className="flex-1 bg-transparent text-gray-600 italic outline-none border-b border-transparent focus:border-blue-400 transition"
                                                        value={item}
                                                        onChange={(e) => updateListItemEn('educationEn', idx, e.target.value)}
                                                    />
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Career Section */}
                            <div className="space-y-4 border-t border-gray-100 pt-6">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-sm font-bold text-gray-700">Riwayat Karir</label>
                                    <button
                                        type="button"
                                        onClick={() => translateList(careerList, setCareerEnList)}
                                        className="text-[10px] text-blue-600 hover:text-blue-800 font-bold"
                                    >
                                        Translate List ➔ EN
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                                    <div className="md:col-span-6 space-y-2">
                                        <input
                                            type="text"
                                            className="w-full p-2.5 rounded-lg border border-gray-300 outline-none text-sm"
                                            placeholder="Jabatan & Instansi (ID)"
                                            value={careerInputs.description}
                                            onChange={e => setCareerInputs({ ...careerInputs, description: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            className="w-full p-2.5 rounded-lg border border-gray-300 bg-blue-50/20 outline-none text-sm"
                                            placeholder="Position & Institution (EN)"
                                            value={careerInputs.descriptionEn}
                                            onChange={e => setCareerInputs({ ...careerInputs, descriptionEn: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-4 grid grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            className="p-2.5 rounded-lg border border-gray-300 outline-none text-sm h-fit"
                                            placeholder="Thn Mulai"
                                            value={careerInputs.startYear}
                                            onChange={e => setCareerInputs({ ...careerInputs, startYear: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            className="p-2.5 rounded-lg border border-gray-300 outline-none text-sm h-fit"
                                            placeholder="Thn Selesai"
                                            value={careerInputs.endYear}
                                            onChange={e => setCareerInputs({ ...careerInputs, endYear: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => addDetailedItem('career')}
                                        className="md:col-span-2 p-2.5 bg-unaicNavy text-white rounded-lg hover:bg-unaicBlue transition shadow-md flex items-center justify-center h-fit"
                                        title="Tambahkan"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Daftar ID</p>
                                        <ul className="space-y-1">
                                            {careerList.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-[11px] bg-gray-50 p-1.5 rounded">
                                                    <button type="button" onClick={() => removeItem('career', idx)} className="text-red-400 hover:text-red-600 mt-0.5">
                                                        <MinusCircle size={14} />
                                                    </button>
                                                    <span className="flex-1 text-gray-600">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase mb-1 text-blue-600">Daftar EN</p>
                                        <ul className="space-y-1">
                                            {careerEnList.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-[11px] bg-blue-50/30 p-1.5 rounded border border-blue-100/50">
                                                    <button type="button" onClick={() => removeItem('careerEn', idx)} className="text-red-400 hover:text-red-600 mt-0.5">
                                                        <MinusCircle size={14} />
                                                    </button>
                                                    <input
                                                        className="flex-1 bg-transparent text-gray-600 italic outline-none border-b border-transparent focus:border-blue-400 transition"
                                                        value={item}
                                                        onChange={(e) => updateListItemEn('careerEn', idx, e.target.value)}
                                                    />
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Research Section (Simple List) */}
                            <div className="space-y-4 border-t border-gray-100 pt-6">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-sm font-bold text-gray-700">Fokus Penelitian</label>
                                    <button
                                        type="button"
                                        onClick={() => translateList(researchList, setResearchEnList)}
                                        className="text-[10px] text-blue-600 hover:text-blue-800 font-bold"
                                    >
                                        Translate List ➔ EN
                                    </button>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            className="flex-1 p-2.5 rounded-lg border border-gray-300 outline-none text-sm"
                                            placeholder="Topik Penelitian (ID)"
                                            value={researchInput}
                                            onChange={e => setResearchInput(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem('research', researchInput, researchEnInput))}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => addItem('research', researchInput, researchEnInput)}
                                            className="p-2.5 bg-unaicNavy text-white rounded-lg hover:bg-unaicBlue transition shadow-md"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full p-2.5 rounded-lg border border-gray-300 bg-blue-50/20 outline-none text-sm"
                                        placeholder="Research Topic (EN)"
                                        value={researchEnInput}
                                        onChange={e => setResearchEnInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem('research', researchInput, researchEnInput))}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Daftar ID</p>
                                        <ul className="space-y-1">
                                            {researchList.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-[11px] bg-gray-50 p-1.5 rounded">
                                                    <button type="button" onClick={() => removeItem('research', idx)} className="text-red-400 hover:text-red-600 mt-0.5">
                                                        <MinusCircle size={14} />
                                                    </button>
                                                    <span className="flex-1 text-gray-600">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase mb-1 text-blue-600">Daftar EN</p>
                                        <ul className="space-y-1">
                                            {researchEnList.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-[11px] bg-blue-50/30 p-1.5 rounded border border-blue-100/50">
                                                    <button type="button" onClick={() => removeItem('researchEn', idx)} className="text-red-400 hover:text-red-600 mt-0.5">
                                                        <MinusCircle size={14} />
                                                    </button>
                                                    <input
                                                        className="flex-1 bg-transparent text-gray-600 italic outline-none border-b border-transparent focus:border-blue-400 transition"
                                                        value={item}
                                                        onChange={(e) => updateListItemEn('researchEn', idx, e.target.value)}
                                                    />
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                                <button type="button" onClick={closeModal} className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition">
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 rounded-xl font-bold bg-unaicNavy text-white hover:bg-unaicBlue transition shadow-lg disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Menyimpan...</> : "Simpan Data"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
