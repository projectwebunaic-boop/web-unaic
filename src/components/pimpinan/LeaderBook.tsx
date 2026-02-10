"use client";

import React from 'react';
import { Link } from '@/i18n/routing';
import { LeaderDetail } from '../../data/pimpinan';

interface LeaderBookProps {
  leader: LeaderDetail;
}

const LeaderBook: React.FC<LeaderBookProps> = ({ leader }) => {
  return (
    <div className="flex justify-center items-center py-4">
      <div className="flex flex-col md:flex-row items-center md:items-stretch rounded-xl shadow-lg overflow-hidden w-full max-w-lg mx-4">
        {/* Photo Section */}
        <div className="w-full md:w-2/5">
          <img
            src={leader.foto}
            alt={leader.name}
            className="w-full h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none border-4 border-[#FFD700] shadow-md transition-transform duration-300 ease-in-out hover:scale-105"
          />
        </div>

        {/* Text Section */}
        <div className="w-full md:w-3/5 bg-[#002B5B] text-white flex flex-col justify-center px-6 py-6 overflow-hidden">
          <h2 className="text-[clamp(1rem,1.5vw,1.8rem)] font-bold text-white text-center md:text-left whitespace-normal break-words">
            {leader.name}
          </h2>
          <p className="text-[clamp(0.85rem,1vw,1rem)] text-white/80 mt-2 text-center md:text-left">
            {leader.jabatan}
          </p>
          <Link href="/akademik/dosen">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-full px-5 py-2 mt-4 mx-auto md:mx-0">
              Lihat Profil
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LeaderBook;
