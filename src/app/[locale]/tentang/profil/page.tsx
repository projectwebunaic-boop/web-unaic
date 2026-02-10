
import { motion, Variants, Transition } from "framer-motion";
import { Book, Lightbulb, Users, Award, School, MapPin, Download, X, ChevronLeft, ChevronRight, Star } from "lucide-react"; // Added Star
import { Link } from "@/i18n/routing";
import HeroSection from "@/components/shared/HeroSection";
import SectionTitle from "@/components/shared/SectionTitle";
import { getLocale, getTranslations } from "next-intl/server";
import fs from 'fs';
import path from 'path';
import ClientProfileGallery from "./ClientProfileGallery"; // Separate client component for interactivity

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

// Map icon string names to Lucide components
const IconMap: { [key: string]: any } = {
  Book, Lightbulb, Users, Award, School, MapPin, Star
};

export default async function ProfilPage() {
  const data = await getProfileData();

  if (!data) {
    return <div className="p-10 text-center">Data Profil belum tersedia.</div>;
  }

  const { hero, history, identity, values, media } = data;
  const locale = await getLocale();
  const t = await getTranslations('Profile');
  const isEn = locale === 'en';

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <main className="font-sans text-gray-700 bg-white">
      {/* Hero Section */}
      <HeroSection
        title={(isEn ? hero?.titleEn : hero?.title) || "Profil"}
        subtitle={(isEn ? hero?.subtitleEn : hero?.subtitle) || "Mengenal lebih dalam tentang Universitas Al-Irsyad Cilacap."}
      />

      {/* Seksi Deskripsi Singkat */}
      <section className="bg-gray-50 w-full py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-gray-600 space-y-4">
              <SectionTitle>{(isEn ? history?.titleEn : history?.title) || "Sejarah Singkat UNAIC"}</SectionTitle>
              <div
                className="prose max-w-none text-gray-600 space-y-4"
                dangerouslySetInnerHTML={{ __html: (isEn ? history?.contentEn : history?.content) || "" }}
              />
            </div>
            <div>
              {history?.image && (
                <img
                  src={history.image}
                  alt="Sejarah UNAIC"
                  className="rounded-xl shadow-lg w-full object-cover max-h-[400px]"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Identitas Kampus */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle>{t('identityTitle')}</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {identity?.map((item: any, idx: number) => {
              const IconComponent = IconMap[item.icon] || InfoIcon;
              return (
                <div key={idx} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg hover:scale-105 transition-transform duration-300 cursor-default text-center">
                  <div className="w-16 h-16 bg-unaicGold bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent size={32} className="text-unaicNavy" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{(isEn ? item.titleEn : item.title)}</h3>
                  <p className="text-gray-700">{(isEn ? item.valueEn : item.value)}</p>
                </div>
              );
            }) || <p>Data identitas belum diisi.</p>}
          </div>
        </div>
      </section>

      {/* Nilai Inti UNAIC */}
      <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle>{t('valuesTitle')}</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {values?.map((item: any, idx: number) => {
              const IconComponent = IconMap[item.icon] || InfoIcon;
              return (
                <div key={idx} className="bg-white border rounded-xl shadow-sm p-6 flex flex-col items-center text-center cursor-default hover:shadow-unaicGold hover:scale-105 transition-transform duration-300">
                  <IconComponent className="text-unaicNavy mb-3" size={36} />
                  <h3 className="font-semibold text-lg mb-1">{(isEn ? item.titleEn : item.title)}</h3>
                  <p className="text-sm text-gray-600">{(isEn ? item.descriptionEn : item.description)}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Gallery & Video (Client Component for interactivity) */}
      <ClientProfileGallery media={media} />

      {/* Call to Action */}
      <section className="bg-unaicNavy py-12">
        <div className="container mx-auto max-w-7xl px-4 text-center text-white">
          <h2 className="font-heading text-3xl font-bold mb-6">{t('ctaTitle')}</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/tentang/sejarah" className="bg-unaicGold text-unaicNavy font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-400 transition-colors">{t('buttons.history')}</Link>
            <Link href="/tentang/visi-misi" className="bg-unaicGold text-unaicNavy font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-400 transition-colors">{t('buttons.vision')}</Link>
            <Link href="/tentang/prestasi" className="bg-unaicGold text-unaicNavy font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-400 transition-colors">{t('buttons.achievements')}</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

// Fallback Icon
function InfoIcon(props: any) { return <div {...props}>?</div> }
