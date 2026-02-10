import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import MitraDetailContent from "./MitraDetailContent";

export const dynamic = 'force-dynamic';

async function getPartnersData() {
    try {
        const filePath = path.join(process.cwd(), 'src/data/partners.json');
        if (!fs.existsSync(filePath)) return null;
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Error reading partners data:", error);
        return null;
    }
}

interface MitraDetailProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function MitraDetailPage({ params }: MitraDetailProps) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const data = await getPartnersData();

    if (!data || !data.items) {
        return notFound();
    }

    const partner = data.items.find((p: any) => p.slug === decodedSlug);

    if (!partner) {
        // Fallback for case sensitivity or extra slashes just in case
        const normalizedSlug = decodedSlug.toLowerCase().trim();
        const partnerFallback = data.items.find((p: any) => p.slug.toLowerCase() === normalizedSlug);

        if (!partnerFallback) {
            return notFound();
        }
        return <MitraDetailContent partner={partnerFallback} categories={data.categories} />;
    }

    return <MitraDetailContent partner={partner} categories={data.categories} />;
}
