import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type'); // 'category' or 'staff'

        if (type === 'category') {
            const categories = await prisma.staffCategory.findMany({
                orderBy: { order: 'asc' }
            });
            return NextResponse.json(categories);
        } else {
            const staff = await prisma.staff.findMany({
                include: { category: true },
                orderBy: { order: 'asc' }
            });
            return NextResponse.json(staff);
        }
    } catch (error) {
        console.error("Staff API GET Error:", error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { type, id, ...data } = body;

        if (type === 'category') {
            if (id) {
                const updated = await prisma.staffCategory.update({
                    where: { id },
                    data: {
                        name: data.name,
                        nameEn: data.nameEn,
                        slug: data.slug,
                        order: parseInt(data.order) || 0
                    }
                });
                return NextResponse.json(updated);
            } else {
                const created = await prisma.staffCategory.create({
                    data: {
                        name: data.name,
                        nameEn: data.nameEn,
                        slug: data.slug,
                        order: parseInt(data.order) || 0
                    }
                });
                return NextResponse.json(created);
            }
        } else {
            // Staff
            const staffData = {
                name: data.name,
                role: data.role,
                roleEn: data.roleEn,
                nidn: data.nidn,
                image: data.image,
                scholarUrl: data.scholarUrl,
                categoryId: data.categoryId,
                order: parseInt(data.order) || 0
            };

            if (id) {
                const updated = await prisma.staff.update({
                    where: { id },
                    data: staffData
                });
                return NextResponse.json(updated);
            } else {
                const created = await prisma.staff.create({
                    data: staffData
                });
                return NextResponse.json(created);
            }
        }
    } catch (error) {
        console.error("Staff API POST Error:", error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        if (type === 'category') {
            await prisma.staffCategory.delete({ where: { id } });
        } else {
            await prisma.staff.delete({ where: { id } });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Staff API DELETE Error:", error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
