'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import HeroSection from "@/components/shared/HeroSection";
import {
    ArrowRight,
    CheckCircle,
    Calendar,
    Award,
    Users,
    BookOpen
} from 'lucide-react';

interface PmbContentProps {
    heroTitle: string;
    heroSubtitle: string;
    ctaTitle: string;
    ctaDesc: string;
    registrationUrl: string;
    translations: {
        registerNow: string;
        viewProdi: string;
        whyChooseTitle: string;
        wavesTitle: string;
        wavesDesc: string;
        scheduleBtn: string;
        reasons: {
            accredited: string;
            accreditedDesc: string;
            lecturers: string;
            lecturersDesc: string;
            curriculum: string;
            curriculumDesc: string;
            facilities: string;
            facilitiesDesc: string;
        };
    };
}

export default function PmbContent({
    heroTitle,
    heroSubtitle,
    ctaTitle,
    ctaDesc,
    registrationUrl,
    translations: t
}: PmbContentProps) {
    return (
        <div className="min-h-screen bg-white font-sans">

            {/* HERO SECTION */}
            <HeroSection
                title={heroTitle}
                subtitle={heroSubtitle}
            />

            {/* CALL TO ACTION BUTTON SECTION */}
            <div className="relative z-30 container mx-auto px-4 -mt-10 mb-20 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl mx-auto border-t-4 border-unaicGold"
                >
                    <h2 className="text-2xl font-bold text-unaicNavy mb-4">{ctaTitle}</h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        {ctaDesc}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href={registrationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-unaicBlue hover:bg-unaicNavy text-white text-lg font-bold px-8 py-4 rounded-full shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all transform hover:-translate-y-1"
                        >
                            {t.registerNow} <ArrowRight size={20} />
                        </a>
                        <Link
                            href="/fakultas"
                            className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-unaicNavy text-lg font-bold px-8 py-4 rounded-full transition-all"
                        >
                            {t.viewProdi}
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* ALASAN MEMILIH UNAIC */}
            <section className="container mx-auto px-4 py-12 max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-heading font-bold text-unaicNavy mb-4">{t.whyChooseTitle}</h2>
                    <div className="w-20 h-1.5 bg-unaicGold mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { icon: <Award className="w-10 h-10 text-orange-500" />, title: t.reasons.accredited, desc: t.reasons.accreditedDesc },
                        { icon: <Users className="w-10 h-10 text-blue-500" />, title: t.reasons.lecturers, desc: t.reasons.lecturersDesc },
                        { icon: <BookOpen className="w-10 h-10 text-green-500" />, title: t.reasons.curriculum, desc: t.reasons.curriculumDesc },
                        { icon: <CheckCircle className="w-10 h-10 text-purple-500" />, title: t.reasons.facilities, desc: t.reasons.facilitiesDesc }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-gray-50 hover:bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-100 transition-all shadow-sm hover:shadow-md text-center group">
                            <div className="bg-white group-hover:bg-blue-50 w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-sm mb-4 transition-colors">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* TIMELINE / JADWAL SINGKAT */}
            <section className="bg-white text-gray-800 py-20 mt-12 relative overflow-hidden border-t border-gray-100">
                <div className="absolute inset-0 bg-[url('/patterns/circuit.svg')] opacity-[0.03]"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-block p-4 bg-unaicNavy/5 rounded-full mb-6">
                        <Calendar size={32} className="text-unaicNavy" />
                    </div>
                    <h2 className="text-3xl font-heading font-bold mb-4 text-unaicNavy">{t.wavesTitle}</h2>
                    <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
                        {t.wavesDesc}
                    </p>

                    <a
                        href={registrationUrl}
                        className="inline-flex items-center gap-2 bg-unaicNavy text-white font-bold px-8 py-3 rounded-full hover:bg-unaicBlue transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        target="_blank"
                    >
                        {t.scheduleBtn} &rarr;
                    </a>
                </div>
            </section>

        </div>
    );
}
