"use client";

import { motion, Variants } from "framer-motion";
import { Eye, BookOpen, Settings, Handshake, TrendingUp, Book, Lightbulb, Users, Award } from "lucide-react";
import { Link } from "@/i18n/routing";
import HeroSection from "@/components/shared/HeroSection";
import { useLocale, useTranslations } from "next-intl";

const IconMap: { [key: string]: any } = {
    Eye, BookOpen, Settings, Handshake, TrendingUp, Book, Lightbulb, Users, Award
};

const fadeInVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.8, ease: "easeOut" },
    },
};

const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" },
    },
};

const staggerContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
};

const staggerItemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

interface VisiMisiContentProps {
    vision: { content: string; contentEn?: string };
    mission: { id: string; title: string; description: string; icon: string; titleEn?: string; descriptionEn?: string }[];
}

export default function VisiMisiContent({ vision, mission }: VisiMisiContentProps) {
    const locale = useLocale();
    const t = useTranslations('VisiMisi');
    const isEn = locale === 'en';

    return (
        <main className="font-sans text-gray-700 bg-white">
            {/* Hero Section */}
            <HeroSection
                title={t('heroTitle')}
                subtitle={t('heroSubtitle')}
            />

            {/* Visi Section */}
            <section className="bg-gray-50 py-16 sm:py-24">
                <div className="container mx-auto max-w-4xl px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeUpVariants}
                        className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center"
                    >
                        <h2 className="font-heading text-3xl font-bold text-unaicNavy mb-6">
                            {t('visionTitle')}
                        </h2>
                        <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
                            {(isEn ? vision?.contentEn : vision?.content) || "Visi belum ditambahkan."}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Misi Section */}
            <section className="bg-white py-16 sm:py-24">
                <div className="container mx-auto max-w-6xl px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeInVariants}
                        className="text-center mb-12"
                    >
                        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-unaicNavy mb-4">
                            {t('missionTitle')}
                        </h2>
                        <div className="w-16 h-1 bg-unaicGold mx-auto"></div>
                    </motion.div>

                    {mission ? (
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={staggerContainerVariants}
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        >
                            {mission.map((misi: any, index: number) => {
                                const IconComponent = IconMap[misi.icon] || BookOpen;
                                return (
                                    <motion.div
                                        key={index}
                                        variants={staggerItemVariants}
                                        className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
                                    >
                                        <div className="flex items-center mb-4">
                                            <div className="w-12 h-12 bg-unaicGold bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                                                <IconComponent className="w-6 h-6 text-unaicNavy" />
                                            </div>
                                            <h3 className="font-heading text-xl font-semibold text-unaicNavy">
                                                {(isEn ? misi.titleEn : misi.title)}
                                            </h3>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed">
                                            {(isEn ? misi.descriptionEn : misi.description)}
                                        </p>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <div className="text-center py-10">Misi belum ditambahkan.</div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-unaicBlue to-unaicNavy py-16 sm:py-24">
                <div className="container mx-auto max-w-4xl px-4 text-center text-white">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeUpVariants}
                    >
                        <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-6">
                            {t('ctaTitle')}
                        </h2>
                        <p className="text-lg mb-8 max-w-2xl mx-auto">
                            {t('ctaDesc')}
                        </p>
                        <Link
                            href="/tentang/profil"
                            className="inline-block bg-unaicGold text-unaicNavy font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-yellow-400 transition-colors duration-300 text-lg"
                        >
                            {t('ctaButton')}
                        </Link>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
