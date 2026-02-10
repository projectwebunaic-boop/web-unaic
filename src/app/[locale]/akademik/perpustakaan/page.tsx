import { getTranslations } from "next-intl/server";
import prisma from "@/lib/prisma";
import LibraryClient from "./LibraryClient";

export default async function LibraryPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations("Library");

    const config = await prisma.libraryConfig.findUnique({
        where: { id: 'singleton' }
    });

    const defaultConfig = {
        simpusUrl: "https://simpus.universitasalirsyad.ac.id/",
        phone: "(0282) 532975",
        email: "perpustakaan@unaic.ac.id",
        address: "Gedung Utama Lantai 2, Universitas Al-Irsyad Cilacap, Jl. Cerme No. 24, Sidanegara, Cilacap.",
        addressEn: "Main Building 2nd Floor, Al-Irsyad University of Cilacap, Jl. Cerme No. 24, Sidanegara, Cilacap.",
        weekdayHours: "08:00 - 16:00",
        saturdayHours: "08:00 - 13:00"
    };

    return (
        <LibraryClient
            config={config || defaultConfig}
            locale={locale}
        />
    );
}
