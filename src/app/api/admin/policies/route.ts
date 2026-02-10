import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const policies = await prisma.academicPolicy.findMany({
            orderBy: { order: 'asc' }
        });
        return NextResponse.json(policies);
    } catch (error) {
        console.error("Error fetching academic policies:", error);
        return NextResponse.json({ error: 'Failed to fetch policies' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items } = body;

        if (!Array.isArray(items)) {
            return NextResponse.json({ success: false, error: 'Items must be an array' }, { status: 400 });
        }

        // Using a transaction to ensure atomic update
        await prisma.$transaction(async (tx) => {
            // Delete all existing items and recreate
            await tx.academicPolicy.deleteMany({});

            if (items.length > 0) {
                await tx.academicPolicy.createMany({
                    data: items.map((item: any, idx: number) => ({
                        title: item.title,
                        titleEn: item.titleEn,
                        description: item.description,
                        descriptionEn: item.descriptionEn,
                        pdfUrl: item.pdfUrl,
                        purpose: item.purpose,
                        purposeEn: item.purposeEn,
                        scope: item.scope,
                        scopeEn: item.scopeEn,
                        lastUpdate: item.lastUpdate,
                        responsible: item.responsible,
                        responsibleEn: item.responsibleEn,
                        order: item.order ?? idx
                    }))
                });
            }
        });

        const updatedItems = await prisma.academicPolicy.findMany({
            orderBy: { order: 'asc' }
        });

        return NextResponse.json({ success: true, data: updatedItems });
    } catch (error) {
        console.error("Error updating academic policies:", error);
        return NextResponse.json({ success: false, error: 'Failed to update policies' }, { status: 500 });
    }
}
