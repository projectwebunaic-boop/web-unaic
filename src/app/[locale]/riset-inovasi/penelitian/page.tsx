"use client";

import { motion } from "framer-motion";
import HeroSection from "@/components/shared/HeroSection";
import { FlaskConical, FileText, CheckCircle, Scale, Loader2 } from "lucide-react";
import SectionTitle from "@/components/shared/SectionTitle";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";

const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

interface ResearchProject {
    id: number;
    title: string;
    titleEn: string | null;
    leader: string;
    year: string | number;
    status: string;
    description: string;
    descriptionEn: string | null;
    reportUrl: string;
}

interface ResearchConfig {
    title: string | null;
    titleEn: string | null;
    subtitle: string | null;
    subtitleEn: string | null;
    focusTitle: string | null;
    focusTitleEn: string | null;
    focusDesc: string | null;
    focusDescEn: string | null;
}

export default function PenelitianPage() {
    const t = useTranslations("Research");
    const locale = useLocale();
    const [researchData, setResearchData] = useState<ResearchProject[]>([]);
    const [config, setConfig] = useState<ResearchConfig | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/admin/research');
                const json = await res.json();
                if (json.projects) setResearchData(json.projects);
                if (json.config) setConfig(json.config);
            } catch (error) {
                console.error("Failed to fetch research data", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <Loader2 className="animate-spin text-unaicNavy" size={48} />
        </div>
    );

    const displayTitle = (locale === 'en' ? config?.titleEn : config?.title) || t("title");
    const displaySubtitle = (locale === 'en' ? config?.subtitleEn : config?.subtitle) || t("subtitle");
    const displayFocusTitle = (locale === 'en' ? config?.focusTitleEn : config?.focusTitle) || t("focusTitle");
    const displayFocusDesc = (locale === 'en' ? config?.focusDescEn : config?.focusDesc) || t("focusDesc");

    return (
        <main className="bg-white font-sans text-gray-700">
            <HeroSection
                title={displayTitle}
                subtitle={displaySubtitle}
                backgroundImage="/images/background/research-bg.jpg"
            />

            {/* Intro Section */}
            <section className="max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2">
                    <SectionTitle align="left">{displayFocusTitle}</SectionTitle>
                    <p className="text-base leading-relaxed mb-6 text-gray-600 mt-4">
                        {displayFocusDesc}
                    </p>
                </div>
                <div className="md:w-1/2 flex justify-center">
                    <div className="w-40 h-40 bg-[#0A2E5C]/5 rounded-full flex items-center justify-center border-2 border-[#0A2E5C]/10">
                        <FlaskConical className="w-20 h-20 text-[#0A2E5C]" />
                    </div>
                </div>
            </section>

            {/* Layanan Section */}
            <section className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <SectionTitle>{t("servicesTitle")}</SectionTitle>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <Scale className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-[#0A2E5C] mb-2">{t("ethicsTitle")}</h3>
                            <p className="text-sm text-gray-600">
                                {t("ethicsDesc")}
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <FileText className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-lg font-bold text-[#0A2E5C] mb-2">{t("hkiTitle")}</h3>
                            <p className="text-sm text-gray-600">
                                {t("hkiDesc")}
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                <CheckCircle className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-bold text-[#0A2E5C] mb-2">{t("pubTitle")}</h3>
                            <p className="text-sm text-gray-600">
                                {t("pubDesc")}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Research List */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <SectionTitle>{t("currentResearch")}</SectionTitle>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {researchData.map((item) => (
                        <motion.div
                            key={item.id}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInVariants}
                            whileHover={{ y: -10 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full border border-gray-100"
                        >
                            {/* Card Header */}
                            <div className="bg-[#0A2E5C] p-6 relative">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="inline-block bg-[#FFD700] text-[#0A2E5C] text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                                        {item.status}
                                    </span>
                                    <span className="text-white/90 text-sm font-medium tracking-wide">
                                        {item.year}
                                    </span>
                                </div>
                                <h3 className="text-white font-heading font-bold text-lg leading-snug line-clamp-3 min-h-[56px]">
                                    {locale === 'en' && item.titleEn ? item.titleEn : item.title}
                                </h3>
                            </div>

                            {/* Card Body */}
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="mb-4">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                        {t("leader")}
                                    </p>
                                    <p className="text-[#0A2E5C] font-semibold text-base border-b border-gray-100 pb-2">
                                        {item.leader}
                                    </p>
                                </div>

                                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                                    {locale === 'en' && item.descriptionEn ? item.descriptionEn : item.description}
                                </p>

                                {/* Footer Link */}
                                <div className="mt-auto">
                                    <a
                                        href={item.reportUrl || "#"}
                                        className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors group"
                                    >
                                        {t("viewDetail")}
                                        <span className="ml-1 transform group-hover:translate-x-1 transition-transform">→</span>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </main>
    );
}
