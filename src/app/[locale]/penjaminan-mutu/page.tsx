import fs from 'fs';
import path from 'path';
import LPMContent from "./LPMContent";

export const dynamic = 'force-dynamic';

async function getLPMData() {
    try {
        const filePath = path.join(process.cwd(), 'src/data/lpm.json');
        if (!fs.existsSync(filePath)) return null;
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Error reading LPM data:", error);
        return null;
    }
}

export default async function LPMPage() {
    const data = await getLPMData();

    if (!data) return <div className="p-10 text-center">Data LPM belum tersedia.</div>;

    return <LPMContent data={data} />;
}
