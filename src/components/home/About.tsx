"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import SectionTitle from "@/components/shared/SectionTitle";
import { useTranslations, useLocale } from "next-intl";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
};

export default function About({ data }: { data?: any }) {
  const t = useTranslations("About");
  const tFeatures = useTranslations("About.features");
  const locale = useLocale();
  const isEn = locale === 'en';

  const featureKeys = ["curriculum", "facilities", "collaboration", "career"];

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-24 sm:py-32 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gray-100 rounded-bl-[100px] -z-10 opacity-50" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gray-100 rounded-tr-[100px] -z-10 opacity-50" />

      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Text Column */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-col gap-8 order-2 lg:order-1"
          >
            <div>
              <motion.span
                variants={fadeUp}
                className="inline-block py-1 px-3 rounded-full bg-unaicGold/10 text-unaicGold font-bold text-sm tracking-wider uppercase mb-4"
              >
                {t("subtitle") || "Tentang Kami"}
              </motion.span>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-unaicNavy leading-tight mb-6">
                {isEn ? (data?.titleEn || data?.title || t("title")) : (data?.title || t("title"))}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                {isEn ? (data?.descriptionEn || data?.description || t("description")) : (data?.description || t("description"))}
              </p>
            </div>

            {/* Features List */}
            <motion.ul variants={staggerContainer} className="space-y-4">
              {featureKeys.map((key) => (
                <motion.li key={key} variants={fadeUp} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-gray-100">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-unaicNavy text-white flex items-center justify-center mt-0.5 shadow-sm">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg mb-1">{tFeatures(key)}</h4>
                    <p className="text-sm text-gray-500">Mendukung pengembangan potensi mahasiswa.</p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>

            {/* CTA Button */}
            <motion.div variants={fadeUp} className="pt-4">
              <Link href="/tentang/profil" className="group inline-flex items-center gap-3 px-8 py-4 bg-unaicNavy text-white font-bold rounded-full shadow-xl hover:shadow-2xl hover:shadow-unaicNavy/20 hover:-translate-y-1 transition-all duration-300 ring-4 ring-transparent hover:ring-unaicNavy/10">
                <span>{t("cta")}</span>
                <div className="bg-white/10 rounded-full p-1 group-hover:bg-white/20 transition-colors">
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Image Composition Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative order-1 lg:order-2 h-full min-h-[600px] flex items-center justify-center"
          >
            {/* Background Blob */}
            <div className="absolute inset-0 bg-gradient-to-tr from-unaicGold/20 to-unaicBlue/20 rounded-full blur-[100px] animate-pulse-slow" />

            {/* Main Image */}
            <div className="absolute top-10 right-0 w-[85%] aspect-[4/5] bg-gray-200 rounded-[2rem] overflow-hidden shadow-2xl z-20 border-8 border-white transform rotate-3 hover:rotate-0 transition-transform duration-700">
              <Image
                src="/images/about/students.jpg"
                alt="Mahasiswa UNAIC"
                fill
                className="object-cover"
              />
            </div>

            {/* Secondary Image */}
            <div className="absolute bottom-10 left-0 w-[55%] aspect-square bg-gray-200 rounded-[2rem] overflow-hidden shadow-xl border-8 border-white z-30 transform -rotate-6 hover:rotate-0 transition-transform duration-700">
              <Image
                src="/images/about/campus.jpg"
                alt="Gedung UNAIC"
                fill
                className="object-cover"
              />
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="absolute top-1/3 left-0 bg-white p-4 rounded-2xl shadow-xl z-40 max-w-[180px] border border-gray-100"
            >
              <div className="text-4xl font-bold text-unaicGold mb-1">20+</div>
              <div className="text-xs font-bold text-unaicNavy uppercase tracking-wide">Tahun Pengalaman Pendidikan</div>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
