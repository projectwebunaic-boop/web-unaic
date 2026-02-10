import React from "react";
import Image from "next/image";
import HeroSection from "@/components/shared/HeroSection";
import prisma from "@/lib/prisma";
import { getLocale } from "next-intl/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getData() {
    return await prisma.lpmStaff.findMany({
        orderBy: { order: 'asc' } // Assuming 'order' field exists or added, otherwise sort by ID or Name
    });
}

export default async function StrukturLJMPage() {
    const locale = await getLocale();
    const structure = await getData();
    const isEn = locale === 'en';

    return (
        <main className="min-h-screen bg-white pb-16">
            {/* HERO SECTION */}
            <HeroSection
                title={isEn ? "Organizational Structure" : "Struktur Organisasi"}
                subtitle={isEn ? "The Professional Team Behind Quality Assurance" : "Tim Profesional di Balik Penjaminan Mutu"}
                className="mb-12"
            />

            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-unaicGold font-bold tracking-wider text-sm uppercase mb-2 block">
                        {isEn ? "Our Team" : "Tim Kami"}
                    </span>
                    <h2 className="text-3xl font-bold text-unaicNavy mb-4">
                        {isEn ? "LJM Organizational Structure" : "Struktur Organisasi LJM"}
                    </h2>
                    <p className="text-gray-500">
                        {isEn
                            ? "Solid team synergy to ensure the achievement of high-quality higher education standards."
                            : "Sinergi tim yang solid untuk memastikan tercapainya standar pendidikan tinggi yang berkualitas."}
                    </p>
                </div>

                {structure && structure.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                        {structure.map((staff: any) => (
                            <div key={staff.id} className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                <div className="w-40 h-40 mb-6 rounded-full overflow-hidden bg-gray-50 border-4 border-white shadow-lg relative group-hover:scale-105 transition-transform duration-300">
                                    <Image
                                        src={staff.image || "/images/placeholder-user.png"}
                                        alt={staff.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <h3 className="font-bold text-unaicNavy text-xl mb-1 text-center">{staff.name}</h3>
                                <div className="h-0.5 w-12 bg-unaicGold/30 my-3"></div>
                                <span className="px-4 py-1.5 bg-unaicBlue/5 text-unaicBlue font-semibold rounded-full text-sm text-center">
                                    {isEn ? (staff.positionEn || staff.position) : staff.position}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-400">
                        {isEn ? "Organizational structure data not yet available." : "Data struktur organisasi belum tersedia."}
                    </div>
                )}
            </div>
        </main>
    );
}
