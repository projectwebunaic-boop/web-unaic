const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const faculties = await prisma.faculty.findMany();
        for (const f of faculties) {
            let updated = false;
            let missions = f.missions;
            let missionsEn = f.missionsEn;

            if (missions) {
                try {
                    const parsed = JSON.parse(missions);
                    if (typeof parsed === 'string') {
                        console.log(`Fixing missions for ${f.key}`);
                        missions = parsed; // Use the parsed string as the raw value (effectively removes one level of stringification)
                        updated = true;
                    }
                } catch (e) { }
            }

            if (missionsEn) {
                try {
                    const parsed = JSON.parse(missionsEn);
                    if (typeof parsed === 'string') {
                        console.log(`Fixing missionsEn for ${f.key}`);
                        missionsEn = parsed;
                        updated = true;
                    }
                } catch (e) { }
            }

            if (updated) {
                await prisma.faculty.update({
                    where: { id: f.id },
                    data: { missions, missionsEn }
                });
            }
        }
        console.log('Cleanup complete');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
