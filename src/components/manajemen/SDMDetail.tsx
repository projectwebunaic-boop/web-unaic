import React from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { ArrowLeft, Mail, Building } from 'lucide-react';

interface SDMDetailProps {
  nama: string;
  jabatan: string;
  unit: string;
  foto: string;
  email: string;
  profil: string;
}

export default function SDMDetail({
  nama,
  jabatan,
  unit,
  foto,
  email,
  profil
}: SDMDetailProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Back Button */}
        <Link
          href="/manajemen/dosen-tendik"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Kembali ke Daftar Tenaga Kependidikan
        </Link>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Photo Section */}
            <div className="md:w-1/3 bg-gradient-to-br from-blue-600 to-blue-800 p-8 flex items-center justify-center">
              <div className="relative w-48 h-48">
                <Image
                  src={foto}
                  alt={nama}
                  fill
                  className="rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
            </div>

            {/* Details Section */}
            <div className="md:w-2/3 p-8">
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-blue-900 mb-2">{nama}</h1>
                  <p className="text-xl text-blue-700 font-medium">{jabatan}</p>
                  <p className="text-lg text-gray-600">{unit}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Building className="text-blue-600" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Unit Kerja</p>
                        <p className="font-medium text-blue-900">{unit}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="text-blue-600" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <a
                          href={`mailto:${email}`}
                          className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          {email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h2 className="text-xl font-bold text-blue-900 mb-4">Profil</h2>
                  <p className="text-gray-700 leading-relaxed">{profil}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
