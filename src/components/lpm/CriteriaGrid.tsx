"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import {
    ShieldCheck, ClipboardCheck, Award, BarChart, FileText,
    Target, Users, GraduationCap, UserCheck, Building,
    BookOpen, FlaskConical, Handshake, ArrowRight
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

// Icon Map (duplicate here because we need it in client component)
const IconMap: { [key: string]: any } = {
    ShieldCheck, ClipboardCheck, Award, BarChart, FileText,
    Target, Users, GraduationCap, UserCheck, Building,
    BookOpen, FlaskConical, Handshake
};

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemAnim = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
};

export default function CriteriaGrid({ criteria }: { criteria: any[] }) {
    const locale = useLocale();
    const t = useTranslations("LPM");
    if (!criteria || criteria.length === 0) {
        return (
            <div className="text-center text-gray-400 py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                {t("noCriteria")}
            </div>
        );
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5"
        >
            {criteria.map((item: any, idx: number) => {
                const IconCurrent = IconMap[item.icon] || ShieldCheck;
                return (
                    <motion.div
                        key={item.id}
                        variants={itemAnim}
                        className="group relative bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 flex flex-col h-full overflow-hidden"
                    >
                        {/* Gradient Hover Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                        {/* Decorative Top Border */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-unaicBlue to-unaicGold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                        <div className="relative z-10 flex flex-col h-full">
                            {/* Header: Icon & Badge */}
                            <div className="flex items-start justify-between mb-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-unaicBlue/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="relative w-14 h-14 shrink-0 bg-blue-50 text-unaicBlue rounded-2xl flex items-center justify-center group-hover:bg-unaicBlue group-hover:text-white transition-all duration-300 border border-blue-100 group-hover:border-transparent">
                                        <IconCurrent size={26} strokeWidth={1.5} />
                                    </div>
                                </div>
                                <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-gray-50 text-gray-400 uppercase tracking-widest border border-gray-100">
                                    0{idx + 1}
                                </span>
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold text-unaicNavy mb-3 group-hover:text-unaicBlue transition-colors break-words leading-snug">
                                {locale === 'en' ? (item.subtitleEn || item.titleEn || item.subtitle || item.title) : (item.subtitle || item.title)}
                            </h3>
                            <p className="text-gray-500 text-sm mb-8 flex-1 leading-relaxed break-words">
                                {locale === 'en' ? (item.descriptionEn || item.description) : item.description}
                            </p>

                            {/* Footer: Link */}
                            <div className="mt-auto">
                                <Link
                                    href={`/manajemen/penjaminan-mutu/${item.slug}`}
                                    className="inline-flex items-center text-sm font-semibold text-unaicNavy group-hover:text-unaicBlue transition-colors group/link"
                                >
                                    {t("more")}
                                    <span className="ml-2 w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center group-hover/link:bg-unaicBlue group-hover/link:text-white transition-colors">
                                        <ArrowRight size={12} className="group-hover/link:-rotate-45 transition-transform duration-300" />
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )
            })}
        </motion.div>
    );
}
