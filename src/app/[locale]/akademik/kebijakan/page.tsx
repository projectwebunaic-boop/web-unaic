import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import HeroSection from "@/components/shared/HeroSection";
import { FileText } from "lucide-react";
import * as motion from "framer-motion/client";
import PoliciesClient from "./PoliciesClient";

export default async function KebijakanAkademikPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AcademicPolicy" });

  const policies = await prisma.academicPolicy.findMany({
    orderBy: { order: 'asc' }
  });

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const slideInRightVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const slideUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <main className="bg-white font-sans text-gray-700">
      <HeroSection
        title={t("title")}
        subtitle={t("subtitle")}
      />

      {/* Deskripsi Section */}
      <motion.section
        className="max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInVariants}
      >
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl font-bold text-[#0A2E5C] mb-2">{t("descriptionTitle")}</h2>
          <div className="w-20 h-1 bg-[#FFD700] mx-auto md:mx-0 mb-6 rounded"></div>
          <p className="text-base leading-relaxed mb-6">
            {t("description")}
          </p>
        </div>

        <motion.div
          className="md:w-1/2 flex justify-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideInRightVariants}
        >
          <div className="w-32 h-32 bg-[#FFD700]/10 rounded-full flex items-center justify-center">
            <FileText className="w-16 h-16 text-[#0A2E5C]" />
          </div>
        </motion.div>
      </motion.section>

      {/* Daftar Kebijakan Section (Client Component for Accordion) */}
      <PoliciesClient policies={policies} locale={locale} />

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#0A2E5C] to-[#0A2E5C] py-16 text-center text-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideUpVariants}
        >
          <h2 className="text-3xl font-bold mb-4">{t("helpTitle")}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t("helpDesc")}
          </p>
          <a
            href="/kontak"
            className="inline-block bg-[#FFD700] text-[#0A2E5C] font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-yellow-400 transition-colors duration-300 text-lg"
          >
            {t("helpBtn")}
          </a>
        </motion.div>
      </section>
    </main>
  );
}
