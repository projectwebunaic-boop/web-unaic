import React from 'react';
import {
  Building2,
  Search,
  UserCircle,
  GraduationCap,
  Briefcase,
  Filter
} from 'lucide-react';
import HeroSection from '@/components/shared/HeroSection';
import Image from 'next/image';
import { Link } from "@/i18n/routing";
import prisma from '@/lib/prisma';
import { getLocale } from "next-intl/server";
import StaffBrowser from '@/components/sdm/StaffBrowser';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getSDMData() {
  try {
    const [categories, staff] = await Promise.all([
      prisma.staffCategory.findMany({ orderBy: { order: 'asc' } }),
      prisma.staff.findMany({
        include: { category: true },
        orderBy: { order: 'asc' }
      })
    ]);
    return { categories, staff };
  } catch (error) {
    console.error("DB Fetch Error:", error);
    return { categories: [], staff: [] };
  }
}

export default async function DosenTendikPage() {
  const locale = await getLocale();
  const isEn = locale === 'en';
  const data = await getSDMData();

  return (
    <main className="font-sans text-gray-700 bg-gray-50 min-h-screen pb-20">
      <HeroSection
        title={isEn ? "UNAIC Personnel Directory" : "Direktori SDM UNAIC"}
        subtitle={isEn
          ? "Get to know the dedicated Lecturers and Staff advancing Universitas Al-Irsyad Cilacap."
          : "Mengenal lebih dekat Dosen dan Tenaga Kependidikan yang berdedikasi memajukan Universitas Al-Irsyad Cilacap."}
      />

      <StaffBrowser
        initialCategories={data.categories}
        initialStaff={data.staff}
        locale={locale}
      />
    </main>
  );
}
