"use client";

import React, { useState, useEffect, useRef } from 'react';
import HeroSection from '@/components/shared/HeroSection';
import { lecturers } from '@/data/lecturers';

export default function DosenPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const sectionRef = useRef<HTMLDivElement>(null);

  const filteredLecturers = lecturers
    .filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const totalPages = Math.ceil(filteredLecturers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLecturers = filteredLecturers.slice(startIndex, startIndex + itemsPerPage);

  // Scroll otomatis ke atas section dosen setiap kali halaman berubah
  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentPage]);

  return (
    <div>
      <HeroSection
        title="Daftar Dosen UNAIC"
        subtitle="Kenali para dosen pengajar yang berkomitmen dalam memberikan pendidikan berkualitas tinggi kepada mahasiswa Universitas Al-Irsyad Cilacap."
      />

      {/* Search Bar */}
      <section className="bg-[#F8F9FA] py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="flex justify-center mb-10">
            <div className="relative w-full max-w-xl">
              <input
                type="text"
                placeholder="Cari dosen berdasarkan nama..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 border-2 border-[#FFD700] rounded-full focus:ring-2 focus:ring-yellow-300 outline-none shadow-sm bg-white text-[#0A1F44] placeholder-[#6B7280]"
              />
              <span className="absolute left-4 top-3.5 text-[#002C6E]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Dosen List Section */}
      <section ref={sectionRef} className="bg-[#F8F9FA] py-16 sm:py-24">
        <div className="container mx-auto max-w-6xl px-4">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#002C6E] mb-2">
              Daftar Dosen Pengajar
            </h2>
            <div className="w-20 h-1 bg-[#FFD700] mx-auto mb-8 rounded-full"></div>
          </div>

          {/* Grid Dosen */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
            {currentLecturers.map((lecturer) => (
              <div
                key={lecturer.id}
                className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg hover:shadow-yellow-100 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                <img
                  src={lecturer.image}
                  alt={lecturer.name}
                  className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-[#FFD700] shadow-sm"
                />
                <h3 className="text-lg font-bold text-[#002C6E] mt-4 truncate">{lecturer.name}</h3>
                <p className="text-sm text-gray-600">{lecturer.prodi}</p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-4 mt-10">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[#002C6E] text-white rounded-full hover:bg-blue-800 disabled:opacity-50 transition-colors duration-200"
            >
              ‹ Sebelumnya
            </button>
            <span className="text-sm text-gray-700 flex items-center px-4">
              Halaman {currentPage} dari {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-[#FFD700] text-[#002C6E] font-semibold rounded-full hover:bg-yellow-500 disabled:opacity-50 transition-colors duration-200"
            >
              Selanjutnya ›
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
