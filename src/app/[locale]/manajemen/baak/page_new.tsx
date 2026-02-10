import HeroSection from "@/components/shared/HeroSection";
import { Card } from "@/components/shared/Card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/shared/Accordion";
import { RadioGroup, RadioGroupItem } from "@/components/shared/RadioGroup";
import { Label } from "@/components/shared/Label";
import { Button } from "@/components/shared/Button";
import { Textarea } from "@/components/shared/Textarea";
import { GraduationCap, Users, FileText, Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { useState } from "react";

export default function BAAKPage() {
  const [surveyData, setSurveyData] = useState({
    name: "",
    responses: {} as Record<string, string>,
    suggestions: ""
  });

  const surveyQuestions = [
    "Kualitas pelayanan administrasi akademik",
    "Kecepatan respon terhadap permintaan mahasiswa",
    "Kemudahan akses informasi akademik",
    "Kepuasan terhadap sistem KRS online",
    "Kualitas bimbingan akademik",
    "Efektivitas komunikasi dengan mahasiswa",
    "Ketersediaan layanan konsultasi",
    "Kepuasan terhadap proses wisuda",
    "Kualitas layanan kemahasiswaan",
    "Tingkat kepuasan keseluruhan"
  ];

  const handleSurveySubmit = () => {
    alert("Terima kasih atas penilaian Anda!");
    setSurveyData({ name: "", responses: {}, suggestions: "" });
  };

  return (
    <main className="font-sans text-gray-700 bg-white">
      <HeroSection
        title="Biro Administrasi Akademik dan Kemahasiswaan (BAAK)"
        subtitle="Memberikan pelayanan akademik dan kemahasiswaan terbaik untuk mahasiswa UNAIC."
        className="bg-gradient-to-r from-blue-600 to-blue-800"
      />

      {/* Layanan Utama BAAK */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-semibold text-unaicNavy mb-4">
              Layanan Utama BAAK
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kami menyediakan berbagai layanan untuk mendukung kegiatan akademik dan kemahasiswaan mahasiswa UNAIC.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-unaicGold rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-unaicNavy mb-3">Pelayanan Akademik</h3>
              <p className="text-gray-600">
                Pengelolaan administrasi akademik, KRS, nilai, dan transkrip mahasiswa.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-unaicGold rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-unaicNavy mb-3">Pelayanan Kemahasiswaan</h3>
              <p className="text-gray-600">
                Pendampingan kegiatan kemahasiswaan, beasiswa, dan pengembangan mahasiswa.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-unaicGold rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-unaicNavy mb-3">Administrasi Akademik</h3>
              <p className="text-gray-600">
                Pengelolaan data akademik, ijazah, dan sertifikat kelulusan.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Pelayanan Akademik */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-semibold text-unaicNavy mb-4">
              FAQ Pelayanan Akademik
            </h2>
            <p className="text-lg text-gray-600">
              Pertanyaan yang sering diajukan mengenai layanan akademik BAAK.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="krs">
              <AccordionTrigger className="text-left">Bagaimana prosedur KRS?</AccordionTrigger>
              <AccordionContent>
                <p>Mahasiswa dapat melakukan KRS melalui portal akademik UNAIC dengan mengikuti langkah-langkah:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Login ke portal akademik</li>
                  <li>Pilih menu KRS</li>
                  <li>Pilih mata kuliah yang diinginkan</li>
                  <li>Konfirmasi dan simpan KRS</li>
                </ol>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cuti">
              <AccordionTrigger className="text-left">Bagaimana pengajuan cuti kuliah?</AccordionTrigger>
              <AccordionContent>
                <p>Untuk mengajukan cuti kuliah, mahasiswa harus:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Mengisi formulir permohonan cuti</li>
                  <li>Melampirkan surat keterangan dari orang tua/wali</li>
                  <li>Menyerahkan ke BAAK untuk diproses</li>
                  <li>Maksimal cuti 1 semester per tahun</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="aktif">
              <AccordionTrigger className="text-left">Bagaimana memperoleh surat aktif kuliah?</AccordionTrigger>
              <AccordionContent>
                <p>Surat keterangan aktif kuliah dapat diperoleh dengan cara:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Login ke portal akademik</li>
                  <li>Pilih menu "Surat Keterangan"</li>
                  <li>Pilih "Surat Aktif Kuliah"</li>
                  <li>Download dan cetak surat</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Kuisioner Kepuasan Layanan Akademik */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-semibold text-unaicNavy mb-4">
              Kuisioner Kepuasan Layanan Akademik
            </h2>
            <p className="text-lg text-gray-600">
              Bantu kami meningkatkan kualitas layanan dengan memberikan penilaian Anda.
            </p>
          </div>

          <Card className="p-8">
            <form onSubmit={(e) => { e.preventDefault(); handleSurveySubmit(); }} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-base font-medium">Nama Lengkap</Label>
                <input
                  id="name"
                  type="text"
                  value={surveyData.name}
                  onChange={(e) => setSurveyData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-unaicGold focus:border-unaicGold"
                  placeholder="Masukkan nama lengkap Anda"
                  required
                />
              </div>

              <div className="space-y-4">
                {surveyQuestions.map((question, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4">
                    <Label className="text-base font-medium mb-3 block">{index + 1}. {question}</Label>
                    <RadioGroup
                      value={surveyData.responses[index.toString()] || ""}
                      onValueChange={(value) => setSurveyData(prev => ({
                        ...prev,
                        responses: { ...prev.responses, [index.toString()]: value }
                      }))}
                      className="flex flex-wrap gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="K" id={`q${index}-k`} />
                        <Label htmlFor={`q${index}-k`}>K (Kurang)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="C" id={`q${index}-c`} />
                        <Label htmlFor={`q${index}-c`}>C (Cukup)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="B" id={`q${index}-b`} />
                        <Label htmlFor={`q${index}-b`}>B (Baik)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="BS" id={`q${index}-bs`} />
                        <Label htmlFor={`q${index}-bs`}>BS (Baik Sekali)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                ))}
              </div>

              <div>
                <Label htmlFor="suggestions" className="text-base font-medium">Saran dan Masukan</Label>
                <Textarea
                  id="suggestions"
                  value={surveyData.suggestions}
                  onChange={(e) => setSurveyData(prev => ({ ...prev, suggestions: e.target.value }))}
                  placeholder="Berikan saran Anda untuk meningkatkan layanan BAAK..."
                  className="mt-1"
                  rows={4}
                />
              </div>

              <div className="text-center">
                <Button type="submit" className="bg-unaicGold hover:bg-unaicGold/90 text-white px-8 py-3">
                  Kirim Penilaian
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </section>

      {/* Kontak BAAK */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-semibold text-unaicNavy mb-4">
              Kontak BAAK
            </h2>
            <p className="text-lg text-gray-600">
              Hubungi kami untuk informasi lebih lanjut atau bantuan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-unaicGold mt-1" />
                  <div>
                    <h3 className="font-semibold text-unaicNavy">Alamat</h3>
                    <p className="text-gray-600">
                      Jl. Cerme No.24, Wanasari, Sidanegara, Kec. Cilacap Tengah, Kabupaten Cilacap, Jawa Tengah 53223
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-unaicGold" />
                  <div>
                    <h3 className="font-semibold text-unaicNavy">WhatsApp</h3>
                    <p className="text-gray-600">088905905905</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-unaicGold" />
                  <div>
                    <h3 className="font-semibold text-unaicNavy">Email</h3>
                    <p className="text-gray-600">pmb.unaic@universitasalirsyad.ac.id</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-unaicNavy mb-4">Hubungi Kami</h3>
                <p className="text-gray-600 mb-6">
                  Butuh bantuan atau informasi? Hubungi BAAK melalui WhatsApp untuk respon cepat.
                </p>
                <Button
                  asChild
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
                >
                  <a
                    href="https://wa.me/6288905905905?text=Halo%20BAAK%2C%20saya%20ingin%20bertanya%20tentang..."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Hubungi via WhatsApp</span>
                  </a>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
