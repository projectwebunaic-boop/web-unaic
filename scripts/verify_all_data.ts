import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("📊 VERIFIKASI DATA FINAL\n");
    console.log("=".repeat(50));

    // News/Posts
    const posts = await prisma.post.findMany({
        select: { title: true, slug: true, published: true, category: true }
    });
    console.log(`\n📰 BERITA (${posts.length} items):`);
    posts.forEach(p => console.log(`   ${p.published ? '✅' : '❌'} [${p.category}] ${p.title}`));

    // Leaders
    const leaders = await prisma.leader.findMany({
        select: { name: true, slug: true, category: true, isActive: true },
        orderBy: { category: 'asc' }
    });
    console.log(`\n👔 PIMPINAN (${leaders.length} items):`);
    leaders.forEach(l => console.log(`   ${l.isActive ? '✅' : '❌'} [${l.category}] ${l.name} (/${l.slug})`));

    // Research
    const research = await prisma.researchProject.findMany({
        select: { title: true, leader: true, year: true }
    });
    console.log(`\n🔬 PENELITIAN (${research.length} items):`);
    research.forEach(r => console.log(`   ✅ ${r.title} - ${r.leader} (${r.year})`));

    // PKM
    const pkm = await prisma.pkmProject.findMany({
        select: { title: true, leader: true, year: true }
    });
    console.log(`\n🤝 PKM (${pkm.length} items):`);
    pkm.forEach(p => console.log(`   ✅ ${p.title} - ${p.leader} (${p.year})`));

    // Publications
    const pubs = await prisma.publication.findMany({
        select: { title: true, type: true }
    });
    console.log(`\n📚 PUBLIKASI (${pubs.length} items):`);
    const byType = pubs.reduce((acc, p) => {
        acc[p.type] = (acc[p.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    Object.entries(byType).forEach(([type, count]) => console.log(`   ✅ ${type}: ${count} items`));

    // Faculties & Programs
    const faculties = await prisma.faculty.findMany({
        include: { programs: true }
    });
    console.log(`\n🏫 FAKULTAS & PRODI (${faculties.length} fakultas):`);
    faculties.forEach(f => {
        console.log(`   ✅ ${f.name} (${f.programs.length} prodi)`);
    });

    console.log("\n" + "=".repeat(50));
    console.log("✅ VERIFIKASI SELESAI!");

    await prisma.$disconnect();
}

main();
