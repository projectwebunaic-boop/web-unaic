"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileCheck, Building2, History, GraduationCap, ChevronDown, ChevronUp, Award, Calendar } from "lucide-react";
import HeroSection from "@/components/shared/HeroSection";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";

interface HistoryItem {
    id: string;
    year: string;
    institutionName: string;
    institutionNameEn?: string;
    description: string;
    descriptionEn?: string;
    docTitle: string;
    docTitleEn?: string;
    docNumber: string;
    downloadUrl: string;
    status: "current" | "archived";
}

interface FacultyItem {
    id: string;
    name: string;
    nameEn?: string;
}

interface ProgramItem {
    id: string;
    facultyId: string;
    program: string;
    programEn?: string;
    level: "D3" | "D4" | "S1" | "Profesi";
    rank: "Unggul" | "A" | "Baik Sekali" | "B" | "Baik";
    skNumber: string;
    expiryDate: string;
    downloadUrl: string;
}

interface AkreditasiContentProps {
    data: {
        history: HistoryItem[];
        faculties: FacultyItem[];
        programs: ProgramItem[];
    }
}

export default function AkreditasiContent({ data }: AkreditasiContentProps) {
    const t = useTranslations("Accreditation");
    const locale = useLocale();
    const { history, faculties, programs } = data;
    const [activeFaculty, setActiveFaculty] = useState<string>("All");

    // Helper to get faculty name by ID
    const getFacultyName = (id: string) => {
        const fac = faculties.find(f => f.id === id);
        if (!fac) return "Unknown Faculty";
        return locale === 'en' ? (fac.nameEn || fac.name) : fac.name;
    };

    const filteredPrograms = activeFaculty === "All"
        ? programs
        : programs.filter(p => p.facultyId === activeFaculty);

    const groupedPrograms = filteredPrograms.reduce((groups, item) => {
        const facId = item.facultyId;
        (groups[facId] = groups[facId] || []).push(item);
        return groups;
    }, {} as Record<string, ProgramItem[]>);

    return (
        <main className="min-h-screen bg-white pb-20 font-sans">
            <HeroSection
                title={t("title")}
                subtitle={t("subtitle")}
            />

            <div className="container mx-auto px-4 md:px-8 py-12 relative z-10">

                {/* Section 1: Sejarah Legalitas Institusi */}
                <section className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-unaicGold/5 rounded-full blur-3xl -z-10"></div>
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <span className="inline-block px-4 py-1 bg-unaicBlue/10 text-unaicBlue rounded-full text-sm font-bold mb-3">
                            {t("instBadge")}
                        </span>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4 font-heading">
                            {t("instTitle")}
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            {t("instDesc")}
                        </p>
                    </div>

                    <div className="relative border-l-4 border-unaicBlue/20 ml-4 md:ml-12 space-y-12">
                        {history.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="relative pl-8 md:pl-12"
                            >
                                {/* Timeline Dot */}
                                <div className={`absolute -left-[14px] top-0 w-6 h-6 rounded-full border-4 border-white ${item.status === 'current' ? 'bg-unaicBlue' : 'bg-gray-400'} shadow-md`} />

                                {/* Content Card */}
                                <div className={`p-6 rounded-2xl border ${item.status === 'current' ? 'bg-white border-unaicBlue/30 shadow-lg shadow-unaicBlue/5' : 'bg-gray-50 border-gray-100 opacity-90'}`}>
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                        <div>
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 ${item.status === 'current' ? 'bg-unaicBlue text-white' : 'bg-gray-200 text-gray-600'}`}>
                                                <History className="w-3 h-3" />
                                                {item.year}
                                            </span>
                                            <h3 className={`text-xl font-bold font-heading ${item.status === 'current' ? 'text-unaicNavy' : 'text-gray-700'}`}>
                                                {locale === 'en' ? (item.institutionNameEn || item.institutionName) : item.institutionName}
                                            </h3>
                                        </div>
                                        {item.status === 'current' && (
                                            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-semibold flex items-center self-start whitespace-nowrap">
                                                <FileCheck className="w-4 h-4 mr-1" />
                                                {t("excellentAccred")}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-gray-600 mb-6 leading-relaxed border-b border-gray-100 pb-4">
                                        {locale === 'en' ? (item.descriptionEn || item.description) : item.description}
                                    </p>
                                    <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 hover:border-unaicBlue/30 transition-colors group cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-red-50 p-2.5 rounded-lg text-red-500">
                                                <FileCheck className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800 text-sm group-hover:text-unaicBlue transition-colors">
                                                    {locale === 'en' ? (item.docTitleEn || item.docTitle) : item.docTitle}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {item.docNumber}
                                                </p>
                                            </div>
                                        </div>
                                        <Link href={item.downloadUrl} className="p-2 text-gray-400 hover:text-unaicBlue transition-colors">
                                            <Download className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Section 2: Akreditasi Program Studi with Slide Menu */}
                <section id="prodi">
                    <div className="text-center md:text-left mb-10">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2 font-heading">
                            {t("progTitle")}
                        </h2>
                        <p className="text-gray-600 max-w-2xl">
                            {t("progDesc")}
                        </p>
                    </div>

                    {/* SLIDE MENU FILTER */}
                    <div className="overflow-x-auto pb-6 scrollbar-hide mb-6 -mx-4 px-4 md:mx-0 md:px-0">
                        <div className="flex gap-3 min-w-max">
                            <button
                                onClick={() => setActiveFaculty("All")}
                                className={`px-5 py-2.5 rounded-full font-semibold transition-all text-sm flex items-center gap-2 ${activeFaculty === "All"
                                    ? "bg-unaicNavy text-white shadow-lg"
                                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                                    }`}
                            >
                                <Building2 size={16} /> {t("allFaculties")}
                            </button>
                            {faculties.map((fac) => (
                                <button
                                    key={fac.id}
                                    onClick={() => setActiveFaculty(fac.id)}
                                    className={`px-5 py-2.5 rounded-full font-semibold transition-all text-sm flex items-center gap-2 ${activeFaculty === fac.id
                                        ? "bg-unaicNavy text-white shadow-lg"
                                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                                        }`}
                                >
                                    {locale === 'en' ? (fac.nameEn || fac.name) : fac.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* PROGRAMS LIST */}
                    <div className="space-y-8">
                        {Object.entries(groupedPrograms).map(([facultyId, progs], index) => {
                            const facultyName = getFacultyName(facultyId);
                            return (
                                <motion.div
                                    key={facultyId}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm"
                                >
                                    <div className="w-full bg-gray-50 p-5 flex items-center justify-between border-b border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm text-unaicNavy">
                                                <GraduationCap className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800 text-left font-heading">{facultyName}</h3>
                                            <span className="bg-unaicBlue/10 text-unaicBlue text-xs font-bold px-2.5 py-1 rounded-full">
                                                {progs.length} {t("progsCount")}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-white text-gray-500 text-xs uppercase font-semibold border-b border-gray-100">
                                                <tr>
                                                    <th className="px-6 py-4 w-16">{t("tableNo")}</th>
                                                    <th className="px-6 py-4">{t("tableProg")}</th>
                                                    <th className="px-6 py-4">{t("tableLevel")}</th>
                                                    <th className="px-6 py-4">{t("tableRank")}</th>
                                                    <th className="px-6 py-4">{t("tableSK")}</th>
                                                    <th className="px-6 py-4 text-right">{t("tableCert")}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {progs.map((program, idx) => (
                                                    <tr key={program.id} className="hover:bg-blue-50/30 transition-colors">
                                                        <td className="px-6 py-4 font-medium text-gray-400">{idx + 1}</td>
                                                        <td className="px-6 py-4">
                                                            <span className="font-bold text-gray-800 block">{locale === 'en' ? (program.programEn || program.program) : program.program}</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded">
                                                                {program.level}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-1.5">
                                                                <Award className={`w-4 h-4 ${program.rank === 'Unggul' ? 'text-green-500' : 'text-blue-500'}`} />
                                                                <span className={`font-semibold ${program.rank === 'Unggul' ? 'text-green-700' : 'text-blue-700'}`}>
                                                                    {program.rank}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm">
                                                                <p className="text-gray-800 font-medium mb-1">{program.skNumber}</p>
                                                                <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                                                    <Calendar className="w-3.5 h-3.5" />
                                                                    {t("validUntil")} {program.expiryDate}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <Link
                                                                href={program.downloadUrl}
                                                                className="inline-flex items-center justify-center p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-unaicBlue hover:border-unaicBlue hover:bg-blue-50 transition-all"
                                                                title="Download Sertifikat"
                                                            >
                                                                <Download className="w-4 h-4" />
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            );
                        })}
                        {Object.keys(groupedPrograms).length === 0 && (
                            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-gray-500">
                                {t("noData")}
                            </div>
                        )}
                    </div>

                </section>
            </div>
        </main>
    );
}
