"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Award, ChevronDown, ChevronUp } from "lucide-react";
import HeroSection from "@/components/shared/HeroSection";
import SectionTitle from "@/components/shared/SectionTitle";
import { useLocale } from "next-intl";

interface Category {
    id: string;
    name: string;
    nameEn?: string;
}

interface ScholarshipItem {
    id: string;
    categoryId: string;
    title: string;
    titleEn?: string;
    description: string;
    descriptionEn?: string;
}

interface BeasiswaContentProps {
    data: {
        categories: Category[];
        items: ScholarshipItem[];
    }
}

export default function BeasiswaContent({ data }: BeasiswaContentProps) {
    const { categories, items } = data;
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const locale = useLocale();
    const isEn = locale === 'en';

    // Helper for localized text
    const tx = (id?: string | null, en?: string | null) => (isEn && en) ? en : (id || "");

    const toggleCategory = (categoryId: string) => {
        setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    };

    const getBeasiswaByCategory = (categoryId: string) => {
        return items.filter(item => item.categoryId === categoryId);
    };

    return (
        <main className="bg-white font-sans text-gray-700 pb-20">
            {/* Hero Section */}
            <HeroSection
                title={isEn ? "Scholarships" : "Beasiswa"}
                subtitle={isEn ? "UNAIC provides various scholarship schemes to support achievement and ease students' education costs." : "UNAIC menyediakan berbagai skema beasiswa untuk mendukung prestasi dan meringankan biaya pendidikan mahasiswa."}
            />

            {/* Jenis Beasiswa Section */}
            <section className="container mx-auto px-4 py-12">
                <SectionTitle>{isEn ? "Types of Scholarships at UNAIC" : "Jenis Beasiswa di UNAIC"}</SectionTitle>

                <div className="max-w-4xl mx-auto space-y-4">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white shadow rounded-lg overflow-hidden"
                        >
                            {/* Category Header */}
                            <button
                                onClick={() => toggleCategory(category.id)}
                                className="w-full p-6 text-left bg-unaicNavy text-white hover:bg-unaicBlue transition-colors duration-300 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <GraduationCap className="w-6 h-6" />
                                    <h3 className="font-semibold text-lg">{tx(category.name, category.nameEn)}</h3>
                                </div>
                                {expandedCategory === category.id ? (
                                    <ChevronUp className="w-5 h-5" />
                                ) : (
                                    <ChevronDown className="w-5 h-5" />
                                )}
                            </button>

                            {/* Category Content */}
                            {expandedCategory === category.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="p-6 bg-gray-50"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {getBeasiswaByCategory(category.id).length > 0 ? (
                                            getBeasiswaByCategory(category.id).map((beasiswa) => (
                                                <div
                                                    key={beasiswa.id}
                                                    className="bg-white rounded-lg shadow hover:shadow-lg p-6 transition-all duration-300 hover:scale-105"
                                                >
                                                    <div className="flex items-start gap-3 mb-3">
                                                        <Award className="w-6 h-6 text-unaicGold flex-shrink-0 mt-1" />
                                                        <div>
                                                            <h4 className="font-bold text-unaicNavy mb-2">
                                                                {tx(beasiswa.title, beasiswa.titleEn)}
                                                            </h4>
                                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                                {tx(beasiswa.description, beasiswa.descriptionEn)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 italic col-span-2 text-center py-4">
                                                {isEn ? "No scholarship data for this category yet." : "Belum ada data beasiswa untuk kategori ini."}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Informasi Pendaftaran Section */}
            <section className="container mx-auto px-4 py-12">
                <SectionTitle>{isEn ? "Scholarship Registration Information" : "Informasi Pendaftaran Beasiswa"}</SectionTitle>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <div className="bg-gray-50 rounded-lg p-8 mb-8">
                        <p className="text-gray-600 text-lg leading-relaxed mb-6">
                            {isEn
                                ? "Detailed information regarding terms, conditions, and scholarship registration mechanisms can be obtained at the UNAIC Student Affairs Bureau."
                                : "Informasi detail terkait syarat, ketentuan, dan mekanisme pendaftaran beasiswa dapat diperoleh di Biro Kemahasiswaan UNAIC."
                            }
                        </p>
                        <button className="px-4 py-2 bg-unaicNavy text-white rounded hover:bg-unaicGold transition-colors duration-300 font-medium">
                            {isEn ? "Contact Student Affairs Bureau" : "Hubungi Biro Kemahasiswaan"}
                        </button>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}
