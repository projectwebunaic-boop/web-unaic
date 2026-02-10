import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const calendarItems = await prisma.academicCalendar.findMany({
            orderBy: { order: 'asc' }
        });
        return NextResponse.json(calendarItems);
    } catch (error) {
        console.error("Error fetching academic calendar:", error);
        return NextResponse.json({ error: 'Failed to fetch calendar' }, { status: 500 });
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
            // Alternatively, we could do an upsert but recreation is simpler for small tables
            await tx.academicCalendar.deleteMany({});

            if (items.length > 0) {
                await tx.academicCalendar.createMany({
                    data: items.map((item: any, idx: number) => ({
                        semester: item.semester,
                        semesterEn: item.semesterEn,
                        activity: item.activity,
                        activityEn: item.activityEn,
                        date: item.date,
                        dateEn: item.dateEn,
                        year: item.year,
                        order: item.order ?? idx
                    }))
                });
            }
        });

        const updatedItems = await prisma.academicCalendar.findMany({
            orderBy: { order: 'asc' }
        });

        return NextResponse.json({ success: true, data: updatedItems });
    } catch (error) {
        console.error("Error updating academic calendar:", error);
        return NextResponse.json({ success: false, error: 'Failed to update calendar' }, { status: 500 });
    }
}
