// === KNOWLEDGE BASE CHATBOT UNAIC ===
// File ini berisi database pertanyaan dan jawaban untuk Chatbot.
// Untuk menambah pengetahuan baru, cukup tambahkan objek baru ke dalam array 'chatbotData'.

export interface ChatbotEntry {
    keywords: string[]; // Kata kunci pemicu (huruf kecil semua)
    response: string;   // Jawaban bot (bisa pakai format Markdown: **tebal**, \n untuk baris baru)
}

export const chatbotData: ChatbotEntry[] = [
    // --- A. GREATING & MENU ---
    {
        keywords: ['halo', 'hi', 'hai', 'pagi', 'siang', 'sore', 'malam', 'assalamualaikum', 'permisi', 'menu', 'bantuan', 'help'],
        response: "👋 **Selamat Datang di Layanan UNAIC!**\n\nSaya Asisten Virtual siap membantu Anda. Silakan pilih topik atau ketik pertanyaan langsung:\n\n1️⃣ **Pendaftaran** (Ketik: 'Cara daftar', 'Biaya', 'Syarat')\n2️⃣ **Prodi & Fakultas** (Ketik: 'Prodi Farmasi', 'Fakultas Kesehatan')\n3️⃣ **Fasilitas & Kampus** (Ketik: 'Fasilitas', 'Lokasi', 'Asrama')\n4️⃣ **Mahasiswa & Beasiswa** (Ketik: 'Beasiswa', 'UKM', 'Prestasi')\n5️⃣ **Kontak** (Ketik: 'Hubungi', 'Alamat')\n\nApa yang ingin Anda ketahui? 😊"
    },

    // --- B. PENDAFTARAN & PMB ---
    {
        keywords: ['daftar', 'pendaftaran', 'pmb', 'masuk', 'regis', 'jalur masuk'],
        response: "🎓 **Informasi Pendaftaran Mahasiswa Baru (PMB)**\n\nSilakan mendaftar melalui portal resmi kami:\n👉 **https://pmb.universitasalirsyad.ac.id**\n\n**Jalur Pendaftaran:**\n1. **Jalur Reguler**: Seleksi menggunakan nilai rapor/tes.\n2. **Jalur Prestasi**: Tanpa tes bagi siswa berprestasi (Akademik/Non-Akademik).\n3. **Jalur Beasiswa KIP-K**: Untuk pendaftar dengan KIP-K kuliah.\n\nButuh panduan langkah-langkahnya?"
    },
    {
        keywords: ['syarat', 'persyaratan', 'berkas'],
        response: "📄 **Persyaratan Umum Pendaftaran:**\n1. Scan Ijazah/SKL SMA/SMK/MA sederajat.\n2. Scan Kartu Keluarga (KK) & KTP.\n3. Pas Foto terbaru background merah/biru.\n4. Bukti pembayaran biaya pendaftaran.\n\nUntuk syarat khusus (seperti tinggi badan prodi kesehatan), silakan unduh brosur di website PMB."
    },
    {
        keywords: ['biaya', 'uang gedung', 'spp', 'ukt', 'harga', 'mahal'],
        response: "💰 **Informasi Biaya Kuliah**\n\nUNAIC menawarkan biaya pendidikan yang terjangkau dan kompetitif dengan skema pembayaran yang fleksibel (bisa diangsur).\n\nBiaya berbeda tiap Prodi dan Gelombang. Untuk estimasi lengkap, silakan unduh **Rincian Biaya** di website PMB kami atau hubungi Admin Keuangan: (0282) 532975."
    },

    // --- C. FAKULTAS, PRODI & PROSPEK ---
    // 1. Ilmu Kesehatan
    {
        keywords: ['keperawatan', 'perawat', 'ners'],
        response: "🏥 **Prodi Keperawatan (D3, S1, Profesi Ners)**\n\nUnggulan UNAIC! Kurikulum berbasis standar internasional dengan praktik di RS ternama.\n**Prospek Karir:** Perawat di RS (DN/LN), Home Care, Safety Officer, Peneliti Kesehatan.\n**Fasilitas:** Lab Keperawatan Mini Hospital yang lengkap."
    },
    {
        keywords: ['kebidanan', 'bidan'],
        response: "🤰 **Prodi Kebidanan (D3, S1, Profesi Bidan)**\n\nMenghasilkan bidan yang kompeten, islami, dan siap praktik mandiri. Fokus pada kesehatan ibu & anak (KIA) dan _Complementary Therapy_."
    },
    {
        keywords: ['fisioterapi', 'fisio'],
        response: "💪 **S1 Fisioterapi**\n\nIlmu yang mempelajari pemulihan gerak tubuh. Sangat dibutuhkan di RS, Klinik Olahraga, dan Pusat Rehabilitasi. UNAIC memiliki klinik fisioterapi mandiri untuk praktik mahasiswa."
    },
    // 2. Farmasi & Sains
    {
        keywords: ['farmasi', 'apoteker', 'obat'],
        response: "💊 **Farmasi (D3, S1, Profesi Apoteker)**\n\nFokus pada pengembangan obat herbal dan pelayanan farmasi klinis. Lulusan terserap di Industri Farmasi, BPOM, Apotek, dan RS."
    },
    {
        keywords: ['tlm', 'analis kesehatan', 'lab medis'],
        response: "🔬 **D4 Teknologi Laboratorium Medis (TLM)**\n\nProdi Vokasi Sarjana Terapan. Ahli dalam pemeriksaan sampel laboratorium untuk diagnosa penyakit. Karir menjanjikan di Laboratorium Klinik (Prodia/Pramita) dan RS."
    },
    {
        keywords: ['informatika', 'it', 'komputer', 'sistem informasi'],
        response: "💻 **S1 Informatika**\n\nMempelajari Software Engineering, AI, dan IoT khususnya di bidang kesehatan (Health Informatics).\n**Prospek:** Software Developer, Data Analyst, IT Consultant, Startup Founder."
    },
    // 3. Ekonomi Bisnis
    {
        keywords: ['bisnis digital', 'digital business'],
        response: "📈 **S1 Bisnis Digital**\n\nPerpaduan ilmu Manajemen Bisnis dan Teknologi. Mencetak lulusan yang siap menjadi Manajer E-Commerce, Digital Marketer, dan Wirausahawan Digital."
    },
    {
        keywords: ['kewirausahaan', 'entrepreneur'],
        response: "🚀 **S1 Kewirausahaan**\n\nFokus membentuk karakter pengusaha. Mahasiswa didampingi membuat bisnis rintisan (Startup) sejak kuliah. Cocok untuk Anda yang ingin jadi CEO muda!"
    },

    // --- D. FASILITAS & KEHIDUPAN KAMPUS ---
    {
        keywords: ['fasilitas', 'gedung', 'lab', 'perpustakaan'],
        response: "🏢 **Fasilitas Kampus UNAIC:**\n\n- **Gedung Perkuliahan** Representatif (AC & Multimedia).\n- **Laboratorium Lengkap**: Lab Komputer, Lab Bahasa, Mini Hospital, Lab Farmasi.\n- **Perpustakaan Digital** dengan ribuan e-book.\n- **Masjid Kampus** yang nyaman.\n- **Free Wi-Fi** di seluruh area kampus.\n- **Sport Center** & Kantin Sehat."
    },
    {
        keywords: ['asrama', 'kos', 'tempat tinggal'],
        response: "🏠 **Asrama Mahasiswa (Ma'had)**\n\nKami menyediakan asrama khusus putri dan putra yang berada di lingkungan kampus. Sangat direkomendasikan untuk mahasiswa baru agar lebih fokus belajar dan bersosialisasi."
    },
    {
        keywords: ['lokasi', 'alamat', 'peta', 'dimana'],
        response: "📍 **Lokasi Strategis**\n\nKampus Pusat UNAIC:\nJl. Cerme No. 24, Sidanegara, Cilacap Tengah, Kab. Cilacap, Jawa Tengah 53223.\n\nLokasi mudah dijangkau transportasi umum, dekat dengan Terminal Bus Cilacap dan Alun-Alun."
    },

    // --- E. KEMAHASISWAAN (Beasiswa & UKM) ---
    {
        keywords: ['beasiswa', 'kip', 'potongan biaya'],
        response: "🎓 **Program Beasiswa UNAIC**\n\nKami menyediakan berbagai beasiswa:\n1. **KIP-Kuliah** (Pemerintah)\n2. **Beasiswa Yayasan** (Untuk Hafidz Quran & Prestasi)\n3. **Beasiswa Mitra** (Perusahaan/Lazis)\n\nPantau info beasiswa terbaru di Instagram @unaic_official atau website kemahasiswaan."
    },
    {
        keywords: ['ukm', 'organisasi', 'kegiatan', 'ekskul'],
        response: "🏆 **Kegiatan Mahasiswa (UKM)**\n\nKembangkan bakatmu di UNAIC! Ada banyak UKM:\n- **Olahraga**: Futsal, Voli, Badminton.\n- **Seni**: Paduan Suara, Tari.\n- **Religi**: LDK (Lembaga Dakwah Kampus).\n- **Khusus**: Mapala (Pecinta Alam), PMI/KSR.\n\nMahasiswa UNAIC aktif dan berprestasi!"
    },

    // --- F. TENTANG & LAINNYA ---
    {
        keywords: ['akreditasi', 'bagus', 'peringkat'],
        response: "✅ **Akreditasi Institusi: BAIK SEKALI**\n\nMayoritas Prodi kami terakreditasi **B** dan **Baik Sekali**. Kami berkomitmen menjaga mutu pendidikan sesuai standar nasional (BAN-PT & LAM-PTKes)."
    },
    {
        keywords: ['sejarah', 'visi', 'misi', 'profil'],
        response: "📜 **Sekilas UNAIC**\n\nUniversitas Al-Irsyad Cilacap (UNAIC) adalah transformasi dari STIKES Al-Irsyad. Di bawah naungan Yayasan Sosial Al-Irsyad, kami berkomitmen mencetak lulusan yang **“Unggul, Islami, dan Terpercaya”**. Kami terus berkembang menjadi pusat pendidikan tinggi kesehatan dan teknologi terbaik di Jawa Tengah Selatan."
    }
];
