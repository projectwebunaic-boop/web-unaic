import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Users,
  Building2,
  GraduationCap,
  MessageSquare,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Globe,
} from "lucide-react";

export const contactInfo = [
  {
    id: 1,
    title: "Alamat Kampus",
    description: "Jl. Raya Timur No. 1, Cilacap, Jawa Tengah 53211",
    icon: <MapPin className="w-8 h-8 text-unaicBlue" />,
    details: "Lokasi strategis di pusat kota Cilacap dengan akses mudah dari berbagai arah",
  },
  {
    id: 2,
    title: "Telepon & Fax",
    description: "+62 282 123456 | Fax: +62 282 123457",
    icon: <Phone className="w-8 h-8 text-unaicBlue" />,
    details: "Senin - Jumat: 08.00 - 16.00 WIB | Sabtu: 08.00 - 12.00 WIB",
  },
  {
    id: 3,
    title: "Email Resmi",
    description: "info@unaic.ac.id | akademik@unaic.ac.id",
    icon: <Mail className="w-8 h-8 text-unaicBlue" />,
    details: "Respon maksimal 1x24 jam pada hari kerja",
  },
  {
    id: 4,
    title: "Jam Operasional",
    description: "Senin - Jumat: 07.30 - 16.30 WIB",
    icon: <Clock className="w-8 h-8 text-unaicBlue" />,
    details: "Sabtu: 07.30 - 12.00 WIB | Minggu: Tutup",
  },
];

export const departments = [
  {
    id: 1,
    name: "Bagian Akademik",
    description: "Informasi penerimaan mahasiswa baru, kurikulum, dan administrasi akademik",
    email: "akademik@unaic.ac.id",
    phone: "+62 282 123458",
    icon: <GraduationCap className="w-6 h-6 text-unaicNavy" />,
    head: "Dr. Ahmad Santoso, M.Pd.",
  },
  {
    id: 2,
    name: "Bagian Kemahasiswaan",
    description: "Layanan beasiswa, kegiatan mahasiswa, dan pengembangan karir",
    email: "kemahasiswaan@unaic.ac.id",
    phone: "+62 282 123459",
    icon: <Users className="w-6 h-6 text-unaicNavy" />,
    head: "Siti Nurhaliza, S.Pd., M.Si.",
  },
  {
    id: 3,
    name: "Bagian Administrasi",
    description: "Administrasi umum, keuangan, dan sumber daya manusia",
    email: "administrasi@unaic.ac.id",
    phone: "+62 282 123460",
    icon: <Building2 className="w-6 h-6 text-unaicNavy" />,
    head: "Budi Setiawan, S.E., M.M.",
  },
  {
    id: 4,
    name: "Bagian Hubungan Masyarakat",
    description: "Kerjasama, publikasi, dan informasi umum universitas",
    email: "humas@unaic.ac.id",
    phone: "+62 282 123461",
    icon: <MessageSquare className="w-6 h-6 text-unaicNavy" />,
    head: "Maria Christina, S.I.Kom.",
  },
];

export const socialMedia = [
  { name: "Facebook", icon: <Facebook className="w-6 h-6" />, url: "https://facebook.com/unaic.official", color: "hover:text-blue-600" },
  { name: "Twitter", icon: <Twitter className="w-6 h-6" />, url: "https://twitter.com/unaic_official", color: "hover:text-sky-500" },
  { name: "Instagram", icon: <Instagram className="w-6 h-6" />, url: "https://instagram.com/unaic.official", color: "hover:text-pink-600" },
  { name: "YouTube", icon: <Youtube className="w-6 h-6" />, url: "https://youtube.com/unaic.official", color: "hover:text-red-600" },
  { name: "LinkedIn", icon: <Linkedin className="w-6 h-6" />, url: "https://linkedin.com/school/unaic", color: "hover:text-blue-700" },
  { name: "Website", icon: <Globe className="w-6 h-6" />, url: "https://unaic.ac.id", color: "hover:text-green-600" },
];