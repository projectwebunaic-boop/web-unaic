import prisma from "@/lib/prisma";
import LabClient from "./LabClient";
import { getTranslations } from 'next-intl/server';

export default async function LaboratoriumPage({ params }: { params: { locale: string } }) {
    const { locale } = await params;

    // Fetch Lab Data from Prisma
    const labsRaw = await prisma.laboratory.findMany({
        orderBy: { order: 'asc' }
    });

    const labs = labsRaw.map(lab => ({
        ...lab,
        facilities: lab.facilities ? JSON.parse(lab.facilities) : [],
        facilitiesEn: lab.facilitiesEn ? JSON.parse(lab.facilitiesEn) : []
    }));

    // Fetch Config Data from Prisma (singleton)
    let config = await prisma.laboratoryConfig.findUnique({
        where: { id: 'singleton' }
    });

    if (!config) {
        config = await prisma.laboratoryConfig.create({
            data: { id: 'singleton' }
        });
    }

    return (
        <LabClient
            labs={labs}
            config={config}
            locale={locale}
        />
    );
}
