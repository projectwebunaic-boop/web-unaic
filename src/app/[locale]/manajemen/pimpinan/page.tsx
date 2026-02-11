import prisma from "@/lib/prisma";
import StrukturOrganisasiSection from "./StrukturOrganisasiSection";
import SectionTitle from "@/components/shared/SectionTitle";
import HeroSection from "@/components/shared/HeroSection";
import LeaderCard from "@/components/pimpinan/LeaderCard";
import { getLocale, getTranslations } from "next-intl/server";

// Force dynamic
export const dynamic = 'force-dynamic';

export default async function PimpinanPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const t = await getTranslations({ locale, namespace: "Leaders" });

  const leadersData = await prisma.leader.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' }
  });

  const rector = leadersData.find(l => l.category === "Rektor");
  const viceRectors = leadersData.filter(l => l.category === "Wakil Rektor");
  const deans = leadersData.filter(l => l.category === "Dekan");
  const others = leadersData.filter(l => !["Rektor", "Wakil Rektor", "Dekan"].includes(l.category));

  return (
    <main className="font-sans text-gray-700 bg-white">
      {/* Hero Section */}
      <HeroSection
        title={t("heroTitleList")}
        subtitle={`${t("heroSubtitleList")} (Total: ${leadersData.length}) [v3.1 - FIX-SERVER-ERROR]`}
        className="bg-blue-900"
      />

      {/* Rektor Section */}
      {rector && (
        <section className="bg-gray-50 py-16 sm:py-24">
          <div className="container mx-auto max-w-6xl px-4">
            <SectionTitle>{t("rector")}</SectionTitle>
            <LeaderCard
              name={rector.name}
              title={isEn ? (rector.titleEn || rector.title) : rector.title}
              image={rector.image || "/images/placeholder-user.png"}
              profileLink={`/manajemen/pimpinan/${rector.slug}`}
            />
          </div>
        </section>
      )}

      {/* Wakil Rektor Section */}
      {viceRectors.length > 0 && (
        <section className="bg-white py-16 sm:py-24">
          <div className="container mx-auto max-w-6xl px-4">
            <SectionTitle>{t("viceRector")}</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {viceRectors.map((leader) => (
                <LeaderCard
                  key={leader.id}
                  name={leader.name}
                  title={isEn ? (leader.titleEn || leader.title) : leader.title}
                  image={leader.image || "/images/placeholder-user.png"}
                  profileLink={`/manajemen/pimpinan/${leader.slug}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dekan Fakultas Section */}
      {deans.length > 0 && (
        <section className="bg-gray-50 py-16 sm:py-24">
          <div className="container mx-auto max-w-6xl px-4">
            <SectionTitle>{t("dean")}</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {deans.map((leader) => (
                <LeaderCard
                  key={leader.id}
                  name={leader.name}
                  title={isEn ? (leader.titleEn || leader.title) : leader.title}
                  image={leader.image || "/images/placeholder-user.png"}
                  profileLink={`/manajemen/pimpinan/${leader.slug}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pejabat Lainnya Section */}
      {others.length > 0 && (
        <section className="bg-white py-16 sm:py-24">
          <div className="container mx-auto max-w-6xl px-4">
            <SectionTitle>{t("otherLeaders")}</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {others.map((leader) => (
                <LeaderCard
                  key={leader.id}
                  name={leader.name}
                  title={isEn ? (leader.titleEn || leader.title) : leader.title}
                  image={leader.image || "/images/placeholder-user.png"}
                  profileLink={`/manajemen/pimpinan/${leader.slug}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Struktur Organisasi Section */}
      <StrukturOrganisasiSection />

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-unaicBlue to-unaicNavy py-16 sm:py-24">
        <div className="container mx-auto max-w-4xl px-4 text-center text-white">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-6">
            {t("ctaTitle")}
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            {t("ctaDesc")}
          </p>
        </div>
      </section>
    </main>
  );
}
