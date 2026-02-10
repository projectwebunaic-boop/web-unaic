"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from '@/i18n/routing';
import { useLocale, useTranslations } from "next-intl";
import {
    Building2,
    Globe,
    Handshake,
    Hospital,
    Landmark,
    GraduationCap,
    ArrowLeft,
    Search,
    ExternalLink,
    LucideIcon
} from 'lucide-react';
import HeroSection from "@/components/shared/HeroSection";
import Image from "next/image";

const IconMap: { [key: string]: LucideIcon } = {
    Building2, Globe, Handshake, Hospital, Landmark, GraduationCap
};

interface MitraContentProps {
    data: {
        categories: {
            id: string;
            name: string;
            nameEn?: string;
            iconName: string;
            description: string;
            descriptionEn?: string;
        }[];
        items: {
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
        }[];
    }
}

export default function MitraContent({ data }: MitraContentProps) {
    const { categories, items } = data;
    const [activeCategory, setActiveCategory] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState("");
    const locale = useLocale();
    const t = useTranslations('Partners');
    const isEn = locale === 'en';

    const filteredItems = items.filter(item => {
        const matchesCategory = activeCategory === "All" || item.category === activeCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const displayCategories = activeCategory === "All" ? categories : categories.filter(c => c.name === activeCategory);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* HERO SECTION */}
            <HeroSection
                title={t('heroTitle')}
                subtitle={t('heroSubtitle')}
            />

            {/* SEARCH & SLIDE MENU */}
            <div className="relative z-30 container mx-auto px-4 -mt-8 mb-16 space-y-6">
                {/* Search Bar */}
                <div className="max-w-3xl mx-auto bg-white rounded-full shadow-xl shadow-gray-200/50 p-2 pl-6 flex items-center gap-4">
                    <Search className="text-gray-400 w-5 h-5 flex-shrink-0" />
                    <input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 py-3"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="bg-unaicBlue hover:bg-unaicNavy text-white px-8 py-3 rounded-full font-bold transition-colors shadow-lg shadow-blue-500/20">
                        {t('searchButton')}
                    </button>
                </div>

                {/* Category Slide Menu */}
                <div className="max-w-5xl mx-auto overflow-x-auto pb-4 scrollbar-hide">
                    <div className="flex gap-3 justify-start md:justify-center min-w-max px-2">
                        <button
                            onClick={() => setActiveCategory("All")}
                            className={`px-6 py-2 rounded-full font-semibold transition-all whitespace-nowrap ${activeCategory === "All"
                                ? "bg-unaicNavy text-white shadow-lg scale-105"
                                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                                }`}
                        >
                            {t('allPartners')}
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.name)}
                                className={`px-6 py-2 rounded-full font-semibold transition-all whitespace-nowrap ${activeCategory === cat.name
                                    ? "bg-unaicNavy text-white shadow-lg scale-105"
                                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                                    }`}
                            >
                                {(isEn ? cat.nameEn : cat.name)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="container mx-auto px-4 lg:px-8 pb-24 space-y-20">

                {/* Intro Section (Only show on 'All') */}
                {activeCategory === "All" && !searchQuery && (
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1 relative">
                            <div className="absolute -top-10 -left-10 w-32 h-32 bg-unaicGold/10 rounded-full blur-3xl"></div>
                            <div className="relative z-10 bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                                        <Handshake size={32} />
                                    </div>
                                    <h3 className="font-bold text-xl text-unaicNavy font-heading">{t('introTitle')}</h3>
                                </div>
                                <p className="text-gray-600 leading-relaxed">
                                    {t('introDesc')}
                                </p>
                            </div>
                        </div>
                        <div className="order-1 md:order-2 text-center md:text-left">
                            <h2 className="text-3xl lg:text-4xl font-bold text-unaicNavy mb-4 font-heading">
                                {t.rich('networkTitle', {
                                    span1: (children) => <span className="text-unaicBlue">{children}</span>,
                                    span2: (children) => <span className="text-unaicGold">{children}</span>
                                })}
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                {t('networkDesc')}
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                {/* Dynamic stats could be added here */}
                            </div>
                        </div>
                    </div>
                )}

                {/* Partners List */}
                <div className="space-y-16">
                    {displayCategories.map((category) => {
                        // Filter partners for this category AND search query
                        const categoryPartners = filteredItems.filter(p => p.category === category.name);

                        // If we are searching or filtering specific category, and no items match, hide section
                        if (categoryPartners.length === 0 && (searchQuery || activeCategory !== "All")) return null;

                        // Icon
                        const Icon = IconMap[category.iconName] || Handshake;

                        return (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-gray-200 pb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-unaicNavy text-white flex items-center justify-center shadow-md">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900 font-heading">{(isEn ? category.nameEn : category.name)}</h2>
                                                <p className="text-gray-500 text-sm max-w-md">{(isEn ? category.descriptionEn : category.description)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {categoryPartners.map((item) => (
                                        <Link
                                            href={`/tentang/mitra/${item.slug}`}
                                            key={item.id}
                                            className="group bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-gray-200 group-hover:bg-unaicBlue transition-colors"></div>
                                                <span className="font-medium text-gray-700 group-hover:text-unaicNavy transition-colors line-clamp-2">
                                                    {item.name}
                                                </span>
                                            </div>
                                            <ExternalLink size={16} className="text-gray-300 group-hover:text-unaicBlue opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                                        </Link>
                                    ))}
                                    {categoryPartners.length === 0 && (
                                        <p className="text-gray-400 italic text-sm col-span-4">{t('emptyCategory')}</p>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                    {activeCategory !== "All" && displayCategories.length === 0 && (
                        <div className="text-center py-20 text-gray-500">
                            {t('noCategories')}
                        </div>
                    )}
                </div>

                {/* Call to Action */}
                <div className="mt-20 bg-gradient-to-r from-unaicNavy to-unaicBlue rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden text-center">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/patterns/circuit.svg')] opacity-10"></div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl text-white font-bold mb-6 font-heading">{t('ctaTitle')}</h2>
                        <p className="text-white/80 mb-8 text-lg">
                            {t('ctaDesc')}
                        </p>
                        <Link
                            href="/kontak"
                            className="inline-flex items-center gap-2 bg-white text-unaicNavy px-8 py-3 rounded-full font-bold hover:bg-unaicGold hover:text-unaicNavy transition-all shadow-xl hover:scale-105"
                        >
                            {t('ctaButton')} <ArrowLeft className="rotate-180" size={20} />
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
