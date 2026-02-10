"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TuitionFaculty } from "@/types/tuition";
import { Info, Check } from "lucide-react";

interface TuitionTableProps {
    data: TuitionFaculty[];
}

export default function TuitionTable({ data }: TuitionTableProps) {
    const [activeFacultyId, setActiveFacultyId] = useState(data[0].id);

    const activeFaculty = data.find((f) => f.id === activeFacultyId) || data[0];

    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            {/* Faculty Tabs */}
            <div className="flex flex-wrap border-b border-gray-200 bg-gray-50/50">
                {data.map((faculty) => (
                    <button
                        key={faculty.id}
                        onClick={() => setActiveFacultyId(faculty.id)}
                        className={`flex-1 min-w-[200px] px-6 py-5 text-sm md:text-base font-bold transition-all duration-300 relative ${activeFacultyId === faculty.id
                                ? "text-unaicNavy bg-white"
                                : "text-gray-500 hover:text-unaicNavy hover:bg-gray-100"
                            }`}
                    >
                        {faculty.name}
                        {activeFacultyId === faculty.id && (
                            <motion.div
                                layoutId="activeTabIndicator"
                                className="absolute bottom-0 left-0 right-0 h-1 bg-unaicGold"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="p-6 md:p-10 bg-white">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeFacultyId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-12"
                    >
                        {activeFaculty.categories.map((category, idx) => (
                            <div key={idx} className="border border-gray-100 rounded-2xl p-6 md:p-8 bg-gray-50/30">
                                <h3 className="text-xl font-heading font-bold text-unaicNavy mb-6 flex items-center gap-2 border-l-4 border-unaicGold pl-3">
                                    {category.name}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {category.programs.map((program, pIdx) => (
                                        <div
                                            key={pIdx}
                                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
                                        >
                                            <h4 className="font-bold text-lg text-gray-800 mb-4 border-b border-gray-100 pb-2">
                                                {program.name}
                                            </h4>
                                            <ul className="space-y-3">
                                                {program.fees.map((fee, fIdx) => (
                                                    <li key={fIdx} className="flex justify-between items-start text-sm">
                                                        <span className="text-gray-500 w-1/2">{fee.label}</span>
                                                        <span className="font-bold text-unaicNavy w-1/2 text-right">{fee.amount}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            {program.note && (
                                                <p className="mt-4 text-xs text-orange-600 bg-orange-50 p-2 rounded border border-orange-100 italic">
                                                    *{program.note}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Common Note */}
                                {category.commonNote && (
                                    <div className="mt-6 flex items-start gap-3 text-sm text-gray-600 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                                        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                        <p>{category.commonNote}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
