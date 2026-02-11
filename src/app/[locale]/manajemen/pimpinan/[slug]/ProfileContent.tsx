"use client";
import { motion } from 'framer-motion';
import {
    GraduationCap,
    Briefcase,
    Microscope,
    Quote
} from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Leader {
    name: string;
    title: string;
    titleEn?: string;
    category: string;
    education: string[];
    educationEn?: string[];
    career: string[];
    careerEn?: string[];
    research: string[];
    researchEn?: string[];
    vision?: string;
    visionEn?: string;
}

interface ProfileContentProps {
    leader: Leader;
    locale: string;
}

export function ProfileContent({ leader, locale }: ProfileContentProps) {
    const t = useTranslations("Leaders");
    const isEn = locale === 'en';

    return (
        <div className="space-y-16">
            {/* Vision & Mission / Biography */}
            {(leader.vision || leader.visionEn) && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Quote className="w-24 h-24 text-unaicBlue" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-8 bg-yellow-400 rounded-full"></div>
                            <h2 className="text-2xl font-bold text-unaicNavy">{t("visionCommitment")}</h2>
                        </div>
                        <p className="text-xl italic text-gray-600 leading-relaxed font-serif">
                            "{isEn ? (leader.visionEn || leader.vision) : leader.vision}"
                        </p>
                    </div>
                </motion.div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
                {/* Education */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-blue-50 rounded-2xl text-unaicBlue">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-unaicNavy">{t("education")}</h2>
                    </div>
                    <ul className="space-y-6">
                        {(isEn ? (leader.educationEn || leader.education) : leader.education).map((item, idx) => (
                            <li key={idx} className="flex gap-4">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></div>
                                <span className="text-gray-600 leading-relaxed">{item}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Career */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-green-50 rounded-2xl text-green-600">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-unaicNavy">{t("career")}</h2>
                    </div>
                    <ul className="space-y-6">
                        {(isEn ? (leader.careerEn || leader.career) : leader.career).map((item, idx) => (
                            <li key={idx} className="flex gap-4">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-400 shrink-0"></div>
                                <span className="text-gray-600 leading-relaxed">{item}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            </div>

            {/* Research Focus */}
            {(leader.research || leader.researchEn) && ((isEn ? leader.researchEn?.length : leader.research?.length) ?? 0) > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
                            <Microscope className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-unaicNavy">{t("researchFocus")}</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {(isEn ? (leader.researchEn || leader.research) : leader.research).map((item, idx) => (
                            <span
                                key={idx}
                                className="px-5 py-2.5 bg-gray-50 text-gray-700 rounded-xl border border-gray-100 font-medium hover:bg-white hover:shadow-md transition-all cursor-default"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
