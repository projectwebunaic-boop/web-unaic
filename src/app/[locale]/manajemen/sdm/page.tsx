"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import HeroSection from '@/components/shared/HeroSection';
import SectionTitle from '@/components/shared/SectionTitle';
import SDMCard from '@/components/manajemen/SDMCard';
import SearchBar from '@/components/manajemen/SearchBar';
import dosenData from '@/data/dosen.json';
import tendikData from '@/data/tendik.json';

export default function SDMPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('dosen');

  const filteredDosen = useMemo(() => {
    return dosenData.filter(dosen =>
      dosen.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dosen.jabatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dosen.fakultas.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const filteredTendik = useMemo(() => {
    return tendikData.filter(tendik =>
      tendik.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tendik.jabatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tendik.unit.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const currentData = activeTab === 'dosen' ? filteredDosen : filteredTendik;
  const totalCount = activeTab === 'dosen' ? dosenData.length : tendikData.length;
  const filteredCount = currentData.length;

  return (
    <div>
      <HeroSection
        title="Sumber Daya Manusia UNAIC"
        subtitle="Kenali para dosen dan tenaga kependidikan yang berkomitmen dalam mendukung kegiatan akademik dan operasional Universitas Al-Irsyad Cilacap."
      />

      {/* Search Section */}
      <section className="bg-gradient-to-r from-blue-50 to-white py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Cari nama atau unit kerja..."
          />

          {/* Results Count */}
          <div className="text-center mb-8">
            <p className="text-blue-700 font-medium">
              Menampilkan {filteredCount} dari {totalCount} {activeTab === 'dosen' ? 'dosen' : 'tenaga kependidikan'}
            </p>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <Tabs defaultValue="dosen" onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-xl mb-8 max-w-md mx-auto">
              <TabsTrigger
                value="dosen"
                className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200"
              >
                Dosen
              </TabsTrigger>
              <TabsTrigger
                value="tendik"
                className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200"
              >
                Tenaga Kependidikan
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="dosen" className="mt-0">
                <motion.div
                  key="dosen"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SectionTitle>
                    Dosen UNAIC
                  </SectionTitle>
                  <p className="text-center text-gray-600 mb-8">
                    Para akademisi yang berdedikasi dalam bidang pendidikan dan penelitian
                  </p>

                  {filteredDosen.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredDosen.map((dosen) => (
                        <SDMCard
                          key={dosen.slug}
                          nama={dosen.nama}
                          slug={dosen.slug}
                          jabatan={dosen.jabatan}
                          fakultas={dosen.fakultas}
                          foto={dosen.foto}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">
                        Tidak ada dosen yang ditemukan.
                      </p>
                    </div>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="tendik" className="mt-0">
                <motion.div
                  key="tendik"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SectionTitle>
                    Tenaga Kependidikan UNAIC
                  </SectionTitle>
                  <p className="text-center text-gray-600 mb-8">
                    Para profesional yang mendukung operasional universitas dengan dedikasi tinggi
                  </p>

                  {filteredTendik.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredTendik.map((tendik) => (
                        <SDMCard
                          key={tendik.slug}
                          nama={tendik.nama}
                          slug={tendik.slug}
                          jabatan={tendik.jabatan}
                          unit={tendik.unit}
                          foto={tendik.foto}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">
                        Tidak ada tenaga kependidikan yang ditemukan.
                      </p>
                    </div>
                  )}
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
