'use client';

import React from 'react';

interface Lecturer {
  slug: string;
  nama: string;
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

interface ScheduleDownloadButtonProps {
  dosen: Lecturer;
}

export default function ScheduleDownloadButton({ dosen }: ScheduleDownloadButtonProps) {
  const handleDownloadPDF = async () => {
    const jsPDF = (await import('jspdf')).default;
    await import('jspdf-autotable');

    const doc = new jsPDF();
    doc.text(`Jadwal Mengajar - ${dosen.nama}`, 14, 15);

    const rows = dosen.jadwal.map((j) => [
      j.nomor,
      j.hari,
      j.jam,
      j.fakultas,
      j.prodi,
      j.matakuliah,
      j.kode,
      j.angkatan,
    ]);

    (doc as any).autoTable({
      head: [["No", "Hari", "Jam", "Fakultas", "Prodi", "Mata Kuliah", "Kode", "Angkatan"]],
      body: rows,
      startY: 25,
    });

    doc.save(`jadwal_${dosen.slug}.pdf`);
  };

  return (
    <button
      onClick={handleDownloadPDF}
      className="bg-unaicNavy text-white px-6 py-3 rounded-full font-semibold hover:bg-unaicBlue transition-colors"
    >
      Download Jadwal PDF
    </button>
  );
}
