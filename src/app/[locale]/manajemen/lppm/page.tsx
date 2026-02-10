import HeroSection from "@/components/shared/HeroSection";
import SectionTitle from "@/components/shared/SectionTitle";
import { Target, Eye, Users, FileText, Send } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function LPPMPage() {
  return (
    <main className="font-sans text-gray-700 bg-white">
      <HeroSection
        title="Profil LPPM UNAIC"
        subtitle="Lembaga Penelitian dan Pengabdian kepada Masyarakat Universitas Al-Irsyad Cilacap"
      />

      {/* Visi, Misi, Tugas Pokok Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <SectionTitle>Visi, Misi & Tugas Pokok</SectionTitle>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
            {/* Visi */}
            <div className="bg-white rounded-xl shadow-md p-8 text-center border border-unaicNavy/10">
              <div className="w-16 h-16 bg-[#FFD700]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="w-8 h-8 text-[#0A2E5C]" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-[#0A2E5C] mb-4">Visi</h3>
              <p className="text-gray-600 leading-relaxed">
                Menjadi lembaga penelitian dan pengabdian kepada masyarakat yang unggul dalam
                pengembangan ilmu pengetahuan, teknologi, dan inovasi berbasis nilai-nilai Islam
                untuk kemajuan bangsa.
              </p>
            </div>

            {/* Misi */}
            <div className="bg-white rounded-xl shadow-md p-8 text-center border border-unaicNavy/10">
              <div className="w-16 h-16 bg-[#FFD700]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-[#0A2E5C]" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-[#0A2E5C] mb-4">Misi</h3>
              <ul className="text-gray-600 text-left space-y-2">
                <li>• Mengembangkan penelitian yang inovatif dan berdampak</li>
                <li>• Mendorong pengabdian masyarakat yang berkelanjutan</li>
                <li>• Meningkatkan publikasi ilmiah berkualitas</li>
                <li>• Membina kerjasama riset dengan stakeholder</li>
              </ul>
            </div>

            {/* Tugas Pokok */}
            <div className="bg-white rounded-xl shadow-md p-8 text-center border border-unaicNavy/10">
              <div className="w-16 h-16 bg-[#FFD700]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-[#0A2E5C]" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-[#0A2E5C] mb-4">Tugas Pokok</h3>
              <ul className="text-gray-600 text-left space-y-2">
                <li>• Koordinasi kegiatan penelitian</li>
                <li>• Pengelolaan program PKM</li>
                <li>• Fasilitasi publikasi ilmiah</li>
                <li>• Pengembangan kerjasama riset</li>
                <li>• Pengelolaan laboratorium riset</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Struktur Organisasi Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <SectionTitle>Struktur Organisasi</SectionTitle>

          <div className="mt-12 bg-white rounded-xl shadow-md p-8 border border-unaicNavy/10">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-heading font-semibold text-[#0A2E5C] mb-4">
                Organisasi LPPM UNAIC
              </h3>
              <p className="text-gray-600">
                Struktur organisasi yang mendukung pengembangan penelitian dan pengabdian masyarakat
              </p>
            </div>

            {/* Organizational Structure - Simple Text Version */}
            <div className="space-y-6">
              <div className="text-center p-4 bg-[#0A2E5C] text-white rounded-lg">
                <h4 className="font-semibold">Ketua LPPM</h4>
                <p className="text-sm mt-1">Dr. Ahmad Rahman, M.Pd.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-[#FFD700]/10 rounded-lg border border-[#FFD700]/20">
                  <h4 className="font-semibold text-[#0A2E5C]">Sekretaris</h4>
                  <p className="text-sm text-gray-600 mt-1">Dr. Siti Nurhaliza, Ph.D.</p>
                </div>
                <div className="text-center p-4 bg-[#FFD700]/10 rounded-lg border border-[#FFD700]/20">
                  <h4 className="font-semibold text-[#0A2E5C]">Bendahara</h4>
                  <p className="text-sm text-gray-600 mt-1">Dr. Budi Santoso, M.B.A.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-[#0A2E5C]">Bidang Penelitian</h4>
                  <p className="text-sm text-gray-600 mt-1">Koordinator</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-[#0A2E5C]">Bidang PKM</h4>
                  <p className="text-sm text-gray-600 mt-1">Koordinator</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-[#0A2E5C]">Bidang Publikasi</h4>
                  <p className="text-sm text-gray-600 mt-1">Koordinator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#0A2E5C] to-blue-600 py-16 sm:py-24">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
            <FileText className="w-16 h-16 text-[#FFD700] mx-auto mb-6" />
            <h2 className="text-3xl font-heading font-bold text-white mb-4">
              Kirim Proposal Penelitian
            </h2>
            <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
              Ajukan proposal penelitian atau pengabdian masyarakat Anda.
              LPPM UNAIC siap mendampingi dan memfasilitasi pengembangan riset yang berdampak.
            </p>
            <Link
              href="/kontak"
              className="inline-flex items-center gap-3 bg-[#FFD700] hover:bg-yellow-400 text-[#0A2E5C] font-semibold px-8 py-4 rounded-lg shadow-lg transition-colors duration-300 text-lg"
            >
              <Send className="w-5 h-5" />
              Ajukan Proposal
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
