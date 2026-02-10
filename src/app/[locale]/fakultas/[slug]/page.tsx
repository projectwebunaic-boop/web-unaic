import { GraduationCap, ExternalLink, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import HeroSection from "@/components/shared/HeroSection";
import SectionTitle from "@/components/shared/SectionTitle";
import prisma from "@/lib/prisma";
import * as Icons from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

interface Props {
  params: { locale: string; slug: string };
}

export default async function FacultyDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const isEn = locale === 'en';
  const t = await getTranslations("Faculties");

  const faculty = await prisma.faculty.findUnique({
    where: { slug },
    include: {
      programs: true,
      dean: true
    }
  });

  if (!faculty) {
    notFound();
  }

  const fakultas = {
    ...faculty,
    nama: isEn ? (faculty.nameEn || faculty.name) : faculty.name,
    deskripsi: isEn ? (faculty.deanMessageEn ? faculty.deanMessageEn.substring(0, 200) + '...' : faculty.nameEn || "") : (faculty.deanMessage ? faculty.deanMessage.substring(0, 200) + '...' : faculty.name),
    icon: (Icons as any)[faculty.icon || "BookOpen"] || Icons.BookOpen,
    prodi: faculty.programs,
    website: faculty.slug === 'ilmu-kesehatan' ? "https://fikes.universitasalirsyad.ac.id" :
      faculty.slug === 'farmasi-sains-teknologi' ? "https://fastek.universitasalirsyad.ac.id" : null,
  };

  return (
    <main className="font-sans text-gray-700 bg-white">
      {/* Hero Section */}
      <HeroSection
        title={fakultas.nama}
        subtitle={fakultas.deskripsi}
      />

      {/* Main Content Section */}
      <section className="w-full bg-gray-50 py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-gray-600 space-y-4">
              <SectionTitle>{t("aboutTitle")}</SectionTitle>
              <p>
                {fakultas.deskripsi} {t("aboutDesc")}
              </p>
              <p>
                {t("locationDesc")}
              </p>
            </div>
            <div>
              <div className="w-24 h-24 bg-unaicGold bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <fakultas.icon className="w-12 h-12 text-unaicNavy" />
              </div>
              <h3 className="text-xl font-semibold text-center text-unaicNavy mb-4">{fakultas.nama}</h3>
              <p className="text-gray-600 text-center">{fakultas.deskripsi}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Program Studi Section */}
      <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle>{t("prodiTitle")}</SectionTitle>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {fakultas.prodi.map((program: any, index: number) => (
              <li
                key={index}
                className="flex items-center gap-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300 group"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-unaicNavy rounded-full flex items-center justify-center group-hover:bg-unaicGold transition-colors duration-300">
                  <GraduationCap className="w-6 h-6 text-white group-hover:text-unaicNavy" />
                </div>
                <Link
                  href={`/fakultas/${faculty.slug}/${program.slug}`}
                  className="text-gray-800 font-medium text-lg hover:text-unaicNavy transition-colors duration-300"
                >
                  {isEn ? (program.nameEn || program.name) : program.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <SectionTitle>{t("visitWebsite")}</SectionTitle>
            <div>
              {fakultas.website ? (
                <a
                  href={fakultas.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-unaicNavy hover:bg-unaicGold text-white hover:text-unaicNavy px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  🌐 {t("visitWebsite")}
                  <ExternalLink className="w-5 h-5" />
                </a>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center gap-3 bg-gray-300 text-gray-500 px-8 py-4 rounded-full font-semibold text-lg cursor-not-allowed"
                >
                  🌐 {t("comingSoon")}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
