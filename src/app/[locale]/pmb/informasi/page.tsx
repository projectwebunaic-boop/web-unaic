"use client";

import { useTranslations } from "next-intl";
import HeroSection from "@/components/shared/HeroSection";
import SectionTitle from "@/components/shared/SectionTitle";
import Accordion from "@/components/shared/Accordion";
import TuitionTable from "@/components/pmb/TuitionTable";
import { getAllTuitionData } from "@/data/biaya";
import { BookOpen, ClipboardList, CheckCircle2, Download, ArrowRight, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

export default function InformasiPMBPage() {
  const t = useTranslations("PMBInfo");

  const steps = [
    {
      number: "01",
      title: t("steps.1.title"),
      description: t("steps.1.desc")
    },
    {
      number: "02",
      title: t("steps.2.title"),
      description: t("steps.2.desc")
    },
    {
      number: "03",
      title: t("steps.3.title"),
      description: t("steps.3.desc")
    },
    {
      number: "04",
      title: t("steps.4.title"),
      description: t("steps.4.desc")
    },
    {
      number: "05",
      title: t("steps.5.title"),
      description: t("steps.5.desc")
    },
    {
      number: "06",
      title: t("steps.6.title"),
      description: t("steps.6.desc")
    }
  ];

  const requirements = [
    t("requirements.list.0"),
    t("requirements.list.1"),
    t("requirements.list.2"),
    t("requirements.list.3"),
    t("requirements.list.4"),
    t("requirements.list.5")
  ];

  const faqs = [
    {
      title: t("faq.q1.title"),
      content: t("faq.q1.content")
    },
    {
      title: t("faq.q2.title"),
      content: t("faq.q2.content")
    },
    {
      title: t("faq.q3.title"),
      content: t("faq.q3.content")
    },
    {
      title: t("faq.q4.title"),
      content: t("faq.q4.content")
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <main className="bg-white scroll-mt-20 font-sans text-gray-700">
      <HeroSection
        title={t("heroTitle")}
        subtitle={t("heroSubtitle")}
        backgroundImage="/images/campus-life.jpg"
      />

      {/* Intro Stats / Highlights */}
      <section className="py-16 -mt-10 relative z-20 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-xl border-b-4 border-unaicGold text-center group hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-unaicNavy group-hover:text-white transition-colors">
              <GraduationCap size={32} className="text-unaicNavy group-hover:text-unaicGold" />
            </div>
            <h3 className="text-xl font-bold text-unaicNavy mb-2">{t("stats.prodi.title")}</h3>
            <p className="text-gray-500 text-sm">{t("stats.prodi.desc")}</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl border-b-4 border-unaicGold text-center group hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-unaicNavy group-hover:text-white transition-colors">
              <BookOpen size={32} className="text-unaicNavy group-hover:text-unaicGold" />
            </div>
            <h3 className="text-xl font-bold text-unaicNavy mb-2">{t("stats.curriculum.title")}</h3>
            <p className="text-gray-500 text-sm">{t("stats.curriculum.desc")}</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl border-b-4 border-unaicGold text-center group hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-unaicNavy group-hover:text-white transition-colors">
              <ClipboardList size={32} className="text-unaicNavy group-hover:text-unaicGold" />
            </div>
            <h3 className="text-xl font-bold text-unaicNavy mb-2">{t("stats.access.title")}</h3>
            <p className="text-gray-500 text-sm">{t("stats.access.desc")}</p>
          </div>
        </div>
      </section>

      {/* Registration Steps */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <SectionTitle>{t("steps.title")}</SectionTitle>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {steps.map((step) => (
              <motion.div
                key={step.number}
                variants={itemVariants}
                className="relative bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg hover:border-unaicBlue/30 transition-all duration-300 group"
              >
                <div className="absolute top-0 right-0 bg-unaicBlue/10 text-unaicBlue font-bold text-4xl p-4 rounded-bl-3xl opacity-50 group-hover:opacity-100 transition-opacity">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-unaicNavy mb-3 mt-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tuition Fees Section */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-6 md:px-12">
          <SectionTitle
            title={t("tuition.title")}
            subtitle={t("tuition.subtitle")}
            description={t("tuition.desc")}
          />
          <div className="mt-12">
            <TuitionTable data={getAllTuitionData()} />
          </div>
        </div>
      </section>

      {/* Requirements & Info */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* Requirements List */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-heading font-bold text-unaicNavy mb-6">{t("requirements.title")}</h2>
              <p className="text-gray-600 mb-8 border-l-4 border-unaicGold pl-4">
                {t("requirements.desc")}
              </p>
              <ul className="space-y-4">
                {requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-gray-800 font-medium">{req}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <a
                  href="/files/brosur-unaic.pdf"
                  download="Brosur PMB UNAIC.pdf"
                  className="inline-flex items-center gap-3 bg-white text-unaicNavy border-2 border-unaicNavy px-8 py-3.5 rounded-full font-bold hover:bg-unaicNavy hover:text-white transition-all shadow-lg hover:shadow-unaicNavy/30"
                >
                  <Download size={20} />
                  {t("requirements.download")}
                </a>
              </div>
            </motion.div>

            {/* FAQ Accordion */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl font-heading font-bold text-unaicNavy mb-6">{t("faq.title")}</h2>
              <p className="text-gray-600 mb-8">
                {t("faq.desc")}
              </p>
              <Accordion items={faqs} />
            </motion.div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-unaicNavy to-blue-900 text-white text-center relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-unaicGold/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              {t("cta.title")}
            </h2>
            <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              {t("cta.desc")}
            </p>
            <a
              href="https://pmb.universitasalirsyad.ac.id"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-unaicGold text-unaicNavy font-bold px-10 py-4 rounded-full text-lg shadow-lg shadow-unaicGold/30 hover:bg-white hover:scale-105 transition-all duration-300"
            >
              {t("cta.button")}
              <ArrowRight size={20} />
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
