import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const faculties = await prisma.faculty.findMany({
            include: {
                programs: {
                    include: {
                        subjects: { orderBy: { order: 'asc' } }
                    }
                },
                facilities: { orderBy: { order: 'asc' } },
                dean: true
            }
        });

        // Manual JSON parsing for SQLite compatibility
        const parsedFaculties = faculties.map(f => {
            const parseJson = (box: string | null) => {
                if (!box) return [];
                try {
                    const parsed = JSON.parse(box);
                    if (Array.isArray(parsed)) return parsed;
                    if (typeof parsed === 'string') return JSON.parse(parsed);
                    return [];
                } catch (e) {
                    return [];
                }
            };

            return {
                ...f,
                missions: parseJson(f.missions),
                missionsEn: parseJson(f.missionsEn),
                programs: f.programs.map((p: any) => ({
                    ...p,
                    advantages: parseJson(p.advantages),
                    advantagesEn: parseJson(p.advantagesEn),
                    careerProspects: parseJson(p.careerProspects),
                    careerProspectsEn: parseJson(p.careerProspectsEn),
                }))
            };
        });

        return NextResponse.json(parsedFaculties);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch faculties' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            id,
            name,
            nameEn,
            slug,
            key,
            icon,
            deanName,
            deanTitle,
            deanTitleEn,
            deanMessage,
            deanMessageEn,
            deanImage,
            deanId,
            vision,
            visionEn,
            missions,
            missionsEn,
            heroImage,
            programs,
            facilities
        } = body;

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID is required for update' }, { status: 400 });
        }

        const updatedFaculty = await prisma.faculty.update({
            where: { id },
            data: {
                name,
                nameEn,
                slug,
                key,
                icon,
                deanName,
                deanTitle,
                deanTitleEn,
                deanMessage,
                deanMessageEn,
                deanImage,
                deanId,
                vision,
                visionEn,
                missions: JSON.stringify(missions || []),
                missionsEn: JSON.stringify(missionsEn || []),
                heroImage,
                programs: {
                    deleteMany: {},
                    create: (programs || []).map((p: any) => ({
                        name: p.name,
                        nameEn: p.nameEn,
                        slug: p.slug,
                        key: p.key || p.slug.replace(/-/g, '_'),
                        level: p.level,
                        accreditation: p.accreditation,
                        description: p.description,
                        descriptionEn: p.descriptionEn,
                        advantages: JSON.stringify(p.advantages || []),
                        advantagesEn: JSON.stringify(p.advantagesEn || []),
                        careerProspects: JSON.stringify(p.careerProspects || []),
                        careerProspectsEn: JSON.stringify(p.careerProspectsEn || []),
                        websiteUrl: p.websiteUrl,
                        curriculumPdf: p.curriculumPdf,
                        duration: p.duration,
                        durationEn: p.durationEn,
                        degree: p.degree,
                        degreeEn: p.degreeEn,
                        icon: p.icon || "GraduationCap",
                        subjects: {
                            create: (p.subjects || []).map((s: any, sIdx: number) => ({
                                semester: s.semester,
                                name: s.name,
                                nameEn: s.nameEn,
                                credits: parseInt(s.credits) || 0,
                                order: s.order ?? sIdx
                            }))
                        }
                    }))
                },
                facilities: {
                    deleteMany: {},
                    create: (facilities || []).map((f: any, idx: number) => ({
                        title: f.title,
                        titleEn: f.titleEn,
                        description: f.description,
                        descriptionEn: f.descriptionEn,
                        image: f.image,
                        order: f.order ?? idx
                    }))
                }
            },
            include: {
                programs: true,
                facilities: true,
                dean: true
            }
        });

        return NextResponse.json({ success: true, data: updatedFaculty });
    } catch (error) {
        console.error("Error updating faculty:", error);
        return NextResponse.json({ success: false, error: 'Failed to update faculty' }, { status: 500 });
    }
}
