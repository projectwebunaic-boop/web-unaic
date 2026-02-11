import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Fixing visibility flags in Supabase...");

    const postUpdate = await prisma.post.updateMany({
        data: { published: true }
    });
    console.log(`✅ Updated ${postUpdate.count} Posts to published: true`);

    // Check Leaders
    const leaders = await prisma.leader.findMany();
    console.log(`📊 Current Leaders: ${leaders.length}`);
    for (const l of leaders) {
        console.log(`   - [${l.isActive ? 'VISIBLE' : 'HIDDEN'}] ${l.name} (${l.slug})`);
    }

    if (leaders.some(l => !l.isActive)) {
        const leaderUpdate = await prisma.leader.updateMany({
            data: { isActive: true }
        });
        console.log(`✅ Updated ${leaderUpdate.count} Leaders to isActive: true`);
    }

    console.log("🎉 Visibility fix complete!");
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
