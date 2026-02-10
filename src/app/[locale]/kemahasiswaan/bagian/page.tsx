"use client";

import { useEffect, useState, use } from "react";
import HeroSection from "@/components/shared/HeroSection";
import SectionTitle from "@/components/shared/SectionTitle";
import {
    Users, Star, HeartHandshake, Lightbulb, Home,
    Stethoscope, GraduationCap, BookOpen, Download, FileText, ChevronRight, Loader2, MessageCircle
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";

interface KemahasiswaanData {
    hero: { title: string; titleEn?: string; subtitle: string; subtitleEn?: string; };
    profile: { title: string; titleEn?: string; content: string; contentEn?: string; };
    layanan_umum: { title: string; titleEn?: string; content: string; contentEn?: string; };
    sections: { id: string; title: string; titleEn?: string; content: string; contentEn?: string; icon: string; slug: string; detail_content: string; detail_contentEn?: string; }[];
    documents: { id: string; title: string; titleEn?: string; url: string; }[];
    contact: { whatsapp: string; email: string; address: string; addressEn?: string; };
}

const iconMap: Record<string, any> = {
    Users, Star, HeartHandshake, Lightbulb, Home, Stethoscope, GraduationCap, BookOpen
};

export default function KemahasiswaanBagianPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = use(params);
    const [data, setData] = useState<KemahasiswaanData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/kemahasiswaan-bagian')
            .then(res => res.json())
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading || !data) {
        return <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 className="animate-spin text-unaicNavy" size={40} />
        </div>;
    }

    const isEn = locale === 'en';
    const t = (id: string | undefined, en: string | undefined) => isEn && en ? en : id;

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <main className="font-sans text-gray-700 bg-white min-h-screen">
            <HeroSection
                title={t(data.hero.title, data.hero.titleEn) || ""}
                subtitle={t(data.hero.subtitle, data.hero.subtitleEn) || ""}
                className="bg-gradient-to-br from-blue-700 via-blue-800 to-unaicNavy relative overflow-hidden"
            >
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
                </div>
            </HeroSection>

            {/* Profil & Layanan Umum */}
            <section className="py-20 bg-white relative">
                <div className="container mx-auto max-w-6xl px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="grid md:grid-cols-2 gap-12 items-center"
                    >
                        <motion.div variants={itemVariants} className="space-y-6">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest border border-blue-100">
                                {isEn ? "Unit Profile" : "Profil Unit"}
                            </div>
                            <h2 className="text-4xl font-extrabold text-unaicNavy leading-tight tracking-tight">
                                {t(data.profile.title, data.profile.titleEn)}
                            </h2>
                            <div className="w-20 h-1.5 bg-unaicGold rounded-full"></div>
                            <p className="text-gray-600 leading-relaxed text-lg italic border-l-4 border-blue-50 pl-6">
                                "{t(data.profile.content, data.profile.contentEn)}"
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="bg-gradient-to-br from-gray-50 to-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-blue-900/5 relative group">
                            <div className="absolute -top-6 -right-6 w-12 h-12 bg-unaicGold rounded-2xl flex items-center justify-center text-white shadow-lg transform rotate-12 transition-transform group-hover:rotate-0">
                                <Star size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-unaicNavy mb-6">
                                {t(data.layanan_umum.title, data.layanan_umum.titleEn)}
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {t(data.layanan_umum.content, data.layanan_umum.contentEn)}
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Seksi Layanan Grid */}
            <section className="py-24 bg-gray-50 border-y border-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/img/pattern.png')] opacity-[0.03]"></div>
                <div className="container mx-auto max-w-6xl px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <SectionTitle>{isEn ? "Coaching & Services" : "Bidang Pembinaan & Layanan"}</SectionTitle>
                        <p className="text-gray-500 max-w-2xl mx-auto mt-6 text-lg">
                            {isEn ? "Our commitment to facilitating every aspect of students' academic journey and self-development." : "Komitmen kami dalam memfasilitasi setiap aspek perjalanan akademik dan pengembangan diri mahasiswa."}
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {data.sections.map((sect) => {
                            const Icon = iconMap[sect.icon] || Users;
                            return (
                                <motion.div
                                    key={sect.id}
                                    variants={itemVariants}
                                    className="group"
                                >
                                    <Link
                                        href={`/${locale}/kemahasiswaan/bagian/${sect.slug}`}
                                        className="bg-white p-8 rounded-3xl shadow-sm border border-transparent hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 flex flex-col h-full"
                                    >
                                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-unaicNavy group-hover:text-white transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3 shadow-sm">
                                            <Icon size={32} />
                                        </div>
                                        <h4 className="text-xl font-bold text-unaicNavy mb-4 group-hover:text-blue-700 transition-colors line-clamp-2">
                                            {t(sect.title, sect.titleEn)}
                                        </h4>
                                        <p className="text-gray-500 leading-relaxed flex-1">
                                            {t(sect.content, sect.contentEn)}
                                        </p>
                                        <div className="mt-8 pt-6 border-t border-gray-50 flex items-center text-blue-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                            {isEn ? "Read More" : "Info Selengkapnya"} <ChevronRight size={16} className="ml-1" />
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Dokumen Unduhan */}
            <section className="py-24 bg-white">
                <div className="container mx-auto max-w-5xl px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-unaicNavy rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl shadow-blue-900/40"
                    >
                        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] -mr-40 -mt-40"></div>
                        <div className="absolute bottom-0 left-0 w-80 h-80 bg-unaicGold/10 rounded-full blur-[100px] -ml-40 -mb-40"></div>

                        <div className="relative z-10 grid lg:grid-cols-5 gap-12 items-center">
                            <div className="lg:col-span-2 space-y-6">
                                <h2 className="text-3xl font-extrabold leading-tight">{isEn ? "Documentation Center" : "Pusat Dokumentasi & Panduan"}</h2>
                                <p className="text-blue-100 text-lg">
                                    {isEn ? "Quick access to various legality documents, ethics, and student affairs operational guidelines." : "Akses cepat ke berbagai dokumen legalitas, etika, dan panduan operasional kemahasiswaan."}
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-white/10 rounded-2xl">
                                        <Download size={24} className="text-unaicGold" />
                                    </div>
                                    <span className="text-sm font-medium text-white/80">{isEn ? "PDF Format / Official Docs" : "Format PDF / Dokumen Resmi"}</span>
                                </div>
                            </div>

                            <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
                                {data.documents.map((doc) => (
                                    <motion.a
                                        key={doc.id}
                                        href={doc.url}
                                        target="_blank"
                                        whileHover={{ x: 5 }}
                                        className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition backdrop-blur-sm group"
                                    >
                                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-unaicGold group-hover:text-unaicNavy transition-all duration-300">
                                            <FileText size={20} />
                                        </div>
                                        <p className="font-bold text-sm truncate flex-1">
                                            {t(doc.title, doc.titleEn)}
                                        </p>
                                        <Download size={14} className="text-white/30 group-hover:text-white" />
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-24 bg-gray-50 border-t border-gray-100">
                <div className="container mx-auto max-w-4xl px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-extrabold text-unaicNavy mb-8 leading-tight">
                            {isEn ? "Responsive Services & Serving" : "Layanan Responsif & Melayani"} <br /><span className="text-blue-600 underline decoration-unaicGold decoration-4 underline-offset-8">{isEn ? "Every Aspiration" : "Setiap Aspirasi"}</span>
                        </h2>
                        <p className="text-gray-500 mb-12 text-xl max-w-2xl mx-auto leading-relaxed">
                            {isEn ? "Need further assistance or want to consult about student programs? Contact our team now." : "Butuh bantuan lebih lanjut atau ingin berkonsultasi mengenai program kemahasiswaan? Hubungi tim kami sekarang."}
                        </p>
                        <Link
                            href={`https://wa.me/${data.contact?.whatsapp || "6288905905905"}`}
                            target="_blank"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-unaicNavy text-white font-black rounded-full hover:bg-blue-800 transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-blue-900/20"
                        >
                            <MessageCircle size={24} /> {isEn ? "Contact via WhatsApp" : "Hubungi Kami via WhatsApp"}
                        </Link>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
