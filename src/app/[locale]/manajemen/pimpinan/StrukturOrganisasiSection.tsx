"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useTranslations } from "next-intl";

const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export default function StrukturOrganisasiSection() {
  const t = useTranslations("Leaders");
  const [showStruktur, setShowStruktur] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const toggleStruktur = () => {
    setShowStruktur(!showStruktur);
  };

  return (
    <section
      id="struktur-organisasi"
      className="bg-white py-16 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInVariants}
        className="text-center mb-12"
      >
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-unaicNavy mb-4">
          {t("orgTitle")}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t("orgDesc")}
        </p>
        <div className="w-16 h-1 bg-unaicGold mx-auto mt-4"></div>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInVariants}
        className="text-center mb-8"
      >
        <button
          onClick={toggleStruktur}
          className="bg-unaicNavy text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-unaicBlue transition-colors duration-300"
        >
          {showStruktur ? t("hideOrg") : t("showOrg")}
        </button>
      </motion.div>

      {showStruktur && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={slideUpVariants}
          className="flex justify-center"
        >
          <div className="w-full max-w-6xl">
            <Zoom>
              <img
                src="/images/pimpinan/struktur.jpg"
                alt="Struktur Organisasi Universitas Al-Irsyad Cilacap"
                className="w-full h-auto rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
                onClick={() => setIsZoomed(true)}
              />
            </Zoom>
          </div>
        </motion.div>
      )}

      {showStruktur && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-500">
            {t("clickToZoom")}
          </p>
        </motion.div>
      )}
    </section>
  );
}
