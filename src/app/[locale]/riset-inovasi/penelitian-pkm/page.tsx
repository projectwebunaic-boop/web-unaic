"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import HeroSection from "@/components/shared/HeroSection";
import { FlaskConical, Lightbulb, BarChart, Users, Handshake, FileText } from "lucide-react";

const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const slideInRightVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

interface ResearchItem {
  id: number;
  title: string;
  leader: string;
  year: number;
  status: "Selesai" | "Berjalan" | "Rencana";
  type: "Penelitian" | "PKM";
  description: string;
  reportUrl: string;
}

const researchData: ResearchItem[] = [
  {
    id: 1,
    title: "Pengembangan Media Pembelajaran Digital Berbasis AR",
    leader: "Dr. Rahmawati, M.Kom",
    year: 2024,
    status: "Berjalan",
    type: "Penelitian",
    description: "Penelitian pengembangan media pembelajaran augmented reality untuk mata kuliah farmasi.",
    reportUrl: "/docs/laporan-penelitian-ar.pdf"
  },
  {
    id: 2,
    title: "Pelatihan Kesehatan Ibu & Anak di Cilacap",
    leader: "Ns. Siti Nurjanah, S.Kep., M.Kep",
    year: 2023,
    status: "Selesai",
    type: "PKM",
    description: "Program pengabdian masyarakat melalui pelatihan kesehatan ibu dan anak di wilayah Cilacap.",
    reportUrl: "/docs/laporan-pkm-kesehatan-ibu-anak.pdf"
  },
  {
    id: 3,
    title: "Analisis Kandungan Nutrisi Tanaman Obat Tradisional",
    leader: "Dr. Ahmad Santoso, Apt., M.Farm",
    year: 2024,
    status: "Berjalan",
    type: "Penelitian",
    description: "Penelitian kandungan nutrisi dan senyawa aktif pada tanaman obat tradisional lokal.",
    reportUrl: "/docs/laporan-penelitian-nutrisi.pdf"
  },
  {
    id: 4,
    title: "Pemberdayaan UMKM Melalui Digital Marketing",
    leader: "Dr. Hendro Wicaksono, SE., MM",
    year: 2023,
    status: "Selesai",
    type: "PKM",
    description: "Program pemberdayaan UMKM di Cilacap melalui pelatihan digital marketing dan e-commerce.",
    reportUrl: "/docs/laporan-pkm-umkm-digital.pdf"
  },
  {
    id: 5,
    title: "Sistem Informasi Manajemen Apotek Berbasis Web",
    leader: "Dr. Maya Sari, M.TI",
    year: 2024,
    status: "Rencana",
    type: "Penelitian",
    description: "Pengembangan sistem informasi terintegrasi untuk manajemen apotek modern.",
    reportUrl: "/docs/proposal-sistem-apotek.pdf"
  },
  {
    id: 6,
    title: "Edukasi Gizi Seimbang untuk Lansia",
    leader: "Dr. Nur Hidayah, S.Gz., M.Gz",
    year: 2023,
    status: "Selesai",
    type: "PKM",
    description: "Program edukasi gizi seimbang dan pola hidup sehat untuk lansia di panti werdha.",
    reportUrl: "/docs/laporan-pkm-gizi-lansia.pdf"
  }
];

const statsData = [
  {
    icon: <BarChart className="w-8 h-8 text-unaicNavy" />,
    number: 120,
    suffix: "+",
    title: "Penelitian",
    description: "Kegiatan penelitian yang telah dilakukan"
  },
  {
    icon: <Users className="w-8 h-8 text-unaicNavy" />,
    number: 80,
    suffix: "+",
    title: "Program PKM",
    description: "Pengabdian masyarakat yang berdampak"
  },
  {
    icon: <Handshake className="w-8 h-8 text-unaicNavy" />,
    number: 50,
    suffix: "+",
    title: "Mitra Kolaborasi",
    description: "Kerjasama dengan institusi dan industri"
  }
];

