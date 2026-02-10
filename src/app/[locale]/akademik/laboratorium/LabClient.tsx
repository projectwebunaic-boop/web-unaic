"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { FlaskRound, Microscope, ChevronLeft, ChevronRight, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import HeroSection from "@/components/shared/HeroSection";
import SectionTitle from "@/components/shared/SectionTitle";

interface LabItem {
    id: string;
    name: string;
    nameEn: string | null;
    description: string | null;
    descriptionEn: string | null;
    image: string | null;
    facilities: string[];
    facilitiesEn: string[];
}

interface LabConfig {
    title: string | null;
    titleEn: string | null;
    subtitle: string | null;
    subtitleEn: string | null;
    contactName: string | null;
    contactPhone: string | null;
    contactEmail: string | null;
    contactAddress: string | null;
    contactAddressEn: string | null;
}

interface LabClientProps {
    labs: LabItem[];
    config: LabConfig;
    locale: string;
    t: any; // Assuming translations are passed or use useTranslations
}

import { useTranslations } from "next-intl";

const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const fadeInVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
};

const staggerItemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function LabClient({ labs, config, locale }: { labs: LabItem[], config: LabConfig, locale: string }) {
    const t = useTranslations("Laboratory");
    const [currentSlide, setCurrentSlide] = useState(0);
    const isEn = locale === 'en';

    const galleryImages = labs.length > 0
        ? labs.map(lab => ({ src: lab.image || "/images/fasilitas/lab.jpg", caption: isEn ? (lab.nameEn || lab.name) : lab.name }))
        : [
            { src: "/images/fasilitas/lab.jpg", caption: isEn ? "UNAIC Modern Laboratory" : "Laboratorium Modern UNAIC" },
            { src: "/images/fasilitas/lab.jpg", caption: isEn ? "Practicum Facilities" : "Fasilitas Praktikum" }
        ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
    };

    return (
        <main className="bg-white font-sans text-gray-700">
            {/* Hero Section */}
            <HeroSection
                title={isEn ? (config.titleEn || config.title || "Laboratorium UNAIC") : (config.title || "Laboratorium UNAIC")}
                subtitle={isEn ? (config.subtitleEn || config.subtitle || "") : (config.subtitle || "")}
            />

            <section className="container mx-auto px-4 py-12">
                <SectionTitle>{t("headerTitle")}</SectionTitle>

                {/* Introduction Section */}
                <section className="py-16 sm:py-24 bg-gray-50 rounded-[3rem] mt-8 overflow-hidden">
                    <div className="container mx-auto max-w-6xl px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                                variants={fadeUpVariants}
                            >
                                <h2 className="font-heading text-3xl sm:text-4xl font-black text-unaicNavy mb-8 tracking-tight capitalize">
                                    {t("introTitle")}
                                </h2>
                                <div className="space-y-6 text-gray-600 text-lg leading-relaxed font-medium">
                                    <p>{t("introText1")}</p>
                                    <p>{t("introText2")}</p>
                                    <p>{t("introText3")}</p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                                variants={fadeUpVariants}
                                className="flex justify-center lg:justify-end"
                            >
                                <div className="bg-gradient-to-br from-unaicBlue to-unaicNavy p-12 rounded-[2.5rem] shadow-2xl relative group">
                                    <div className="absolute inset-0 bg-white/10 rounded-[2.5rem] scale-95 group-hover:scale-100 transition-transform duration-500"></div>
                                    <FlaskRound className="w-32 h-32 text-white relative z-10" />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Laboratory Grid Section */}
                <section className="py-24">
                    <div className="container mx-auto max-w-6xl px-4">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={fadeUpVariants}
                            className="text-center mb-16"
                        >
                            <h2 className="font-heading text-4xl font-black text-unaicNavy mb-6 tracking-tight capitalize">
                                {t("listTitle")}
                            </h2>
                            <div className="w-24 h-2 bg-unaicGold mx-auto rounded-full mb-8"></div>
                            <p className="text-gray-500 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                                {t("listSubtitle")}
                            </p>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={staggerContainerVariants}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                        >
                            {labs.map((lab, index) => (
                                <motion.div
                                    key={lab.id}
                                    variants={staggerItemVariants}
                                    className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer group"
                                >
                                    <div className="overflow-hidden relative h-56">
                                        <Image
                                            src={lab.image || "/images/fasilitas/lab.jpg"}
                                            alt={lab.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            unoptimized
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-unaicNavy/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                                            <span className="text-white font-bold capitalize tracking-widest text-xs border-b border-white/50 pb-1">Selengkapnya</span>
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <div className="flex items-center mb-5">
                                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-unaicNavy group-hover:bg-unaicNavy group-hover:text-white transition-colors duration-500">
                                                {index % 2 === 0 ? <FlaskRound size={24} /> : <Microscope size={24} />}
                                            </div>
                                            <h3 className="ml-4 font-black text-xl text-unaicNavy leading-tight capitalize tracking-tight">
                                                {isEn ? (lab.nameEn || lab.name) : lab.name}
                                            </h3>
                                        </div>
                                        <p className="text-gray-500 leading-relaxed mb-6 font-medium text-sm line-clamp-3">
                                            {isEn ? (lab.descriptionEn || lab.description) : lab.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {(isEn ? (lab.facilitiesEn || lab.facilities) : lab.facilities).map((fac, i) => (
                                                <span key={i} className="text-[10px] font-black capitalize tracking-widest bg-gray-50 text-gray-400 px-3 py-1.5 rounded-xl border border-gray-100 group-hover:bg-blue-50 group-hover:text-blue-500 group-hover:border-blue-100 transition-colors">
                                                    {fac}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Gallery Section */}
                <section className="py-24 bg-gray-900 rounded-[4rem] text-white">
                    <div className="container mx-auto max-w-6xl px-4">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={fadeUpVariants}
                            className="text-center mb-16"
                        >
                            <h2 className="font-heading text-4xl font-black mb-4 tracking-tight capitalize">
                                {t("galleryTitle")}
                            </h2>
                            <p className="text-gray-400 text-lg font-medium">
                                {t("gallerySubtitle")}
                            </p>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={fadeInVariants}
                            className="relative max-w-4xl mx-auto"
                        >
                            <div className="overflow-hidden rounded-[2.5rem] shadow-2xl relative aspect-[16/10] md:aspect-[16/9] border-4 border-white/10">
                                <Image
                                    key={currentSlide}
                                    src={galleryImages[currentSlide].src}
                                    alt={galleryImages[currentSlide].caption}
                                    fill
                                    className="object-cover animate-in fade-in duration-700"
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                <div className="absolute bottom-10 left-10 right-10">
                                    <p className="text-white text-2xl font-black capitalize tracking-tight">
                                        {galleryImages[currentSlide].caption}
                                    </p>
                                </div>
                            </div>

                            {/* Navigation Arrows */}
                            <button
                                onClick={prevSlide}
                                className="absolute top-1/2 -left-6 md:-left-12 transform -translate-y-1/2 bg-white text-unaicNavy rounded-full p-4 shadow-2xl hover:bg-unaicGold transition-all duration-300 group"
                            >
                                <ChevronLeft className="w-8 h-8 group-hover:scale-110" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute top-1/2 -right-6 md:-right-12 transform -translate-y-1/2 bg-white text-unaicNavy rounded-full p-4 shadow-2xl hover:bg-unaicGold transition-all duration-300 group"
                            >
                                <ChevronRight className="w-8 h-8 group-hover:scale-110" />
                            </button>

                            {/* Dots Indicator */}
                            <div className="flex justify-center mt-10 space-x-3">
                                {galleryImages.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentSlide(idx)}
                                        className={`h-2.5 rounded-full transition-all duration-500 ${idx === currentSlide ? "bg-unaicGold w-12" : "bg-white/20 w-2.5"
                                            }`}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* CTA / Contact Section */}
                <section className="py-24">
                    <div className="container mx-auto max-w-5xl px-4">
                        <motion.div
                            className="bg-gradient-to-br from-unaicNavy to-[#0A2E5C] rounded-[3rem] p-12 md:p-20 text-white text-center shadow-2xl relative overflow-hidden"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={fadeUpVariants}
                        >
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                            <div className="relative z-10">
                                <h2 className="font-heading text-4xl md:text-5xl font-black mb-8 capitalize tracking-tighter">
                                    {t("ctaTitle")}
                                </h2>
                                <p className="text-blue-100/80 text-xl mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
                                    {t("ctaDesc")}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                    <div className="text-left bg-white/10 p-8 rounded-[2rem] backdrop-blur-md border border-white/10 hover:bg-white/15 transition-colors">
                                        <p className="text-unaicGold text-xs font-black capitalize tracking-widest mb-4">{t("info.contactPerson")}</p>
                                        <p className="text-white font-black text-2xl mb-2">{config.contactName || "Administrator Lab"}</p>
                                        <a href={`tel:${config.contactPhone}`} className="text-white/80 hover:text-white flex items-center gap-3 transition-colors font-bold">
                                            <div className="bg-green-500/20 p-2 rounded-xl text-green-400">
                                                <Phone size={18} />
                                            </div>
                                            {config.contactPhone || "-"}
                                        </a>
                                    </div>
                                    <div className="text-left bg-white/10 p-8 rounded-[2rem] backdrop-blur-md border border-white/10 hover:bg-white/15 transition-colors">
                                        <p className="text-unaicGold text-xs font-black capitalize tracking-widest mb-4">{t("info.locationEmail")}</p>
                                        <div className="space-y-4">
                                            <p className="text-white font-bold leading-snug flex items-start gap-3">
                                                <MapPin size={20} className="text-blue-400 shrink-0 mt-1" />
                                                {isEn ? (config.contactAddressEn || config.contactAddress || "-") : (config.contactAddress || "-")}
                                            </p>
                                            <a href={`mailto:${config.contactEmail}`} className="text-blue-300/80 hover:text-blue-200 block font-mono text-sm underline decoration-blue-500/30 underline-offset-4">
                                                <Mail size={16} className="inline mr-2" />
                                                {config.contactEmail || "-"}
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-center gap-6">
                                    <Link
                                        href={`https://wa.me/${config.contactPhone?.replace(/[^0-9]/g, "")}`}
                                        target="_blank"
                                        className="bg-green-500 text-white font-black px-10 py-5 rounded-2xl shadow-xl hover:bg-green-600 transition-all transform hover:scale-105 capitalize tracking-widest text-sm flex items-center justify-center gap-3"
                                    >
                                        Chat WhatsApp
                                    </Link>
                                    <Link
                                        href="/kontak"
                                        className="bg-white text-unaicNavy font-black px-10 py-5 rounded-2xl shadow-xl hover:bg-gray-100 transition-all transform hover:scale-105 capitalize tracking-widest text-sm"
                                    >
                                        {t("ctaContactBtn")}
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </section>
        </main>
    );
}
