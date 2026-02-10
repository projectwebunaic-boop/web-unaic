const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const programs = await prisma.facultyProgram.findMany();
        console.log('--- Programs in DB ---');
        programs.forEach(p => {
            console.log(`Slug: ${p.slug}, Name: ${p.name}, NameEn: ${p.nameEn}`);
        });
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
