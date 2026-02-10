export interface LeaderDetail {
  name: string;
  jabatan: string;
  foto: string;
  pendidikan: string[];
  karir: string[];
  penelitian: string[];
}

export const rektorDetail: LeaderDetail = {
  name: "Sarwa, AMK., S.Pd., M.Kes.",
  jabatan: "Rektor Universitas Al-Irsyad Cilacap",
  foto: "/images/pimpinan/rektor.png",
  pendidikan: [
    "S1 Keperawatan - Universitas Indonesia (2005)",
    "S2 Pendidikan - Universitas Negeri Jakarta (2010)",
    "S3 Kesehatan Masyarakat - Universitas Gadjah Mada (2015)"
  ],
  karir: [
    "Dosen Fakultas Ilmu Kesehatan UNAIC (2006-sekarang)",
    "Kepala Program Studi Keperawatan (2010-2015)",
    "Dekan Fakultas Ilmu Kesehatan (2015-2020)",
    "Rektor Universitas Al-Irsyad Cilacap (2020-sekarang)"
  ],
  penelitian: [
    "Pengembangan Model Pembelajaran Berbasis Komunitas di Daerah Pedesaan",
    "Studi Efektivitas Program Kesehatan Reproduksi Remaja",
    "Implementasi Teknologi Digital dalam Pendidikan Kesehatan"
  ]
};

export const wakilRektorDetail: LeaderDetail[] = [
  {
    name: "apt. Mika Tri Kumala Swandari, M.Sc",
    jabatan: "Wakil Rektor I",
    foto: "/images/pimpinan/warek1.png",
    pendidikan: [
      "S1 Farmasi - Universitas Padjadjaran (2008)",
      "S2 Farmasi Klinis - Universitas Indonesia (2012)",
      "S3 Farmakologi - Universitas Airlangga (2018)"
    ],
    karir: [
      "Apoteker RSUD Cilacap (2008-2012)",
      "Dosen Fakultas Farmasi UNAIC (2012-sekarang)",
      "Kepala Laboratorium Farmasi Klinis (2015-2020)",
      "Wakil Rektor I UNAIC (2020-sekarang)"
    ],
    penelitian: [
      "Pengembangan Obat Herbal untuk Penyakit Tropis",
      "Studi Bioavailabilitas Obat Generik",
      "Riset Pengembangan Vaksin Lokal"
    ]
  },
  {
    name: "Yogi Andhi Lestari, S.ST., M.Keb.",
    jabatan: "Wakil Rektor II",
    foto: "/images/pimpinan/warek2.png",
    pendidikan: [
      "D3 Kebidanan - Akademi Kebidanan Yogyakarta (2007)",
      "S1 Kebidanan - Universitas Gadjah Mada (2010)",
      "S2 Kesehatan Masyarakat - Universitas Diponegoro (2015)"
    ],
    karir: [
      "Bidan di Puskesmas Cilacap (2007-2012)",
      "Dosen Fakultas Ilmu Kesehatan UNAIC (2012-sekarang)",
      "Kepala Program Studi Kebidanan (2015-2020)",
      "Wakil Rektor II UNAIC (2020-sekarang)"
    ],
    penelitian: [
      "Program Pencegahan Stunting di Wilayah Pesisir",
      "Studi Kualitas Pelayanan Kesehatan Ibu dan Anak",
      "Pengembangan Model Asuhan Kebidanan Berbasis Budaya"
    ]
  },
  {
    name: "Agus Prasetyo, M.Kep., Ns.",
    jabatan: "Wakil Rektor III",
    foto: "/images/pimpinan/warek3.png",
    pendidikan: [
      "S1 Keperawatan - Universitas Indonesia (2009)",
      "S2 Keperawatan - Universitas Gadjah Mada (2013)",
      "S3 Manajemen Keperawatan - Universitas Airlangga (2018)"
    ],
    karir: [
      "Perawat di RSUP Dr. Sardjito (2009-2013)",
      "Dosen Fakultas Ilmu Kesehatan UNAIC (2013-sekarang)",
      "Kepala Program Studi Keperawatan (2016-2020)",
      "Wakil Rektor III UNAIC (2020-sekarang)"
    ],
    penelitian: [
      "Manajemen Risiko Keselamatan Pasien di Rumah Sakit",
      "Pengembangan Kompetensi Perawat Profesional",
      "Studi Efektivitas Program Pendidikan Berkelanjutan"
    ]
  }
];

