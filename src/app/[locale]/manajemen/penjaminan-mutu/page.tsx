import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import {
    ShieldCheck,
    ClipboardCheck,
    Award,
    BarChart,
    FileText,
    Target,
    Users,
    GraduationCap,
    UserCheck,
    Building,
    BookOpen,
    FlaskConical,
    Handshake,
    ArrowRight,
    MapPin,
    Mail,
    Phone
} from "lucide-react";
// Import Data Statis
import lpmData from "@/data/lpm.json";
import HeroSection from "@/components/shared/HeroSection";

import prisma from "@/lib/prisma";

// 1. Force Dynamic Rendering to prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable ISR

async function getLPMData() {
    try {
        // Fetch all relevant data from DB
        const [profile, agendas, criteria, documents, staff, heroItem, contactItem] = await Promise.all([
            prisma.lpmProfile.findFirst(),
            prisma.lpmAgenda.findMany({ orderBy: { date: 'desc' }, take: 3 }),
            prisma.lpmCriterion.findMany({ orderBy: { order: 'asc' } }),
            prisma.lpmDocument.findMany({ orderBy: { order: 'asc' } }),
            prisma.lpmStaff.findMany({ orderBy: { order: 'asc' } }),
            prisma.pageContent.findUnique({ where: { pageSlug_section: { pageSlug: 'lpm', section: 'hero' } } }),
            prisma.pageContent.findUnique({ where: { pageSlug_section: { pageSlug: 'lpm', section: 'contact' } } }),
        ]);

        const hero = heroItem ? JSON.parse(heroItem.content || '{}') : lpmData.hero;
        const contact = contactItem ? JSON.parse(contactItem.content || '{}') : lpmData.contact;

        return {
            hero,
            contact,
            profile,
            criteria,
            documents,
            structure: staff,
            agendas: (agendas || []).map(a => ({
                ...a,
                date: a.date.toISOString()
            }))
        };

    } catch (error) {
        console.error("Error reading LPM data from DB, falling back to JSON:", error);
        return {
            ...lpmData,
            agendas: (lpmData.agendas || []).map(a => ({ ...a, date: new Date(a.date).toISOString() }))
        };
    }
}

import { getLocale } from "next-intl/server";

