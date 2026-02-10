'use client';

import { notFound } from 'next/navigation';
import { Link } from "@/i18n/routing";
import { use } from 'react';
import HeroSection from '@/components/shared/HeroSection';
import SectionTitle from '@/components/shared/SectionTitle';
import { dosenData } from '@/data/dosen';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface Lecturer {
  slug: string;
  nama: string;
  prodi: string;
  fakultas: string;
  foto: string;
  jabatan: string;
  struktural: boolean;
  pendidikan: string[];
  matakuliah: string[];
  penelitian: {
    judul: string;
    kategori: string;
    url: string;
  }[];
  jadwal: {
    nomor: number;
    hari: string;
    jam: string;
    fakultas: string;
    prodi: string;
    matakuliah: string;
    kode: string;
    angkatan: string;
  }[];
}

export default function DosenDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;
  const dosen = dosenData.find(d => d.slug === slug) as Lecturer | undefined;

  if (!dosen) {
    notFound();
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Jadwal Mengajar", 14, 15);

    // Prepare table data from jadwal
    const tableData = dosen.jadwal.map(jadwal => [
      jadwal.nomor,
      jadwal.hari,
      jadwal.jam,
      jadwal.fakultas,
      jadwal.prodi,
      jadwal.matakuliah,
      jadwal.kode,
      jadwal.angkatan
    ]);

    autoTable(doc, {
      head: [['No', 'Hari', 'Jam', 'Fakultas', 'Prodi', 'Mata Kuliah', 'Kode', 'Angkatan']],
      body: tableData,
      startY: 25
    });

    // Generate PDF as blob and open in new tab
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  };

  return (
    <div>
      <HeroSection
        title={dosen.nama}
        subtitle={`Dosen ${dosen.prodi} - ${dosen.fakultas}`}
      />

      {/* Profile Photo Section */}
      <section className="bg-white py-16 sm:py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img
              src={dosen.foto}
              alt={dosen.nama}
              className="w-48 h-48 rounded-full object-cover border-4 border-unaicGold shadow-lg"
            />
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-unaicNavy mb-2">
                {dosen.nama}
              </h1>
              {dosen.struktural && (
                <span className="inline-block bg-unaicGold text-unaicNavy px-3 py-1 rounded-full text-sm font-semibold mb-2">
                  Pimpinan
                </span>
              )}
              <p className="text-lg text-gray-600 mb-1">
                {dosen.jabatan}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                {dosen.prodi}
              </p>
              <p className="text-sm text-gray-500">
                {dosen.fakultas}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <SectionTitle>Riwayat Pendidikan</SectionTitle>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <ul className="space-y-4">
              {dosen.pendidikan.map((edu, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-3 h-3 bg-unaicGold rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <span className="text-gray-700">{edu}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="bg-white py-16 sm:py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <SectionTitle>Mata Kuliah yang Diajarkan</SectionTitle>
          <div className="bg-gray-50 rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dosen.matakuliah.map((mk, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-unaicGold rounded-full mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">{mk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Research Section */}
      {dosen.penelitian && dosen.penelitian.length > 0 && (
        <section className="bg-gray-50 py-16 sm:py-24">
          <div className="container mx-auto max-w-4xl px-4">
            <SectionTitle>Penelitian & Publikasi</SectionTitle>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="space-y-6">
                {dosen.penelitian.map((penelitian, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-unaicNavy mb-2">
                          {penelitian.judul}
                        </h3>
                        <span className="inline-block bg-unaicGold text-unaicNavy px-3 py-1 rounded-full text-sm font-medium">
                          {penelitian.kategori}
                        </span>
                      </div>
                      <a
                        href={penelitian.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 bg-unaicNavy text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-unaicBlue transition-colors flex-shrink-0"
                      >
                        Lihat Detail
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Schedule Section */}
      {dosen.jadwal && dosen.jadwal.length > 0 && (
        <section className="bg-gray-50 py-16 sm:py-24">
          <div className="container mx-auto max-w-6xl px-4">
            <SectionTitle>Jadwal Mengajar</SectionTitle>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table id="jadwalTable" className="w-full border">
                  <thead className="bg-unaicNavy text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">No</th>
                      <th className="px-4 py-3 text-left">Hari</th>
                      <th className="px-4 py-3 text-left">Jam</th>
                      <th className="px-4 py-3 text-left">Fakultas</th>
                      <th className="px-4 py-3 text-left">Prodi</th>
                      <th className="px-4 py-3 text-left">Mata Kuliah</th>
                      <th className="px-4 py-3 text-left">Kode</th>
                      <th className="px-4 py-3 text-left">Angkatan</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-900">
                    {dosen.jadwal.map((jadwal, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-4 py-4 border-b border-gray-200 font-medium">{jadwal.nomor}</td>
                        <td className="px-4 py-4 border-b border-gray-200">{jadwal.hari}</td>
                        <td className="px-4 py-4 border-b border-gray-200">{jadwal.jam}</td>
                        <td className="px-4 py-4 border-b border-gray-200">{jadwal.fakultas}</td>
                        <td className="px-4 py-4 border-b border-gray-200">{jadwal.prodi}</td>
                        <td className="px-4 py-4 border-b border-gray-200 font-medium">{jadwal.matakuliah}</td>
                        <td className="px-4 py-4 border-b border-gray-200">{jadwal.kode}</td>
                        <td className="px-4 py-4 border-b border-gray-200">{jadwal.angkatan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-4 text-center">
              <button onClick={handleDownloadPDF} className="bg-unaicNavy text-white px-6 py-3 rounded-full font-semibold hover:bg-unaicBlue transition-colors">
                Download Jadwal PDF
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Back Button */}
      <section className="bg-white py-8">
        <div className="container mx-auto max-w-4xl px-4">
          <Link href="/akademik/dosen">
            <button className="bg-unaicNavy text-white px-6 py-3 rounded-full font-semibold hover:bg-unaicBlue transition-colors">
              ← Kembali ke Daftar Dosen
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
