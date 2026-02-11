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
        <>
            {/* Header: Name and Title */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="border-b border-gray-200 pb-8"
            >
                <h1 className="font-heading text-4xl lg:text-5xl font-extrabold text-unaicNavy mb-3 leading-tight">
                    {leader.name}
                </h1>
                <div className="inline-block relative">
                    <p className="font-heading text-xl lg:text-2xl text-unaicBlue font-medium relative z-10">
                        {isEn ? (leader.titleEn || leader.title) : leader.title}
                    </p>
                    <div className="absolute -bottom-1 left-0 w-full h-2 bg-blue-100 -z-0 opacity-50 -rotate-1"></div>
                </div>
            </motion.div>

            {/* Quote / Vision Section - Premium Look */}
            {(leader.vision || leader.category === 'Rektor') && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-2xl p-8 lg:p-10 shadow-sm border border-gray-100 flex gap-6 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 text-gray-50 opacity-10 rotate-12">
                        <Quote size={150} />
                    </div>
                    <div className="w-1.5 self-stretch bg-unaicGold rounded-full flex-shrink-0"></div>
                    <div className="relative z-10">
                        <h3 className="font-bold text-unaicNavy text-lg mb-3 flex items-center gap-2">
                            <span className="w-8 h-[1px] bg-unaicNavy/30"></span> {t("visionTitle")}
                        </h3>
                        <blockquote className="text-lg md:text-xl text-gray-600 font-serif italic leading-relaxed">
                            "{isEn ? (leader.visionEn || leader.vision || t("defaultVision")) : (leader.vision || t("defaultVision"))}"
                        </blockquote>
                    </div>
                </motion.div>
            )}

            {/* Two Column Grid for History */}
            <div className="grid md:grid-cols-2 gap-8">

                {/* Education History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                >
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                            <GraduationCap size={24} />
                        </div>
                        <h2 className="font-heading font-bold text-xl text-gray-800">{t("educationHistory")}</h2>
                    </div>

                    <div className="space-y-6">
                        {(isEn && leader.educationEn && leader.educationEn.length > 0 ? leader.educationEn : leader.education).map((edu, idx) => (
                            <div key={idx} className="flex gap-4 relative">
                                <div className="flex flex-col items-center">
                                    <div className="w-3 h-3 rounded-full bg-orange-200 border-2 border-orange-50 mt-1.5 flex-shrink-0"></div>
                                    {idx !== (isEn && leader.educationEn && leader.educationEn.length > 0 ? leader.educationEn.length : leader.education.length) - 1 && <div className="w-0.5 flex-1 bg-orange-100/50 my-1"></div>}
                                </div>
                                <p className="text-gray-600 font-medium leading-relaxed text-sm md:text-base">{edu}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Research */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                >
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                            <Microscope size={24} />
                        </div>
                        <h2 className="font-heading font-bold text-xl text-gray-800">{t("researchFocus")}</h2>
                    </div>

                    <div className="space-y-4">
                        {(isEn && leader.researchEn && leader.researchEn.length > 0 ? leader.researchEn : leader.research).map((item, idx) => (
                            <div key={idx} className="flex gap-3 items-start group">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0 group-hover:scale-125 transition-transform"></div>
                                <p className="text-gray-600 font-medium text-sm md:text-base leading-relaxed group-hover:text-gray-900 transition-colors">{item}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Career History - Full Width */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <Briefcase size={24} />
                    </div>
                    <h2 className="font-heading font-bold text-xl text-gray-800">{t("careerHistory")}</h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-y-6 gap-x-12">
                    {(isEn && leader.careerEn && leader.careerEn.length > 0 ? leader.careerEn : leader.career).map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-start group">
                            <div className="w-10 h-1 bg-blue-100 mt-2.5 rounded-full flex-shrink-0 group-hover:w-12 group-hover:bg-blue-600 transition-all duration-300"></div>
                            <p className="text-gray-700 font-medium text-base leading-relaxed">{item}</p>
                        </div>
                    ))}
                </div>
            </motion.div>
        </>
    );
}
