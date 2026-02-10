"use client";

import React from 'react';
import { Link } from "@/i18n/routing";
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from "next-intl";
import HeroSection from "@/components/shared/HeroSection";
import {
    Building2,
    Globe,
    FileText,
    Image as ImageIcon,
    ArrowLeft,
    Download
} from 'lucide-react';
import Image from "next/image";

interface PartnerItem {
    id: string;
    slug: string;
    name: string;
    category: string;
    description: string;
    descriptionEn?: string;
    profile: string;
    profileEn?: string;
    images: string[];
    website?: string;
    mouDocument?: string;
}

interface MitraDetailContentProps {
    partner: PartnerItem;
    categories: {
        id: string;
        name: string;
        nameEn?: string;
    }[];
}

export default function MitraDetailContent({ partner, categories }: MitraDetailContentProps) {
    const locale = useLocale();
    const t = useTranslations('Partners');
    const isEn = locale === 'en';

    const categoryObj = categories.find(c => c.name === partner.category);
    const categoryName = isEn && categoryObj?.nameEn ? categoryObj.nameEn : partner.category;

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">

            {/* 
         HERO SECTION
         Using the partner name as title
      */}
            <HeroSection
                title={partner.name}
                subtitle={categoryName}
            />

            <div className="container mx-auto px-4 lg:px-8 -mt-20 relative z-30">

                {/* Navigation Back */}
                <div className="mb-6">
                    <Link
                        href="/tentang/mitra"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full transition-all text-sm font-medium"
                    >
                        <ArrowLeft size={16} /> {t('backButton')}
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* MAIN CONTENT (LEFT) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Profile Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100"
                        >
                            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                                <div className="p-3 bg-blue-50 text-unaicBlue rounded-xl">
                                    <Building2 size={24} />
                                </div>
                                <h2 className="text-2xl font-heading font-bold text-unaicNavy">{t('profileTitle')}</h2>
                            </div>

                            <div className="prose prose-lg text-gray-600 leading-relaxed font-sans whitespace-pre-line">
                                <p>{(isEn ? partner.profileEn : partner.profile)}</p>
                            </div>

                            {partner.website && (
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <a
                                        href={partner.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-unaicBlue font-semibold hover:text-unaicNavy transition-colors"
                                    >
                                        <Globe size={18} /> {t('websiteButton')}
                                    </a>
                                </div>
                            )}
                        </motion.div>

                        {/* Documentation Gallery */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100"
                        >
                            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                                <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                                    <ImageIcon size={24} />
                                </div>
                                <h2 className="text-2xl font-heading font-bold text-unaicNavy">{t('galleryTitle')}</h2>
                            </div>

                            {partner.images && partner.images.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {partner.images.map((img, idx) => (
                                        <div key={idx} className="group relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                                            <Image
                                                src={img}
                                                alt={`${partner.name} documentation ${idx + 1}`}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                    <ImageIcon className="mx-auto text-gray-300 mb-2" size={48} />
                                    <p className="text-gray-500 text-sm">{t('noGallery')}</p>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* SIDEBAR (RIGHT) */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* MoU Document Card */}
                        {/* MoU Document Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 sticky top-8"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                                    <FileText size={24} />
                                </div>
                                <h3 className="text-xl font-heading font-bold text-unaicNavy">{t('mouTitle')}</h3>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 mb-4">
                                <p className="text-sm text-gray-500 mb-1">{t('mouStatus')}</p>
                                <div className="flex items-center gap-2 text-green-700 font-bold bg-green-100 px-3 py-1 rounded-full w-fit text-xs">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    {t('mouActive')}
                                </div>
                            </div>

                            {partner.mouDocument ? (
                                <div className="space-y-4">
                                    <p className="text-sm text-gray-600">
                                        {t('mouDesc')}
                                    </p>
                                    <a
                                        href={partner.mouDocument}
                                        download
                                        className="flex w-full items-center justify-center gap-2 bg-unaicNavy hover:bg-unaicBlue text-white font-bold py-3 rounded-xl transition-all shadow-md group"
                                    >
                                        <Download size={20} className="group-hover:animate-bounce" />
                                        {t('downloadButton')}
                                    </a>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-sm text-gray-400 italic">{t('noMou')}</p>
                                </div>
                            )}

                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <h4 className="font-bold text-gray-800 mb-2 text-sm">{t('contactTitle')}</h4>
                                <p className="text-xs text-gray-500 mb-4">
                                    {t('contactDesc')}
                                </p>
                                <Link href="/kontak" className="text-unaicGold font-bold text-sm hover:underline">
                                    Hubungi Kami →
                                </Link>
                            </div>
                        </motion.div>

                    </div>

                </div>

            </div>
        </div>
    );
}
