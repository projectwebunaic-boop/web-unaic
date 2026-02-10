import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import HeroSection from "@/components/shared/HeroSection";
import { CalendarDays, Download } from "lucide-react";
import * as motion from "framer-motion/client";

export default async function KalenderAkademikPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AcademicCalendar" });
  const isEn = locale === 'en';

  const calendarData = await prisma.academicCalendar.findMany({
    orderBy: { order: 'asc' }
  });

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const slideUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const slideInRightVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const config = await prisma.academicCalendarConfig.findUnique({
    where: { id: 'singleton' }
  });

  const pdfUrl = isEn ? (config?.pdfUrlEn || config?.pdfUrl) : (config?.pdfUrl || "/docs/kalender-akademik-2025.pdf");

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
            <CalendarDays className="w-16 h-16 text-[#0A2E5C]" />
          </div>
        </motion.div>
      </motion.section>

      {/* Tabel Kalender Akademik Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideUpVariants}
        >
          <h2 className="text-3xl font-bold text-[#0A2E5C] mb-2">{t("tableTitle")}</h2>
          <div className="w-20 h-1 bg-[#FFD700] mx-auto mb-6 rounded"></div>
        </motion.div>

        {calendarData.length > 0 ? (
          <motion.div
            className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideUpVariants}
          >
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-[#0A2E5C] text-white">
                  <th className="px-6 py-4 text-left font-semibold">{t("table.semester")}</th>
                  <th className="px-6 py-4 text-left font-semibold">{t("table.activity")}</th>
                  <th className="px-6 py-4 text-left font-semibold">{t("table.date")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {calendarData.map((item: any, index: number) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-[#FFD700]/5 transition-colors duration-200 ${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'
                      }`}
                  >
                    <td className="px-6 py-4 font-bold text-[#0A2E5C]">
                      {isEn ? (item.semesterEn || item.semester) : item.semester}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {isEn ? (item.activityEn || item.activity) : item.activity}
                    </td>
                    <td className="px-6 py-4 font-medium text-[#0A2E5C]">
                      {isEn ? (item.dateEn || item.date) : item.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200"
            variants={slideUpVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="text-gray-400 italic">{t("noData")}</p>
          </motion.div>
        )}

        <motion.div
          className="mt-4 text-center text-sm text-gray-600 md:hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideUpVariants}
        >
          <p>{t("mobileNote")}</p>
        </motion.div>
      </section>

      {/* Download Section */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          className="bg-gray-50 rounded-xl p-8 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideUpVariants}
        >
          <h2 className="text-2xl font-bold text-[#0A2E5C] mb-4">{t("downloadTitle")}</h2>
          <p className="text-gray-600 mb-6">
            {t("downloadDesc")}
          </p>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#0A2E5C] text-white font-semibold px-6 py-3 rounded-lg hover:bg-unaicBlue transition-all duration-300 shadow-lg shadow-[#0A2E5C]/20"
          >
            <Download className="w-5 h-5" />
            {t("downloadBtn")}
          </a>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#0A2E5C] to-unaicNavy py-16 text-center text-white">
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
            className="inline-block bg-[#FFD700] text-[#0A2E5C] font-black px-8 py-4 rounded-xl shadow-lg hover:bg-yellow-400 transition-colors duration-300 text-lg"
          >
            {t("helpBtn")}
          </a>
        </motion.div>
      </section>
    </main>
  );
}
