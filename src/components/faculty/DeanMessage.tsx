"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Quote } from "lucide-react";
import { useTranslations } from "next-intl";

interface DeanMessageProps {
    name: string;
    title: string;
    message: string;
    image: string;
    facultyName?: string;
}

export default function DeanMessage({ name, title, message, image, facultyName }: DeanMessageProps) {
    const t = useTranslations("Faculties");
    return (
        <section className="py-16 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative w-full lg:w-1/3 aspect-[3/4] max-w-sm"
                    >
                        <div className="absolute -inset-4 bg-unaicBlue/5 rounded-[40px] -rotate-6"></div>
                        <div className="absolute -inset-4 border-2 border-unaicGold/20 rounded-[40px] rotate-3"></div>
                        <div className="relative h-full w-full rounded-[32px] overflow-hidden shadow-2xl border-4 border-white">
                            <Image
                                src={image}
                                alt={name}
                                fill
                                className="object-cover object-top"
                                priority
                            />
                        </div>
                        {/* Ornament */}
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-unaicGold rounded-full flex items-center justify-center text-white shadow-xl z-10">
                            <Quote size={40} />
                        </div>
                    </motion.div>

                    {/* Content Side */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex-1 space-y-6"
                    >
                        <div className="space-y-2">
                            <span className="text-unaicGold font-bold tracking-wider uppercase text-sm">{t("deanWelcome")}</span>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-unaicNavy leading-tight">
                                {t("welcomeTo")} {facultyName}
                            </h2>
                        </div>

                        <div className="relative">
                            <p className="text-gray-600 text-lg leading-relaxed italic">
                                "{message}"
                            </p>
                        </div>

                        <div className="pt-6 border-t border-gray-100 italic">
                            <h4 className="text-xl font-bold text-gray-900">{name}</h4>
                            <p className="text-unaicBlue font-medium">{title}</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
