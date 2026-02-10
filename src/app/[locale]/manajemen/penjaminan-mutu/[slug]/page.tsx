import React from "react";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
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
    ArrowLeft
} from "lucide-react";
import HeroSection from "@/components/shared/HeroSection";
import prisma from "@/lib/prisma";
import { getLocale } from "next-intl/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Map icon strings to components (Must match main page)
const IconMap: { [key: string]: any } = {
    ShieldCheck, ClipboardCheck, Award, BarChart, FileText,
    Target, Users, GraduationCap, UserCheck, Building,
    BookOpen, FlaskConical, Handshake
};

interface PageProps {
    params: Promise<{
        slug: string;
        locale: string;
    }>
}

export default async function CriteriaDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const locale = await getLocale();
    const isEn = locale === 'en';

    let criterion;
    try {
        criterion = await prisma.lpmCriterion.findUnique({
            where: { slug }
        });
    } catch (e) {
        console.error(e);
    }

    if (!criterion) return notFound();

    const IconCurrent = IconMap[criterion.icon] || ShieldCheck;

    // Select content based on locale
    const title = isEn ? (criterion.titleEn || criterion.title) : criterion.title;
    const subtitle = isEn ? (criterion.subtitleEn || criterion.subtitle) : criterion.subtitle;
    const contentHtml = isEn ? (criterion.contentEn || criterion.content) : criterion.content;
    const description = isEn ? (criterion.descriptionEn || criterion.description) : criterion.description;

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            {/* HERO SECTION */}
            <HeroSection
                title={title}
                subtitle={subtitle}
                className="pt-32 pb-24"
            >
                <div className="absolute top-24 left-4 md:left-8 z-30">
                    <Link href="/manajemen/penjaminan-mutu" className="inline-flex items-center text-white/80 hover:text-white transition-colors text-sm font-medium bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                        <ArrowLeft size={16} className="mr-2" /> {isEn ? "Back" : "Kembali"}
                    </Link>
                </div>

                {/* Floating Icon (Optional, centered below title) */}
                <div className="mt-8 flex justify-center">
                    <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center p-4 backdrop-blur-md border border-white/20 shadow-xl animate-bounce-slow">
                        <IconCurrent size={40} className="text-unaicGold" />
                    </div>
                </div>
            </HeroSection>

            <div className="container mx-auto px-4 -mt-8 relative z-20">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-md border border-gray-100 max-w-4xl mx-auto">
                    {/* Content */}
                    <article className="prose prose-lg prose-slate max-w-none text-gray-800 [&>*]:text-gray-800 prose-headings:text-gray-900 prose-p:text-gray-800 prose-strong:text-gray-900 prose-ul:text-gray-800">
                        <div dangerouslySetInnerHTML={{ __html: contentHtml || `<p>${description}</p>` }} />
                    </article>

                    <div className="mt-12 pt-8 border-t border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            {isEn ? "Related Documents" : "Dokumen Terkait"}
                        </h3>
                        {/* We could potentially filter documents by criteria if we add that metadata later. For now, showing a generic message or all docs if relevant. */}
                        <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3">
                            <FileText className="shrink-0 text-unaicBlue mt-1" size={20} />
                            <div>
                                <p className="text-sm text-gray-700">
                                    {isEn
                                        ? "To view supporting documents related to this criteria, please visit the main LPM page section "
                                        : "Untuk melihat dokumen pendukung terkait kriteria ini, silakan kunjungi halaman utama LPM bagian "}
                                    <Link href="/manajemen/penjaminan-mutu/dokumen" className="text-unaicBlue font-bold hover:underline">
                                        {isEn ? "Quality Documents" : "Dokumen Mutu"}
                                    </Link>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
