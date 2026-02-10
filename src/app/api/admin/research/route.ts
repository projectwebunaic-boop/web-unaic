import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const config = await prisma.researchConfig.findUnique({
            where: { id: 'singleton' }
        });

        const projects = await prisma.researchProject.findMany({
            orderBy: { order: 'asc' }
        });

        return NextResponse.json({
            config: config || {},
            projects: projects
        });
    } catch (error) {
        console.error('Research GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, data } = body;

        if (type === 'update_config') {
            const updatedConfig = await prisma.researchConfig.upsert({
                where: { id: 'singleton' },
                update: {
                    title: data.title,
                    titleEn: data.titleEn,
                    subtitle: data.subtitle,
                    subtitleEn: data.subtitleEn,
                    focusTitle: data.focusTitle,
                    focusTitleEn: data.focusTitleEn,
                    focusDesc: data.focusDesc,
                    focusDescEn: data.focusDescEn
                },
                create: {
                    id: 'singleton',
                    title: data.title,
                    titleEn: data.titleEn,
                    subtitle: data.subtitle,
                    subtitleEn: data.subtitleEn,
                    focusTitle: data.focusTitle,
                    focusTitleEn: data.focusTitleEn,
                    focusDesc: data.focusDesc,
                    focusDescEn: data.focusDescEn
                }
            });
            return NextResponse.json({ message: 'Config updated', data: updatedConfig });
        }

        if (type === 'create_project') {
            const newProject = await prisma.researchProject.create({
                data: {
                    title: data.title,
                    titleEn: data.titleEn,
                    leader: data.leader,
                    year: data.year,
                    status: data.status,
                    description: data.description,
                    descriptionEn: data.descriptionEn,
                    reportUrl: data.reportUrl,
                    order: data.order || 0
                }
            });
            return NextResponse.json({ message: 'Project created', data: newProject });
        }

        if (type === 'update_project') {
            const updatedProject = await prisma.researchProject.update({
                where: { id: data.id },
                data: {
                    title: data.title,
                    titleEn: data.titleEn,
                    leader: data.leader,
                    year: data.year,
                    status: data.status,
                    description: data.description,
                    descriptionEn: data.descriptionEn,
                    reportUrl: data.reportUrl,
                    order: data.order
                }
            });
            return NextResponse.json({ message: 'Project updated', data: updatedProject });
        }

        if (type === 'delete_project') {
            await prisma.researchProject.delete({
                where: { id: data.id }
            });
            return NextResponse.json({ message: 'Project deleted' });
        }

        return NextResponse.json({ error: 'Invalid operation type' }, { status: 400 });

    } catch (error: any) {
        console.error('Research POST error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
