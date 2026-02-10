"use client";

import React from 'react';
import { Link } from '@/i18n/routing';

interface LecturerCardProps {
  name: string;
  faculty: string;
  program: string;
  image: string;
  specialization: string;
  profileLink: string;
}

const LecturerCard: React.FC<LecturerCardProps> = ({
  name,
  faculty,
  program,
  image,
  specialization,
  profileLink
}) => {
  return (
    <div className="group flex flex-col md:flex-row items-center md:items-stretch rounded-2xl shadow-lg overflow-hidden w-full max-w-lg mx-auto h-80 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:-translate-y-1 bg-white border border-gray-200">
      {/* Photo Section */}
      <div className="relative w-full md:w-2/5 h-1/2 md:h-full overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none transition-transform duration-300 ease-in-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-2 right-2 text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</div>
      </div>

      {/* Text Section */}
      <div className="w-full md:w-3/5 bg-gradient-to-br from-[#002B5B] to-[#001F3F] text-white flex flex-col justify-center px-6 py-6 overflow-hidden">
        <h2 className="text-[clamp(1rem,1.5vw,1.8rem)] font-bold text-white text-center md:text-left whitespace-normal break-words leading-tight tracking-wide mb-2">
          {name}
        </h2>
        <p className="text-[clamp(0.85rem,1vw,1rem)] text-white/90 mt-2 text-center md:text-left leading-relaxed mb-1">
          {faculty}
        </p>
        <p className="text-[clamp(0.8rem,0.9vw,0.95rem)] text-white/80 text-center md:text-left leading-relaxed mb-2">
          {program}
        </p>
        <p className="text-[clamp(0.75rem,0.8vw,0.9rem)] text-white/70 text-center md:text-left leading-relaxed mb-4">
          {specialization}
        </p>
        <Link href={profileLink}>
          <button className="mt-auto mx-auto md:mx-0 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
            Lihat Profil
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LecturerCard;
