import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

// const prisma = new PrismaClient();

export async function GET() {
    try {
        const data = await prisma.agenda.findMany({
            orderBy: { date: 'desc' }
        });
        // Convert Date objects to strings if frontend expects strings? 
        // AdminAgendaPage expects `date` string YYYY-MM-DD.
        // Prisma returns Date object.
        const formatted = data.map(item => ({
            ...item,
            date: item.date.toISOString().split('T')[0] // Simple YYYY-MM-DD
        }));
        return NextResponse.json(formatted);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, type, ...newItem } = body;

        if (type === 'DELETE') {
            await prisma.agenda.delete({ where: { id } });
            return NextResponse.json({ success: true });
        } else if (id) {
            // Update existing
            await prisma.agenda.update({
                where: { id },
                data: {
                    title: newItem.title,
                    titleEn: newItem.titleEn,
                    slug: newItem.slug,
                    date: new Date(newItem.date), // Convert string to Date
                    time: newItem.time,
                    location: newItem.location,
                    locationEn: newItem.locationEn,
                    category: newItem.category,
                    thumbnail: newItem.thumbnail,
                    description: newItem.description,
                    descriptionEn: newItem.descriptionEn,
                }
            });
        } else {
            // Create new
            await prisma.agenda.create({
                data: {
                    title: newItem.title,
                    titleEn: newItem.titleEn,
                    slug: newItem.slug, // Ensure slug is unique or handle error
                    date: new Date(newItem.date),
                    time: newItem.time,
                    location: newItem.location,
                    locationEn: newItem.locationEn,
                    category: newItem.category,
                    thumbnail: newItem.thumbnail,
                    description: newItem.description,
                    descriptionEn: newItem.descriptionEn,
                }
            });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error saving agenda data:", error);
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
