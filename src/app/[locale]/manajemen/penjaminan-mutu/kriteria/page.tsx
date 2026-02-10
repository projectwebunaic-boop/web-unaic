import React from "react";
import CriteriaGrid from "@/components/lpm/CriteriaGrid";
import HeroSection from "@/components/shared/HeroSection";
import prisma from "@/lib/prisma";
import { getLocale } from "next-intl/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getData() {
    return await prisma.lpmCriterion.findMany({
        orderBy: { order: 'asc' }
    });
}

export default async function KriteriaPage() {
    const locale = await getLocale();
    const rawCriteria = await getData();
    const isEn = locale === 'en';

    // Localize Data
    const criteria = rawCriteria.map(c => ({
        ...c,
        title: isEn ? (c.titleEn || c.title) : c.title,
        subtitle: isEn ? (c.subtitleEn || c.subtitle) : c.subtitle,
        description: isEn ? (c.descriptionEn || c.description) : c.description,
    }));

    return (
        <main className="min-h-screen bg-white pb-16">
            {/* HERO SECTION */}
            <HeroSection
                title={isEn ? "9 Accreditation Criteria" : "9 Kriteria Akreditasi"}
                subtitle={isEn ? "Internal Quality Assurance Standards of Universitas Al-Irsyad Cilacap" : "Standar Penjaminan Mutu Internal Universitas Al-Irsyad Cilacap"}
                className="mb-12"
            />

            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-unaicGold font-bold tracking-wider text-sm uppercase mb-2 block">
                        {isEn ? "Quality Standards" : "Standar Mutu"}
                    </span>
                    <h2 className="text-3xl font-bold text-unaicNavy mb-4">
                        {isEn ? "Scope of Accreditation Criteria" : "Lingkup Kriteria Akreditasi"}
                    </h2>
                    <p className="text-gray-500">
                        {isEn
                            ? "The Internal Quality Assurance System (SPMI) of Universitas Al-Irsyad Cilacap refers to the 9 National Accreditation Criteria to ensure superior education quality."
                            : "Sistem Penjaminan Mutu Internal (SPMI) Universitas Al-Irsyad Cilacap mengacu pada 9 Kriteria Akreditasi Nasional untuk memastikan kualitas pendidikan yang unggul."}
                    </p>
                </div>

                <div className="relative z-10">
                    <CriteriaGrid criteria={criteria} />
                </div>
            </div>
        </main>
    );
}
