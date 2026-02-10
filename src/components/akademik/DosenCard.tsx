import React from 'react';
import { Link } from '@/i18n/routing';
import { LecturerDetail } from '../../data/dosen';

interface DosenCardProps {
  dosen: LecturerDetail;
}

const DosenCard: React.FC<DosenCardProps> = ({ dosen }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6 text-center">
        <img
          src={dosen.foto}
          alt={dosen.nama}
          className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-unaicGold"
        />
        <h3 className="text-lg font-bold text-unaicNavy mb-2">
          {dosen.nama}
        </h3>
        <p className="text-sm text-gray-600 mb-1">
          {dosen.prodi}
        </p>
        <p className="text-xs text-gray-500 mb-4">
          {dosen.fakultas}
        </p>
        <Link href={`/akademik/dosen/${dosen.slug}`}>
          <button className="bg-unaicGold text-unaicNavy px-4 py-2 rounded-full font-semibold hover:bg-yellow-400 transition-colors text-sm">
            Lihat Profil
          </button>
        </Link>
      </div>
    </div>
  );
};

export default DosenCard;
