"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";

/**
 * Modern Quick Links / Services Bar
 * Redesigned for "Scientific Modernity" look with glassmorphism and fluid animations.
 */

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 120,
            damping: 12,
        },
    },
};

export default function ServicesBar({ data }: { data: any[] }) {
    const locale = useLocale();
    const isEn = locale === 'en';
    if (!data || data.length === 0) return null;

    return (
        <section className="relative z-30 px-4 md:px-8 max-w-7xl mx-auto -mt-10 md:-mt-14">
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
            >
                {data.map((service, index) => {
                    // unexpected-any warning ignored for dynamic icon resolution
                    // @ts-ignore
                    const Icon = LucideIcons[service.iconName] || LucideIcons.HelpCircle;

                    return (
                        <motion.a
                            key={index}
                            href={service.link}
                            target={service.link.startsWith("http") ? "_blank" : "_self"}
                            variants={itemVariants}
                            whileHover={{ y: -5, scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            className={`group relative bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/50 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-white ${service.shadow || ""}`}
                        >
                            {/* Decorative Background Blob */}
                            <div className={`absolute -right-6 -top-6 w-20 h-20 rounded-full ${service.light} opacity-50 group-hover:scale-150 transition-transform duration-500 ease-out blur-xl`} />

                            <div className="relative z-10 flex items-start justify-between mb-3">
                                <div className={`p-3.5 rounded-xl ${service.color} text-white shadow-md group-hover:scale-110 transition-transform duration-300 ring-2 ring-white/50`}>
                                    <Icon size={24} strokeWidth={2} />
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-unaicGold group-hover:text-unaicNavy transition-colors duration-300">
                                    <ArrowRight size={14} className="text-gray-400 group-hover:text-unaicNavy -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                </div>
                            </div>

                            <div className="relative z-10 mt-2">
                                <h3 className="font-bold text-[17px] text-gray-800 leading-tight group-hover:text-unaicNavy transition-colors">
                                    {isEn ? (service.titleEn || service.title) : service.title}
                                </h3>
                                <p className="text-xs text-gray-500 font-medium mt-1 group-hover:text-gray-600 transition-colors">
                                    {isEn ? (service.descEn || service.desc) : service.desc}
                                </p>
                            </div>
                        </motion.a>
                    )
                })}
            </motion.div>
        </section>
    );
}
