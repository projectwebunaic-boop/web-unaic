"use client";

import { motion } from "framer-motion";
import { BookOpen, Search, Monitor, Clock, ExternalLink, MapPin, Phone, GraduationCap, Database, RefreshCw, Mail } from "lucide-react";
import HeroSection from "@/components/shared/HeroSection";
import { useTranslations } from "next-intl";

interface LibraryConfig {
    simpusUrl: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    addressEn: string | null;
    weekdayHours: string | null;
    saturdayHours: string | null;
}

interface LibraryClientProps {
    config: LibraryConfig;
    locale: string;
}

export default function LibraryClient({ config, locale }: LibraryClientProps) {
    const t = useTranslations("Library");
    const isEn = locale === 'en';

    const fadeInVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
    };

    const slideUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    };

    const services = [
        { key: "opac", icon: <Search size={32} /> },
        { key: "repository", icon: <GraduationCap size={32} /> },
        { key: "journal", icon: <Database size={32} /> },
        { key: "circulation", icon: <RefreshCw size={32} /> },
    ];

    return (
        <main className="font-sans text-gray-700 bg-white min-h-screen">
            <HeroSection
                title={t("title")}
                subtitle={t("subtitle")}
            />

            {/* Portal Highlight Section */}
            <section className="py-20 container mx-auto px-4 max-w-6xl">
                <motion.div
                    className="bg-gradient-to-br from-unaicNavy to-[#0A2E5C] rounded-[2rem] p-8 md:p-16 text-white text-center shadow-2xl relative overflow-hidden"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInVariants}
                >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-unaicGold/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

                    <div className="relative z-10 space-y-8">
                        <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm mb-4">
                            <Monitor size={48} className="text-unaicGold" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight">{t("portalTitle")}</h2>
                        <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                            {t("portalDesc")}
                        </p>
                        <div>
                            <a
                                href={config.simpusUrl || "https://simpus.universitasalirsyad.ac.id/"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 bg-unaicGold text-unaicNavy px-10 py-5 rounded-2xl font-black text-xl hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-xl"
                            >
                                {t("portalBtn")}
                                <ExternalLink size={24} />
                            </a>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Services Grid */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 max-w-6xl">
                    <motion.div
                        className="text-center mb-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={slideUpVariants}
                    >
                        <h2 className="text-4xl font-black text-unaicNavy mb-4">{t("servicesTitle")}</h2>
                        <div className="w-24 h-2 bg-unaicGold mx-auto rounded-full"></div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {services.map((item, i) => (
                            <motion.div
                                key={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={slideUpVariants}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all group"
                            >
                                <div className="w-16 h-16 bg-blue-50 text-unaicNavy rounded-2xl flex items-center justify-center mb-6 group-hover:bg-unaicNavy group-hover:text-white transition-colors">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-unaicNavy mb-3">
                                    {t(`services.${item.key}.title`)}
                                </h3>
                                <p className="text-gray-500 leading-relaxed font-medium">
                                    {t(`services.${item.key}.desc`)}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Practical Info Section */}
            <section className="py-20 container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Hours */}
                    <motion.div
                        className="space-y-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={slideUpVariants}
                    >
                        <h3 className="text-2xl font-black text-unaicNavy flex items-center gap-3">
                            <Clock size={28} className="text-unaicGold" />
                            {t("info.hours")}
                        </h3>
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 font-semibold">
                            <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                                <span className="text-gray-500">{t("info.weekday")}</span>
                                <span className="text-unaicNavy">{config.weekdayHours}</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                                <span className="text-gray-500">{t("info.saturday")}</span>
                                <span className="text-unaicNavy">{config.saturdayHours}</span>
                            </div>
                            <div className="flex justify-between items-center text-red-500">
                                <span>{t("info.sunday")}</span>
                                <span>{t("info.closed")}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Location */}
                    <motion.div
                        className="space-y-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={slideUpVariants}
                        transition={{ delay: 0.1 }}
                    >
                        <h3 className="text-2xl font-black text-unaicNavy flex items-center gap-3">
                            <MapPin size={28} className="text-unaicGold" />
                            {t("info.location")}
                        </h3>
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full font-semibold">
                            <p className="leading-relaxed mb-4 text-gray-600">
                                {isEn ? config.addressEn : config.address}
                            </p>
                        </div>
                    </motion.div>

                    {/* Contact */}
                    <motion.div
                        className="space-y-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={slideUpVariants}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className="text-2xl font-black text-unaicNavy flex items-center gap-3">
                            <Phone size={28} className="text-unaicGold" />
                            {t("info.contact")}
                        </h3>
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full space-y-4 font-semibold">
                            <a href={`tel:${config.phone}`} className="flex items-center gap-3 text-gray-600 hover:text-unaicNavy transition group">
                                <span className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-unaicNavy group-hover:bg-unaicNavy group-hover:text-white transition-colors">
                                    <Phone size={18} />
                                </span>
                                {config.phone}
                            </a>
                            <a href={`mailto:${config.email}`} className="flex items-center gap-3 text-gray-600 hover:text-unaicNavy transition group">
                                <span className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-unaicNavy group-hover:bg-unaicNavy group-hover:text-white transition-colors">
                                    <Mail size={18} />
                                </span>
                                {config.email}
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
