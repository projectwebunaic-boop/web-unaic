"use client";

import { motion } from "framer-motion";
import { Target, Compass, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface VisionMissionProps {
    vision: string;
    missions: string[];
}

export default function VisionMission({ vision, missions: initialMissions }: VisionMissionProps) {
    const t = useTranslations("Faculties");
    const missions = Array.isArray(initialMissions) ? initialMissions : [];

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Vision Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-white p-8 md:p-12 rounded-[32px] shadow-xl border border-unaicBlue/10 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-unaicBlue/5 rounded-bl-full -mr-16 -mt-16"></div>
                        <div className="relative z-10 space-y-6">
                            <div className="inline-flex p-4 rounded-2xl bg-unaicBlue text-white shadow-lg shadow-unaicBlue/20">
                                <Target size={32} />
                            </div>
                            <h2 className="text-3xl font-extrabold text-unaicNavy">{t("vision")}</h2>
                            <p className="text-xl text-gray-700 leading-relaxed font-medium">
                                {vision}
                            </p>
                        </div>
                    </motion.div>
                    {/* Mission Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-unaicNavy p-8 md:p-12 rounded-[32px] shadow-xl text-white relative overflow-hidden"
                    >
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-tr-full -ml-16 -mb-16"></div>
                        <div className="relative z-10 space-y-6">
                            <div className="inline-flex p-4 rounded-2xl bg-unaicGold text-unaicNavy shadow-lg shadow-unaicGold/20">
                                <Compass size={32} />
                            </div>
                            <h2 className="text-3xl font-extrabold">{t("mission")}</h2>
                            <ul className="space-y-4">
                                {missions.map((mission, idx) => (
                                    <motion.li
                                        key={idx}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 + (idx * 0.1) }}
                                        className="flex items-start gap-3 group"
                                    >
                                        <div className="mt-1 shrink-0 text-unaicGold group-hover:scale-110 transition-transform">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <p className="text-gray-200 leading-relaxed">
                                            {mission}
                                        </p>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
