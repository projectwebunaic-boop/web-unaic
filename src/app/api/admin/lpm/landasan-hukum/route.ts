import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const data = await prisma.lpmLegalBasis.findMany({
            orderBy: { order: 'asc' }
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id, title, titleEn, category, description, descriptionEn, url, order } = body;

        if (id) {
            // Update
            const updated = await prisma.lpmLegalBasis.update({
                where: { id },
                data: { title, titleEn, category, description, descriptionEn, url, order: parseInt(order) || 0 }
            });
            return NextResponse.json(updated);
        } else {
            // Create
            const created = await prisma.lpmLegalBasis.create({
                data: { title, titleEn, category, description, descriptionEn, url, order: parseInt(order) || 0 }
            });
            return NextResponse.json(created);
        }
    } catch (error) {
        console.error("Legal Basis API Error:", error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await prisma.lpmLegalBasis.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
