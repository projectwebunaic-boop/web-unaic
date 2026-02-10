import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        let config = await prisma.laboratoryConfig.findUnique({
            where: { id: 'singleton' }
        });

        if (!config) {
            config = await prisma.laboratoryConfig.create({
                data: { id: 'singleton' }
            });
        }

        return NextResponse.json(config);
    } catch (error) {
        console.error("Laboratorium Config GET: Error", error);
        return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            title, titleEn, subtitle, subtitleEn,
            contactName, contactPhone, contactEmail,
            contactAddress, contactAddressEn
        } = body;

        const config = await prisma.laboratoryConfig.upsert({
            where: { id: 'singleton' },
            update: {
                title, titleEn, subtitle, subtitleEn,
                contactName, contactPhone, contactEmail,
                contactAddress, contactAddressEn
            },
            create: {
                id: 'singleton',
                title, titleEn, subtitle, subtitleEn,
                contactName, contactPhone, contactEmail,
                contactAddress, contactAddressEn
            }
        });

        return NextResponse.json({ success: true, data: config });
    } catch (error) {
        console.error("Laboratorium Config POST: Error", error);
        return NextResponse.json({ success: false, error: 'Failed to update config' }, { status: 500 });
    }
}
