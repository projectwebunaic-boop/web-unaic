export interface LecturerDetail {
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

export const dosenData: LecturerDetail[] = [
  {
    slug: "sarwa",
    nama: "Sarwa, AMK., S.Pd., M.Kes.",
    prodi: "S1 Keperawatan",
    fakultas: "Fakultas Ilmu Kesehatan",
    foto: "/images/dosen/sarwa.jpg",
    jabatan: "Rektor Universitas Al-Irsyad Cilacap",
    struktural: true,
    pendidikan: [
      "S1 Keperawatan - Universitas Indonesia (2005)",
      "S2 Kesehatan Masyarakat - Universitas Gadjah Mada (2010)",
      "S3 Manajemen Kesehatan - Universitas Airlangga (2015)"
    ],
    matakuliah: ["Keperawatan Dasar", "Manajemen Keperawatan", "Etika Keperawatan"],
    penelitian: [
      {
        judul: "Pengaruh Manajemen Keperawatan Terhadap Kualitas Pelayanan Kesehatan",
        kategori: "Sinta",
        url: "https://sinta.kemdikbud.go.id/journals/detail?id=123456"
      },
      {
        judul: "Strategi Peningkatan Kompetensi Perawat di Era Digital",
        kategori: "Conference",
        url: "https://conference.unair.ac.id/proceedings/2023/paper123"
      }
    ],
    jadwal: [
      {
        nomor: 1,
        hari: "Senin",
        jam: "08.00 - 09.40",
        fakultas: "Ilmu Kesehatan",
        prodi: "S1 Keperawatan",
        matakuliah: "Etika Profesi",
        kode: "KP101",
        angkatan: "2023"
      },
      {
        nomor: 2,
        hari: "Rabu",
        jam: "10.00 - 11.40",
        fakultas: "Ilmu Kesehatan",
        prodi: "S1 Keperawatan",
        matakuliah: "Manajemen Keperawatan",
        kode: "KP201",
        angkatan: "2022"
      }
    ]
  },
  {
    slug: "mika-tri-kumala-swandari",
    nama: "apt. Mika Tri Kumala Swandari, M.Sc",
    prodi: "S1 Farmasi",
    fakultas: "Fakultas Farmasi, Sains & Teknologi",
    foto: "/images/dosen/mika.jpg",
    jabatan: "Wakil Rektor I",
    struktural: true,
    pendidikan: [
      "S1 Farmasi - Universitas Padjadjaran (2008)",
      "S2 Farmasi Klinis - Universitas Indonesia (2012)",
      "S3 Farmakologi - Universitas Airlangga (2018)"
    ],
    matakuliah: ["Farmasi Klinis", "Farmakologi", "Biokimia"],
    penelitian: [
      {
        judul: "Pengembangan Obat Anti-Kanker dari Ekstrak Tanaman Herbal",
        kategori: "Sinta",
        url: "https://sinta.kemdikbud.go.id/journals/detail?id=789012"
      },
      {
        judul: "Farmakokinetika Obat pada Pasien Geriatri",
        kategori: "Conference",
        url: "https://conference.ui.ac.id/proceedings/2022/pharma456"
      }
    ],
    jadwal: [
      {
        nomor: 1,
        hari: "Selasa",
        jam: "09.00 - 10.40",
        fakultas: "Farmasi, Sains & Teknologi",
        prodi: "S1 Farmasi",
        matakuliah: "Farmakologi",
        kode: "FR201",
        angkatan: "2023"
      },
      {
        nomor: 2,
        hari: "Kamis",
        jam: "13.00 - 14.40",
        fakultas: "Farmasi, Sains & Teknologi",
        prodi: "S1 Farmasi",
        matakuliah: "Biokimia",
        kode: "FR301",
        angkatan: "2022"
      }
    ]
  },
  {
    slug: "yogi-andhi-lestari",
    nama: "Yogi Andhi Lestari, S.ST., M.Keb.",
    prodi: "D3 Kebidanan",
    fakultas: "Fakultas Ilmu Kesehatan",
    foto: "/images/dosen/yogi.jpg",
    jabatan: "Wakil Rektor II",
    struktural: true,
    pendidikan: [
      "D3 Kebidanan - Akademi Kebidanan Yogyakarta (2007)",
      "S1 Kebidanan - Universitas Gadjah Mada (2010)",
      "S2 Kesehatan Masyarakat - Universitas Diponegoro (2015)"
    ],
    matakuliah: ["Kebidanan Dasar", "Kesehatan Ibu dan Anak", "Praktikum Kebidanan"],
    penelitian: [
      {
        judul: "Intervensi Kesehatan Reproduksi pada Remaja",
        kategori: "Sinta",
        url: "https://sinta.kemdikbud.go.id/journals/detail?id=345678"
      },
      {
        judul: "Pengelolaan Risiko Kehamilan pada Ibu Hamil",
        kategori: "Conference",
        url: "https://conference.ugm.ac.id/proceedings/2021/midwifery789"
      }
    ],
    jadwal: [
      {
        nomor: 1,
        hari: "Senin",
        jam: "07.00 - 08.40",
        fakultas: "Ilmu Kesehatan",
        prodi: "D3 Kebidanan",
        matakuliah: "Kebidanan Dasar",
        kode: "KB101",
        angkatan: "2023"
      },
      {
        nomor: 2,
        hari: "Jumat",
        jam: "14.00 - 15.40",
        fakultas: "Ilmu Kesehatan",
        prodi: "D3 Kebidanan",
        matakuliah: "Kesehatan Ibu dan Anak",
        kode: "KB201",
        angkatan: "2022"
      }
    ]
  },
  {
    slug: "agus-prasetyo",
    nama: "Agus Prasetyo, M.Kep., Ns.",
    prodi: "S1 Keperawatan",
    fakultas: "Fakultas Ilmu Kesehatan",
    foto: "/images/dosen/agus.jpg",
    jabatan: "Wakil Rektor III",
    struktural: true,
    pendidikan: [
      "S1 Keperawatan - Universitas Indonesia (2009)",
      "S2 Keperawatan - Universitas Gadjah Mada (2013)",
      "S3 Manajemen Keperawatan - Universitas Airlangga (2018)"
    ],
    matakuliah: ["Keperawatan Medikal", "Manajemen Keperawatan", "Etika Keperawatan"],
    penelitian: [
      {
        judul: "Pengembangan Model Keperawatan Holistik untuk Pasien Kronis",
        kategori: "Sinta",
        url: "https://sinta.kemdikbud.go.id/journals/detail?id=567890"
      },
      {
        judul: "Evaluasi Program Pendidikan Keperawatan di Indonesia",
        kategori: "Conference",
        url: "https://conference.unpad.ac.id/proceedings/2020/nursing101"
      }
    ],
    jadwal: [
      {
        nomor: 1,
        hari: "Selasa",
        jam: "08.00 - 09.40",
        fakultas: "Ilmu Kesehatan",
        prodi: "S1 Keperawatan",
        matakuliah: "Keperawatan Medikal",
        kode: "KP301",
        angkatan: "2023"
      },
      {
        nomor: 2,
        hari: "Kamis",
        jam: "10.00 - 11.40",
        fakultas: "Ilmu Kesehatan",
        prodi: "S1 Keperawatan",
        matakuliah: "Etika Keperawatan",
        kode: "KP401",
        angkatan: "2022"
      }
    ]
  },
  {
    slug: "johariyah",
    nama: "Dr. Johariyah., M. Keb.",
    prodi: "S1 Kebidanan",
    fakultas: "Fakultas Ilmu Kesehatan",
    foto: "/images/dosen/johariyah.jpg",
    jabatan: "Dekan Fakultas Ilmu Kesehatan",
    struktural: true,
    pendidikan: [
      "S1 Kebidanan - Universitas Gadjah Mada (2006)",
      "S2 Kesehatan Reproduksi - Universitas Indonesia (2011)",
      "S3 Kesehatan Masyarakat - Universitas Diponegoro (2016)"
    ],
    matakuliah: ["Kebidanan Klinis", "Kesehatan Reproduksi", "Manajemen Kebidanan"],
    penelitian: [
      {
        judul: "Pengaruh Pendidikan Kesehatan Reproduksi Terhadap Perilaku Remaja",
        kategori: "Sinta",
        url: "https://sinta.kemdikbud.go.id/journals/detail?id=901234"
      },
      {
        judul: "Strategi Pencegahan Komplikasi Persalinan di Daerah Pedesaan",
        kategori: "Conference",
        url: "https://conference.undip.ac.id/proceedings/2019/midwifery202"
      }
    ],
    jadwal: [
      {
        nomor: 1,
        hari: "Senin",
        jam: "09.00 - 10.40",
        fakultas: "Ilmu Kesehatan",
        prodi: "S1 Kebidanan",
        matakuliah: "Kebidanan Klinis",
        kode: "KB301",
        angkatan: "2023"
      },
      {
        nomor: 2,
        hari: "Rabu",
        jam: "13.00 - 14.40",
        fakultas: "Ilmu Kesehatan",
        prodi: "S1 Kebidanan",
        matakuliah: "Kesehatan Reproduksi",
        kode: "KB401",
        angkatan: "2022"
      }
    ]
  },
  {
    slug: "nurfauzi",
    nama: "Dr. apt. Yuhansyah Nurfauzi, M.Si.",
    prodi: "S1 Farmasi",
    fakultas: "Fakultas Farmasi, Sains & Teknologi",
    foto: "/images/dosen/nurfauzi.jpg",
    jabatan: "Dekan Fakultas Farmasi, Sains & Teknologi",
    struktural: true,
    pendidikan: [
      "S1 Farmasi - Institut Teknologi Bandung (2007)",
      "S2 Kimia Farmasi - Universitas Indonesia (2012)",
      "S3 Farmakognosi - Universitas Gadjah Mada (2017)"
    ],
    matakuliah: ["Kimia Farmasi", "Farmakologi", "Farmakognosi"],
    penelitian: [
      {
        judul: "Isolasi dan Identifikasi Senyawa Bioaktif dari Tanaman Obat Tradisional",
        kategori: "Sinta",
        url: "https://sinta.kemdikbud.go.id/journals/detail?id=112233"
      },
      {
        judul: "Pengembangan Formulasi Obat Herbal untuk Pengobatan Diabetes",
        kategori: "Conference",
        url: "https://conference.itb.ac.id/proceedings/2021/pharma303"
      }
    ],
    jadwal: [
      {
        nomor: 1,
        hari: "Selasa",
        jam: "08.00 - 09.40",
        fakultas: "Farmasi, Sains & Teknologi",
        prodi: "S1 Farmasi",
        matakuliah: "Kimia Farmasi",
        kode: "FR101",
        angkatan: "2023"
      },
      {
        nomor: 2,
        hari: "Jumat",
        jam: "10.00 - 11.40",
        fakultas: "Farmasi, Sains & Teknologi",
        prodi: "S1 Farmasi",
        matakuliah: "Farmakognosi",
        kode: "FR401",
        angkatan: "2022"
      }
    ]
  },
  {
    slug: "opi-irawansyah",
    nama: "Dr Opi Irawansyah, M.PdI.",
    prodi: "S1 Kewirausahaan",
    fakultas: "Fakultas Ekonomi & Bisnis",
    foto: "/images/dosen/opi.jpg",
    jabatan: "Dekan Fakultas Ekonomi & Bisnis",
    struktural: true,
    pendidikan: [
      "S1 Ekonomi Islam - Universitas Islam Indonesia (2008)",
      "S2 Ekonomi Syariah - Universitas Muhammadiyah Yogyakarta (2013)",
      "S3 Pendidikan Islam - Universitas Negeri Yogyakarta (2018)"
    ],
    matakuliah: ["Ekonomi Syariah", "Kewirausahaan Islam", "Manajemen Bisnis"],
    penelitian: [
      {
        judul: "Pengaruh Literasi Keuangan Syariah Terhadap Perilaku Konsumsi Muslim",
        kategori: "Sinta",
        url: "https://sinta.kemdikbud.go.id/journals/detail?id=445566"
      },
      {
        judul: "Model Kewirausahaan Berbasis Ekonomi Islam di Era Digital",
        kategori: "Conference",
        url: "https://conference.uinyogyakarta.ac.id/proceedings/2022/islamic-econ404"
      }
    ],
    jadwal: [
      {
        nomor: 1,
        hari: "Senin",
        jam: "08.00 - 09.40",
        fakultas: "Ekonomi & Bisnis",
        prodi: "S1 Kewirausahaan",
        matakuliah: "Ekonomi Syariah",
        kode: "EB101",
        angkatan: "2023"
      },
      {
        nomor: 2,
        hari: "Rabu",
        jam: "10.00 - 11.40",
        fakultas: "Ekonomi & Bisnis",
        prodi: "S1 Kewirausahaan",
        matakuliah: "Kewirausahaan Islam",
        kode: "EB201",
        angkatan: "2022"
      }
    ]
  }
];
