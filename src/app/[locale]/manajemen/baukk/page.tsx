import fs from "fs";
import path from "path";
import HeroSection from "@/components/shared/HeroSection";
import SectionTitle from "@/components/shared/SectionTitle";
import Accordion from "@/components/shared/Accordion";
import { Button } from "@/components/shared/Button";
import { Link } from "@/i18n/routing";
import {
  Wallet, Briefcase, Building, Truck, FileText,
  MessageCircle, Phone, Mail, MapPin, ExternalLink, ShieldCheck
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

// Force dynamic
export const dynamic = 'force-dynamic';

interface BAUKKData {
  hero: { title: string; titleEn?: string; subtitle: string; subtitleEn?: string; };
  services: { id: string; title: string; titleEn?: string; description: string; descriptionEn?: string; icon: string; slug?: string; link?: string; }[];
  audits: { year: number; url: string; title: string; titleEn?: string; }[];
  contact: { address: string; addressEn?: string; whatsapp: string; email: string; };
  faqs: { question: string; questionEn?: string; answer: string; answerEn?: string; }[];
}

async function getBAUKKData(): Promise<BAUKKData> {
  const filePath = path.join(process.cwd(), 'src/data/baukk.json');
  if (!fs.existsSync(filePath)) {
    return {
      hero: { title: "BAUKK", subtitle: "Biro Administrasi Umum" },
      services: [],
      audits: [],
      contact: { address: "", whatsapp: "", email: "" },
      faqs: []
    };
  }
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

// Icon mapper
const iconMap: Record<string, any> = {
  Wallet, Briefcase, Building, Truck, FileText, ShieldCheck
};

export default async function BAUKKPage() {
  const data = await getBAUKKData();
  const locale = await getLocale();
  const t = await getTranslations("BAUKK");

  return (
    <main className="font-sans text-gray-700 bg-white">
      <HeroSection
        title={locale === 'en' ? (data.hero.titleEn || data.hero.title) : data.hero.title}
        subtitle={locale === 'en' ? (data.hero.subtitleEn || data.hero.subtitle) : data.hero.subtitle}
        className="bg-gradient-to-r from-blue-700 to-unaicNavy"
      />

      {/* Layanan Utama */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <SectionTitle>{t("servicesTitle")}</SectionTitle>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-center mb-16">
            {t("servicesDesc")}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.services.map((service) => {
              const Icon = iconMap[service.icon] || FileText;
              return (
                <div key={service.id} className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-unaicNavy mb-3 group-hover:text-blue-700 transition-colors">
                    {locale === 'en' ? (service.titleEn || service.title) : service.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    {locale === 'en' ? (service.descriptionEn || service.description) : service.description}
                  </p>
                  {/* Placeholder for future links/slugs if implemented similar to BAAK */}
                  <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="w-0 h-full bg-blue-500 group-hover:w-full transition-all duration-500 ease-in-out"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Transparansi & Audit */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="bg-gradient-to-br from-unaicNavy to-blue-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl overflow-hidden relative">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

            <div className="relative z-10 text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t("transparencyTitle")}</h2>
              <p className="text-blue-100 max-w-2xl mx-auto">
                {t("transparencyDesc")}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 relative z-10 max-w-4xl mx-auto">
              {data.audits.map((audit, idx) => (
                <Link
                  href={audit.url}
                  key={idx}
                  className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition backdrop-blur-sm group"
                >
                  <div className="bg-white/20 p-2 rounded-lg">
                    <FileText className="text-unaicGold" size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm text-white group-hover:text-unaicGold transition-colors">{audit.year}</p>
                    <p className="text-xs text-blue-200 truncate max-w-[120px]">{locale === 'en' ? (audit.titleEn || audit.title) : audit.title}</p>
                  </div>
                  <ExternalLink size={14} className="ml-auto text-white/50 group-hover:text-white" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-3xl px-4">
          <SectionTitle>{t("faqTitle")}</SectionTitle>
          <Accordion
            items={data.faqs.map(faq => ({
              title: locale === 'en' ? (faq.questionEn || faq.question) : faq.question,
              content: `<p class="text-gray-600">${locale === 'en' ? (faq.answerEn || faq.answer) : faq.answer}</p>`
            }))}
          />
        </div>
      </section>

      {/* Kontak */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <SectionTitle>{t("contactTitle")}</SectionTitle>
          <p className="text-gray-600 mb-10 max-w-xl mx-auto">
            {t("contactDesc")}
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-6 mb-10">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <MapPin className="text-unaicGold" />
              <span className="text-sm font-medium text-gray-700 max-w-[200px] text-left">{locale === 'en' ? (data.contact.addressEn || data.contact.address) : data.contact.address}</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <Mail className="text-unaicGold" />
              <span className="text-sm font-medium text-gray-700">{data.contact.email}</span>
            </div>
          </div>

          <Button asChild className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-green-600/30 transition-all text-lg">
            <a href={`https://wa.me/${data.contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2" /> {t("whatsappBtn")}
            </a>
          </Button>
        </div>
      </section>
    </main>
  );
}
