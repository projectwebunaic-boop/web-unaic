"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ChevronDown, ChevronUp, GraduationCap, Calendar, Award } from "lucide-react";
import { Link } from "@/i18n/routing";
import { programAccreditations, ProgramAccreditation } from "@/data/accreditation";

// Grouping helper
const groupByFaculty = (data: ProgramAccreditation[]) => {
    return data.reduce((groups, item) => {
        (groups[item.faculty] = groups[item.faculty] || []).push(item);
        return groups;
    }, {} as Record<string, ProgramAccreditation[]>);
};

export default function ProgramTable() {
    const groupedData = groupByFaculty(programAccreditations);
    // Default open all or specific logic can be added here
    const [openFaculties, setOpenFaculties] = useState<Record<string, boolean>>(
        Object.keys(groupedData).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    const toggleFaculty = (faculty: string) => {
        setOpenFaculties(prev => ({ ...prev, [faculty]: !prev[faculty] }));
    };

    return (
        <div className="space-y-8">
            {Object.entries(groupedData).map(([faculty, programs], index) => (
                <motion.div
                    key={faculty}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm"
                >
                    {/* Faculty Header (Accordion Trigger) */}
                    <button
                        onClick={() => toggleFaculty(faculty)}
                        className="w-full bg-gray-50 p-5 flex items-center justify-between hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm text-unaicNavy">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 text-left">{faculty}</h3>
                            <span className="bg-unaicBlue/10 text-unaicBlue text-xs font-bold px-2.5 py-1 rounded-full">
                                {programs.length} Prodi
                            </span>
                        </div>
                        {openFaculties[faculty] ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                    </button>

                    {/* Table Content */}
                    <AnimatePresence>
                        {openFaculties[faculty] && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-t border-gray-100">
                                        <thead className="bg-white text-gray-500 text-xs uppercase font-semibold">
                                            <tr>
                                                <th className="px-6 py-4 w-16">No</th>
                                                <th className="px-6 py-4">Program Studi</th>
                                                <th className="px-6 py-4">Jenjang</th>
                                                <th className="px-6 py-4">Peringkat</th>
                                                <th className="px-6 py-4">No. SK & Masa Berlaku</th>
                                                <th className="px-6 py-4 text-right">Sertifikat</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {programs.map((program, idx) => (
                                                <tr key={program.id} className="hover:bg-blue-50/30 transition-colors">
                                                    <td className="px-6 py-4 text-gray-400 font-medium">{idx + 1}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-bold text-gray-800 block">{program.program}</span>
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
                                                                Berlaku s.d {program.expiryDate}
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
                        )}
                    </AnimatePresence>
                </motion.div>
            ))}
        </div>
    );
}
