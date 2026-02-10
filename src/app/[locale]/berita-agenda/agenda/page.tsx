
import HeroSection from "@/components/shared/HeroSection";
import SectionTitle from "@/components/shared/SectionTitle";
import AgendaList from "@/components/events/AgendaList";
import fs from 'fs';
import path from 'path';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

async function getAgendaData() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/agenda.json');
    if (!fs.existsSync(filePath)) return [];
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading agenda data:", error);
    return [];
  }
}

export default async function BeritaAgendaAgendaPage() {
  const t = await getTranslations("Agenda");
  const agendaData = await getAgendaData();

  return (
    <main className="bg-white font-sans text-gray-700">
      {/* Hero Section */}
      <HeroSection
        title={t("heroTitle")}
        subtitle={t("heroSubtitle", { defaultValue: "Kumpulan agenda terbaru seputar Universitas Al-Irsyad Cilacap." })}
      />

      {/* Agenda Terkini Section */}
      <section className="container mx-auto px-4 py-12">
        <SectionTitle>{t("recentAgenda", { defaultValue: "Agenda Terkini" })}</SectionTitle>

        <AgendaList data={agendaData} />
      </section>
    </main>
  );
}
