import fs from 'fs';
import path from 'path';
import AlumniContent from "./AlumniContent";

export const dynamic = 'force-dynamic';

async function getAlumniData() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/alumni.json');
    if (!fs.existsSync(filePath)) return null;
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading alumni data:", error);
    return null;
  }
}

async function getNewsData() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/news.json');
    if (!fs.existsSync(filePath)) return [];
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading news data:", error);
    return [];
  }
}

export default async function AlumniPage() {
  const alumniData = await getAlumniData();
  const newsData = await getNewsData();

  if (!alumniData) return <div className="p-10 text-center">Data Alumni belum tersedia.</div>;

  return <AlumniContent data={alumniData} newsData={newsData} />;
}
