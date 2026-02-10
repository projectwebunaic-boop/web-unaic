import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const profile = await prisma.lppmProfile.findUnique({
            where: { id: 'singleton' }
        });

        const staff = await prisma.lppmStaff.findMany({
            orderBy: { order: 'asc' }
        });

        if (!profile) {
            // Create default profile if not exists
            const defaultProfile = await prisma.lppmProfile.create({
                data: { id: 'singleton' }
            });
            return NextResponse.json({ ...defaultProfile, staff: [] });
        }

        // Parse JSON strings to arrays
        const data = {
            ...profile,
            mission: profile.mission ? JSON.parse(profile.mission) : [],
            missionEn: profile.missionEn ? JSON.parse(profile.missionEn) : [],
            tasks: profile.tasks ? JSON.parse(profile.tasks) : [],
            tasksEn: profile.tasksEn ? JSON.parse(profile.tasksEn) : [],
            staff: staff
        };

        return NextResponse.json(data);
    } catch (error) {
        console.error('LPPM GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, data } = body;

        if (type === 'update_profile') {
            const updatedProfile = await prisma.lppmProfile.upsert({
                where: { id: 'singleton' },
                update: {
                    vision: data.vision,
                    visionEn: data.visionEn,
                    mission: Array.isArray(data.mission) ? JSON.stringify(data.mission) : data.mission,
                    missionEn: Array.isArray(data.missionEn) ? JSON.stringify(data.missionEn) : data.missionEn,
                    tasks: Array.isArray(data.tasks) ? JSON.stringify(data.tasks) : data.tasks,
                    tasksEn: Array.isArray(data.tasksEn) ? JSON.stringify(data.tasksEn) : data.tasksEn,
                    ctaTitle: data.ctaTitle,
                    ctaTitleEn: data.ctaTitleEn,
                    ctaDescription: data.ctaDescription,
                    ctaDescriptionEn: data.ctaDescriptionEn,
                    ctaButtonText: data.ctaButtonText,
                    ctaButtonTextEn: data.ctaButtonTextEn,
                    ctaButtonLink: data.ctaButtonLink,
                },
                create: {
                    id: 'singleton',
                    vision: data.vision,
                    visionEn: data.visionEn,
                    mission: Array.isArray(data.mission) ? JSON.stringify(data.mission) : data.mission,
                    missionEn: Array.isArray(data.missionEn) ? JSON.stringify(data.missionEn) : data.missionEn,
                    tasks: Array.isArray(data.tasks) ? JSON.stringify(data.tasks) : data.tasks,
                    tasksEn: Array.isArray(data.tasksEn) ? JSON.stringify(data.tasksEn) : data.tasksEn,
                    ctaTitle: data.ctaTitle,
                    ctaTitleEn: data.ctaTitleEn,
                    ctaDescription: data.ctaDescription,
                    ctaDescriptionEn: data.ctaDescriptionEn,
                    ctaButtonText: data.ctaButtonText,
                    ctaButtonTextEn: data.ctaButtonTextEn,
                    ctaButtonLink: data.ctaButtonLink,
                }
            });
            return NextResponse.json({ message: 'Profile updated', data: updatedProfile });
        }

        if (type === 'create_staff') {
            const newStaff = await prisma.lppmStaff.create({
                data: {
                    name: data.name,
                    position: data.position,
                    positionEn: data.positionEn,
                    image: data.image,
                    order: data.order || 0
                }
            });
            return NextResponse.json({ message: 'Staff created', data: newStaff });
        }

        if (type === 'update_staff') {
            const updatedStaff = await prisma.lppmStaff.update({
                where: { id: data.id },
                data: {
                    name: data.name,
                    position: data.position,
                    positionEn: data.positionEn,
                    image: data.image,
                    order: data.order
                }
            });
            return NextResponse.json({ message: 'Staff updated', data: updatedStaff });
        }

        if (type === 'delete_staff') {
            await prisma.lppmStaff.delete({
                where: { id: data.id }
            });
            return NextResponse.json({ message: 'Staff deleted' });
        }

        return NextResponse.json({ error: 'Invalid operation type' }, { status: 400 });

    } catch (error: any) {
        console.error('LPPM POST error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
