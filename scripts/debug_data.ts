import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
    console.log("🔍 Checking Leader Slugs in Database...");
    const leaders = await prisma.leader.findMany({
        select: { name: true, slug: true, category: true }
    });
    console.log(JSON.stringify(leaders, null, 2));
    await prisma.$disconnect();
}
run();
