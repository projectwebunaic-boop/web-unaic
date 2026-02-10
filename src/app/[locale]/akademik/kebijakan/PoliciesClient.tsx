"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";

interface AcademicPolicy {
    id: string;
    title: string;
    titleEn: string | null;
    description: string;
    descriptionEn: string | null;
    pdfUrl: string;
    purpose: string | null;
    purposeEn: string | null;
    scope: string | null;
    scopeEn: string | null;
    lastUpdate: string | null;
    responsible: string | null;
    responsibleEn: string | null;
}

interface PoliciesClientProps {
    policies: AcademicPolicy[];
    locale: string;
}

export default function PoliciesClient({ policies, locale }: PoliciesClientProps) {
    const [expandedCard, setExpandedCard] = useState<string | null>(null);
    const t = useTranslations("AcademicPolicy");
    const isEn = locale === 'en';

    const toggleAccordion = (id: string) => {
        setExpandedCard(expandedCard === id ? null : id);
    };

    const slideUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    };

    return (
        <section className="max-w-7xl mx-auto px-4 py-16">
            <motion.div
                className="text-center mb-12"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={slideUpVariants}
            >
                <h2 className="text-3xl font-bold text-[#0A2E5C] mb-2">{t("sectionTitle")}</h2>
                <div className="w-20 h-1 bg-[#FFD700] mx-auto mb-6 rounded"></div>
            </motion.div>

            {policies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {policies.map((item) => {
                        const title = isEn ? (item.titleEn || item.title) : item.title;
                        const description = isEn ? (item.descriptionEn || item.description) : item.description;
                        const purpose = isEn ? (item.purposeEn || item.purpose) : item.purpose;
                        const scope = isEn ? (item.scopeEn || item.scope) : item.scope;
                        const responsible = isEn ? (item.responsibleEn || item.responsible) : item.responsible;

                        return (
                            <motion.div
                                key={item.id}
                                className="bg-white border border-[#0A2E5C] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={slideUpVariants}
                                whileHover={{ scale: 1.02 }}
                            >
                                {/* Card Header */}
                                <div className="bg-[#0A2E5C] text-white p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-6 h-6 flex-shrink-0" />
                                        <h3 className="font-semibold text-sm line-clamp-2">{title}</h3>
                                    </div>
                                    <button
                                        onClick={() => toggleAccordion(item.id)}
                                        className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                                    >
                                        {expandedCard === item.id ? (
                                            <ChevronUp className="w-5 h-5" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>

                                {/* Card Content */}
                                <div className="p-4">
                                    <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-3">
                                        {description}
                                    </p>

                                    <a
                                        href={item.pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-[#FFD700] text-[#0A2E5C] font-semibold px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors duration-300 text-sm"
                                    >
                                        <Download className="w-4 h-4" />
                                        {t("download")}
                                    </a>
                                </div>

                                {/* Accordion Content */}
                                <AnimatePresence>
                                    {expandedCard === item.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="border-t border-gray-200 bg-gray-50 p-4"
                                        >
                                            <h4 className="font-semibold text-[#0A2E5C] mb-3">{t("detailTitle")}:</h4>
                                            <div className="space-y-2 text-sm">
                                                {purpose && <p><strong>{t("purpose")}:</strong> {purpose}</p>}
                                                {scope && <p><strong>{t("scope")}:</strong> {scope}</p>}
                                                {item.lastUpdate && <p><strong>{t("update")}:</strong> {item.lastUpdate}</p>}
                                                {responsible && <p><strong>{t("responsible")}:</strong> {responsible}</p>}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-gray-400 italic">{t("noData")}</p>
                </div>
            )}
        </section>
    );
}
