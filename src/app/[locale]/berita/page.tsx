"use client";

import { motion } from "framer-motion";
import HeroSection from "@/components/shared/HeroSection";
import SectionTitle from "@/components/shared/SectionTitle";
import NewsList from "@/components/news/NewsList";

export default function BeritaPage() {
  return (
    <main className="bg-white font-sans text-gray-700">
      {/* Hero Section */}
      <HeroSection
        title="Berita"
        subtitle="Kumpulan berita terbaru seputar Universitas Al-Irsyad Cilacap."
      />

      {/* Berita Terkini Section */}
      <section className="container mx-auto px-4 py-12">
        <SectionTitle>Berita Terkini</SectionTitle>

        <NewsList />
      </section>
    </main>
  );
}
