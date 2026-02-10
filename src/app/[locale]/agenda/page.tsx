
import HeroSection from "@/components/shared/HeroSection";
import SectionTitle from "@/components/shared/SectionTitle";
import NewsList from "@/components/news/NewsList";

export default function AgendaPage() {
  return (
    <main className="bg-white font-sans text-gray-700">
      {/* Hero Section */}
      <HeroSection
        title="Agenda"
        subtitle="Agenda kegiatan Universitas Al-Irsyad Cilacap yang meliputi seminar, workshop, wisuda, dan berbagai acara akademik maupun non-akademik."
      />

      {/* Agenda Kampus Terkini Section */}
      <section className="container mx-auto px-4 py-12">
        <SectionTitle>Agenda Kampus Terkini</SectionTitle>

        {/* Use NewsList specialized for Agenda */}
        <NewsList defaultTab="Agenda" hideTabs={true} />
      </section>
    </main>
  );
}
