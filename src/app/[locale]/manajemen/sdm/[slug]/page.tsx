import React from 'react';
import { notFound } from 'next/navigation';
import HeroSection from '@/components/shared/HeroSection';
import dosenData from '@/data/dosen.json';
import tendikData from '@/data/tendik.json';

interface SDMDetailPageProps {
  params: {
    slug: string;
  };
}

export default function SDMDetailPage({ params }: SDMDetailPageProps) {
  const { slug } = params;

  // Cari di data dosen
  const dosen = dosenData.find(d => d.slug === slug);

  // Cari di data tendik
  const tendik = tendikData.find(t => t.slug === slug);

  // Jika tidak ditemukan di kedua data
  if (!dosen && !tendik) {
    notFound();
  }

  const person = dosen || tendik!;
  const isDosen = !!dosen;

  return (
    <div>
      <HeroSection
        title={person.nama}
        subtitle={`${person.jabatan} - ${isDosen ? (person as any).fakultas : (person as any).unit}`}
      />

      <section className="bg-white py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="md:flex">
              {/* Foto Profil */}
              <div className="md:w-1/3 bg-gradient-to-br from-blue-50 to-blue-100 p-8 flex items-center justify-center">
                <div className="relative">
                  <img
                    src={person.foto}
                    alt={`Foto ${person.nama}`}
                    className="w-48 h-48 rounded-full object-cover border-8 border-white shadow-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder-person.jpg';
                    }}
                  />
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    {isDosen ? 'Dosen' : 'Tendik'}
                  </div>
                </div>
              </div>

              {/* Detail Informasi */}
              <div className="md:w-2/3 p-8">
                <div className="space-y-6">
                  {/* Nama dan Jabatan */}
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {person.nama}
                    </h1>
                    <p className="text-xl text-blue-700 font-semibold mb-1">
                      {person.jabatan}
                    </p>
                    <p className="text-lg text-gray-600">
                      {isDosen ? (person as any).fakultas : (person as any).unit}
                    </p>
                  </div>

                  {/* Informasi Khusus Dosen */}
                  {isDosen && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-2">Bidang Keahlian</h3>
                        <p className="text-blue-800">{(dosen as any).bidang}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-green-900 mb-2">Email</h3>
                        <a
                          href={`mailto:${(dosen as any).email}`}
                          className="text-green-800 hover:text-green-600 transition-colors"
                        >
                          {(dosen as any).email}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Informasi Khusus Tendik */}
                  {!isDosen && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">Email</h3>
                      <a
                        href={`mailto:${(tendik as any).email}`}
                        className="text-blue-800 hover:text-blue-600 transition-colors"
                      >
                        {(tendik as any).email}
                      </a>
                    </div>
                  )}

                  {/* Profil */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Profil</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {person.profil}
                    </p>
                  </div>

                  {/* Link SINTA untuk Dosen */}
                  {isDosen && (dosen as any).sinta && (
                    <div className="flex flex-wrap gap-4">
                      <a
                        href={(dosen as any).sinta}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                          <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
                        </svg>
                        Lihat Profil SINTA
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Generate static params for all SDM
export async function generateStaticParams() {
  const dosenSlugs = dosenData.map(dosen => ({ slug: dosen.slug }));
  const tendikSlugs = tendikData.map(tendik => ({ slug: tendik.slug }));

  return [...dosenSlugs, ...tendikSlugs];
}
