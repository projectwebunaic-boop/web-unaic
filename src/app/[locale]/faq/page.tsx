import fs from 'fs';
import path from 'path';
import { HelpCircle, Phone, Mail } from "lucide-react";
import HeroSection from "@/components/shared/HeroSection";
import SectionTitle from "@/components/shared/SectionTitle";
import FAQAccordion from "@/components/faq/FAQAccordion";
import { getTranslations, getLocale } from 'next-intl/server';

async function getData() {
  try {
    const faqPath = path.join(process.cwd(), 'src/data/faq.json');
    const settingsPath = path.join(process.cwd(), 'src/data/admin_settings.json');

    const faqContent = fs.existsSync(faqPath) ? fs.readFileSync(faqPath, 'utf-8') : '[]';
    const settingsContent = fs.existsSync(settingsPath) ? fs.readFileSync(settingsPath, 'utf-8') : '{}';

    return {
      faqs: JSON.parse(faqContent),
      settings: JSON.parse(settingsContent)
    };

  } catch (error) {
    console.error("Error reading data:", error);
    return { faqs: [], settings: {} };
  }
}

export const dynamic = 'force-dynamic';

export default async function FAQPage() {
  const { faqs, settings } = await getData();
  const contact = settings.contact || { phone: "(0282) 532975", email: "info@universitasalirsyad.ac.id" }; // Fallback

  const t = await getTranslations("FAQ");
  const locale = await getLocale();
  const isEn = locale === 'en';

  // Map data based on locale
  const localizedFaqs = faqs.map((item: any) => ({
    ...item,
    question: isEn && item.questionEn ? item.questionEn : item.question,
    answer: isEn && item.answerEn ? item.answerEn : item.answer,
    // Note: Categories might also need translation if strictly required, but for now filtering is based on keys.
  }));

  return (
    <main className="bg-white font-sans text-gray-700">
      {/* Hero Section */}
      <HeroSection
        title={t("title")}
        subtitle={t("subtitle")}
      />

      {/* Pertanyaan Umum Section */}
      <section className="container mx-auto px-4 py-12">
        <SectionTitle>{t("generalQuestions")}</SectionTitle>
        {localizedFaqs.length > 0 ? (
          <FAQAccordion data={localizedFaqs} />
        ) : (
          <div className="text-center py-20 text-gray-500">{t("noFAQ")}</div>
        )}
      </section>

      {/* Butuh Bantuan Lebih Lanjut Section */}
      <section className="container mx-auto px-4 py-12">
        <SectionTitle>{t("needHelp")}</SectionTitle>

        <div className="max-w-4xl mx-auto text-center animate-fadeIn">
          <div className="bg-gray-50 rounded-lg p-8 mb-8">
            <HelpCircle className="w-16 h-16 text-unaicBlue mx-auto mb-4" />
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              {t("needHelpDesc")}
            </p>
            <a
              href="/kontak"
              className="inline-block px-6 py-3 bg-unaicNavy text-white rounded-lg hover:bg-unaicGold transition-colors duration-300 font-medium text-lg"
            >
              {t("contactUs")}
            </a>

            <div className="mt-8 pt-8 border-t border-gray-100 w-full flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-gray-600">
              <div className="flex items-center gap-2 group">
                <div className="p-2 bg-blue-50 rounded-full text-unaicBlue group-hover:bg-unaicBlue group-hover:text-white transition-colors">
                  <Phone size={18} />
                </div>
                <span className="font-semibold text-unaicNavy text-lg">{contact.phone}</span>
              </div>
              <div className="hidden md:block w-px h-8 bg-gray-200"></div>
              <div className="flex items-center gap-2 group">
                <div className="p-2 bg-blue-50 rounded-full text-unaicBlue group-hover:bg-unaicBlue group-hover:text-white transition-colors">
                  <Mail size={18} />
                </div>
                <span className="font-semibold text-unaicNavy text-lg">{contact.email}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
