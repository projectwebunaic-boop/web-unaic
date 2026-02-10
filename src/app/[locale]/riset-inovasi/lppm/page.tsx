"use client";

import HeroSection from "@/components/shared/HeroSection";
import SectionTitle from "@/components/shared/SectionTitle";
import { Target, Eye, Users, FileText, Send, User } from "lucide-react";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

interface OrganizationRole {
    id: number;
    name: string;
    position: string;
    positionEn: string | null;
}

interface LPPMData {
    vision: string | null;
    visionEn: string | null;
    mission: string[];
    missionEn: string[];
    tasks: string[];
    tasksEn: string[];
    ctaTitle: string | null;
    ctaTitleEn: string | null;
    ctaDescription: string | null;
    ctaDescriptionEn: string | null;
    ctaButtonText: string | null;
    ctaButtonTextEn: string | null;
    ctaButtonLink: string | null;
    staff: OrganizationRole[];
}

export default function LPPMPage() {
    const locale = useLocale();
    const isEn = locale === "en";
    const t = useTranslations("Navigation.menu");

    const [data, setData] = useState<LPPMData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/admin/lppm');
                const json = await res.json();
                setData(json);
            } catch (error) {
                console.error("Failed to fetch LPPM data", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!data) return <div className="min-h-screen flex items-center justify-center">Failed to load data.</div>;

    const displayVision = isEn ? (data.visionEn || data.vision) : data.vision;
    const displayMission = isEn ? (data.missionEn.length > 0 ? data.missionEn : data.mission) : data.mission;
    const displayTasks = isEn ? (data.tasksEn.length > 0 ? data.tasksEn : data.tasks) : data.tasks;

    return (
        <main className="font-sans text-gray-700 bg-white">
            <HeroSection
                title={isEn ? "LPPM UNAIC Profile" : "Profil LPPM UNAIC"}
                subtitle={isEn
                    ? "Institute for Research and Community Service, Al-Irsyad University of Cilacap"
                    : "Lembaga Penelitian dan Pengabdian kepada Masyarakat Universitas Al-Irsyad Cilacap"}
                backgroundImage="/images/background/lppm-bg.jpg"
            />

            {/* Direct Link Section */}
            <section className="bg-gradient-to-r from-unaicNavy to-blue-700 py-8 text-white text-center">
                <div className="container mx-auto px-4">
                    <p className="text-lg mb-4 font-medium">
                        {isEn ? "Visit LPPM UNAIC Official Website for more information" : "Kunjungi Website Resmi LPPM UNAIC untuk informasi lebih lengkap"}
                    </p>
                    <Link
                        href="https://lppm.universitasalirsyad.ac.id/"
                        target="_blank"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFD700] text-[#0A2E5C] rounded-full font-bold hover:bg-yellow-400 transition-colors shadow-lg"
                    >
                        <Send className="w-4 h-4" />
                        Buka lppm.universitasalirsyad.ac.id
                    </Link>
                </div>
            </section>

            {/* Visi, Misi, Tugas Pokok Section - PREMIUM DESIGN */}
            <section className="py-20 relative overflow-hidden bg-white">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-50 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 opacity-50"></div>

                <div className="container mx-auto max-w-6xl px-4 relative z-10">
                    <SectionTitle>{isEn ? "Vision, Mission & Goals" : "Visi, Misi & Tugas Pokok"}</SectionTitle>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                        {/* Visi Card */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="group bg-gradient-to-br from-[#0A2E5C] to-blue-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Eye className="w-32 h-32" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 border border-white/20">
                                    <Eye className="w-7 h-7 text-[#FFD700]" />
                                </div>
                                <h3 className="text-2xl font-bold font-heading mb-4 text-[#FFD700]">{isEn ? "Vision" : "Visi"}</h3>
                                <p className="text-blue-50 leading-relaxed font-light">
                                    {displayVision}
                                </p>
                            </div>
                        </motion.div>

                        {/* Misi Card */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 relative overflow-hidden md:col-span-2"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-yellow-100"></div>

                            <div className="flex flex-col md:flex-row gap-8 relative z-10">
                                <div className="shrink-0">
                                    <div className="w-14 h-14 bg-[#0A2E5C]/5 rounded-xl flex items-center justify-center border border-[#0A2E5C]/10">
                                        <Target className="w-7 h-7 text-[#0A2E5C]" />
                                    </div>
                                </div>
                                <div className="grow">
                                    <h3 className="text-2xl font-bold font-heading mb-6 text-[#0A2E5C]">{isEn ? "Mission" : "Misi"}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {displayMission.map((item, idx) => (
                                            <div key={idx} className="flex gap-3">
                                                <div className="w-1.5 h-1.5 bg-[#FFD700] rounded-full mt-2 shrink-0"></div>
                                                <p className="text-gray-600 text-sm leading-relaxed">{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Tugas Pokok Card - Full Width on Mobile */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="md:col-span-3 bg-white rounded-2xl p-8 shadow-lg border border-gray-100 relative overflow-hidden"
                        >
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#0A2E5C] via-blue-500 to-[#FFD700]"></div>

                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="shrink-0">
                                    <div className="w-14 h-14 bg-[#0A2E5C] rounded-xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
                                        <FileText className="w-7 h-7 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold font-heading mb-6 text-[#0A2E5C]">{isEn ? "Main Tasks" : "Tugas Pokok"}</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {displayTasks.map((item, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-block px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm font-medium hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors cursor-default"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Struktur Organisasi Section - PROFESSIONAL CHART */}
            <section className="py-20 bg-gray-50/50">
                <div className="container mx-auto max-w-6xl px-4">
                    <SectionTitle>{isEn ? "Organizational Structure" : "Struktur Organisasi"}</SectionTitle>
                    <div className="text-center mb-16 mt-4">
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            {isEn
                                ? "Solid and integrated leadership structure to support a sustainable research ecosystem."
                                : "Struktur kepemimpinan yang solid dan terintegrasi untuk mendukung ekosistem riset yang berkelanjutan."}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {data.staff.map((member) => (
                            <div key={member.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow group">
                                <div className="w-20 h-20 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100 group-hover:bg-blue-50 transition-colors">
                                    <User className="text-gray-400 group-hover:text-unaicBlue" size={32} />
                                </div>
                                <h4 className="font-bold text-[#0A2E5C] leading-tight mb-2">{member.name}</h4>
                                <p className="text-xs font-semibold text-gray-500 bg-gray-50 py-1 px-3 rounded-full inline-block">
                                    {isEn ? (member.positionEn || member.position) : member.position}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-[#0A2E5C] to-blue-600 py-16 sm:py-24">
                <div className="container mx-auto max-w-4xl px-4 text-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                        <FileText className="w-16 h-16 text-[#FFD700] mx-auto mb-6" />
                        <h2 className="text-3xl font-heading font-bold text-white mb-4">
                            {isEn ? (data.ctaTitleEn || data.ctaTitle) : data.ctaTitle}
                        </h2>
                        <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
                            {isEn ? (data.ctaDescriptionEn || data.ctaDescription) : data.ctaDescription}
                        </p>
                        <Link
                            href={data.ctaButtonLink || "/kontak"}
                            target={data.ctaButtonLink?.startsWith('http') ? "_blank" : undefined}
                            rel={data.ctaButtonLink?.startsWith('http') ? "noopener noreferrer" : undefined}
                            className="inline-flex items-center gap-3 bg-[#FFD700] hover:bg-yellow-400 text-[#0A2E5C] font-semibold px-8 py-4 rounded-lg shadow-lg transition-colors duration-300 text-lg"
                        >
                            <Send className="w-5 h-5" />
                            {isEn ? (data.ctaButtonTextEn || data.ctaButtonText) : data.ctaButtonText}
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
