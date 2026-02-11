import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
    const l = await prisma.leader.findMany({select: {name: true, category: true, slug: true, isActive: true}});
    console.log("LEADER CATEGORIES:", JSON.stringify(l, null, 2));
    const p = await prisma.post.findMany({select: {title: true, category: true, published: true}});
    console.log("POST CATEGORIES:", JSON.stringify(p, null, 2));
    prisma.$disconnect();
}
run();
