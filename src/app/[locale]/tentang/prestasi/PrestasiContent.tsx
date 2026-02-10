"use client";

import { useState, useEffect } from "react";
import HeroSection from "@/components/shared/HeroSection";
import { useLocale, useTranslations } from "next-intl";
import { motion, Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, GraduationCap, BookOpen, Globe, Award, MessageSquare, Trophy, PenTool, Lightbulb, Bot, LucideIcon } from "lucide-react";
import Image from "next/image";

const IconMap: { [key: string]: LucideIcon } = {
    GraduationCap, BookOpen, Globe, Award, MessageSquare, Trophy, PenTool, Lightbulb, Bot
};

const fadeInVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const slideUpVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

interface PrestasiContentProps {
    data: {
        stats: any[];
        highlights: any[];
        carousel: any[];
        timeline: any[];
    }
}

export default function PrestasiContent({ data }: PrestasiContentProps) {
    const { stats, highlights, carousel, timeline } = data;
    const [counts, setCounts] = useState(stats.map(() => 0));
    const [carouselIndex, setCarouselIndex] = useState(0);
    const locale = useLocale();
    const t = useTranslations('Achievements');
    const isEn = locale === 'en';

    useEffect(() => {
        const intervals = stats.map((stat, idx) => {
            return setInterval(() => {
                setCounts((prev) => {
                    const newCounts = [...prev];
                    if (newCounts[idx] < stat.count) {
                        newCounts[idx] += 1;
                    }
                    return newCounts;
                });
            }, 20);
        });
        return () => intervals.forEach(clearInterval);
    }, [stats]);

    useEffect(() => {
        if (carousel.length === 0) return;
        const autoSlide = setInterval(() => {
            setCarouselIndex((prev) => (prev + 1) % carousel.length);
        }, 5000);
        return () => clearInterval(autoSlide);
    }, [carousel.length]);

    const prevSlide = () => {
        if (carousel.length === 0) return;
        setCarouselIndex((prev) => (prev === 0 ? carousel.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        if (carousel.length === 0) return;
        setCarouselIndex((prev) => (prev + 1) % carousel.length);
    };

    return (
        <main className="font-sans text-gray-700 bg-white">
            <HeroSection
                title={t('heroTitle')}
                subtitle={t('heroSubtitle')}
            />

            {/* Highlight Prestasi (Statistik Cepat) */}
            <section className="container mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-4 gap-6">
                {stats.map((stat, idx) => {
                    const IconComponent = IconMap[stat.icon] || Award;
                    return (
                        <motion.div
                            key={stat.id || idx}
                            className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center shadow-md"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={slideUpVariants}
                        >
                            <div className="mb-4">
                                <IconComponent className="w-8 h-8 text-unaicNavy" />
                            </div>
                            <div className="text-3xl font-bold text-unaicNavy">{counts[idx]}</div>
                            <div className="text-gray-600 mt-2 text-center">{(isEn ? stat.labelEn : stat.label)}</div>
                        </motion.div>
                    );
                })}
            </section>

            {/* Prestasi Unggulan (Grid Cards) */}
            <section className="container mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold text-unaicNavy mb-8 text-center">{t('highlightsTitle')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {highlights.map((item, idx) => (
                        <motion.div
                            key={item.id || idx}
                            className="relative rounded-lg overflow-hidden shadow-lg cursor-pointer group h-[300px]"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInVariants}
                        >
                            <Image
                                src={item.photo || "/images/placeholder.jpg"}
                                alt={item.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
                            <div className="absolute bottom-0 p-4 text-white">
                                <h3 className="text-xl font-semibold">{(isEn ? item.titleEn : item.title)}</h3>
                                <p className="text-sm">{(isEn ? item.categoryEn : item.category)} - {item.year}</p>
                                <p className="mt-1 text-sm">{(isEn ? item.descriptionEn : item.description)}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Carousel Prestasi Internasional */}
            {carousel.length > 0 && (
                <section className="relative w-full overflow-hidden">
                    <div className="flex transition-transform duration-700" style={{ transform: `translateX(-${carouselIndex * 100}%)` }}>
                        {carousel.map((slide, idx) => (
                            <div key={slide.id || idx} className="min-w-full relative h-[400px] md:h-[500px]">
                                <Image src={slide.photo || "/images/placeholder.jpg"} alt={slide.title} fill className="object-cover" />
                                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-4 rounded">
                                    <h3 className="text-lg font-semibold">{(isEn ? slide.titleEn : slide.title)}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Navigation */}
                    <button
                        onClick={prevSlide}
                        aria-label="Previous Slide"
                        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 transition"
                    >
                        <ChevronLeft className="w-6 h-6 text-unaicNavy" />
                    </button>
                    <button
                        onClick={nextSlide}
                        aria-label="Next Slide"
                        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 transition"
                    >
                        <ChevronRight className="w-6 h-6 text-unaicNavy" />
                    </button>
                    {/* Dots */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {carousel.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCarouselIndex(idx)}
                                className={`w-3 h-3 rounded-full ${carouselIndex === idx ? "bg-unaicNavy" : "bg-gray-300"}`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Timeline Prestasi */}
            <section className="container mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold text-unaicNavy mb-8 text-center">{t('timelineTitle')}</h2>
                <div className="flex flex-col md:flex-row md:space-x-8 overflow-x-auto pb-4">
                    {timeline.map((item, idx) => {
                        const Icon = IconMap[item.icon] || Award;
                        return (
                            <motion.div
                                key={item.id || idx}
                                className="flex items-center mb-6 md:mb-0 min-w-[200px]"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={slideUpVariants}
                            >
                                <Icon className="w-6 h-6 mr-4 text-unaicNavy shrink-0" />
                                <p className="text-gray-700">{item.year}: {(isEn ? item.descriptionEn : item.description)}</p>
                            </motion.div>
                        )
                    })}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-unaicBlue to-unaicNavy py-16 text-center text-white">
                <h2 className="text-3xl font-bold mb-6">{t('ctaTitle')}</h2>
                <a
                    href="/pendaftaran"
                    className="inline-block bg-unaicGold text-unaicNavy font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-yellow-400 transition-colors duration-300 text-lg"
                >
                    {t('ctaButton')}
                </a>
            </section>
        </main>
    );
}
