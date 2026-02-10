import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const data = await prisma.laboratory.findMany({
            orderBy: { order: 'asc' }
        });

        // Convert facilities back to array if it's stored as JSON string
        const formattedData = data.map(item => ({
            ...item,
            facilities: item.facilities ? JSON.parse(item.facilities) : [],
            facilitiesEn: item.facilitiesEn ? JSON.parse(item.facilitiesEn) : []
        }));

        return NextResponse.json(formattedData);
    } catch (error) {
        console.error("Laboratorium API: Error", error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, nameEn, description, descriptionEn, image, facilities, facilitiesEn, order } = body;

        const newItem = await prisma.laboratory.create({
            data: {
                name,
                nameEn,
                description,
                descriptionEn,
                image,
                facilities: Array.isArray(facilities) ? JSON.stringify(facilities) : facilities,
                facilitiesEn: Array.isArray(facilitiesEn) ? JSON.stringify(facilitiesEn) : facilitiesEn,
                order: order ?? 0
            }
        });

        return NextResponse.json({ message: 'Lab added', data: newItem });
    } catch (error) {
        console.error("Laboratorium POST: Error", error);
        return NextResponse.json({ error: 'Failed to add data' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, name, nameEn, description, descriptionEn, image, facilities, facilitiesEn, order } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const updatedItem = await prisma.laboratory.update({
            where: { id },
            data: {
                name,
                nameEn,
                description,
                descriptionEn,
                image,
                facilities: Array.isArray(facilities) ? JSON.stringify(facilities) : facilities,
                facilitiesEn: Array.isArray(facilitiesEn) ? JSON.stringify(facilitiesEn) : facilitiesEn,
                order: order ?? 0
            }
        });

        return NextResponse.json({ message: 'Lab updated', data: updatedItem });
    } catch (error) {
        console.error("Laboratorium PUT: Error", error);
        return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await prisma.laboratory.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Lab deleted' });
    } catch (error) {
        console.error("Laboratorium DELETE: Error", error);
        return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
    }
}
