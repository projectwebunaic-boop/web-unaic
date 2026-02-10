import fs from 'fs';
import path from 'path';
import OrganisasiContent from "./OrganisasiContent";

export const dynamic = 'force-dynamic';

async function getOrganizationsData() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/organizations.json');
    if (!fs.existsSync(filePath)) return null;
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading organizations data:", error);
    return null;
  }
}

export default async function OrganisasiPage() {
  const data = await getOrganizationsData();

  if (!data) return <div className="p-10 text-center">Data Organisasi belum tersedia.</div>;

  return <OrganisasiContent data={data} />;
}
