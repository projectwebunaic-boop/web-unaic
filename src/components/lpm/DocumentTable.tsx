"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, Download, Filter } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";

interface DocumentItem {
    id: string;
    title: string;
    titleEn?: string;
    category: string;
    year: string;
    url: string;
}

interface DocumentTableProps {
    documents: DocumentItem[];
}

export default function DocumentTable({ documents }: DocumentTableProps) {
    const locale = useLocale();
    const t = useTranslations("LPM");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ["All", ...Array.from(new Set(documents.map((doc) => doc.category)))];

    const filteredDocs = documents.filter((doc) => {
        const title = locale === 'en' ? (doc.titleEn || doc.title) : doc.title;
        const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header & Filter */}
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder={t("searchPlaceholder")}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-unaicBlue focus:ring-2 focus:ring-unaicBlue/20 transition-all outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <Filter className="text-gray-400 w-5 h-5 shrink-0" />
                        <div className="flex gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat
                                        ? "bg-unaicNavy text-white"
                                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    {cat === "All" ? t("categoryAll") : cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Table List */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm font-semibold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">{t("tableDocName")}</th>
                            <th className="px-6 py-4">{t("tableCategory")}</th>
                            <th className="px-6 py-4">{t("tableYear")}</th>
                            <th className="px-6 py-4 text-right">{t("tableAction")}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        <AnimatePresence mode="popLayout">
                            {filteredDocs.length > 0 ? (
                                filteredDocs.map((doc, index) => (
                                    <motion.tr
                                        key={doc.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-blue-50/50 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-blue-100/50 flex items-center justify-center text-unaicBlue group-hover:bg-unaicBlue group-hover:text-white transition-colors">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <span className="font-medium text-gray-800">{locale === 'en' ? (doc.titleEn || doc.title) : doc.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {doc.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">{doc.year}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={doc.url}
                                                target="_blank"
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 font-medium text-sm hover:bg-unaicNavy hover:text-white hover:border-unaicNavy transition-all shadow-sm"
                                            >
                                                <Download className="w-4 h-4" />
                                                {t("download")}
                                            </Link>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <FileText className="w-12 h-12 text-gray-300" />
                                            <p>{t("noDocuments")}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
