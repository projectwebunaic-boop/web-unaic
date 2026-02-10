"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Building, BookOpen, Coffee, Hospital, Home, Car, Star, LucideIcon } from "lucide-react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import HeroSection from "@/components/shared/HeroSection";
import { useLocale, useTranslations } from "next-intl";

const IconMap: { [key: string]: LucideIcon } = {
    Building, BookOpen, Coffee, Hospital, Home, Car, Star
};

const fadeInVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
};

const staggerItemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

interface FasilitasContentProps {
    data: {
        academic: any[];
        public: any[];
        gallery: string[];
        stats: any[];
    }
}

export default function FasilitasContent({ data }: FasilitasContentProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const locale = useLocale();
    const t = useTranslations('Facilities');
    const isEn = locale === 'en';

    const { academic, public: publicFacilities, gallery, stats } = data;

    // Carousel navigation handlers
    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
    };
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
    };

    return (
        <main className="font-sans text-gray-700 bg-white">
            {/* Hero Section */}
            <HeroSection
                title={t('heroTitle')}
                subtitle={t('heroSubtitle')}
            />

            {/* Fasilitas Akademik Section */}
            <section className="py-16 sm:py-24 bg-gray-50">
                <div className="container mx-auto max-w-6xl px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={staggerContainerVariants}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {academic.map((fasilitas, index) => {
                            const Icon = IconMap[fasilitas.icon] || BookOpen;
                            return (
                                <motion.div
                                    key={fasilitas.id || index}
                                    variants={staggerItemVariants}
                                    className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                                >
                                    <div className="overflow-hidden">
                                        <div className="relative h-48 w-full">
                                            <Image
                                                src={fasilitas.image || "/images/placeholder.jpg"}
                                                alt={fasilitas.title}
                                                fill
                                                className="object-cover transition-transform duration-300 hover:scale-105"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center mb-4">
                                            <Icon className="w-8 h-8 text-unaicNavy" />
                                            <h3 className="ml-3 font-heading text-xl font-semibold text-unaicNavy">{(isEn ? fasilitas.titleEn : fasilitas.title)}</h3>
                                        </div>
                                        <p className="text-gray-600">{(isEn ? fasilitas.descriptionEn : fasilitas.description)}</p>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Fasilitas Umum & Penunjang Section */}
            <section className="py-16 sm:py-24">
                <div className="container mx-auto max-w-6xl px-4 space-y-16">
                    {publicFacilities.map((fasilitas, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <motion.div
                                key={fasilitas.id || index}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                                variants={fadeUpVariants}
                                className={`flex flex-col md:flex-row items-center gap-8 ${isEven ? "md:flex-row" : "md:flex-row-reverse"
                                    }`}
                            >
                                <div className="md:w-1/2 overflow-hidden rounded-xl shadow-lg cursor-pointer w-full relative h-[300px] md:h-[400px]">
                                    <Image
                                        src={fasilitas.image || "/images/placeholder.jpg"}
                                        alt={fasilitas.title}
                                        fill
                                        className="object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                                <div className="md:w-1/2">
                                    <h3 className="font-heading text-2xl font-bold text-unaicNavy mb-4">{(isEn ? fasilitas.titleEn : fasilitas.title)}</h3>
                                    <p className="text-gray-600">{(isEn ? fasilitas.descriptionEn : fasilitas.description)}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* Galeri Fasilitas Section */}
            {gallery && gallery.length > 0 && (
                <section className="py-16 sm:py-24 bg-gray-50">
                    <div className="container mx-auto max-w-6xl px-4">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeInVariants}
                            className="relative"
                        >
                            <div className="overflow-hidden rounded-xl shadow-lg">
                                <div className="relative h-64 md:h-[500px]">
                                    <Image
                                        src={gallery[currentSlide] || "/images/placeholder.jpg"}
                                        alt={`Galeri Fasilitas ${currentSlide + 1}`}
                                        fill
                                        className="object-cover rounded-xl"
                                    />
                                </div>
                            </div>
                            {/* Navigation Arrows */}
                            <button
                                onClick={prevSlide}
                                aria-label="Previous Slide"
                                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow-md hover:bg-opacity-100 transition"
                            >
                                &#8592;
                            </button>
                            <button
                                onClick={nextSlide}
                                aria-label="Next Slide"
                                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow-md hover:bg-opacity-100 transition"
                            >
                                &#8594;
                            </button>
                            {/* Dots */}
                            <div className="flex justify-center mt-4 space-x-2">
                                {gallery.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentSlide(idx)}
                                        aria-label={`Go to slide ${idx + 1}`}
                                        className={`w-3 h-3 rounded-full ${idx === currentSlide ? "bg-unaicNavy" : "bg-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Statistik Section */}
            <section className="py-16 sm:py-24">
                <div className="container mx-auto max-w-6xl px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={staggerContainerVariants}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center"
                    >
                        {stats.map((stat, index) => {
                            const Icon = IconMap[stat.icon] || BookOpen;
                            return (
                                <motion.div
                                    key={stat.id || index}
                                    variants={staggerItemVariants}
                                    className="bg-white rounded-xl shadow-md p-6"
                                >
                                    <div className="flex justify-center mb-4">
                                        <Icon className="w-10 h-10 text-unaicGold" />
                                    </div>
                                    <p className="text-3xl font-bold text-unaicNavy">{stat.value}</p>
                                    <p className="text-gray-600">{(isEn ? stat.labelEn : stat.label)}</p>
                                </motion.div>
                            )
                        })}
                    </motion.div>
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
                            href="/kontak"
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
