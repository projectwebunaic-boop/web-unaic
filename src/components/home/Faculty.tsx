"use client";

import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { Link } from '@/i18n/routing';
import { faculties } from "@/data/faculties";
import SectionTitle from "@/components/shared/SectionTitle";
import { useTranslations, useLocale } from "next-intl";
import * as Icons from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    },
  },
};

export default function Faculty({ data, dbFaculties }: { data?: any; dbFaculties?: any[] }) {
  const t = useTranslations("Faculties");
  const locale = useLocale();
  const isEn = locale === 'en';

  const displayFaculties = dbFaculties && dbFaculties.length > 0 ? dbFaculties : [];

  return (
    <section className="relative bg-gray-50 py-24 sm:py-32 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-unaicNavy -z-20" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/patterns/grid.svg')] opacity-10 -z-10" />

      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-white mb-16">
          <SectionTitle
            title={isEn ? (data?.titleEn || "Faculties & Study Programs") : (data?.title || "Fakultas & Program Studi")}
            subtitle={isEn ? (data?.subtitleEn || "Academic Choices") : (data?.subtitle || "Pilihan Akademik")}
            description={isEn ? (data?.descriptionEn || "UNAIC offers a selection of superior faculties with accredited study programs.") : (data?.description || "UNAIC menawarkan pilihan fakultas unggulan dengan program studi terakreditasi.")}
            align="center"
            className="!text-white"
          />
        </div>

        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          {displayFaculties.map((faculty, index) => {
            const IconComponent = (Icons as any)[faculty.icon || "BookOpen"] || Icons.BookOpen;

            return (
              <motion.div
                key={faculty.id}
                className="group relative h-[500px] rounded-[2rem] bg-white shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                variants={cardVariants}
              >
                {/* Image/Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-unaicNavy to-blue-900 md:group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-white opacity-0 md:group-hover:opacity-5 transition-opacity duration-500" />

                {/* Content Wrapper */}
                <div className="relative h-full flex flex-col p-8 z-10">
                  {/* Top Icon Area */}
                  <div className="mb-6 flex justify-between items-start">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner group-hover:bg-unaicGold group-hover:text-unaicNavy transition-colors duration-300">
                      <IconComponent size={32} />
                    </div>
                    <span className="text-white/50 text-6xl font-black opacity-20 select-none absolute top-4 right-4">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                    {isEn ? (faculty.nameEn || faculty.name) : faculty.name}
                  </h3>
                  <div className="w-12 h-1 bg-unaicGold rounded-full mb-4 group-hover:w-20 transition-all duration-300" />

                  {/* Hover Reveal Content */}
                  <div className="mt-auto transform translate-y-8 md:translate-y-0 transition-transform duration-500">
                    <p className="text-blue-100 text-sm mb-6 line-clamp-2 opacity-80">
                      {isEn ? (faculty.descriptionEn || "Leading faculty with integrated curriculum.") : (faculty.description || "Fakultas unggulan dengan kurikulum terintegrasi.")}
                    </p>

                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 mb-2">
                      <p className="text-white text-sm leading-relaxed mb-3 font-medium">
                        {isEn ? "Excellent study programs for your future." : "Pilihan program studi unggulan untuk masa depanmu."}
                      </p>
                      <ul className="space-y-1">
                        {faculty.programs?.slice(0, 3).map((program: any, idx: number) => (
                          <li key={idx} className="flex items-center gap-2 text-white/80 text-xs">
                            <div className="w-1 h-1 rounded-full bg-unaicGold" />
                            <span className="truncate">{isEn ? (program.nameEn || program.name) : program.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      href={`/fakultas/${faculty.slug}`}
                      className="mt-4 flex items-center justify-between w-full py-3 px-5 bg-white text-unaicNavy font-bold rounded-xl hover:bg-unaicGold transition-colors shadow-lg"
                    >
                      <span>{isEn ? "Explore Faculty" : "Jelajahi Fakultas"}</span>
                      <FiArrowRight />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
