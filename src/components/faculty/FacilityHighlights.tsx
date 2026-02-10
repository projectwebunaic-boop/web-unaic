"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface Facility {
    title: string;
    description: string;
    image: string;
}

interface FacilityHighlightsProps {
    facilities: Facility[];
}

export default function FacilityHighlights({ facilities }: FacilityHighlightsProps) {
    const t = useTranslations("Faculties");
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-8">
                <div className="max-w-3xl mb-16">
                    <h2 className="text-4xl font-extrabold text-unaicNavy mb-4">{t("facilities")}</h2>
                    <p className="text-gray-500 text-lg">
                        {t("facilitiesSubtitle")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {facilities.map((fac, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative overflow-hidden rounded-[24px] aspect-[4/5] shadow-lg"
                        >
                            <Image
                                src={fac.image}
                                alt={fac.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-unaicNavy/90 via-unaicNavy/20 to-transparent"></div>

                            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-xl font-bold text-white mb-2">{fac.title}</h3>
                                <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {fac.description}
                                </p>
                                <div className="mt-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-unaicGold text-unaicNavy opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100">
                                    <ArrowUpRight size={20} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
