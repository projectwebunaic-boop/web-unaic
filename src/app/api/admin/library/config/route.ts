import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        let config = await prisma.libraryConfig.findUnique({
            where: { id: 'singleton' }
        });

        if (!config) {
            config = await prisma.libraryConfig.create({
                data: { id: 'singleton' }
            });
        }

        return NextResponse.json(config);
    } catch (error) {
        console.error("Error fetching library config:", error);
        return NextResponse.json({ error: 'Failed to fetch library config' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { simpusUrl, phone, email, address, addressEn, weekdayHours, saturdayHours } = body;

        const config = await prisma.libraryConfig.upsert({
            where: { id: 'singleton' },
            update: { simpusUrl, phone, email, address, addressEn, weekdayHours, saturdayHours },
            create: { id: 'singleton', simpusUrl, phone, email, address, addressEn, weekdayHours, saturdayHours }
        });

        return NextResponse.json({ success: true, data: config });
    } catch (error) {
        console.error("Error updating library config:", error);
        return NextResponse.json({ success: false, error: 'Failed to update library config' }, { status: 500 });
    }
}
