import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from "@/lib/prisma";

// const prisma = new PrismaClient();

// Update getLPMData to fetch from new tables
export const dynamic = 'force-dynamic';

async function getLPMData() {
    // 1. Fetch Profile (About, Vision, Mission) hierarchy
    // Since we used LpmProfile singleton
    const profile = await prisma.lpmProfile.findFirst() || { about: "", aboutEn: "", vision: "", visionEn: "", mission: [], missionEn: [] };

    // 2. Fetch Structure (Staff)
    const staff = await prisma.lpmStaff.findMany({ orderBy: { order: 'asc' } });

    // 3. Fetch Criteria
    const criteria = await prisma.lpmCriterion.findMany({ orderBy: { order: 'asc' } });

    // 4. Fetch Documents
    const documents = await prisma.lpmDocument.findMany({ orderBy: { order: 'asc' } });

    // 5. Fetch Agendas
    const agendas = await prisma.lpmAgenda.findMany({ orderBy: { date: 'desc' } });

    // 6. Fetch Contact (Still from PageContent or hardcoded for now?)
    // Existing code used PageContent for contact. Let's keep it if not migrated.
    const contactItem = await prisma.pageContent.findUnique({
        where: { pageSlug_section: { pageSlug: 'lpm', section: 'contact' } }
    });
    const contact = contactItem ? JSON.parse(contactItem.content || '{}') : { address: "", whatsapp: "", email: "" };

    // Hero (Still from PageContent)
    const heroItem = await prisma.pageContent.findUnique({
        where: { pageSlug_section: { pageSlug: 'lpm', section: 'hero' } }
    });
    const hero = heroItem ? JSON.parse(heroItem.content || '{}') : { title: "", subtitle: "" };


    return {
        hero,
        about: {
            content: profile.about,
            contentEn: profile.aboutEn
        },
        profile: { // This key might be confusing, but corresponds to VisiMisi in frontend likely
            vision: profile.vision,
            visionEn: profile.visionEn,
            mission: profile.mission,
            missionEn: profile.missionEn
        },
        structure: staff,
        criteria,
        documents,
        agendas,
        contact
    };
}

export async function GET() {
    try {
        const data = await getLPMData();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching LPM data:", error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
// POST handler removed as specific routes now handle updates.