export default function PenelitianPKMPage() {
  const [activeTab, setActiveTab] = useState<"Penelitian" | "PKM">("Penelitian");

  const filteredData = researchData.filter(item => item.type === activeTab);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Selesai": return "bg-green-100 text-green-800";
      case "Berjalan": return "bg-blue-100 text-blue-800";
      case "Rencana": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <main className="bg-white font-sans text-gray-700">
      {/* Hero Section */}
      <HeroSection
        title="LPPM UNAIC"
        subtitle="Mendorong riset unggul dan pengabdian masyarakat berbasis nilai Islami."
      />

      {/* Deskripsi Section */}
      <motion.section
        className="max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInVariants}
      >
        {/* Text Content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl font-bold text-[#0A2E5C] mb-2">Penelitian & PKM UNAIC</h2>
          <div className="w-20 h-1 bg-[#FFD700] mx-auto md:mx-0 mb-6 rounded"></div>
          <p className="text-base leading-relaxed mb-6">
            Universitas Al-Irsyad Cilacap (UNAIC) mendorong civitas akademika untuk aktif melakukan penelitian dan pengabdian kepada masyarakat (PKM).
            Penelitian diarahkan pada pengembangan ilmu pengetahuan, teknologi, dan kesehatan berbasis Islam.
            PKM difokuskan pada pemberdayaan masyarakat melalui edukasi, pelayanan kesehatan, dan inovasi teknologi tepat guna.
          </p>
        </div>

        {/* Icon Content */}
        <motion.div
          className="md:w-1/2 flex justify-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideInRightVariants}
        >
          <div className="w-32 h-32 bg-[#FFD700]/10 rounded-full flex items-center justify-center">
            <FlaskConical className="w-16 h-16 text-[#0A2E5C]" />
          </div>
        </motion.div>
      </motion.section>

      {/* Tab Navigation & Content */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideUpVariants}
        >
          <h2 className="text-3xl font-bold text-[#0A2E5C] mb-2">Kegiatan Penelitian & PKM</h2>
          <div className="w-20 h-1 bg-[#FFD700] mx-auto mb-6 rounded"></div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="flex justify-center mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideUpVariants}
        >
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab("Penelitian")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === "Penelitian"
                  ? "bg-[#0A2E5C] text-white shadow-md"
                  : "text-gray-600 hover:text-[#0A2E5C]"
              }`}
            >
              Penelitian
            </button>
            <button
              onClick={() => setActiveTab("PKM")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === "PKM"
                  ? "bg-[#0A2E5C] text-white shadow-md"
                  : "text-gray-600 hover:text-[#0A2E5C]"
              }`}
            >
              Pengabdian Masyarakat (PKM)
            </button>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredData.map((item, index) => (
            <motion.div
              key={item.id}
              className="bg-white border border-[#0A2E5C] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideUpVariants}
              whileHover={{ scale: 1.02 }}
            >
              {/* Card Header */}
              <div className="bg-[#0A2E5C] text-white p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium bg-[#FFD700] text-[#0A2E5C] px-2 py-1 rounded">
                    {item.status}
                  </span>
                  <span className="text-xs font-medium">{item.year}</span>
                </div>
                <h3 className="font-semibold text-sm leading-tight">{item.title}</h3>
              </div>

              {/* Card Content */}
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-3">
                  <strong>Ketua:</strong> {item.leader}
                </p>

                <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                  {item.description}
                </p>

                {/* Action Button */}
                <div className="flex justify-end">
                  <a
                    href={item.reportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#FFD700] text-[#0A2E5C] font-semibold px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors duration-300 text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    Detail
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideUpVariants}
          >
            <h2 className="text-3xl font-bold text-[#0A2E5C] mb-2">Statistik Penelitian & PKM</h2>
            <div className="w-20 h-1 bg-[#FFD700] mx-auto mb-6 rounded"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {statsData.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={slideUpVariants}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-[#FFD700]/10 rounded-full flex items-center justify-center">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-[#0A2E5C] mb-2">
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  >
                    {stat.number}
                  </motion.span>
                  {stat.suffix}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{stat.title}</h3>
                <p className="text-sm text-gray-600">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#0A2E5C] to-[#0A2E5C] py-16 text-center text-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideUpVariants}
        >
          <h2 className="text-3xl font-bold mb-4">Dukung Riset & PKM UNAIC</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Kolaborasi dengan UNAIC untuk penelitian dan pengabdian masyarakat yang berdampak.
          </p>
          <a
            href="/kontak"
            className="inline-block bg-[#FFD700] text-[#0A2E5C] font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-yellow-400 transition-colors duration-300 text-lg"
          >
            Hubungi LPPM
          </a>
        </motion.div>
      </section>
    </main>
  );
}
