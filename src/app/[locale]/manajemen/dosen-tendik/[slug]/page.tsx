import React from 'react';
import { notFound } from 'next/navigation';
import DosenDetail from '@/components/manajemen/DosenDetail';
import SDMDetail from '@/components/manajemen/SDMDetail';
import dosenData from '@/data/dosen.json';
import tendikData from '@/data/tendik.json';

interface PageProps {
  params: {
    slug: string;
  };
}

export default function DosenTendikDetailPage({ params }: PageProps) {
  // Check if it's a lecturer first
  const dosen = dosenData.find(d => d.slug === params.slug);
  if (dosen) {
    return <DosenDetail {...dosen} />;
  }

  // Check if it's staff
  const tendik = tendikData.find(t => t.slug === params.slug);
  if (tendik) {
    return <SDMDetail {...tendik} />;
  }

  // If neither found, show 404
  notFound();
}

export async function generateStaticParams() {
  // Generate static params for both lecturers and staff
  const dosenParams = dosenData.map((dosen) => ({
    slug: dosen.slug,
  }));

  const tendikParams = tendikData.map((tendik) => ({
    slug: tendik.slug,
  }));

  return [...dosenParams, ...tendikParams];
}

export async function generateMetadata({ params }: PageProps) {
  // Check lecturer first
  const dosen = dosenData.find(d => d.slug === params.slug);
  if (dosen) {
    return {
      title: `${dosen.nama} - ${dosen.jabatan}`,
      description: `Profil lengkap ${dosen.nama}, ${dosen.jabatan} di ${dosen.fakultas} Universitas Al-Irsyad Cilacap.`,
    };
  }

  // Check staff
  const tendik = tendikData.find(t => t.slug === params.slug);
  if (tendik) {
    return {
      title: `${tendik.nama} - ${tendik.jabatan}`,
      description: `Profil lengkap ${tendik.nama}, ${tendik.jabatan} di ${tendik.unit} Universitas Al-Irsyad Cilacap.`,
    };
  }

  return {
    title: 'SDM Tidak Ditemukan',
  };
}
