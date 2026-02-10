"use client";

import { useState, useEffect } from "react";
import {
    ShieldAlert,
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    CheckCircle,
    XCircle,
    Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock Data for MVP (Will replace with API fetch)
const MOCK_COMPLAINTS = [
    {
        id: "TIC-001",
        date: "2024-03-20",
        category: "Fasilitas",
        title: "AC di Ruang 304 Mati Total",
        reporter: "Anonim",
        status: "pending", // pending, process, done, rejected
        desc: "AC tidak dingin sama sekali sejak pagi, mohon diperbaiki karena panas."
    },
    {
        id: "TIC-002",
        date: "2024-03-19",
        category: "Akademik",
        title: "Nilai MK Anatomi Belum Keluar",
        reporter: "Budi Santoso",
        status: "process",
        desc: "Saya sudah ujian susulan tapi nilai di SIAKAD masih kosong."
    },
    {
        id: "TIC-003",
        date: "2024-03-18",
        category: "Etik",
        title: "Laporan Dugaan Pungli Parkir",
        reporter: "Anonim",
        status: "pending",
        desc: "Ada oknum yang meminta uang parkir padahal seharusnya gratis bagi mahasiswa."
    }
];

export default function ComplaintAdmin() {
    const [complaints, setComplaints] = useState<any[]>([]);
    const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch data from API
    const fetchComplaints = async () => {
        setIsLoading(true);
        try {
            // Add cache busting to ensure fresh data
            const res = await fetch('/api/admin/aduan?t=' + Date.now());
            if (res.ok) {
                const data = await res.json();
                setComplaints(data);
            }
        } catch (error) {
            console.error("Failed to fetch complaints:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch('/api/admin/aduan', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });

            if (res.ok) {
                // Update local state
                setComplaints(prev => prev.map(item =>
                    item.id === id ? { ...item, status: newStatus } : item
                ));
                // Update selected item if open
                if (selectedComplaint && selectedComplaint.id === id) {
                    setSelectedComplaint({ ...selectedComplaint, status: newStatus });
                }
                alert(`Status berhasil diubah menjadi ${newStatus}`);
                if (newStatus === 'done' || newStatus === 'rejected') {
                    setSelectedComplaint(null); // Close modal on finish
                }
            } else {
                alert("Gagal mengupdate status.");
            }
        } catch (error) {
            alert("Terjadi kesalahan sistem.");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold border border-yellow-200">Pending</span>;
            case 'process': return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold border border-blue-200">Diproses</span>;
            case 'done': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">Selesai</span>;
            case 'rejected': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200">Ditolak</span>;
            default: return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">Unknown</span>;
        }
    };



    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <ShieldAlert className="text-unaicNavy" />
                        Manajemen Aduan
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Pantau dan tindak lanjuti laporan masuk.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={fetchComplaints} className="p-2 border border-gray-200 rounded-lg hover:bg-blue-50 text-blue-600" title="Refresh Data">
                        <Clock size={20} />
                    </button>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Cari Tiket / Judul..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID & Tgl</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Judul Laporan</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : complaints.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        Belum ada aduan masuk.
                                    </td>
                                </tr>
                            ) : (
                                complaints.map((item) => (
                                    <tr key={item.id} className="hover:bg-blue-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded mr-2">{item.id}</span>
                                            <div className="text-xs text-gray-500 mt-1">{item.date}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-gray-700">{item.category}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-800">{item.title}</div>
                                            <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">{item.desc}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(item.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setSelectedComplaint(item)}
                                                className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center justify-end gap-1 ml-auto"
                                            >
                                                <Eye size={16} /> Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedComplaint && (
                    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
                        >
                            <div className="px-8 py-6 border-b flex justify-between items-start bg-gray-50">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="font-bold text-xl text-gray-800">#{selectedComplaint.id}</span>
                                        {getStatusBadge(selectedComplaint.status)}
                                    </div>
                                    <h2 className="text-lg text-gray-600 leading-tight">{selectedComplaint.title}</h2>
                                </div>
                                <button onClick={() => setSelectedComplaint(null)} className="text-gray-400 hover:text-gray-600">
                                    <XCircle size={28} />
                                </button>
                            </div>

                            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="block text-gray-500 mb-1">Pelapor</span>
                                        <span className="font-semibold text-gray-800">{selectedComplaint.reporter}</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500 mb-1">Tanggal</span>
                                        <span className="font-semibold text-gray-800">{selectedComplaint.date}</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500 mb-1">Kategori</span>
                                        <span className="font-semibold text-gray-800">{selectedComplaint.category}</span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <span className="block text-gray-500 mb-2 text-sm font-bold uppercase">Isi Laporan</span>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {selectedComplaint.desc}
                                    </p>
                                </div>

                                <div>
                                    <span className="block text-gray-500 mb-2 text-sm font-bold uppercase">Bukti Lampiran</span>
                                    {selectedComplaint.imageUrl ? (
                                        <div className="w-full rounded-lg overflow-hidden border border-gray-200">
                                            <a href={selectedComplaint.imageUrl} target="_blank" rel="noopener noreferrer">
                                                <img
                                                    src={selectedComplaint.imageUrl}
                                                    alt="Bukti Laporan"
                                                    className="w-full h-auto max-h-96 object-contain bg-gray-50 hover:opacity-95 transition-opacity cursor-zoom-in"
                                                />
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200">
                                            Tidak ada lampiran gambar
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="px-8 py-6 bg-gray-50 border-t flex justify-end gap-3">
                                {selectedComplaint.status !== 'rejected' && (
                                    <button
                                        onClick={() => handleUpdateStatus(selectedComplaint.id, 'rejected')}
                                        className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-red-600 font-medium hover:bg-red-50 transition border-red-200"
                                    >
                                        Tolak / Spam
                                    </button>
                                )}

                                {selectedComplaint.status === 'pending' && (
                                    <button
                                        onClick={() => handleUpdateStatus(selectedComplaint.id, 'process')}
                                        className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-lg flex items-center gap-2"
                                    >
                                        <CheckCircle size={18} /> Proses Aduan
                                    </button>
                                )}

                                {selectedComplaint.status === 'process' && (
                                    <button
                                        onClick={() => handleUpdateStatus(selectedComplaint.id, 'done')}
                                        className="px-5 py-2.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition shadow-lg flex items-center gap-2"
                                    >
                                        <CheckCircle size={18} /> Tandai Selesai
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
