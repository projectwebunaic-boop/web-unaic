import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const criteria = await prisma.lpmCriterion.findMany({
            orderBy: { order: 'asc' }
        });
        return NextResponse.json(criteria);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id, ...data } = body;

        if (id) {
            // Update exist
            const updated = await prisma.lpmCriterion.update({
                where: { id },
                data
            });
            return NextResponse.json(updated);
        } else {
            // Create
            // Check if id provided in body for create (e.g. uuid from frontend)
            const created = await prisma.lpmCriterion.create({
                data: {
                    id: crypto.randomUUID(),
                    ...data
                }
            });
            return NextResponse.json(created);
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await prisma.lpmCriterion.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
