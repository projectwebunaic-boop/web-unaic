import fs from 'fs';
import path from 'path';
import MitraContent from "./MitraContent";

export const dynamic = 'force-dynamic';

async function getPartnersData() {
    try {
        const filePath = path.join(process.cwd(), 'src/data/partners.json');
        if (!fs.existsSync(filePath)) return null;
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Error reading partners data:", error);
        return null;
    }
}

export default async function MitraPage() {
    const data = await getPartnersData();

    if (!data) return <div className="p-10 text-center">Data Mitra belum tersedia.</div>;

    return <MitraContent data={data} />;
}
