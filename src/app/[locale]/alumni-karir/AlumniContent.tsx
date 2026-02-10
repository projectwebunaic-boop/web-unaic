"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Users, Briefcase, GraduationCap, Award, TrendingUp, Star, ChevronLeft, ChevronRight, HeartHandshake, ExternalLink } from "lucide-react";
import { Link } from '@/i18n/routing';
import Image from "next/image";
import HeroSection from "@/components/shared/HeroSection";
import NewsList from "@/components/news/NewsList";

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

interface AlumniData {
    stats: any[];
    services: any[];
    communities: any[];
    contributions: any[];
    featured: any[];
    stories: any[];
}

interface AlumniContentProps {
    data: AlumniData;
    newsData: any[];
}

export default function AlumniContent({ data, newsData }: AlumniContentProps) {
    // Mapping icons for dynamic services
    const getIcon = (idx: number) => {
        const icons = [<Briefcase key={0} className="w-12 h-12 text-unaicBlue" />, <TrendingUp key={1} className="w-12 h-12 text-unaicBlue" />, <Users key={2} className="w-12 h-12 text-unaicBlue" />];
        return icons[idx % icons.length];
    };

    const getStatIcon = (idx: number) => {
        const icons = [<Users key={0} className="w-8 h-8 text-unaicNavy" />, <Briefcase key={1} className="w-8 h-8 text-unaicNavy" />, <Award key={2} className="w-8 h-8 text-unaicNavy" />, <Star key={3} className="w-8 h-8 text-unaicNavy" />];
        return icons[idx % icons.length];
    };

    return (
        <main className="font-sans text-gray-700 bg-white">
            {/* Hero Section */}
            <HeroSection
                title="Alumni & Karir"
                subtitle="Jaringan alumni yang kuat dan layanan karir terdepan untuk kesuksesan masa depan Anda."
            />

            {/* Description Section */}
            <section className="py-16 sm:py-24 bg-gray-50">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={fadeUpVariants}
                        >
                            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-unaicNavy mb-6">
                                Jaringan Alumni & Karir UNAIC
                            </h2>
                            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                                <p>
                                    Universitas Al-Irsyad Cilacap (UNAIC) memiliki jaringan alumni yang kuat dan tersebar di berbagai bidang profesional.
                                </p>
                                <p>
                                    Melalui portal ini, kami menyediakan berbagai layanan karir, informasi lowongan, serta wadah bagi alumni untuk tetap terhubung dan berkontribusi bagi almamater.
                                </p>
                            </div>
                        </motion.div>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={fadeUpVariants}
                            className="flex justify-center lg:justify-end"
                        >
                            <div className="bg-unaicBlue p-8 rounded-2xl shadow-lg">
                                <GraduationCap className="w-24 h-24 text-white" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 sm:py-24">
                <div className="container mx-auto max-w-6xl px-4">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainerVariants} className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {data.stats.map((stat, index) => (
                            <motion.div key={index} variants={staggerItemVariants} className="text-center p-6 bg-white rounded-xl shadow-md border border-unaicNavy/10">
                                <div className="flex justify-center mb-4">{getStatIcon(index)}</div>
                                <div className="font-heading text-3xl font-bold text-unaicNavy mb-2">{stat.number}</div>
                                <div className="text-gray-600 font-medium">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Career Info Section (News Integration) */}
            <section className="py-16 sm:py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-unaicNavy mb-4">Informasi Karir & Lowongan</h2>
                        <p className="text-gray-600 text-lg">Peluang karir terbaru untuk alumni dan mahasiswa tingkat akhir</p>
                    </div>
                    {/* Using existing NewsList component with 'Karir' filter */}
                    <NewsList newsData={newsData} defaultTab="Karir" hideTabs limit={3} showButton />
                </div>
            </section>

            {/* Services Section */}
            <section className="py-16 sm:py-24">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-unaicNavy mb-4">Layanan Alumni</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {data.services.map((service, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-md border border-unaicNavy/10 p-8 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex justify-center mb-6">{getIcon(index)}</div>
                                <h3 className="font-heading text-xl font-semibold text-unaicNavy mb-4 text-center">{service.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-6">{service.description}</p>
                                <ul className="space-y-2">
                                    {service.features?.split(',').map((feature: string, idx: number) => (
                                        <li key={idx} className="flex items-center text-sm text-gray-600">
                                            <div className="w-2 h-2 bg-unaicBlue rounded-full mr-3"></div>{feature.trim()}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* NEW SECTION: Contributions & Communities */}
            <section className="py-16 sm:py-24 bg-unaicNavy/5">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Communities */}
                        <div>
                            <h3 className="font-heading text-2xl font-bold text-unaicNavy mb-6 flex items-center gap-2">
                                <Users className="w-6 h-6" /> Komunitas Alumni
                            </h3>
                            <div className="space-y-4">
                                {data.communities.map((com, idx) => (
                                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <h4 className="font-bold text-lg text-unaicNavy">{com.name}</h4>
                                        <p className="text-sm text-gray-600 mt-2"><span className="font-semibold">Aktivitas:</span> {com.activity}</p>
                                        <p className="text-sm text-gray-600 mt-1"><span className="font-semibold">Kontak:</span> {com.contact}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contributions */}
                        <div>
                            <h3 className="font-heading text-2xl font-bold text-unaicNavy mb-6 flex items-center gap-2">
                                <HeartHandshake className="w-6 h-6" /> Sumbangan & Kontribusi
                            </h3>
                            <div className="space-y-4">
                                {data.contributions.map((ctr, idx) => (
                                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-unaicGold/10 rounded-bl-full"></div>
                                        <h4 className="font-bold text-lg text-unaicNavy">{ctr.title}</h4>
                                        <p className="text-sm text-gray-600 mt-2 mb-4">{ctr.description}</p>
                                        <a href={ctr.link} target="_blank" className="text-sm font-semibold text-unaicBlue hover:underline flex items-center gap-1">
                                            Ikut Berkontribusi <ExternalLink size={14} />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Alumni Section */}
            <section className="py-16 sm:py-24">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-unaicNavy mb-4">Alumni Berprestasi</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {data.featured.map((alumni, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-md border border-unaicNavy/10 overflow-hidden hover:shadow-lg transition-all duration-300">
                                <div className="relative h-48 overflow-hidden bg-gray-100">
                                    {alumni.image ? (
                                        <Image src={alumni.image} alt={alumni.name} fill className="object-cover object-top transition-transform duration-300 hover:scale-110" />
                                    ) : (
                                        <Users className="w-20 h-20 text-gray-300 m-auto mt-14" />
                                    )}
                                    <div className="absolute top-4 left-4 bg-unaicBlue text-white text-xs px-3 py-1 rounded-full">{alumni.graduation}</div>
                                </div>
                                <div className="p-6">
                                    <h3 className="font-heading text-lg font-semibold text-unaicNavy mb-2">{alumni.name}</h3>
                                    <div className="text-sm text-gray-600 mb-3">
                                        <div className="font-medium">{alumni.position}</div>
                                        <div className="text-unaicBlue">{alumni.company}</div>
                                    </div>
                                    <blockquote className="text-sm text-gray-600 italic mb-4 border-l-4 border-unaicGold pl-4">"{alumni.testimonial}"</blockquote>
                                    <div className="mb-4">
                                        <h4 className="font-medium text-unaicNavy text-sm mb-2">Prestasi:</h4>
                                        <p className="text-xs text-gray-600">{alumni.achievements}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-unaicNavy to-unaicBlue py-16 sm:py-24">
                <div className="container mx-auto max-w-4xl px-4 text-center">
                    <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-6">Bergabung dengan Jaringan Alumni UNAIC</h2>
                    <p className="text-white text-lg mb-8 max-w-2xl mx-auto">Hubungi kami untuk informasi lebih lanjut tentang layanan karir dan jaringan alumni.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/kontak" className="inline-block bg-unaicGold hover:bg-yellow-400 text-unaicNavy font-semibold px-8 py-4 rounded-lg shadow-lg">Hubungi Career Center</Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
