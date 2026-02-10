const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const faculties = await prisma.faculty.findMany({
        include: { programs: true, facilities: true }
    });
    console.log('Faculties:', JSON.stringify(faculties, null, 2));

    const leaders = await prisma.leader.findMany();
    console.log('Leaders:', JSON.stringify(leaders, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
