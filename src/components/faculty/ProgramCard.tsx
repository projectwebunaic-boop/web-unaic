"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { ArrowRight, GraduationCap, Clock, Award } from "lucide-react";
import * as Icons from "lucide-react";
import { useTranslations } from "next-intl";

interface ProgramCardProps {
    name: string;
    level: string; // D3, S1, Profesi
    slug: string;
    description?: string; // Short " tagline"
    accreditation?: string;
    facultySlug: string;
    index: number;
    duration?: string;
    degree?: string;
    iconName?: string;
}

export default function ProgramCard({
    name,
    level,
    slug,
    description,
    accreditation = "Baik Sekali",
    facultySlug,
    index,
    duration,
    degree,
    iconName
}: ProgramCardProps) {
    const t = useTranslations("Faculties");
    const href = `/fakultas/${facultySlug}/${slug}`;

    // Dynamic icon loading
    const IconComponent = (Icons as any)[iconName || "GraduationCap"] || Icons.GraduationCap;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full overflow-hidden"
        >
            <div className="p-8 flex-grow">
                <div className="flex items-center justify-between mb-6">
                    <span className={`inline-block px-4 py-1.5 rounded-xl text-xs font-bold tracking-wider ${level.includes('D3') ? 'bg-blue-50 text-blue-600' :
                        level.includes('S1') ? 'bg-indigo-50 text-indigo-600' :
                            'bg-purple-50 text-purple-600'
                        }`}>
                        {level}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-xl border border-green-100">
                        <Award className="w-3.5 h-3.5" /> {accreditation}
                    </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-unaicNavy transition-colors leading-tight">
                    {name.replace(level, '').trim()}
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6 font-medium">
                    {description || (t("prodiFallbackPrefix") ? `${t("prodiFallbackPrefix")} ${name} ${t("prodiFallbackSuffix")}` : `Program studi ${name} unggulan dengan kurikulum berbasis kompetensi dan fasilitas modern.`)}
                </p>

                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600 font-semibold">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-unaicGold/10 group-hover:text-unaicGold transition-colors">
                            <Clock className="w-4 h-4" />
                        </div>
                        <span>{duration || (level === 'D3' ? `6 ${t("semester")}` : level === 'S1' ? `8 ${t("semester")}` : `2-4 ${t("semester")}`)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 font-semibold">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-unaicGold/10 group-hover:text-unaicGold transition-colors">
                            <IconComponent className="w-4 h-4" />
                        </div>
                        <span>{degree || (level === 'Profesi' ? (t("certificate") || 'Sertifikat') : level === 'D3' ? 'A.Md' : 'S.Kom / S.Farm / S.Kep')}</span>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-gray-50/50 border-t border-gray-100 mt-auto group-hover:bg-gray-50 transition-colors">
                <Link
                    href={href}
                    className="flex items-center justify-between w-full text-unaicNavy font-bold text-sm group/link transition-all"
                >
                    <span className="group-hover/link:underline decoration-2 underline-offset-4">{t("viewCurriculum")}</span>
                    <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100 group-hover/link:bg-unaicNavy group-hover/link:text-white transition-all">
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </Link>
            </div>
        </motion.div>
    );
}
