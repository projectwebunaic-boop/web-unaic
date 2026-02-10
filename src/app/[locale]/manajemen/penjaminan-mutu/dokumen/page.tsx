import React from "react";
import LPMDocumentBrowser from "@/components/lpm/DocumentBrowser";
import HeroSection from "@/components/shared/HeroSection";
import prisma from "@/lib/prisma";
import { getLocale } from "next-intl/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getData() {
    return await prisma.lpmDocument.findMany({
        orderBy: { order: 'asc' }
    });
}

export default async function DokumenLJMPage() {
    const locale = await getLocale();
    const rawDocs = await getData();
    const isEn = locale === 'en';

    // Transform data for DocumentBrowser component
    const documents = rawDocs.map(doc => ({
        ...doc,
        title: isEn ? (doc.titleEn || doc.title) : doc.title,
    }));

    return (
        <main className="min-h-screen bg-white pb-16">
            {/* HERO SECTION */}
            <HeroSection
                title={isEn ? "Quality Documents" : "Dokumen Mutu"}
                subtitle={isEn ? "Center for Policies, Manuals, SOPs, and Forms" : "Pusat Arsip Kebijakan, Manual, SOP, dan Formulir"}
                className="mb-12" // Original was mb-12.
            />

            <div className="max-w-7xl mx-auto px-4">
                <section className="bg-white rounded-3xl p-6 md:p-10 shadow-lg shadow-gray-100 border border-gray-100 -mt-20 relative z-30">
                    <LPMDocumentBrowser documents={documents} />
                </section>
            </div>
        </main>
    );
}
