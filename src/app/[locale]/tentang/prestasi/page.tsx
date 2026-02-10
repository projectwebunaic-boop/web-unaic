import fs from 'fs';
import path from 'path';
import PrestasiContent from "./PrestasiContent";

export const dynamic = 'force-dynamic';

async function getAchievementsData() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/achievements.json');
    if (!fs.existsSync(filePath)) return null;
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading achievements data:", error);
    return null;
  }
}

export default async function PrestasiPage() {
  const data = await getAchievementsData();

  if (!data) return <div className="p-10 text-center">Data Prestasi belum tersedia.</div>;

  return <PrestasiContent data={data} />;
}
