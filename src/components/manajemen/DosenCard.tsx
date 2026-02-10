"use client";

import React from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { ChevronRight } from 'lucide-react';

interface DosenCardProps {
  nama: string;
  slug: string;
  jabatan: string;
  fakultas: string;
  foto: string;
}

export default function DosenCard({ nama, slug, jabatan, fakultas, foto }: DosenCardProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-blue-100 overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="relative w-24 h-24 mb-4">
            <Image
              src={foto}
              alt={nama}
              fill
              className="rounded-full object-cover border-4 border-white shadow-md"
            />
          </div>
          <h3 className="text-lg font-bold text-blue-900 mb-2 line-clamp-2">{nama}</h3>
          <p className="text-sm text-blue-700 font-medium mb-1">{jabatan}</p>
          <p className="text-xs text-gray-600 mb-4">{fakultas}</p>
          <Link
            href={`/manajemen/dosen-tendik/${slug}`}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
          >
            Lihat Profil
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
