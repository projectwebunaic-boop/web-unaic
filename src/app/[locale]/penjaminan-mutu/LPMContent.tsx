"use client";

import HeroSection from "@/components/shared/HeroSection";
import CriteriaGrid from "@/components/lpm/CriteriaGrid";
import DocumentTable from "@/components/lpm/DocumentTable";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

interface LPMContentProps {
    data: {
        hero: { title: string; titleEn?: string; subtitle: string; subtitleEn?: string };
        about: { content: string; contentEn?: string };
        criteria: any[];
        documents: any[];
    };
}

export default function LPMContent({ data }: LPMContentProps) {
    const t = useTranslations("LPM");
    const locale = useLocale();
    const searchParams = useSearchParams();

    const activeCriteriaIdx = searchParams.get("kriteria")
        ? parseInt(searchParams.get("kriteria")!)
        : null;

    const { hero, criteria, documents } = data;

    // Filter documents based on criteria if selected (assuming categories or IDs match)
    // In current implementation, we just use all documents or filter by searchTerm in DocumentTable
    const filteredDocuments = documents;

    const displayHero = {
        title: locale === 'en' ? (hero.titleEn || hero.title) : hero.title,
        subtitle: locale === 'en' ? (hero.subtitleEn || hero.subtitle) : hero.subtitle
    };

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            <HeroSection
                title={displayHero.title || t("defaultTitle")}
                subtitle={displayHero.subtitle || t("defaultSubtitle")}
            />

            <div className="container mx-auto px-4 md:px-8 py-12 relative z-10">
                <section className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-12">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <span className="inline-block px-4 py-1 bg-blue-50 text-unaicBlue rounded-full text-sm font-bold mb-3">
                            {t("portalBadge")}
                        </span>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            {t("criteriaTitle")}
                        </h2>
                        <p className="text-gray-600">
                            {t("criteriaDesc")}
                        </p>
                    </div>

                    <CriteriaGrid criteria={criteria} />
                </section>

                <section id="documents" className="scroll-mt-24">
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {activeCriteriaIdx
                                ? `${t("documentsTitle")}: ${t("criteria")} ${activeCriteriaIdx}`
                                : t("allDocuments")}
                        </h2>
                        {activeCriteriaIdx && (
                            <a href="/penjaminan-mutu" className="text-sm text-unaicBlue hover:underline">
                                ({t("resetFilter")})
                            </a>
                        )}
                    </div>

                    <DocumentTable documents={filteredDocuments} />
                </section>
            </div>
        </main>
    );
}
