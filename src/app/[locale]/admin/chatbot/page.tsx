"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Save, X, Search, LogIn, KeyRound } from "lucide-react";

interface KnowledgeItem {
    id: string;
    topics: string[];
    keywords: string[];
    answer: string;
    isActive: boolean;
    isSuggestion?: boolean;
}

export default function ChatbotAdmin() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pin, setPin] = useState("");
    const [data, setData] = useState<KnowledgeItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null);
    const [formData, setFormData] = useState({
        topics: "",
        keywords: "",
        answer: "",
        isActive: true,
        isSuggestion: false
    });

    // Simple Auth Check (Hardcoded for MVP)
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (pin === "1234") { // Default PIN
            setIsAuthenticated(true);
            fetchData();
        } else {
            alert("PIN Salah!");
        }
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/chatbot");
            const jsonData = await res.json();
            if (Array.isArray(jsonData)) {
                setData(jsonData);
            }
        } catch (e) {
            console.error("Failed to fetch data", e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin hapus data ini?")) return;
        try {
            await fetch(`/api/admin/chatbot?id=${id}`, { method: "DELETE" });
            fetchData();
        } catch (e) {
            alert("Gagal menghapus");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            topics: formData.topics.split(",").map(s => s.trim()).filter(s => s),
            keywords: formData.keywords.split(",").map(s => s.trim()).filter(s => s),
            answer: formData.answer,
            isActive: formData.isActive,
            isSuggestion: formData.isSuggestion
        };

        try {
            if (editingItem) {
                // Update
                await fetch("/api/admin/chatbot", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: editingItem.id, ...payload })
                });
            } else {
                // Create
                await fetch("/api/admin/chatbot", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            }
            setIsModalOpen(false);
            fetchData();
        } catch (e) {
            alert("Gagal menyimpan");
        }
    };

    const openModal = (item?: KnowledgeItem) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                topics: item.topics.join(", "),
                keywords: item.keywords.join(", "),
                answer: item.answer,
                isActive: item.isActive,
                isSuggestion: item.isSuggestion || false
            });
        } else {
            setEditingItem(null);
            setFormData({ topics: "", keywords: "", answer: "", isActive: true, isSuggestion: false });
        }
        setIsModalOpen(true);
    };

    const filteredData = data.filter(item =>
        item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                    <div className="flex justify-center mb-6">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <KeyRound className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Chatbot</h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">PIN Akses</label>
                            <input
                                type="password"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Masukkan PIN"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                            Masuk Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Knowledge Base Chatbot</h1>
                        <p className="text-gray-500 mt-1">Kelola jawaban dan pengetahuan pintar untuk asisten virtual.</p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm"
                    >
                        <Plus size={20} /> Tambah Data
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center gap-3">
                    <Search className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari pertanyaan, keyword, atau jawaban..."
                        className="flex-1 outline-none text-gray-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Content Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {isLoading ? (
                        <div className="p-10 text-center text-gray-500">Memuat data...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4 border-b">Topik & Keywords</th>
                                        <th className="p-4 border-b w-1/2">Jawaban (Preview)</th>
                                        <th className="p-4 border-b text-center">Status</th>
                                        <th className="p-4 border-b text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredData.map((item) => (
                                        <tr key={item.id} className="hover:bg-blue-50/30 transition">
                                            <td className="p-4 align-top">
                                                <div className="flex flex-wrap gap-1 mb-2">
                                                    {item.topics.map(t => (
                                                        <span key={t} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-md font-medium">{t}</span>
                                                    ))}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    KW: {item.keywords.join(", ")}
                                                </div>
                                            </td>
                                            <td className="p-4 align-top text-gray-700 text-sm leading-relaxed">
                                                {item.answer.length > 100 ? item.answer.substring(0, 100) + "..." : item.answer}
                                            </td>
                                            <td className="p-4 align-top text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    {item.isActive ? 'Aktif' : 'Nonaktif'}
                                                </span>
                                            </td>
                                            <td className="p-4 align-top text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => openModal(item)}
                                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredData.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="p-8 text-center text-gray-400">Tidak ada data ditemukan.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editingItem ? 'Edit Data' : 'Tambah Data Baru'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Topik (Pisahkan koma)</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder:text-gray-400"
                                        placeholder="Contoh: Pendaftaran, PMB"
                                        value={formData.topics}
                                        onChange={e => setFormData({ ...formData, topics: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                                        value={formData.isActive ? "true" : "false"}
                                        onChange={e => setFormData({ ...formData, isActive: e.target.value === "true" })}
                                    >
                                        <option value="true">Aktif</option>
                                        <option value="false">Nonaktif</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Keywords (Kunci Pencarian)</label>
                                <textarea
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder:text-gray-400"
                                    rows={2}
                                    placeholder="Contoh: cara daftar, registrasi online, buat akun (Pisahkan dengan koma)"
                                    value={formData.keywords}
                                    onChange={e => setFormData({ ...formData, keywords: e.target.value })}
                                />
                                <p className="text-xs text-gray-500 mt-1">Masukkan variasi kata kunci agar pencarian lebih akurat.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Jawaban Bot</label>
                                <textarea
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-sans text-gray-900 placeholder:text-gray-400"
                                    rows={6}
                                    placeholder="Tulis jawaban di sini. Bisa menggunakan **bold** atau list."
                                    value={formData.answer}
                                    onChange={e => setFormData({ ...formData, answer: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isSuggestion"
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    checked={formData.isSuggestion}
                                    onChange={e => setFormData({ ...formData, isSuggestion: e.target.checked })}
                                />
                                <label htmlFor="isSuggestion" className="text-sm font-medium text-gray-700 cursor-pointer">
                                    Tampilkan di Menu Cepat (Suggestion Chips)
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition font-medium"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
                                >
                                    <Save size={18} /> Simpan Data
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
