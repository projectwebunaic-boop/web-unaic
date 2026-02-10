import fs from 'fs';
import path from 'path';
import AkreditasiContent from "./AkreditasiContent";

export const dynamic = 'force-dynamic';

async function getAccreditationData() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/accreditation.json');
    if (!fs.existsSync(filePath)) return null;
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading accreditation data:", error);
    return null;
  }
}

export default async function AccreditationPage() {
  const data = await getAccreditationData();

  if (!data) return <div className="p-10 text-center">Data Akreditasi belum tersedia.</div>;

  return <AkreditasiContent data={data} />;
}
