"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Download, BookOpen, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Subject {
    semester: string;
    course: string;
    credits: string;
}

interface Program {
    name: string;
    pdfUrl: string;
    curriculum: Subject[];
}

interface Faculty {
    name: string;
    programs: Program[];
}

interface CurriculumClientProps {
    data: Faculty[];
    translations: {
        description: string;
        semester: string;
        course: string;
        credits: string;
        download: string;
        noData: string;
    };
}

export default function CurriculumClient({ data, translations }: CurriculumClientProps) {
    const [activeFaculty, setActiveFaculty] = useState<number | null>(0);
    const [activeProgram, setActiveProgram] = useState<number | null>(0);

    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <AlertCircle size={48} className="text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">{translations.noData}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar: Faculties & Programs */}
            <div className="lg:col-span-4 space-y-4">
                <p className="text-sm text-gray-500 mb-6 px-2">{translations.description}</p>

                {data.map((faculty, fIdx) => (
                    <div key={fIdx} className="space-y-2">
                        <button
                            onClick={() => {
                                setActiveFaculty(activeFaculty === fIdx ? null : fIdx);
                                setActiveProgram(0);
                            }}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${activeFaculty === fIdx
                                    ? "bg-unaicNavy text-white shadow-xl shadow-unaicNavy/20"
                                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-100"
                                }`}
                        >
                            <span className="font-bold text-left">{faculty.name}</span>
                            {activeFaculty === fIdx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>

                        <AnimatePresence>
                            {activeFaculty === fIdx && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden space-y-2 pl-4"
                                >
                                    {faculty.programs.map((program, pIdx) => (
                                        <button
                                            key={pIdx}
                                            onClick={() => setActiveProgram(pIdx)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm transition-all ${activeProgram === pIdx
                                                    ? "bg-blue-50 text-unaicNavy font-bold border-l-4 border-unaicNavy"
                                                    : "text-gray-600 hover:bg-gray-50 border-l-4 border-transparent"
                                                }`}
                                        >
                                            <BookOpen size={16} />
                                            <span className="text-left">{program.name}</span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>

            {/* Main Content: Curriculum Table */}
            <div className="lg:col-span-8">
                <AnimatePresence mode="wait">
                    {activeFaculty !== null && activeProgram !== null && data[activeFaculty]?.programs[activeProgram] ? (
                        <motion.div
                            key={`${activeFaculty}-${activeProgram}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden"
                        >
                            <div className="p-6 md:p-8 bg-gray-50/50 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-800 tracking-tight">
                                        {data[activeFaculty].programs[activeProgram].name}
                                    </h2>
                                    <p className="text-sm text-gray-500 font-medium">
                                        {data[activeFaculty].name}
                                    </p>
                                </div>
                                {data[activeFaculty].programs[activeProgram].pdfUrl !== "#" && (
                                    <a
                                        href={data[activeFaculty].programs[activeProgram].pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-5 py-2.5 bg-unaicNavy text-white rounded-xl text-sm font-bold hover:bg-unaicBlue transition-all shadow-lg shadow-unaicNavy/20 whitespace-nowrap self-start md:self-center"
                                    >
                                        <Download size={18} />
                                        {translations.download}
                                    </a>
                                )}
                            </div>

                            <div className="p-0 overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-white border-b border-gray-100">
                                            <th className="px-6 py-4 text-left font-black text-gray-400 uppercase tracking-widest text-[10px] w-20">
                                                {translations.semester}
                                            </th>
                                            <th className="px-6 py-4 text-left font-black text-gray-400 uppercase tracking-widest text-[10px]">
                                                {translations.course}
                                            </th>
                                            <th className="px-6 py-4 text-center font-black text-gray-400 uppercase tracking-widest text-[10px] w-24">
                                                {translations.credits}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {data[activeFaculty].programs[activeProgram].curriculum.length > 0 ? (
                                            data[activeFaculty].programs[activeProgram].curriculum.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                                                    <td className="px-6 py-4 text-gray-700 font-bold group-hover:text-unaicNavy">
                                                        <span className="bg-gray-100 group-hover:bg-blue-100 px-2 py-1 rounded text-xs transition-colors">
                                                            {item.semester}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-700 font-medium group-hover:text-unaicNavy">
                                                        {item.course}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="font-bold text-gray-800">{item.credits}</span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-12 text-center text-gray-400 italic">
                                                    {translations.noData}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-full flex items-center justify-center p-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                            <p className="text-gray-400 font-medium">Silakan pilih program studi</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
