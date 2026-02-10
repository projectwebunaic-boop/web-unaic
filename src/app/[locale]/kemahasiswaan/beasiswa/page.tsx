import fs from 'fs';
import path from 'path';
import BeasiswaContent from "./BeasiswaContent";

export const dynamic = 'force-dynamic';

async function getScholarshipsData() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/scholarships.json');
    if (!fs.existsSync(filePath)) return null;
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading scholarships data:", error);
    return null;
  }
}

export default async function BeasiswaPage() {
  const data = await getScholarshipsData();

  if (!data) return <div className="p-10 text-center">Data Beasiswa belum tersedia.</div>;

  return <BeasiswaContent data={data} />;
}
