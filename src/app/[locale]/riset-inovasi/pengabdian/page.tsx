"use client";

import { motion } from "framer-motion";
import HeroSection from "@/components/shared/HeroSection";
import { Users, Handshake, Rocket, Loader2 } from "lucide-react";
import SectionTitle from "@/components/shared/SectionTitle";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

interface PkmProgram {
    id: number;
    title: string;
    titleEn: string | null;
    description: string;
    descriptionEn: string | null;
    icon: string;
    features: string | null;
    featuresEn: string | null;
}

interface PkmProject {
    id: number;
    title: string;
    titleEn: string | null;
    leader: string;
    year: string;
    status: string;
    description: string;
    descriptionEn: string | null;
    reportUrl: string | null;
    order: number;
}

interface PkmConfig {
    id: string;
    title: string | null;
    titleEn: string | null;
    subtitle: string | null;
    subtitleEn: string | null;
    impactTitle: string | null;
    impactTitleEn: string | null;
    impactDesc: string | null;
    impactDescEn: string | null;
}

const IconLoader = ({ name, className }: { name: string, className?: string }) => {
    switch (name) {
        case 'Rocket': return <Rocket className={className} />;
        case 'Handshake': return <Handshake className={className} />;
        case 'Users': return <Users className={className} />;
        default: return <Rocket className={className} />;
    }
};

export default function PengabdianPage() {
    const locale = useLocale();
    const t = useTranslations("CommunityService");
    const [pkmData, setPkmData] = useState<PkmProject[]>([]);
    const [programs, setPrograms] = useState<PkmProgram[]>([]);
    const [config, setConfig] = useState<PkmConfig | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/admin/pkm');
                const json = await res.json();
                setPkmData(json.projects || []);
                setPrograms(json.programs || []);
                setConfig(json.config || null);
            } catch (error) {
                console.error("Failed to fetch pkm data", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-unaicBlue" size={48} />
            </div>
        );
    }

    const title = locale === 'en' ? (config?.titleEn || config?.title || t('title')) : (config?.title || t('title'));
    const subtitle = locale === 'en' ? (config?.subtitleEn || config?.subtitle || t('subtitle')) : (config?.subtitle || t('subtitle'));
    const impactTitle = locale === 'en' ? (config?.impactTitleEn || config?.impactTitle || t('impactTitle')) : (config?.impactTitle || t('impactTitle'));
    const impactDesc = locale === 'en' ? (config?.impactDescEn || config?.impactDesc || t('impactDesc')) : (config?.impactDesc || t('impactDesc'));

    return (
        <main className="bg-white font-sans text-gray-700">
            <HeroSection
                title={title}
                subtitle={subtitle}
                backgroundImage="/images/background/pkm-bg.jpg"
            />

            {/* Intro Section */}
            <section className="max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row-reverse items-center gap-12">
                <div className="md:w-1/2">
                    <SectionTitle align="left" subtitle={t('impactTitle').toUpperCase()}>{impactTitle}</SectionTitle>
                    <p className="text-base leading-relaxed mb-6 text-gray-600 mt-6 bg-blue-50/30 p-8 rounded-3xl border-l-4 border-unaicBlue italic shadow-sm">
                        {impactDesc}
                    </p>
                </div>
                <div className="md:w-1/2 flex justify-center">
                    <div className="relative">
                        <div className="w-64 h-64 bg-unaicBlue/5 rounded-[3rem] rotate-6 absolute inset-0 -z-10 border border-unaicBlue/10"></div>
                        <div className="w-64 h-64 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center border border-gray-100 overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-unaicBlue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <Users className="w-32 h-32 text-unaicNavy transform group-hover:scale-110 transition-transform duration-500" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Program Unggulan Section */}
            <section className="bg-gray-50/50 py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-unaicBlue/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
                <div className="max-w-7xl mx-auto px-4 relative">
                    <SectionTitle subtitle="CORE PROGRAMS">{t('servicesTitle')}</SectionTitle>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-16 max-w-5xl mx-auto">
                        {programs.map((program, idx) => {
                            const programTitle = locale === 'en' ? (program.titleEn || program.title) : program.title;
                            const programDesc = locale === 'en' ? (program.descriptionEn || program.description) : program.description;
                            const programFeatures = locale === 'en'
                                ? JSON.parse(program.featuresEn || program.features || '[]')
                                : JSON.parse(program.features || '[]');

                            const isOdd = idx % 2 !== 0;

                            return (
                                <div key={program.id} className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 relative group overflow-hidden">
                                    <div className={`absolute top-0 right-0 w-24 h-24 ${isOdd ? 'bg-amber-500/5' : 'bg-unaicBlue/5'} rounded-bl-[3rem] -mr-4 -mt-4 transition-all duration-500 group-hover:w-32 group-hover:h-32`}></div>
                                    <div className="flex items-center gap-5 mb-8">
                                        <div className={`p-4 ${isOdd ? 'bg-amber-50 text-amber-600 group-hover:bg-amber-500' : 'bg-blue-50 text-unaicNavy group-hover:bg-unaicBlue'} rounded-2xl group-hover:text-white transition-colors duration-300`}>
                                            <IconLoader name={program.icon} className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-2xl font-black text-unaicNavy tracking-tight">{programTitle}</h3>
                                    </div>
                                    <p className="text-gray-600 mb-8 leading-relaxed">
                                        {programDesc}
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {programFeatures.map((item: string, i: number) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-gray-500 font-bold">
                                                <div className={`w-1.5 h-1.5 rounded-full ${isOdd ? 'bg-amber-500' : 'bg-unaicBlue'}`}></div>
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Featured PKM List */}
            <section className="max-w-7xl mx-auto px-4 py-24">
                <SectionTitle subtitle="IMPACTFUL ACTIVITIES">{t('featuredTitle')}</SectionTitle>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pkmData.map((item) => {
                        const projectTitle = locale === 'en' ? (item.titleEn || item.title) : item.title;
                        const projectDesc = locale === 'en' ? (item.descriptionEn || item.description) : item.description;

                        return (
                            <motion.div
                                key={item.id}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInVariants}
                                className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 group flex flex-col h-full"
                            >
                                <div className="bg-unaicNavy/5 p-8 border-b border-gray-50 group-hover:bg-unaicNavy transition-colors duration-500">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-[10px] font-black bg-white text-unaicNavy px-4 py-1.5 rounded-full shadow-sm uppercase tracking-widest">{item.status}</span>
                                        <span className="text-xs text-unaicNavy font-black group-hover:text-white/80 transition-colors uppercase tracking-widest">{item.year}</span>
                                    </div>
                                    <h3 className="font-black text-unaicNavy group-hover:text-white text-lg line-clamp-2 leading-tight transition-colors duration-500">{projectTitle}</h3>
                                </div>
                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="mb-6">
                                        <p className="text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">{t('leader')}</p>
                                        <p className="text-sm font-bold text-unaicNavy group-hover:text-unaicBlue transition-colors">{item.leader}</p>
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-4 mb-8 leading-relaxed italic">{projectDesc}</p>
                                    <div className="mt-auto pt-6 border-t border-gray-50">
                                        <a href={item.reportUrl ?? undefined} className="inline-flex items-center gap-2 text-sm font-black text-unaicBlue hover:text-unaicNavy transition-colors group/link uppercase tracking-wider">
                                            {t('viewReport')}
                                            <span className="transform group-hover/link:translate-x-1 transition-transform">→</span>
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}
