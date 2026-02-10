"use client";

import HeroSection from "@/components/shared/HeroSection";
import SectionTitle from "@/components/shared/SectionTitle";
import Accordion from "@/components/shared/Accordion";
import { Button } from "@/components/shared/Button";
import { GraduationCap, Users, FileText, Phone, Mail, MapPin, MessageCircle, ExternalLink, Loader2, CheckSquare, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";

interface Service {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  link: string;
  icon: string;
  slug?: string;
  content?: string;
  contentEn?: string;
  category?: string;
}

export default function BAAKPage() {
  const t = useTranslations("BAAK");
  const locale = useLocale();

  const [data, setData] = useState<{ services: Service[], questions: string[], contact?: { address: string, whatsapp: string, email: string } }>({ services: [], questions: [] });
  const [loading, setLoading] = useState(true);
  const [submittingSurvey, setSubmittingSurvey] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [surveyData, setSurveyData] = useState({
    name: "",
    responses: {} as Record<string, string>,
    suggestions: ""
  });

  useEffect(() => {
    fetch('/api/admin/baak')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSurveySubmit = async () => {
    if (!surveyData.name) {
      alert("Mohon isi nama lengkap Anda.");
      return;
    }

    setSubmittingSurvey(true);
    try {
      const res = await fetch('/api/baak/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(surveyData)
      });

      if (res.ok) {
        setShowSuccessModal(true);
        setSurveyData({ name: "", responses: {}, suggestions: "" });
      } else {
        alert("Gagal mengirim survey, silakan coba lagi.");
      }
    } catch (e) {
      alert("Terjadi kesalahan.");
    } finally {
      setSubmittingSurvey(false);
    }
  };

  // Helper to render icon
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Users": return <Users className="w-10 h-10 text-white" />;
      case "FileText": return <FileText className="w-10 h-10 text-white" />;
      default: return <GraduationCap className="w-10 h-10 text-white" />;
    }
  };

  const filteredServices = data.services.filter(service => {
    const title = locale === 'en' ? (service.titleEn || service.title) : service.title;
    const desc = locale === 'en' ? (service.descriptionEn || service.description) : service.description;
    return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <main className="font-sans text-gray-700 bg-white">
      <HeroSection
        title={t("title")}
        subtitle={t("subtitle")}
        className="bg-gradient-to-r from-blue-600 to-blue-800"
      />

      {/* Layanan Utama BAAK */}
      <section className="py-16 sm:py-24 bg-gray-50/50">
        <div className="container mx-auto max-w-6xl px-4">
          <SectionTitle>{t("servicesTitle")}</SectionTitle>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-center mb-10">
            {t("servicesDesc")}
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-12 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:border-unaicBlue focus:ring-4 focus:ring-unaicBlue/10 outline-none transition shadow-sm"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-unaicBlue" /></div>
          ) : (
            <>
              {Object.keys(
                filteredServices.reduce((acc, service) => {
                  const cat = service.category || "Lainnya";
                  if (!acc[cat]) acc[cat] = [];
                  acc[cat].push(service);
                  return acc;
                }, {} as Record<string, Service[]>)
              ).length > 0 ? (
                <div className="space-y-12">
                  {["Akademik", "Kemahasiswaan", "Administrasi", "Lainnya"].map((category) => {
                    const categoryServices = filteredServices.filter(s => (s.category || "Lainnya") === category);
                    if (categoryServices.length === 0) return null;

                    const getCategoryTitle = (cat: string) => {
                      switch (cat) {
                        case "Akademik": return t("categories.academic");
                        case "Kemahasiswaan": return t("categories.student");
                        case "Administrasi": return t("categories.admin");
                        default: return t("categories.other");
                      }
                    };

                    const categoryTitle = getCategoryTitle(category);

                    return (
                      <div key={category}>
                        <h3 className="text-2xl font-bold text-unaicNavy mb-6 border-l-4 border-unaicGold pl-4">{categoryTitle}</h3>
                        <motion.div
                          variants={containerVariants}
                          initial="hidden"
                          whileInView="show"
                          viewport={{ once: true }}
                          className="grid md:grid-cols-3 gap-6"
                        >
                          {categoryServices.map((service) => {
                            const href = service.slug
                              ? `/manajemen/baak/${service.slug}`
                              : (service.link && service.link !== '#' ? service.link : '#');

                            const isExternal = href.startsWith('http');

                            return (
                              <motion.div key={service.id} variants={itemVariants} className="h-full">
                                <Link
                                  href={href}
                                  target={isExternal ? '_blank' : '_self'}
                                  className="group h-full p-8 rounded-2xl bg-white border border-gray-100 hover:border-unaicBlue/30 shadow-sm hover:shadow-xl hover:shadow-unaicBlue/5 transition-all duration-300 flex flex-col items-start text-left relative overflow-hidden"
                                >
                                  <div className="absolute top-0 right-0 w-24 h-24 bg-unaicBlue/5 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>

                                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-unaicGold to-orange-400 flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                    {renderIcon(service.icon)}
                                  </div>

                                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-unaicBlue transition-colors">
                                    {locale === 'en' ? (service.titleEn || service.title) : service.title}
                                  </h3>

                                  <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed flex-1">
                                    {locale === 'en' ? (service.descriptionEn || service.description) : service.description}
                                  </p>

                                  <span className="text-sm font-bold text-unaicBlue flex items-center gap-2 group-hover:gap-3 transition-all mt-auto">
                                    {service.slug ? t("viewDetail") : t("accessService")} <ExternalLink size={16} className={service.slug ? "hidden" : ""} />
                                  </span>
                                </Link>
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-gray-400" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">{t("noServices")}</h3>
                  <p className="text-gray-500">{t("noServicesDesc")}</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* FAQ Pelayanan Akademik */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          <SectionTitle>{t("faqTitle")}</SectionTitle>
          <p className="text-lg text-gray-600 text-center mb-12">
            {t("faqDesc")}
          </p>

          <Accordion
            items={t.raw("faqs")}
          />
        </div>
      </section>

      {/* Kuisioner Kepuasan Layanan Akademik */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto max-w-5xl px-4">
          <SectionTitle>{t("surveyTitle")}</SectionTitle>
          <p className="text-lg text-gray-600 text-center mb-12">
            {t("surveyDesc")}
          </p>

          <section className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-6 my-10 border border-gray-100">
            <h2 className="text-2xl font-bold text-center text-unaicNavy mb-6">
              {t("surveyStart")}
            </h2>

            {/* ... form content ... */}
            <form onSubmit={(e) => { e.preventDefault(); handleSurveySubmit(); }}>
              <div className="mb-6">
                <label className="font-semibold text-unaicNavy block mb-1">{t("fullName")}</label>
                <input
                  type="text"
                  value={surveyData.name}
                  onChange={(e) => setSurveyData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={t("fullNamePlaceholder")}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-unaicGold outline-none"
                  required
                />
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200 mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-unaicNavy text-white">
                    <tr>
                      <th className="py-3 px-4 text-left w-12">No</th>
                      <th className="py-3 px-4 text-left">Pertanyaan / Question</th>
                      <th className="py-3 px-4 text-center w-16">K</th>
                      <th className="py-3 px-4 text-center w-16">C</th>
                      <th className="py-3 px-4 text-center w-16">B</th>
                      <th className="py-3 px-4 text-center w-16">BS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {data.questions.map((q: any, index: number) => {
                      const questionText = locale === 'en' ? (q.textEn || q.text) : q.text; // Ensure we handle new structure
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-center font-medium text-gray-500">{index + 1}</td>
                          <td className="py-3 px-4 text-gray-800">{questionText}</td>
                          {["K", "C", "B", "BS"].map((opt) => (
                            <td key={opt} className="text-center p-0">
                              <label className="flex items-center justify-center w-full h-full py-3 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`q${index}`}
                                  value={opt}
                                  checked={surveyData.responses[index.toString()] === opt}
                                  onChange={(e) => setSurveyData(prev => ({
                                    ...prev,
                                    responses: { ...prev.responses, [index.toString()]: e.target.value }
                                  }))}
                                  className="accent-unaicGold w-4 h-4 cursor-pointer"
                                  aria-label={`${opt} untuk pertanyaan ${index + 1}`}
                                />
                              </label>
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 mb-8">
                <label className="font-semibold text-unaicNavy block mb-1">{t("suggestions")}</label>
                <textarea
                  value={surveyData.suggestions}
                  onChange={(e) => setSurveyData(prev => ({ ...prev, suggestions: e.target.value }))}
                  rows={4}
                  placeholder={t("suggestionsPlaceholder")}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-unaicGold outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submittingSurvey || data.questions.length === 0}
                className="w-full bg-unaicNavy text-white font-bold py-4 rounded-xl hover:bg-unaicBlue transition-all shadow-lg hover:shadow-xl disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {submittingSurvey ? <><Loader2 className="animate-spin" /> {t("submitting")}</> : t("submitBtn")}
              </button>
            </form>
          </section>
        </div>
      </section>

      {/* Success Modal */}
      {
        showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-unaicGold to-unaicNavy"></div>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckSquare size={40} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{t("successTitle")}</h3>
              <p className="text-gray-600 mb-8">
                {t("successDesc")}
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-unaicNavy text-white font-bold py-3 rounded-xl hover:bg-unaicBlue transition-all shadow-lg"
              >
                {t("close")}
              </button>
            </motion.div>
          </div>
        )
      }

      {/* Kontak BAAK */}
      {/* Kontak BAAK */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          <SectionTitle>{t("contactTitle")}</SectionTitle>
          <p className="text-lg text-gray-600 text-center mb-12">
            {t("contactDesc")}
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-md">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-unaicGold mt-1" />
                  <div>
                    <h3 className="font-semibold text-unaicNavy">{t("address")}</h3>
                    <p className="text-gray-600">
                      {data.contact?.address || "Jl. Cerme No.24, Wanasari, Sidanegara, Kec. Cilacap Tengah, Kabupaten Cilacap, Jawa Tengah 53223"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-unaicGold" />
                  <div>
                    <h3 className="font-semibold text-unaicNavy">{t("whatsapp")}</h3>
                    <p className="text-gray-600">
                      {data.contact?.whatsapp ? `+${data.contact.whatsapp}` : "088905905905"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-unaicGold" />
                  <div>
                    <h3 className="font-semibold text-unaicNavy">{t("email")}</h3>
                    <p className="text-gray-600">
                      {data.contact?.email || "pmb.unaic@universitasalirsyad.ac.id"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-md">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-unaicNavy mb-4">{t("contactUs")}</h3>
                <p className="text-gray-600 mb-6">
                  {t("contactUsDesc")}
                </p>
                <Button
                  asChild
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
                >
                  <a
                    href={`https://wa.me/${data.contact?.whatsapp || "6288905905905"}?text=Halo%20BAAK%2C%20saya%20ingin%20bertanya%20tentang...`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>{t("contactWaBtn")}</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