export default async function PenjaminanMutuPage() {
    const locale = await getLocale();
    const isEn = locale === 'en';
    const data = await getLPMData();

    // Fallback if no data
    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-2xl shadow-sm border">
                    <ShieldCheck size={48} className="mx-auto text-gray-400 mb-4" />
                    <h2 className="text-xl font-bold text-gray-700">Data Tidak Tersedia</h2>
                    <p className="text-gray-500">Silakan hubungi administrator.</p>
                </div>
            </div>
        );
    }

    const { hero, criteria, contact } = data;

    const menuItems = [
        {
            title: isEn ? "LJM Profile" : "Profil LJM",
            description: isEn ? "About, Main Duties, and Activity Cycles." : "Profil, Tugas Pokok, dan Siklus Kegiatan.",
            icon: <Target className="group-hover:text-white text-unaicGold" size={32} />,
            href: "/manajemen/penjaminan-mutu/profil",
            color: "group-hover:bg-unaicNavy"
        },
        {
            title: isEn ? "Organizational Structure" : "Struktur Organisasi",
            description: isEn ? "The professional team behind quality assurance." : "Tim dan bagan organisasi LJM Universitas Al-Irsyad Cilacap.",
            icon: <Users className="group-hover:text-white text-unaicGold" size={32} />,
            href: "/manajemen/penjaminan-mutu/struktur",
            color: "group-hover:bg-unaicNavy"
        },
        {
            title: isEn ? "Legal Basis" : "Landasan Hukum",
            description: isEn ? "Legal documents and university regulations." : "Dokumen hukum dan regulasi universitas.",
            icon: <BookOpen className="group-hover:text-white text-unaicGold" size={32} />,
            href: "/manajemen/penjaminan-mutu/landasan-hukum",
            color: "group-hover:bg-unaicNavy"
        },
        {
            title: isEn ? "Quality Documents" : "Dokumen Mutu",
            description: isEn ? "Download portal for policies, manuals, and SOPs." : "Pusat unduhan dokumen kebijakan, manual, SOP, dan formulir.",
            icon: <FileText className="group-hover:text-white text-unaicGold" size={32} />,
            href: "/manajemen/penjaminan-mutu/dokumen",
            color: "group-hover:bg-unaicNavy"
        },
        {
            title: isEn ? "Accreditation & Audit" : "Akreditasi & Audit",
            description: isEn ? "Information on institution and study program accreditation." : "Informasi akreditasi institusi dan program studi.",
            icon: <ShieldCheck className="group-hover:text-white text-unaicGold" size={32} />,
            href: "/manajemen/penjaminan-mutu/akreditasi-audit",
            color: "group-hover:bg-unaicNavy"
        },
        {
            title: isEn ? "9 Accreditation Criteria" : "9 Kriteria Akreditasi",
            description: isEn ? "National accreditation standards guidelines." : "Standar penilaian akreditasi nasional yang menjadi acuan mutu universitas.",
            icon: <Award className="group-hover:text-white text-unaicGold" size={32} />,
            href: "/manajemen/penjaminan-mutu/kriteria",
            color: "group-hover:bg-unaicNavy"
        }
    ];

    return (
        <main className="min-h-screen bg-white overflow-hidden">
            {/* HERO SECTION */}
            <HeroSection
                title={isEn ? (hero?.titleEn || hero?.title) : (hero?.title || "Lembaga Jaminan Mutu")}
                subtitle={isEn ? (hero?.subtitleEn || hero?.subtitle) : (hero?.subtitle || "Menjamin standar mutu pendidikan tinggi yang unggul.")}
            />

            <div className="w-full max-w-7xl mx-auto px-4 py-8 md:px-6 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

                    {/* LEFT COLUMN: Content */}
                    <div className="lg:col-span-2 space-y-16">

                        {/* MENU GRID */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {menuItems.map((item, idx) => (
                                <Link
                                    key={idx}
                                    href={item.href}
                                    className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[180px]"
                                >
                                    <div>
                                        <div className={`w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center mb-4 transition-colors duration-300 ${item.color}`}>
                                            {item.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-unaicNavy mb-2">{item.title}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                                    </div>
                                    <div className="mt-4 flex items-center text-unaicGold font-semibold text-sm group-hover:gap-2 transition-all">
                                        Selengkapnya <ArrowRight size={16} className="ml-1" />
                                    </div>
                                </Link>
                            ))}
                        </section>

                    </div>

                    {/* RIGHT COLUMN: Sidebar */}
                    <aside className="space-y-8 h-fit lg:sticky lg:top-24">
                        {/* Quick Links */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-unaicNavy mb-4 pb-2 border-b border-gray-100">{isEn ? "Other Menus" : "Menu Lainnya"}</h3>
                            <nav className="space-y-2">
                                <Link href="/manajemen/baak" className="block px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-unaicBlue transition-colors text-sm font-medium flex justify-between items-center group">
                                    Biro Administrasi Akademik
                                    <ArrowRight size={16} className="text-gray-300 group-hover:text-unaicBlue" />
                                </Link>
                                <Link href="/manajemen/baukk" className="block px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-unaicBlue transition-colors text-sm font-medium flex justify-between items-center group">
                                    Biro Admin Umum & Keuangan
                                    <ArrowRight size={16} className="text-gray-300 group-hover:text-unaicBlue" />
                                </Link>
                                <Link href="/riset-inovasi/lppm" className="block px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-unaicBlue transition-colors text-sm font-medium flex justify-between items-center group">
                                    Lembaga Penelitian & Pengabdian
                                    <ArrowRight size={16} className="text-gray-300 group-hover:text-unaicBlue" />
                                </Link>
                            </nav>
                        </div>

                        {/* Contact Card */}
                        <div className="bg-unaicNavy p-6 rounded-2xl text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <ShieldCheck size={20} className="text-unaicGold" /> {isEn ? "LJM Office" : "Kantor LJM"}
                            </h3>
                            <div className="space-y-4 text-sm text-gray-300">
                                {contact?.address && (
                                    <div className="flex items-start gap-3">
                                        <MapPin size={18} className="shrink-0 mt-1 text-unaicGold" />
                                        <p>{contact.address}</p>
                                    </div>
                                )}
                                {contact?.email && (
                                    <div className="flex items-center gap-3">
                                        <Mail size={18} className="shrink-0 text-unaicGold" />
                                        <p>{contact.email}</p>
                                    </div>
                                )}
                                {contact?.whatsapp && (
                                    <div className="flex items-center gap-3">
                                        <Phone size={18} className="shrink-0 text-unaicGold" />
                                        <p>{contact.whatsapp}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>

                </div>
            </div>
        </main>
    );
}
