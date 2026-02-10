"use client";

import { useState } from "react";
import { Search, FileText, Download, Filter } from "lucide-react";
import { Link } from '@/i18n/routing';

interface Document {
    id: string;
    title: string;
    year: number;
    url: string;
    category?: string;
}

interface DocumentBrowserProps {
    documents: Document[];
}

const CATEGORIES = [
    "Semua",
    "VMTS",
    "Tata Pamong",
    "Kemahasiswaan",
    "SDM",
    "Keuangan",
    "Pendidikan",
    "Penelitian",
    "PkM",
    "Luaran",
    "Lainnya"
];

export default function LPMDocumentBrowser({ documents = [] }: DocumentBrowserProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("Semua");

    const filteredDocs = documents.filter((doc) => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === "Semua" ? true : doc.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-unaicNavy mb-6">Semua Dokumen Publik</h2>

            {/* Controls */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">

                {/* Search */}
                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Cari dokumen (contoh: Renstra, Statuta)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-unaicBlue/20 transition-all"
                    />
                </div>

                {/* Categories */}
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                    <Filter size={16} className="text-gray-400 shrink-0 mr-1" />
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${activeCategory === cat
                                ? "bg-unaicNavy text-white shadow-md"
                                : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider font-semibold">
                            <tr>
                                <th className="px-6 py-4">Nama Dokumen</th>
                                <th className="px-6 py-4 w-32">Kategori</th>
                                <th className="px-6 py-4 w-24">Tahun</th>
                                <th className="px-6 py-4 w-32 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredDocs.length > 0 ? (
                                filteredDocs.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                    <FileText size={16} />
                                                </div>
                                                <span className="font-medium text-gray-800">{doc.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 font-medium">
                                                {doc.category || "Umum"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{doc.year}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={doc.url}
                                                target="_blank"
                                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:border-unaicBlue hover:text-unaicBlue transition-colors text-xs font-medium shadow-sm"
                                            >
                                                <Download size={14} /> Unduh
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                        Tidak ada dokumen yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
                {filteredDocs.length > 0 ? (
                    filteredDocs.map((doc) => (
                        <div key={doc.id} className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.03)] hover:shadow-lg transition-all duration-300 space-y-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                        <FileText size={22} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-unaicNavy line-clamp-2 leading-snug">{doc.title}</h3>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="inline-flex px-2.5 py-1 bg-gray-100 rounded-md text-[10px] text-gray-600 font-bold uppercase tracking-wider">
                                                {doc.category || "Umum"}
                                            </span>
                                            <span className="text-xs text-gray-400 font-medium">• {doc.year}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href={doc.url}
                                target="_blank"
                                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm group-hover:border-unaicBlue group-hover:text-unaicBlue transition-colors"
                            >
                                <Download size={16} /> Unduh Dokumen
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-400 py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        Tidak ada dokumen.
                    </div>
                )}
            </div>
        </div>
    );
}
