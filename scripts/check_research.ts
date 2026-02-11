import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Checking Research & Innovation Data in Supabase:");

    // Check specific tables
    const counts = {
        ResearchProject: await prisma.researchProject.count(),
        ResearchConfig: await prisma.researchConfig.count(),
        Publication: await prisma.publication.count(),
        PkmProject: await prisma.pkmProject.count(),
        PkmConfig: await prisma.pkmConfig.count(),
        LppmStaff: await prisma.lppmStaff.count(),
        LppmProfile: await prisma.lppmProfile.count(),
        Laboratory: await prisma.laboratory.count(),
    };

    console.table(counts);

    // List some titles to be sure (optional, but good for confidence)
    if (counts.ResearchProject > 0) {
        console.log("Sample Research Projects:");
        const rp = await prisma.researchProject.findMany({ take: 2 });
        console.table(rp.map(r => ({ title: r.title, leader: r.leader, year: r.year })));
    }

    await prisma.$disconnect();
}

main();
