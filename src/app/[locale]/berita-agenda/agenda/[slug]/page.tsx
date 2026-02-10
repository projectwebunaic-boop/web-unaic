
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar, Clock, MapPin, ChevronLeft, Share2 } from 'lucide-react';
import { Link } from "@/i18n/routing";
import HeroSection from '@/components/shared/HeroSection';
import ShareButton from "@/components/shared/ShareButton";
import { getLocale, getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

async function getAgendaData() {
    try {
        const filePath = path.join(process.cwd(), 'src/data/agenda.json');
        if (!fs.existsSync(filePath)) return [];
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Error reading agenda data:", error);
        return [];
    }
}

export default async function AgendaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const locale = await getLocale();
    const t = await getTranslations("Agenda");
    const data = await getAgendaData();
    const agenda = data.find((item: any) => item.slug === slug);

    if (!agenda) {
        return notFound();
    }

    const displayTitle = locale === 'en' ? (agenda.titleEn || agenda.title) : agenda.title;
    const displayLocation = locale === 'en' ? (agenda.locationEn || agenda.location) : agenda.location;
    const displayDescription = locale === 'en' ? (agenda.descriptionEn || agenda.description) : agenda.description;

    return (
        <main className="font-sans text-gray-700 bg-white pb-20">
            {/* Hero Section - Mini */}
            {/* Hero Section */}
            <HeroSection
                title={t("heroTitle")}
                subtitle={displayTitle}
            >
                <span className="inline-block mt-4 py-1 px-3 rounded-full bg-unaicGold/20 text-unaicGold border border-unaicGold/30 text-xs font-bold uppercase tracking-wider">
                    {t("category")}: {agenda.category}
                </span>
            </HeroSection>

            <div className="container mx-auto px-4 -mt-10 relative z-20">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-w-5xl mx-auto">

                    {/* Image Banner */}
                    {agenda.thumbnail && (
                        <div className="relative h-64 md:h-96 w-full">
                            <img
                                src={agenda.thumbnail}
                                alt={agenda.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="p-8 md:p-12">
                        {/* Meta Info Bar */}
                        <div className="flex flex-wrap gap-6 p-6 bg-gray-50 rounded-xl border border-gray-100 mb-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">{t("date")}</p>
                                    <p className="font-semibold text-gray-800">{new Date(agenda.date).toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                            </div>

                            <div className="w-px h-10 bg-gray-200 hidden md:block"></div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">{t("time")}</p>
                                    <p className="font-semibold text-gray-800">{agenda.time}</p>
                                </div>
                            </div>

                            <div className="w-px h-10 bg-gray-200 hidden md:block"></div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">{t("location")}</p>
                                    <p className="font-semibold text-gray-800">{displayLocation}</p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="prose prose-lg max-w-none text-gray-600">
                            <h3 className="text-2xl font-bold text-unaicNavy mb-4">{t("descriptionTitle")}</h3>
                            <div dangerouslySetInnerHTML={{ __html: displayDescription.replace(/\n/g, '<br/>') }} />
                        </div>

                        {/* Action Footer */}
                        <div className="border-t border-gray-100 mt-12 pt-8 flex justify-between items-center">
                            <Link
                                href="/berita-agenda/agenda"
                                className="flex items-center gap-2 text-gray-500 hover:text-unaicNavy font-medium transition-colors"
                            >
                                <ChevronLeft size={20} />
                                {t("backToList")}
                            </Link>

                            <ShareButton
                                title={displayTitle}
                                text={`${t("shareText")}: ${displayTitle}`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
