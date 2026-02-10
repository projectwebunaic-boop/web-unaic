import React from "react";
import AgendaCard from "@/components/events/AgendaCard";
import HeroSection from "@/components/shared/HeroSection";
import prisma from "@/lib/prisma";
import { getLocale } from "next-intl/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getData() {
    return await prisma.lpmAgenda.findMany({
        orderBy: { date: 'desc' }
    });
}

export default async function AgendaLJMPage() {
    const locale = await getLocale();
    const rawAgendas = await getData();
    const isEn = locale === 'en';

    // Localize Data
    const agendas = rawAgendas.map(agenda => ({
        ...agenda,
        title: isEn ? (agenda.titleEn || agenda.title) : agenda.title,
        description: isEn ? (agenda.descriptionEn || agenda.description) : agenda.description,
        location: isEn ? (agenda.locationEn || agenda.location) : agenda.location,
    }));

    return (
        <main className="min-h-screen bg-white pb-16">
            {/* HERO SECTION */}
            <HeroSection
                title={isEn ? "Quality Agenda" : "Agenda Mutu"}
                subtitle={isEn ? "Activities Schedule, Audits, and Management Reviews" : "Jadwal Kegiatan, Audit, dan Rapat Tinjauan Manajemen"}
                className="mb-12"
            />

            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-unaicGold font-bold tracking-wider text-sm uppercase mb-2 block">
                        {isEn ? "Quality Calendar" : "Kalender Mutu"}
                    </span>
                    <h2 className="text-3xl font-bold text-unaicNavy mb-4">
                        {isEn ? "Upcoming Events" : "Agenda Kegiatan Terkini"}
                    </h2>
                    <p className="text-gray-500">
                        {isEn
                            ? "Monitor upcoming and past quality assurance activities."
                            : "Pantau jadwal kegiatan penjaminan mutu yang akan datang maupun yang telah terlaksana."}
                    </p>
                </div>

                {agendas.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {agendas.map((agenda: any) => (
                            <div key={agenda.id} className="h-full transform hover:-translate-y-2 transition-transform duration-300">
                                <AgendaCard
                                    title={agenda.title}
                                    slug={agenda.slug}
                                    date={agenda.date.toISOString()} // AgendaCard likely expects string
                                    location={agenda.location || 'Online'}
                                    description={agenda.description || ''}
                                    image={agenda.thumbnail || "/images/placeholder-event.jpg"} // Fallback image if needed
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                        <p className="text-gray-400 font-medium">
                            {isEn ? "No agenda scheduled." : "Belum ada agenda yang dijadwalkan."}
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
