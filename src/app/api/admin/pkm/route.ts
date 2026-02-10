import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const config = await prisma.pkmConfig.findUnique({
            where: { id: 'singleton' }
        });

        const projects = await prisma.pkmProject.findMany({
            orderBy: { order: 'asc' }
        });

        const programs = await prisma.pkmProgram.findMany({
            orderBy: { order: 'asc' }
        });

        return NextResponse.json({
            config: config || {},
            projects: projects,
            programs: programs
        });
    } catch (error) {
        console.error('PKM GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, data } = body;

        if (type === 'update_config') {
            const updatedConfig = await prisma.pkmConfig.upsert({
                where: { id: 'singleton' },
                update: {
                    title: data.title,
                    titleEn: data.titleEn,
                    subtitle: data.subtitle,
                    subtitleEn: data.subtitleEn,
                    impactTitle: data.impactTitle,
                    impactTitleEn: data.impactTitleEn,
                    impactDesc: data.impactDesc,
                    impactDescEn: data.impactDescEn
                },
                create: {
                    id: 'singleton',
                    title: data.title,
                    titleEn: data.titleEn,
                    subtitle: data.subtitle,
                    subtitleEn: data.subtitleEn,
                    impactTitle: data.impactTitle,
                    impactTitleEn: data.impactTitleEn,
                    impactDesc: data.impactDesc,
                    impactDescEn: data.impactDescEn
                }
            });
            return NextResponse.json({ message: 'Config updated', data: updatedConfig });
        }

        if (type === 'create_project') {
            const newProject = await prisma.pkmProject.create({
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
            const updatedProject = await prisma.pkmProject.update({
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
            await prisma.pkmProject.delete({
                where: { id: data.id }
            });
            return NextResponse.json({ message: 'Project deleted' });
        }

        if (type === 'create_program') {
            const newProgram = await prisma.pkmProgram.create({
                data: {
                    title: data.title,
                    titleEn: data.titleEn,
                    description: data.description,
                    descriptionEn: data.descriptionEn,
                    icon: data.icon || "Rocket",
                    features: data.features,
                    featuresEn: data.featuresEn,
                    order: data.order || 0
                }
            });
            return NextResponse.json({ message: 'Program created', data: newProgram });
        }

        if (type === 'update_program') {
            const updatedProgram = await prisma.pkmProgram.update({
                where: { id: data.id },
                data: {
                    title: data.title,
                    titleEn: data.titleEn,
                    description: data.description,
                    descriptionEn: data.descriptionEn,
                    icon: data.icon,
                    features: data.features,
                    featuresEn: data.featuresEn,
                    order: data.order
                }
            });
            return NextResponse.json({ message: 'Program updated', data: updatedProgram });
        }

        if (type === 'delete_program') {
            await prisma.pkmProgram.delete({
                where: { id: data.id }
            });
            return NextResponse.json({ message: 'Program deleted' });
        }

        return NextResponse.json({ error: 'Invalid operation type' }, { status: 400 });

    } catch (error: any) {
        console.error('PKM POST error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
