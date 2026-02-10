import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const publications = await prisma.publication.findMany({
            orderBy: { createdAt: 'desc' }
        });

        // Group by type for simpler frontend consumption, matching old API structure
        const data = {
            journals: publications.filter(p => p.type === 'JOURNAL').map(p => ({
                id: p.id,
                name: p.title, // Map title to name for backward compatibility if needed, though we should prefer title
                title: p.title,
                titleEn: p.titleEn,
                link: p.link,
                description: p.description,
                descriptionEn: p.descriptionEn
            })),
            proceedings: publications.filter(p => p.type === 'PROCEEDING').map(p => ({
                id: p.id,
                title: p.title,
                titleEn: p.titleEn,
                authors: p.authors,
                year: p.year,
                category: 'Prosiding',
                pdfUrl: p.pdfUrl
            })),
            articles: publications.filter(p => p.type === 'ARTICLE').map(p => ({
                id: p.id,
                title: p.title,
                titleEn: p.titleEn,
                authors: p.authors,
                year: p.year,
                category: 'Artikel',
                pdfUrl: p.pdfUrl
            }))
        };

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching publications:", error);
        return NextResponse.json({ error: 'Failed to fetch publications' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Handle Delete
        if (body.type === 'delete') {
            await prisma.publication.delete({ where: { id: body.id } });
            return NextResponse.json({ success: true });
        }

        // Handle Create/Update
        const {
            id,
            category, // Maps to type
            title,
            titleEn,
            link,
            pdfUrl,
            authors,
            year,
            description,
            descriptionEn
        } = body;

        let publication;

        if (id) {
            // Update
            publication = await prisma.publication.update({
                where: { id },
                data: {
                    type: category,
                    title,
                    titleEn,
                    link,
                    pdfUrl,
                    authors,
                    year,
                    description,
                    descriptionEn
                }
            });
        } else {
            // Create
            publication = await prisma.publication.create({
                data: {
                    type: category,
                    title,
                    titleEn,
                    link,
                    pdfUrl,
                    authors,
                    year,
                    description,
                    descriptionEn
                }
            });
        }

        return NextResponse.json({ success: true, data: publication });

    } catch (error) {
        console.error("Error saving publication:", error);
        return NextResponse.json({ success: false, error: 'Failed to save publication' }, { status: 500 });
    }
}
