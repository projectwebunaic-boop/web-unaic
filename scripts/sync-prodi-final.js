const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('--- Starting Study Program Sync ---');

        // 1. Delete inactive D3 programs
        const toDelete = ['d3-nursing', 'd3-midwifery', 'd3-fisioterapi', 'd3-physio'];
        const deleteResult = await prisma.facultyProgram.deleteMany({
            where: {
                slug: { in: toDelete }
            }
        });
        console.log(`Deleted ${deleteResult.count} inactive D3 programs.`);

        // 2. Update S1 Keperawatan name
        const nursingProgram = await prisma.facultyProgram.findFirst({
            where: { slug: 's1-nursing' }
        });

        if (nursingProgram) {
            await prisma.facultyProgram.update({
                where: { id: nursingProgram.id },
                data: {
                    name: 'S1 Ilmu Keperawatan',
                    nameEn: 'S1 Nursing Science'
                }
            });
            console.log('Updated "S1 Keperawatan" to "S1 Ilmu Keperawatan".');
        } else {
            console.log('Could not find S1 Nursing program with slug "s1-nursing".');
        }

        console.log('--- Sync Complete ---');
    } catch (error) {
        console.error('Error during sync:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
