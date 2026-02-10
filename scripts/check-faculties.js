const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const faculties = await prisma.faculty.findMany({
            include: {
                programs: true,
            }
        });
        console.log('--- Faculties in DB ---');
        faculties.forEach(f => {
            console.log(`ID: ${f.id}, Key: ${f.key}, Name: ${f.name}, NameEn: ${f.nameEn}`);
            console.log(`Programs: ${f.programs.length}`);
        });
        if (faculties.length === 0) {
            console.log('No faculties found in database.');
        }
    } catch (error) {
        console.error('Error fetching faculties:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
