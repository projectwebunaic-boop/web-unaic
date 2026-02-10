"use client";

import React from 'react';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';

interface SDMCardProps {
  nama: string;
  slug: string;
  jabatan: string;
  unit?: string;
  fakultas?: string;
  foto: string;
}

export default function SDMCard({ nama, slug, jabatan, unit, fakultas, foto }: SDMCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      <div className="p-6 text-center">
        {/* Foto Profil */}
        <div className="relative w-24 h-24 mx-auto mb-4">
          <img
            src={foto}
            alt={`Foto ${nama}`}
            className="w-full h-full rounded-full object-cover border-4 border-blue-100"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/placeholder-person.jpg';
            }}
          />
        </div>

        {/* Nama */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {nama}
        </h3>

        {/* Jabatan */}
        <p className="text-sm font-semibold text-blue-700 mb-1">
          {jabatan}
        </p>

        {/* Unit/Fakultas */}
        <p className="text-sm text-gray-600 mb-4">
          {unit || fakultas}
        </p>

        {/* Tombol Lihat Profil */}
        <Link
          href={`/manajemen/sdm/${slug}`}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Lihat Profil
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
}
