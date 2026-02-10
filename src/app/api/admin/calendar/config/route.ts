import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        let config = await prisma.academicCalendarConfig.findUnique({
            where: { id: 'singleton' }
        });

        if (!config) {
            config = await prisma.academicCalendarConfig.create({
                data: { id: 'singleton' }
            });
        }

        return NextResponse.json(config);
    } catch (error) {
        console.error("Error fetching academic calendar config:", error);
        return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { pdfUrl, pdfUrlEn } = body;

        const config = await prisma.academicCalendarConfig.upsert({
            where: { id: 'singleton' },
            update: { pdfUrl, pdfUrlEn },
            create: { id: 'singleton', pdfUrl, pdfUrlEn }
        });

        return NextResponse.json({ success: true, data: config });
    } catch (error) {
        console.error("Error updating academic calendar config:", error);
        return NextResponse.json({ success: false, error: 'Failed to update config' }, { status: 500 });
    }
}
