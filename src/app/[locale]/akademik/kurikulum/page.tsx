import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import HeroSection from "@/components/shared/HeroSection";
import SectionTitle from "@/components/shared/SectionTitle";
import CurriculumClient from "./CurriculumClient";

export default async function KurikulumPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const ct = await getTranslations({ locale, namespace: "Curriculum" });
  const isEn = locale === 'en';

  const faculties = await prisma.faculty.findMany({
    include: {
      programs: {
        include: {
          subjects: { orderBy: { order: 'asc' } }
        }
      }
    },
    orderBy: { key: 'asc' }
  });

  // Pre-process data to be serializable and handle translations
  const curriculumData = faculties.map(f => ({
    name: isEn ? (f.nameEn || f.name) : f.name,
    programs: f.programs.map(p => ({
      name: isEn ? (p.nameEn || p.name) : p.name,
      // @ts-ignore
      pdfUrl: (p as any).curriculumPdf || "#",
      curriculum: p.subjects.map(s => ({
        semester: s.semester,
        course: isEn ? (s.nameEn || s.name) : s.name,
        credits: s.credits.toString()
      }))
    }))
  })).filter(f => f.programs.length > 0); // Only show faculties with programs

  return (
    <main className="bg-white font-sans text-gray-700">
      <HeroSection
        title={ct("title")}
        subtitle={ct("subtitle")}
      />

      <section className="container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <SectionTitle
            subtitle={ct("description")}
            align="left"
          >
            {ct("sectionTitle")}
          </SectionTitle>

          <div className="mt-12">
            <CurriculumClient
              data={curriculumData}
              translations={{
                description: ct("description"),
                semester: ct("table.semester"),
                course: ct("table.course"),
                credits: ct("table.credits"),
                download: ct("download"),
                noData: ct("noData")
              }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
