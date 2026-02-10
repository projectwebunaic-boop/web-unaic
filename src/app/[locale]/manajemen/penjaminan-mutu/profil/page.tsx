import React from "react";
// import { Target, ShieldCheck } from "lucide-react"; // Unused
import HeroSection from "@/components/shared/HeroSection";
import prisma from "@/lib/prisma";
import { getLocale } from "next-intl/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getData() {
    return await prisma.lpmProfile.findFirst() || {
        about: "", aboutEn: ""
    };
}

export default async function ProfilLJMPage() {
    const locale = await getLocale();
    const data = await getData();
    const isEn = locale === 'en';

    const aboutContent = isEn ? (data.aboutEn || data.about) : data.about;

    return (
        <main className="min-h-screen bg-white">
            {/* HERO SECTION */}
            <HeroSection
                title={isEn ? "LJM Profile" : "Profil LJM"}
                subtitle={isEn ? "Ensuring Excellent and Sustainable Quality Culture" : "Mewujudkan Budaya Mutu yang Unggul dan Berkelanjutan"}
                className="mb-12"
            />

            <div className="max-w-4xl mx-auto px-4 pb-16 space-y-16">

                {/* 1. TENTANG */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-2 h-8 bg-unaicGold rounded-full"></div>
                        <h2 className="text-3xl font-bold text-unaicNavy">{isEn ? "Profile" : "Profil"}</h2>
                    </div>
                    <div
                        className="prose prose-lg text-gray-600 leading-relaxed max-w-none text-justify"
                        dangerouslySetInnerHTML={{ __html: aboutContent || "" }}
                    />
                </section>



                {/* 3. TUGAS POKOK */}
                {(data as any).mainDuties && (
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-2 h-8 bg-unaicGold rounded-full"></div>
                            <h2 className="text-3xl font-bold text-unaicNavy">{isEn ? "Main Duties" : "Tugas Pokok"}</h2>
                        </div>
                        <div
                            className="prose prose-lg text-gray-600 leading-relaxed max-w-none text-justify p-6 bg-white rounded-2xl shadow-sm border border-gray-100"
                            dangerouslySetInnerHTML={{ __html: isEn ? ((data as any).mainDutiesEn || (data as any).mainDuties) : (data as any).mainDuties }}
                        />
                    </section>
                )}

                {/* 4. SIKLUS KEGIATAN */}
                {(data as any).activityCycle && (
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-2 h-8 bg-unaicGold rounded-full"></div>
                            <h2 className="text-3xl font-bold text-unaicNavy">{isEn ? "Activity Cycle (PPEPP)" : "Siklus Kegiatan (PPEPP)"}</h2>
                        </div>
                        {(() => {
                            const rawContent = isEn ? ((data as any).activityCycleEn || (data as any).activityCycle) : (data as any).activityCycle;
                            let listContent = [];
                            try {
                                if (rawContent) {
                                    const parsed = JSON.parse(rawContent);
                                    if (Array.isArray(parsed)) listContent = parsed;
                                }
                            } catch (e) { /* Not JSON, treat as HTML string */ }

                            if (listContent.length > 0) {
                                // Render as Ordered List
                                return (
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                        <ol className="list-decimal pl-6 space-y-3">
                                            {listContent.map((item: string, idx: number) => (
                                                <li key={idx} className="text-gray-600 leading-relaxed text-lg pl-2">
                                                    {item}
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                );
                            } else {
                                // Render as HTML (Backward Compatibility)
                                return (
                                    <div
                                        className="prose prose-lg text-gray-600 leading-relaxed max-w-none text-justify p-6 bg-white rounded-2xl shadow-sm border border-gray-100"
                                        dangerouslySetInnerHTML={{ __html: rawContent || "" }}
                                    />
                                );
                            }
                        })()}
                    </section>
                )}
            </div>
        </main>
    );
}
