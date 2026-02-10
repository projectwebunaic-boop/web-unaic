import fs from 'fs';
import path from 'path';
import FasilitasContent from "./FasilitasContent";

export const dynamic = 'force-dynamic';

async function getFacilitiesData() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/facilities.json');
    if (!fs.existsSync(filePath)) return null;
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading facilities data:", error);
    return null;
  }
}

export default async function FasilitasPage() {
  const data = await getFacilitiesData();

  if (!data) return <div className="p-10 text-center">Data Fasilitas belum tersedia.</div>;

  return <FasilitasContent data={data} />;
}
