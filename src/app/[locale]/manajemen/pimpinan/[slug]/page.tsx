import prisma from "@/lib/prisma";
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
import { Link } from "@/i18n/routing";
import {
    ArrowLeft,
    GraduationCap,
    Briefcase,
    Microscope,
    Mail,
    Quote,
    Building2,
    Globe,
    Award
} from 'lucide-react';
import { getTranslations } from "next-intl/server";
import { ProfileContent } from "./ProfileContent";

export default async function LeaderDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { slug, locale } = await params;

    const t = await getTranslations({ locale, namespace: "Leaders" });
    const isEn = locale === 'en';

    const leaderData = await prisma.leader.findUnique({
        where: { slug }
    });

    if (!leaderData) {
        notFound();
    }

    // Parse JSON strings from SQLite
    const parseJsonField = (field: string | null) => {
        if (!field) return [];
        try {
            return JSON.parse(field);
        } catch {
            return [];
        }
    };

    const leader = {
        name: leaderData.name,
        title: leaderData.title,
        titleEn: leaderData.titleEn,
        category: leaderData.category,
        image: leaderData.image,
        email: leaderData.email,
        scholar: leaderData.scholar,
        vision: leaderData.vision,
        visionEn: leaderData.visionEn,
        education: parseJsonField(leaderData.education),
        educationEn: parseJsonField(leaderData.educationEn),
        career: parseJsonField(leaderData.career),
        careerEn: parseJsonField(leaderData.careerEn),
        research: parseJsonField(leaderData.research),
        researchEn: parseJsonField(leaderData.researchEn),
    };

    return (
        <main className="bg-gray-50 font-sans text-gray-700 min-h-screen">
            {/* Hero Section with Image */}
            <section className="relative bg-gradient-to-br from-[#0A2E5C] via-[#1a4d8f] to-[#0A2E5C] text-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                </div>

                <div className="container mx-auto max-w-6xl px-4 py-16 sm:py-24 relative z-10">
                    <Link
                        href="/manajemen/pimpinan"
                        className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-8 transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">{t("backToList")}</span>
                    </Link>

                    <div className="grid md:grid-cols-[300px_1fr] gap-8 lg:gap-12 items-start">
                        {/* Profile Image */}
                        <div className="relative">
                            <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 bg-white/5 backdrop-blur-sm">
                                <img
                                    src={leader.image || "/images/placeholder-user.png"}
                                    alt={leader.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Decorative Elements */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#FFD700]/20 rounded-full blur-2xl"></div>
                            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl"></div>
                        </div>

                        {/* Profile Info */}
                        <div className="flex flex-col justify-center">
                            <div className="inline-block mb-4">
                                <span className="bg-[#FFD700] text-[#0A2E5C] px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg">
                                    {leader.category}
                                </span>
                            </div>

                            <h1 className="font-heading text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
                                {leader.name}
                            </h1>

                            <p className="text-xl lg:text-2xl text-blue-100 font-medium mb-8 leading-relaxed">
                                {isEn ? (leader.titleEn || leader.title) : leader.title}
                            </p>

                            {/* Contact Info */}
                            <div className="flex flex-wrap gap-4">
                                {leader.email && (
                                    <a
                                        href={`mailto:${leader.email}`}
                                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-5 py-3 rounded-xl transition-all duration-300 border border-white/20 hover:border-white/40 group"
                                    >
                                        <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        <span className="font-medium">{t("contactEmail")}</span>
                                    </a>
                                )}
                                {leader.scholar && (
                                    <a
                                        href={leader.scholar}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-5 py-3 rounded-xl transition-all duration-300 border border-white/20 hover:border-white/40 group"
                                    >
                                        <Globe className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        <span className="font-medium">Google Scholar</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                        <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="rgb(249, 250, 251)" />
                    </svg>
                </div>
            </section>

            {/* Content Section */}
            <section className="container mx-auto max-w-5xl px-4 py-16 space-y-12">
                <ProfileContent leader={leader} locale={locale} />
            </section>
        </main>
    );
}
