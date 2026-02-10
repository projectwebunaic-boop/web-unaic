"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Users2, ChevronDown, ChevronUp, Users, Heart, Calendar, Trophy, Zap, Mountain, Palette, Code } from "lucide-react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import HeroSection from "@/components/shared/HeroSection";
import { useLocale } from "next-intl";

const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};

const staggerItemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

interface Category {
    id: string;
    name: string;
    nameEn?: string;
}

interface OrganizationItem {
    id: string;
    categoryId: string;
    name: string;
    nameEn?: string;
    fullName?: string;
    fullNameEn?: string;
    description: string;
    descriptionEn?: string;
    details?: string;
    detailsEn?: string;
    activities?: string;
    activitiesEn?: string;
    logo?: string;
}

interface OrganisasiContentProps {
    data: {
        categories: Category[];
        items: OrganizationItem[];
    }
}

// Helper icons mapping
const getIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('olahraga')) return <Trophy className="w-8 h-8 text-unaicNavy" />;
    if (lower.includes('seni')) return <Palette className="w-8 h-8 text-unaicNavy" />;
    if (lower.includes('alam')) return <Mountain className="w-8 h-8 text-unaicNavy" />;
    if (lower.includes('it') || lower.includes('multi')) return <Code className="w-8 h-8 text-unaicNavy" />;
    return <Zap className="w-8 h-8 text-unaicNavy" />;
};

const getColor = (idx: number) => {
    const colors = [
        "bg-blue-50 border-blue-200",
        "bg-purple-50 border-purple-200",
        "bg-green-50 border-green-200",
        "bg-orange-50 border-orange-200",
        "bg-indigo-50 border-indigo-200"
    ];
    return colors[idx % colors.length];
};

