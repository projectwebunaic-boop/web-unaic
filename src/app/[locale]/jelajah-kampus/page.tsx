"use client";

import React from "react";
import HeroSection from "@/components/shared/HeroSection";
import { motion } from "framer-motion";
import { MapPin, Building, Trees, GraduationCap, ArrowRight, Play } from "lucide-react";
import Image from "next/image";
import { Link } from '@/i18n/routing';
import { useTranslations } from "next-intl";

export default function JelajahKampusPage() {
    const t = useTranslations('CampusTour');

    const facilities = [
        { title: t('facilities.items.classroom.title'), img: "/images/fasilitas/ruang-kelas.jpg", desc: t('facilities.items.classroom.desc') },
        { title: t('facilities.items.lab.title'), img: "/images/fasilitas/lab.jpg", desc: t('facilities.items.lab.desc') },
        { title: t('facilities.items.library.title'), img: "/images/fasilitas/perpustakaan.jpg", desc: t('facilities.items.library.desc') },
        { title: t('facilities.items.dorm.title'), img: "/images/fasilitas/asrama.jpg", desc: t('facilities.items.dorm.desc') },
        { title: t('facilities.items.sport.title'), img: "/images/fasilitas/parkiran.jpg", desc: t('facilities.items.sport.desc') },
        { title: t('facilities.items.canteen.title'), img: "/images/fasilitas/kantin.jpg", desc: t('facilities.items.canteen.desc') },
    ];

    const introList = [
        t('intro.list.0'),
        t('intro.list.1'),
        t('intro.list.2'),
        t('intro.list.3')
    ];

    return (
        <main className="font-sans text-gray-700 bg-white">
            {/* 1. Immersive Hero Section */}
            <HeroSection
                title={t('heroTitle')}
                subtitle={t('heroSubtitle')}
                backgroundImage="/images/hero-poster.jpg"
            />

            {/* 2. Intro: Green & Islamic Campus */}
            <section className="py-20 -mt-1 relative z-30">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative rounded-2xl overflow-hidden shadow-2xl h-[400px]"
                        >
                            <Image
                                src="/images/fasilitas/masjid.jpg" // Fallback if specific image not avail
                                alt="Suasana Kampus UNAIC"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center gap-2 text-unaicGold mb-4">
                                <Trees size={24} />
                                <span className="font-bold uppercase tracking-wider text-sm">{t('intro.badge')}</span>
                            </div>
                            <h2 className="font-heading text-4xl font-bold text-unaicNavy mb-6">
                                {t('intro.title')}
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                {t('intro.desc')}
                            </p>
                            <ul className="space-y-3 mb-8">
                                {introList.map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-gray-700 font-medium">
                                        <div className="w-2 h-2 rounded-full bg-unaicBlue" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 3. Facilities Highlights (Grid) */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center mb-16">
                        <h2 className="font-heading text-3xl md:text-4xl font-bold text-unaicNavy mb-4">{t('facilities.title')}</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">{t('facilities.desc')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {facilities.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="h-48 relative overflow-hidden">
                                    <Image
                                        src={item.img}
                                        alt={item.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <div className="p-6">
                                    <h3 className="font-bold text-xl text-unaicNavy mb-2">{item.title}</h3>
                                    <p className="text-gray-600 text-sm">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link href="/tentang/fasilitas" className="inline-flex items-center font-semibold text-unaicBlue hover:text-unaicNavy transition-colors">
                            {t('facilities.viewAll')} <ArrowRight size={20} className="ml-2" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 4. Virtual Tour / Video Profile */}
            <section className="py-20 bg-unaicNavy text-white overflow-hidden relative">
                <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.png')] bg-repeat" />
                <div className="container mx-auto px-6 max-w-5xl relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 border border-white/20 text-unaicGold text-sm font-semibold mb-6">
                        <Play size={16} /> {t('virtualTour.badge')}
                    </div>
                    <h2 className="font-heading text-3xl md:text-5xl font-bold mb-8">{t('virtualTour.title')}</h2>

                    <div className="relative aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 group cursor-pointer">
                        {/* Video Placeholder - Replacing static image with actual video if available, else poster */}
                        <video
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                            poster="/images/hero-poster.jpg"
                            controls
                        >
                            <source src="/video/hero/hero.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-20 h-20 bg-unaicGold/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 animate-pulse">
                                <Play size={32} className="text-unaicNavy ml-1" fill="currentColor" />
                            </div>
                        </div>
                    </div>
                    <p className="mt-8 text-white/80 text-lg">
                        {t('virtualTour.desc')}
                    </p>
                </div>
            </section>

            {/* 5. Location Map */}
            <section className="py-20">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid md:grid-cols-2 gap-12 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="p-10 flex flex-col justify-center bg-unaicBlue/5">
                            <div className="flex items-center gap-3 text-unaicBlue mb-4">
                                <MapPin size={28} />
                                <span className="font-bold text-lg uppercase tracking-wider">{t('location.badge')}</span>
                            </div>
                            <h2 className="font-heading text-3xl md:text-4xl font-bold text-unaicNavy mb-6">
                                {t('location.title')}
                            </h2>
                            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                                {t('location.desc')}
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                                    <MapPin className="text-unaicGold mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-unaicNavy">{t('location.addressTitle')}</h4>
                                        <p className="text-gray-600 text-sm">{t('location.addressDesc')}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                                    <Building className="text-unaicGold mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-unaicNavy">{t('location.landmarkTitle')}</h4>
                                        <p className="text-gray-600 text-sm">{t('location.landmarkDesc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-full min-h-[400px] w-full bg-gray-200 relative">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.853037090885!2d109.00696131538356!3d-7.729007679805987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e650c8d1e378941%3A0x67a364d935f8c872!2sUniversitas%20Al-Irsyad%20Cilacap!5e0!3m2!1sid!2sid!4v1629789378902!5m2!1sid!2sid"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="absolute inset-0"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. CTA Footer */}
            <section className="bg-unaicGold py-20">
                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <h2 className="font-heading text-3xl md:text-5xl font-bold text-unaicNavy mb-6">{t('cta.title')}</h2>
                    <p className="text-unaicNavy/80 text-xl mb-10">{t('cta.desc')}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="https://pmb.universitasalirsyad.ac.id" target="_blank" className="px-8 py-4 bg-unaicNavy text-white font-bold rounded-xl shadow-lg hover:bg-blue-900 transition-all hover:scale-105 flex items-center justify-center gap-2">
                            <GraduationCap size={20} /> {t('cta.register')}
                        </a>
                        <Link href="/akademik/fakultas" className="px-8 py-4 bg-white/20 border-2 border-unaicNavy text-unaicNavy font-bold rounded-xl hover:bg-white/40 transition-all hover:scale-105">
                            {t('cta.programs')}
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
