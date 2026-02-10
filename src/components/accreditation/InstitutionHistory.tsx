"use client";

import { motion } from "framer-motion";
import { Download, FileCheck, Building2, History } from "lucide-react";
import { Link } from "@/i18n/routing";
import { institutionHistory } from "@/data/accreditation";

export default function InstitutionHistory() {
    return (
        <div className="relative border-l-4 border-unaicBlue/20 ml-6 md:ml-12 space-y-12">
            {institutionHistory.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className="relative pl-8 md:pl-12"
                >
                    {/* Timeline Dot */}
                    <div className={`absolute -left-[14px] top-0 w-6 h-6 rounded-full border-4 border-white ${item.status === 'current' ? 'bg-unaicBlue' : 'bg-gray-400'
                        } shadow-md`} />

                    {/* Content Card */}
                    <div className={`p-6 rounded-2xl border ${item.status === 'current'
                            ? 'bg-white border-unaicBlue/30 shadow-lg shadow-unaicBlue/5'
                            : 'bg-gray-50 border-gray-100 opacity-90'
                        }`}>
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                            <div>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 ${item.status === 'current'
                                        ? 'bg-unaicBlue text-white'
                                        : 'bg-gray-200 text-gray-600'
                                    }`}>
                                    <History className="w-3 h-3" />
                                    {item.year}
                                </span>
                                <h3 className={`text-xl font-bold ${item.status === 'current' ? 'text-unaicNavy' : 'text-gray-700'}`}>
                                    {item.institutionName}
                                </h3>
                            </div>

                            {item.status === 'current' && (
                                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-semibold flex items-center self-start">
                                    <FileCheck className="w-4 h-4 mr-1" />
                                    Terakreditasi Baik Sekali
                                </div>
                            )}
                        </div>

                        <p className="text-gray-600 mb-6 leading-relaxed border-b border-gray-100 pb-4">
                            {item.description}
                        </p>

                        {/* Document Action */}
                        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 hover:border-unaicBlue/30 transition-colors group cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="bg-red-50 p-2.5 rounded-lg text-red-500">
                                    <FileCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm group-hover:text-unaicBlue transition-colors">
                                        {item.docTitle}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {item.docNumber}
                                    </p>
                                </div>
                            </div>
                            <Link
                                href={item.downloadUrl}
                                className="p-2 text-gray-400 hover:text-unaicBlue transition-colors"
                                title="Download Dokumen"
                            >
                                <Download className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
