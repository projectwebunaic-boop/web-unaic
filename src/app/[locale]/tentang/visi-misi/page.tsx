import fs from 'fs';
import path from 'path';
import VisiMisiContent from "./VisiMisiContent";

export const dynamic = 'force-dynamic';

async function getProfileData() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/profile.json');
    if (!fs.existsSync(filePath)) return null;
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading profile data:", error);
    return null;
  }
}

export default async function VisiMisiPage() {
  const data = await getProfileData();

  if (!data) return <div className="p-10 text-center">Data Visi Misi belum tersedia.</div>;

  const { vision, mission } = data;

  return <VisiMisiContent vision={vision} mission={mission} />;
}
