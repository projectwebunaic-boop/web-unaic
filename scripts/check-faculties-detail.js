const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const faculties = await prisma.faculty.findMany();
        console.log('--- Faculties Detail ---');
        faculties.forEach(f => {
            console.log(`Key: ${f.key}`);
            console.log(`- Vision ID: ${f.vision ? f.vision.substring(0, 30) + '...' : 'NULL'}`);
            console.log(`- Vision EN: ${f.visionEn ? f.visionEn.substring(0, 30) + '...' : 'NULL'}`);
            console.log(`- Dean Msg EN: ${f.deanMessageEn ? 'PRESENT' : 'NULL'}`);
        });
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