export const dekanFakultasDetail: LeaderDetail[] = [
  {
    name: "Dr. Johariyah., M. Keb.",
    jabatan: "Dekan Fakultas Ilmu Kesehatan",
    foto: "/images/pimpinan/dekan1.png",
    pendidikan: [
      "S1 Kebidanan - Universitas Gadjah Mada (2006)",
      "S2 Kesehatan Reproduksi - Universitas Indonesia (2011)",
      "S3 Kesehatan Masyarakat - Universitas Diponegoro (2016)"
    ],
    karir: [
      "Bidan di RSUD Cilacap (2006-2011)",
      "Dosen Fakultas Ilmu Kesehatan UNAIC (2011-sekarang)",
      "Kepala Program Studi Kebidanan (2013-2018)",
      "Dekan Fakultas Ilmu Kesehatan UNAIC (2018-sekarang)"
    ],
    penelitian: [
      "Epidemiologi Kesehatan Reproduksi Remaja",
      "Program Kesehatan Sekolah di Daerah Terpencil",
      "Pengembangan Model Deteksi Dini Kanker Serviks"
    ]
  },
  {
    name: "Dr. apt. Yuhansyah Nurfauzi, M.Si.",
    jabatan: "Dekan Fakultas Farmasi, Sains & Teknologi",
    foto: "/images/pimpinan/dekan2.png",
    pendidikan: [
      "S1 Farmasi - Institut Teknologi Bandung (2007)",
      "S2 Kimia Farmasi - Universitas Indonesia (2012)",
      "S3 Farmakognosi - Universitas Gadjah Mada (2017)"
    ],
    karir: [
      "Peneliti di Balai Penelitian Tanaman Obat (2007-2012)",
      "Dosen Fakultas Farmasi UNAIC (2012-sekarang)",
      "Kepala Laboratorium Farmakognosi (2015-2018)",
      "Dekan Fakultas Farmasi, Sains & Teknologi UNAIC (2018-sekarang)"
    ],
    penelitian: [
      "Isolasi dan Identifikasi Senyawa Bioaktif dari Tanaman Obat",
      "Pengembangan Fitofarmaka untuk Penyakit Degeneratif",
      "Studi Etnofarmakologi Masyarakat Adat"
    ]
  },
  {
    name: "Dr Opi Irawansyah, M.PdI.",
    jabatan: "Dekan Fakultas Ekonomi & Bisnis",
    foto: "/images/pimpinan/dekan3.png",
    pendidikan: [
      "S1 Ekonomi Islam - Universitas Islam Indonesia (2008)",
      "S2 Ekonomi Syariah - Universitas Muhammadiyah Yogyakarta (2013)",
      "S3 Pendidikan Islam - Universitas Negeri Yogyakarta (2018)"
    ],
    karir: [
      "Pengajar di Madrasah Aliyah (2008-2013)",
      "Dosen Fakultas Ekonomi & Bisnis UNAIC (2013-sekarang)",
      "Kepala Program Studi Ekonomi Syariah (2015-2018)",
      "Dekan Fakultas Ekonomi & Bisnis UNAIC (2018-sekarang)"
    ],
    penelitian: [
      "Pengembangan Model Bisnis Syariah di Era Digital",
      "Studi Perilaku Konsumen Muslim Modern",
      "Implementasi Ekonomi Islam dalam Pembangunan Berkelanjutan"
    ]
  }
];
