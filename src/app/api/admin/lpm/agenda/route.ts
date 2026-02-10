import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const agendas = await prisma.lpmAgenda.findMany({
            orderBy: { date: 'desc' }
        });
        return NextResponse.json(agendas);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id, ...data } = body;

        if (id) {
            const updated = await prisma.lpmAgenda.update({
                where: { id },
                data
            });
            return NextResponse.json(updated);
        } else {
            const created = await prisma.lpmAgenda.create({
                data
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

        await prisma.lpmAgenda.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