export default function OrganisasiContent({ data }: OrganisasiContentProps) {
    const { categories, items } = data;
    const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
    const locale = useLocale();
    const isEn = locale === 'en';

    // Helper for localized text
    const tx = (id?: string | null, en?: string | null) => (isEn && en) ? en : (id || "");

    const toggleOrg = (id: string) => {
        setSelectedOrg(selectedOrg === id ? null : id);
    };

    // Filter items
    const coreItems = items.filter(i => i.categoryId === 'core');
    const ukmItems = items.filter(i => i.categoryId === 'ukm');

    return (
        <main className="font-sans text-gray-700 bg-white">
            <HeroSection
                title={isEn ? "Student Organizations" : "Organisasi Mahasiswa"}
                subtitle={isEn
                    ? "A place for leadership development, creativity, and solidarity for students of Universitas Al-Irsyad Cilacap."
                    : "Wadah pengembangan kepemimpinan, kreativitas, dan solidaritas mahasiswa Universitas Al-Irsyad Cilacap."}
            />

            {/* Core Organizations Section */}
            {coreItems.length > 0 && (
                <section className="py-16 sm:py-24 bg-gray-50">
                    <div className="container mx-auto max-w-6xl px-4">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={fadeUpVariants}
                            className="text-center mb-12"
                        >
                            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-unaicNavy mb-4">
                                {isEn ? "Student Organization Structure" : "Struktur Organisasi Mahasiswa"}
                            </h2>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                {isEn
                                    ? "Core organizations that serve as the main pillars in managing and developing student activities at UNAIC"
                                    : "Organisasi inti yang menjadi pilar utama dalam mengelola dan mengembangkan kegiatan kemahasiswaan di UNAIC"}
                            </p>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={staggerContainerVariants}
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        >
                            {coreItems.map((org) => (
                                <motion.div
                                    key={org.id}
                                    variants={staggerItemVariants}
                                    className="bg-white rounded-xl shadow-md border border-unaicNavy/20 p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                                >
                                    <div className="flex items-start mb-4">
                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mr-4 bg-gray-100 overflow-hidden shrink-0`}>
                                            {org.logo ? (
                                                <Image src={org.logo} alt={tx(org.name, org.nameEn)} width={64} height={64} className="object-cover w-full h-full" />
                                            ) : (
                                                <Users className="w-8 h-8 text-unaicNavy" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-heading text-xl font-semibold text-unaicNavy mb-2">
                                                {tx(org.name, org.nameEn)}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-3 font-medium">{tx(org.fullName, org.fullNameEn)}</p>
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                {tx(org.description, org.descriptionEn)}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleOrg(org.id)}
                                        className="text-unaicBlue hover:text-unaicNavy font-bold text-sm transition-colors duration-300 flex items-center gap-1"
                                    >
                                        {selectedOrg === org.id ? (isEn ? "Hide Details" : "Tutup Detail") : (isEn ? "View Details" : "Lihat Detail")}
                                        {selectedOrg === org.id ? (
                                            <ChevronUp className="w-4 h-4" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4" />
                                        )}
                                    </button>

                                    <motion.div
                                        initial={false}
                                        animate={{
                                            height: selectedOrg === org.id ? "auto" : 0,
                                            opacity: selectedOrg === org.id ? 1 : 0
                                        }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="border-t border-gray-100 pt-4 mt-4">
                                            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                                                {tx(org.details, org.detailsEn)}
                                            </p>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* UKM Section */}
            {ukmItems.length > 0 && (
                <section className="py-16 sm:py-24">
                    <div className="container mx-auto max-w-6xl px-4">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={fadeUpVariants}
                            className="text-center mb-12"
                        >
                            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-unaicNavy mb-4">
                                {isEn ? "Student Activity Units (UKM)" : "Unit Kegiatan Mahasiswa (UKM)"}
                            </h2>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                {isEn
                                    ? "Various student activity units that accommodate students' interests and talents in various fields"
                                    : "Berbagai unit kegiatan yang menampung minat dan bakat mahasiswa di berbagai bidang"}
                            </p>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={staggerContainerVariants}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {ukmItems.map((ukm, index) => (
                                <motion.div
                                    key={ukm.id}
                                    variants={staggerItemVariants}
                                    className={`${getColor(index)} rounded-2xl p-6 border-2 hover:shadow-xl transition-all duration-300 flex flex-col`}
                                >
                                    <div className="flex items-center mb-5">
                                        <div className="bg-white rounded-xl p-3 mr-4 shadow-sm shrink-0">
                                            {ukm.logo ? <Image src={ukm.logo} alt={tx(ukm.name, ukm.nameEn)} width={32} height={32} /> : getIcon(tx(ukm.name, ukm.nameEn))}
                                        </div>
                                        <h3 className="font-heading text-lg font-bold text-unaicNavy">
                                            {tx(ukm.name, ukm.nameEn)}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1">
                                        {tx(ukm.description, ukm.descriptionEn)}
                                    </p>
                                    <div className="space-y-3 pt-4 border-t border-gray-100">
                                        <h4 className="font-bold text-unaicNavy text-xs uppercase tracking-wider">
                                            {isEn ? "Main Activities:" : "Kegiatan Utama:"}
                                        </h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {tx(ukm.activities, ukm.activitiesEn)?.split(',').map((activity, idx) => (
                                                <span key={idx} className="bg-white text-gray-700 px-2.5 py-1 rounded-md text-[11px] font-medium shadow-sm border border-gray-100">
                                                    {activity.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-unaicNavy to-unaicBlue py-16 sm:py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -ml-32 -mb-32"></div>
                </div>
                <div className="container mx-auto max-w-4xl px-4 text-center relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeUpVariants}
                    >
                        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-6">
                            {isEn ? "Join a Student Organization" : "Bergabung dengan Organisasi Mahasiswa"}
                        </h2>
                        <p className="text-white text-lg mb-8 max-w-2xl mx-auto opacity-90">
                            {isEn
                                ? "Develop your potential and expand your network with the UNAIC community."
                                : "Kembangkan potensi dan perluas jaringanmu bersama komunitas UNAIC."}
                        </p>
                        <Link
                            href="/kemahasiswaan/kegiatan"
                            className="inline-flex items-center bg-white text-unaicNavy hover:bg-unaicGold hover:text-unaicNavy font-bold px-8 py-4 rounded-xl shadow-xl transition-all duration-300 text-lg group"
                        >
                            <Calendar className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                            {isEn ? "View Activities" : "Lihat Kegiatan"}
                        </Link>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
