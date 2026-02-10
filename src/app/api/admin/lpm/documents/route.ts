import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const docs = await prisma.lpmDocument.findMany({
            orderBy: { order: 'asc' }
        });
        return NextResponse.json(docs);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id, ...data } = body;

        if (id) {
            const updated = await prisma.lpmDocument.update({
                where: { id },
                data: {
                    ...data,
                    year: Number(data.year)
                }
            });
            return NextResponse.json(updated);
        } else {
            const created = await prisma.lpmDocument.create({
                data: {
                    ...data,
                    year: Number(data.year)
                }
            });
            return NextResponse.json(created);
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await prisma.lpmDocument.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
