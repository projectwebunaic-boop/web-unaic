"use client";

import { motion } from "framer-motion";
import { Users, GraduationCap, UserCheck, BookOpen, Handshake } from "lucide-react";
import CountUp from "react-countup";
import SectionTitle from "@/components/shared/SectionTitle";
import { useTranslations, useLocale } from "next-intl";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function Stats({ data }: { data?: any }) {
  const t = useTranslations("Stats");
  const tLabels = useTranslations("Stats.labels");
  const locale = useLocale();
  const isEn = locale === 'en';

  const stats = [
    { label: tLabels("students"), value: 5000, suffix: "+", icon: <Users size={32} className="text-white" /> },
    { label: tLabels("alumni"), value: 3500, suffix: "+", icon: <GraduationCap size={32} className="text-white" /> },
    { label: tLabels("lecturers"), value: 150, suffix: "+", icon: <UserCheck size={32} className="text-white" /> },
    { label: tLabels("programs"), value: 25, suffix: "+", icon: <BookOpen size={32} className="text-white" /> },
    { label: tLabels("partners"), value: 100, suffix: "+", icon: <Handshake size={32} className="text-white" /> },
  ];

  return (
    <section className="relative bg-unaicNavy py-20 overflow-hidden">
      {/* Background Patterns */}
      <div className="absolute inset-0 bg-[url('/patterns/circuit-board.svg')] opacity-5"></div>
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-unaicGold/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-[120px]"></div>

      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <SectionTitle
          title={isEn ? (data?.titleEn || data?.title || t("title")) : (data?.title || t("title"))}
          subtitle={isEn ? (data?.subtitleEn || data?.subtitle || t("subtitle")) : (data?.subtitle || t("subtitle"))}
          description={isEn ? (data?.descriptionEn || data?.description || t("description")) : (data?.description || t("description"))}
          align="center"
          className="!text-white mb-16"
        />

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          {stats.map(({ label, value, suffix, icon }, index) => (
            <motion.div
              key={index}
              className="text-center group p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-unaicGold/30 transition-all duration-300 transform hover:-translate-y-1"
              variants={itemVariants}
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-unaicGold to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                {icon}
              </div>
              <CountUp
                start={0}
                end={value}
                duration={3}
                separator=","
                suffix={suffix}
                className="text-3xl md:text-4xl font-black text-white block mb-1"
              />
              <div className="h-0.5 w-8 bg-unaicGold mx-auto mb-2 opacity-50 group-hover:w-16 transition-all duration-500"></div>
              <p className="text-blue-100 text-sm font-medium tracking-wide uppercase">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
