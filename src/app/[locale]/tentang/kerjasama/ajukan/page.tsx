"use client";

import HeroSection from "@/components/shared/HeroSection";
import PartnershipForm from "@/components/partnership/PartnershipForm";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function PartnershipSubmissionPage() {
    return (
        <main className="font-sans text-gray-700 bg-gray-50 pb-20">
            <HeroSection
                title="Ajukan Kerjasama"
                subtitle="Kami menyambut baik inisiatif kolaborasi dari berbagai instansi untuk kemajuan bersama."
            />

            <div className="container mx-auto px-4 md:px-8 py-12 relative z-10">

                {/* Back Button */}
                <div className="max-w-4xl mx-auto mb-8">
                    <Link href="/tentang/kerjasama" className="inline-flex items-center text-unaicBlue font-semibold hover:underline gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                        <ArrowLeft className="w-4 h-4" /> Kembali ke Halaman Kerjasama
                    </Link>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                        {/* Header Card */}
                        <div className="bg-unaicNavy p-8 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-2xl font-bold mb-2">Formulir Pengajuan Mitra</h2>
                                <p className="opacity-90">Silakan lengkapi data di bawah ini. Tim kami akan segera menindaklanjuti permohonan Anda.</p>
                            </div>
                            {/* Decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                        </div>

                        <div className="p-8 md:p-12">
                            <PartnershipForm />
                        </div>
                    </div>

                    {/* Disclaimer / Additional Info */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <h4 className="font-bold text-unaicNavy mb-2">Proses Verifikasi</h4>
                            <p className="text-sm text-gray-600">
                                Setiap pengajuan akan melalui proses verifikasi oleh Biro Kerjasama. Pastikan nomor kontak dan email yang Anda masukkan valid dan aktif.
                            </p>
                        </div>
                        <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
                            <h4 className="font-bold text-yellow-800 mb-2">Pusat Bantuan</h4>
                            <p className="text-sm text-gray-600">
                                Mengalami kendala saat mengisi formulir? Hubungi kami via email di <span className="font-bold">humas@unaic.ac.id</span> atau WhatsApp <span className="font-bold">+62 812-3456-7890</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
