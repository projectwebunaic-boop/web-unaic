const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const faculty = await prisma.faculty.findUnique({
            where: { key: 'health' }
        });
        console.log('--- Health Faculty Missions ---');
        console.log('Missions (raw):', faculty.missions);
        console.log('Missions type:', typeof faculty.missions);
        console.log('MissionsEn (raw):', faculty.missionsEn);
        console.log('MissionsEn type:', typeof faculty.missionsEn);

        if (faculty.missions) {
            try {
                const parsed = JSON.parse(faculty.missions);
                console.log('Parsed Missions:', parsed);
                console.log('Parsed Missions type:', typeof parsed);
                console.log('Is array?', Array.isArray(parsed));
            } catch (e) {
                console.log('Failed to parse missions');
            }
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
