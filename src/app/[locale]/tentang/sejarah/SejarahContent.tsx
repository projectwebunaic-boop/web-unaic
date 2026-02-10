"use client";

import Image from "next/image";

import { motion, Variants, Transition, AnimatePresence } from "framer-motion";
import {
    BookOpen,
    Building,
    Calendar,
    ChevronRight,
    GraduationCap,
    Milestone,
    Users,
    Award,
    X,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import HeroSection from "@/components/shared/HeroSection";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

// Map icon string names to Lucide components
const IconMap: { [key: string]: any } = {
    BookOpen, Building, Calendar, GraduationCap, Milestone, Users, Award
};

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.2, delayChildren: 0.3 } as Transition,
    },
};

const itemVariants: Variants = {
    hidden: { y: 30 },
    visible: {
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" } as Transition,
    },
};

export default function SejarahContent({ data }: { data: any }) {
    if (!data) return <div className="p-10 text-center">Data Sejarah belum tersedia.</div>;

    const locale = useLocale();
    const t = useTranslations('History');
    const isEn = locale === 'en';

    const { timeline, stats, archiveGallery } = data;

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <main className="font-sans bg-white text-gray-800">
            {/* Hero Section */}
            <HeroSection
                title="Sejarah"
                subtitle="Perjalanan dari Akademi hingga menjadi Universitas Unggul."
            />

            {/* Timeline Sejarah */}
            <section className="w-full bg-gray-50 py-20">
                <div className="container mx-auto max-w-6xl px-4">
                    <motion.div
                        className="relative"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={containerVariants}
                    >
                        <div className="absolute left-16 top-0 h-full w-0.5 bg-gray-200 hidden md:block"></div>
                        {timeline?.map((item: any, index: number) => {
                            const IconComponent = IconMap[item.icon] || Milestone;
                            return (
                                <motion.div
                                    key={index}
                                    className="relative flex items-start mb-16"
                                    variants={itemVariants}
                                >
                                    <div className="w-16 h-16 bg-unaicGold rounded-full flex items-center justify-center text-white font-bold text-lg ring-8 ring-gray-50 mr-8 relative z-10 shrink-0">
                                        {item.year}
                                    </div>
                                    <div className="flex-1 bg-white p-6 rounded-xl shadow-md border-l-4 border-unaicNavy">
                                        <div className="flex items-center gap-3 mb-2">
                                            <IconComponent className="w-6 h-6 text-unaicNavy" />
                                            <h3 className="font-heading text-lg font-semibold text-unaicNavy">
                                                {(isEn ? item.titleEn : item.title)}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {(isEn ? item.descriptionEn : item.description)}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Highlight Capaian */}
            <section className="w-full bg-white py-20">
                <div className="container mx-auto max-w-6xl px-4">
                    <h2 className="text-3xl font-bold font-heading text-center text-unaicNavy mb-12">
                        {t('statsTitle')}
                    </h2>
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={containerVariants}
                    >
                        {stats?.map((stat: any, index: number) => (
                            <motion.div key={index} className="text-center" variants={itemVariants}>
                                <span className="text-4xl sm:text-5xl font-bold text-unaicNavy">
                                    {Number(stat.value).toLocaleString(isEn ? 'en-US' : 'id-ID')}{stat.suffix}
                                </span>
                                <p className="mt-2 text-gray-600 text-sm sm:text-base">
                                    {(isEn ? stat.labelEn : stat.label)}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Galeri Arsip */}
            <section className="w-full bg-gray-50 py-20">
                <div className="container mx-auto max-w-6xl px-4">
                    <h2 className="text-3xl font-bold font-heading text-center text-unaicNavy mb-12">
                        {t('galleryTitle')}
                    </h2>
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={containerVariants}
                    >
                        {archiveGallery?.map((image: string, index: number) => (
                            <motion.div
                                key={index}
                                className="relative h-48 overflow-hidden rounded-lg shadow-md group cursor-pointer"
                                variants={itemVariants}
                                onClick={() => setSelectedImage(image)}
                            >
                                <Image
                                    src={image}
                                    alt={`Galeri UNAIC ${index + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                                    <span className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        Lihat Detail
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="w-full bg-gradient-to-r from-blue-600 to-unaicNavy py-16">
                <div className="container mx-auto max-w-4xl px-4 text-center text-white">
                    <h2 className="font-heading text-3xl font-bold mb-4">
                        {t('ctaTitle')}
                    </h2>
                    <p className="text-gray-200 mb-8 max-w-2xl mx-auto">
                        {t('ctaDesc')}
                    </p>
                    <Link
                        href="/tentang/visi-misi"
                        className="inline-flex items-center gap-2 bg-unaicGold text-unaicNavy font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-yellow-400 transition-colors transform hover:scale-105"
                    >
                        <span>{t('ctaButton')}</span>
                        <ChevronRight size={20} />
                    </Link>
                </div>
            </section>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="relative max-w-5xl w-full h-full max-h-[90vh] flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
                            >
                                <X size={32} />
                            </button>
                            <div className="relative w-full h-full">
                                <Image
                                    src={selectedImage}
                                    alt="Preview Galeri"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
