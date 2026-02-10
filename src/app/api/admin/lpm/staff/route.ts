import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const staff = await prisma.lpmStaff.findMany({
            orderBy: { order: 'asc' }
        });
        return NextResponse.json(staff);
    } catch (error) {
        console.error("Error fetching staff:", error);
        return NextResponse.json({ error: 'Failed', details: String(error) }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id, ...data } = body;

        if (id) {
            // Update
            const updated = await prisma.lpmStaff.update({
                where: { id: Number(id) },
                data
            });
            return NextResponse.json(updated);
        } else {
            // Create
            const created = await prisma.lpmStaff.create({
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

        await prisma.lpmStaff.delete({ where: { id: Number(id) } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
