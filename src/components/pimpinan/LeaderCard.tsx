"use client";

import React from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

interface LeaderCardProps {
  name: string;
  title: string;
  image: string;
  profileLink: string;
}

const LeaderCard: React.FC<LeaderCardProps> = ({ name, title, image, profileLink }) => {
  const t = useTranslations("Leaders");
  return (
    <div className="group flex flex-col items-center rounded-2xl shadow-lg overflow-hidden w-full max-w-sm mx-auto transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:-translate-y-1 bg-white border border-gray-200">
      {/* Photo Section */}
      <div className="relative w-full aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-center bg-gray-50 rounded-t-2xl transition-transform duration-300 ease-in-out group-hover:scale-105"
          style={{ objectPosition: 'center 30%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-2 right-2 text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</div>
      </div>

      {/* Text Section */}
      <div className="w-full bg-gradient-to-br from-[#002B5B] to-[#001F3F] text-white flex flex-col justify-center px-6 py-6">
        <h2 className="text-lg md:text-xl font-bold text-white text-center whitespace-nowrap overflow-hidden text-ellipsis leading-tight tracking-wide mb-2">
          {name}
        </h2>
        <p className="text-sm md:text-base text-white/90 text-center leading-relaxed mb-4">
          {title}
        </p>
        <Link href={profileLink} className="self-center">
          <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold rounded-full px-6 py-2 text-sm shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
            {t("viewProfile")}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LeaderCard;
