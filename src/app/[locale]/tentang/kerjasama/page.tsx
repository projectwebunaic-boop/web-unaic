"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Handshake, Building2, Award, ChevronRight, ExternalLink } from "lucide-react";
import HeroSection from "@/components/shared/HeroSection";
import Image from "next/image";
import { Link } from "@/i18n/routing";

// Placeholder data for partners
const partners = {
    domestic: [
        { name: "Kementerian Kesehatan RI", logo: "/images/partners/kemenkes.png", category: "Instansi Pemerintah" },
        { name: "RSUD Cilacap", logo: "/images/partners/rsud-cilacap.png", category: "Rumah Sakit Pendidikan" },
        { name: "PT Pertamina (Persero)", logo: "/images/partners/pertamina.png", category: "Industri" },
        { name: "Universitas Gadjah Mada", logo: "/images/partners/ugm.png", category: "Universitas" },
        { name: "Telkom Indonesia", logo: "/images/partners/telkom.png", category: "Industri Teknologi" },
        { name: "Bank Syariah Indonesia", logo: "/images/partners/bsi.png", category: "Perbankan" },
        { name: "RS Margono Soekarjo", logo: "/images/partners/rs-margono.png", category: "Rumah Sakit" },
        { name: "Dinas Kesehatan Jateng", logo: "/images/partners/dinkes.png", category: "Pemerintah" },
    ],
    international: [
        { name: "Mahsa University (Malaysia)", logo: "/images/partners/mahsa.png", country: "Malaysia" },
        { name: "Lincoln University College", logo: "/images/partners/lincoln.png", country: "Malaysia" },
        { name: "Tokyo University (Jepang)", logo: "/images/partners/tokyo.png", country: "Jepang" },
        { name: "Management and Science University", logo: "/images/partners/msu.png", country: "Malaysia" },
        { name: "National Taipei Univ. of Nursing", logo: "/images/partners/ntunhs.png", country: "Taiwan" },
    ]
};

const stats = [
    { label: "Mitra Dalam Negeri", value: "50+", icon: <Building2 className="w-8 h-8 text-white" /> },
    { label: "Mitra Luar Negeri", value: "15+", icon: <Globe className="w-8 h-8 text-white" /> },
    { label: "MoU Aktif", value: "120+", icon: <Handshake className="w-8 h-8 text-white" /> },
    { label: "Program Pertukaran", value: "5", icon: <Award className="w-8 h-8 text-white" /> },
];

export default function KerjasamaPage() {
    const [activeTab, setActiveTab] = useState<'domestic' | 'international'>('domestic');

    return (
        <main className="font-sans text-gray-700 bg-white">
            <HeroSection
                title="Kerjasama & Mitra"
                subtitle="Membangun sinergi global untuk meningkatkan kualitas pendidikan, penelitian, dan pengabdian masyarakat."
            />

            {/* Stats Bar */}
            <section className="relative mt-12 z-20 container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-unaicNavy text-white p-6 rounded-xl shadow-xl flex flex-col items-center justify-center text-center border-b-4 border-unaicGold"
                        >
                            <div className="mb-2 bg-white/10 p-3 rounded-full">{stat.icon}</div>
                            <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                            <p className="text-sm opacity-80">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Main Content */}
            <section className="py-20 container mx-auto px-4 max-w-6xl">

                {/* Intro */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-unaicNavy mb-4">Jejak Kolaborasi</h2>
                    <p className="text-gray-600 text-lg">
                        UNAIC terus memperluas jaringan kerjasama dengan berbagai instansi di dalam dan luar negeri
                        untuk mendukung program Merdeka Belajar Kampus Merdeka (MBKM) dan Internasionalisasi Kampus.
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex justify-center mb-12">
                    <div className="bg-gray-100 p-1 rounded-full inline-flex space-x-2">
                        <button
                            onClick={() => setActiveTab('domestic')}
                            className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === 'domestic'
                                ? 'bg-unaicNavy text-white shadow-md'
                                : 'text-gray-500 hover:text-unaicNavy'
                                }`}
                        >
                            <Building2 size={18} />
                            Dalam Negeri
                        </button>
                        <button
                            onClick={() => setActiveTab('international')}
                            className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === 'international'
                                ? 'bg-unaicNavy text-white shadow-md'
                                : 'text-gray-500 hover:text-unaicNavy'
                                }`}
                        >
                            <Globe size={18} />
                            Luar Negeri
                        </button>
                    </div>
                </div>

                {/* Logo Grid */}
                <motion.div
                    key={activeTab} // Triggers animation on tab change
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                    {partners[activeTab].map((partner, idx) => (
                        <div
                            key={idx}
                            className="group bg-white border border-gray-100 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center text-center h-48 relative overflow-hidden"
                        >
                            {/* Fallback Icon if no image (Since we likely don't have real logos yet) */}
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                {activeTab === 'domestic' ? <Building2 className="text-gray-400 group-hover:text-unaicGold" /> : <Globe className="text-gray-400 group-hover:text-unaicGold" />}
                            </div>

                            <h4 className="font-bold text-gray-800 group-hover:text-unaicNavy transition-colors">{partner.name}</h4>
                            <span className="text-xs text-gray-500 mt-2 bg-gray-50 px-2 py-1 rounded">
                                {(partner as any).country || (partner as any).category}
                            </span>

                            {/* Hover Effect Border */}
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-unaicNavy to-unaicGold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                        </div>
                    ))}
                </motion.div>

                {/* CTA */}
                <div className="mt-20 bg-gradient-to-br from-unaicNavy to-blue-900 rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Ingin Menjadi Mitra Kami?</h3>
                        <p className="opacity-90 max-w-lg">Kami membuka peluang kerjasama seluas-luasnya di bidang Pendidikan, Penelitian, dan Pengembangan Sumber Daya Manusia.</p>
                    </div>
                    <Link href="/tentang/kerjasama/ajukan" className="bg-unaicGold text-unaicNavy px-8 py-3 rounded-lg font-bold hover:bg-white transition-colors flex items-center gap-2">
                        Ajukan Kerjasama <ChevronRight size={20} />
                    </Link>
                </div>

            </section>
        </main>
    );
}
