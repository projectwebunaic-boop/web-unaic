import { TuitionFaculty } from "@/types/tuition";

export const tuitionData: TuitionFaculty[] = [
    {
        id: "fikes",
        name: "Fakultas Ilmu Kesehatan",
        categories: [
            {
                name: "Program Reguler",
                commonNote: "Biaya sudah termasuk biaya kuliah, praktikum, ujian UTS dan UAS, dan Praktik Kerja Lapangan (PKL) Kecuali Administrasi Praktik RS",
                programs: [
                    {
                        name: "S1 Keperawatan",
                        fees: [
                            { label: "APP Tiap Bulan", amount: "Rp. 1.500.000" },
                            { label: "Registrasi Awal Semester 1", amount: "Rp. 10.150.000" },
                        ],
                    },
                    {
                        name: "S1 Kebidanan",
                        fees: [
                            { label: "APP Tiap Bulan", amount: "Rp. 1.250.000" },
                            { label: "Registrasi Awal Semester 1", amount: "Rp. 8.305.000" },
                        ],
                    },
                    {
                        name: "S1 Fisioterapi",
                        fees: [
                            { label: "APP Tiap Bulan", amount: "Rp. 1.250.000" },
                            { label: "Registrasi Awal Semester 1", amount: "Rp. 8.305.000" },
                        ],
                    },
                    {
                        name: "D3 Keperawatan",
                        fees: [
                            { label: "APP Tiap Bulan", amount: "Rp. 1.250.000" },
                            { label: "Registrasi Awal Semester 1", amount: "Rp. 8.725.000" },
                        ],
                    },
                ],
            },
            {
                name: "Program Reguler Profesi",
                commonNote: "Biaya sudah termasuk biaya kuliah, praktikum, ujian UTS dan UAS, Praktik Klinik dan Praktik Kerja Lapangan (PKL)",
                programs: [
                    {
                        name: "Profesi Ners (Alumni)",
                        fees: [
                            { label: "Registrasi Awal Semester 1", amount: "Rp. 5.400.000" },
                        ],
                    },
                    {
                        name: "Profesi Ners (Non Alumni)",
                        fees: [
                            { label: "Registrasi Awal Semester 1", amount: "Rp. 6.000.000" },
                        ],
                    },
                    {
                        name: "Profesi Bidan (Alumni)",
                        fees: [
                            { label: "Registrasi Awal Semester 1", amount: "Rp. 5.400.000" },
                        ],
                    },
                    {
                        name: "Profesi Bidan (Non Alumni)",
                        fees: [
                            { label: "Registrasi Awal Semester 1", amount: "Rp. 6.000.000" },
                        ],
                    },
                ],
            },
            {
                name: "Program RPL & Kelas Karyawan",
                commonNote: "Biaya sudah termasuk biaya kuliah, praktikum, ujian UTS dan UAS, Praktik Klinik dan Praktik Kerja Lapangan (PKL)",
                programs: [
                    {
                        name: "S1 Keperawatan RPL",
                        fees: [
                            { label: "APP Tiap Bulan", amount: "Rp. 1.500.000" },
                            { label: "Registrasi Awal Semester 1", amount: "Rp. 7.400.000" },
                        ],
                    },
                    {
                        name: "S1 Kebidanan RPL",
                        fees: [
                            { label: "APP Tiap Bulan", amount: "Rp. 1.500.000" },
                            { label: "Registrasi Awal Semester 1", amount: "Rp. 7.400.000" },
                        ],
                    },
                    {
                        name: "Profesi Ners Kelas Karyawan",
                        fees: [
                            { label: "APP Tiap Bulan", amount: "Rp. 1.500.000" },
                            { label: "Registrasi Awal Semester 1", amount: "Rp. 8.500.000" },
                        ],
                    },
                    {
                        name: "Profesi Bidan Kelas Karyawan",
                        fees: [
                            { label: "APP Tiap Bulan", amount: "Rp. 1.550.000" },
                            { label: "Registrasi Awal Semester 1", amount: "Rp. 7.550.000" },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: "ffst",
        name: "Fakultas Farmasi, Sains dan Teknologi",
        categories: [
            {
                name: "Program Reguler",
                commonNote: "Biaya sudah termasuk biaya kuliah, praktikum, ujian UTS dan UAS, dan Praktik Kerja Lapangan (PKL) Kecuali Administrasi Praktik RS",
                programs: [
                    {
                        name: "S1 Farmasi",
                        fees: [
                            { label: "APP Tiap Bulan", amount: "Rp. 1.500.000" },
                            { label: "Registrasi Awal Semester 1", amount: "Rp. 10.550.000" },
                        ],
                    },
                    {
                        name: "S1 Informatika",
                        fees: [
                            { label: "APP Tiap Bulan", amount: "Rp. 700.000" },
                            { label: "Registrasi Awal Semester 1", amount: "Rp. 4.300.000" },
                        ],
                    },
                    {
                        name: "D3 Farmasi",
                        fees: [
                            { label: "APP Tiap Bulan", amount: "Rp. 1.250.000" },
                            { label: "Registrasi Awal Semester 1", amount: "Rp. 9.725.000" },
                        ],
                    },
                    {
                        name: "D4 Teknologi Lab Medis",
                        fees: [
                            { label: "APP Tiap Bulan", amount: "Rp. 1.300.000" },
                            { label: "Registrasi Awal Semester 1", amount: "Rp. 9.080.000" },
                        ],
                    },
                ],
            },
            {
                name: "Program Reguler Profesi",
                commonNote: "Biaya sudah termasuk biaya kuliah, praktikum, ujian UTS dan UAS, dan PKPA Sampai Selesai",
                programs: [
                    {
                        name: "Profesi Apoteker (Alumni)",
                        fees: [
                            { label: "APP Paket", amount: "Rp. 41.000.000" },
                            { label: "Pembayaran Tahap 1", amount: "Rp. 15.000.000" },
                        ],
                    },
                    {
                        name: "Profesi Apoteker (Non Alumni)",
                        fees: [
                            { label: "APP Paket", amount: "Rp. 59.000.000" },
                            { label: "Pembayaran Tahap 1", amount: "Rp. 21.300.000" },
                        ],
                    },
                ],
            },
            {
                name: "Program Rekognisi Pembelajaran Lampau (RPL)",
                commonNote: "Biaya sudah termasuk biaya kuliah, praktikum, ujian UTS dan UAS, dan Praktik Kerja Lapangan (PKL)",
                programs: [
                    {
                        name: "S1 Farmasi RPL",
                        fees: [
                            { label: "APP Tiap Bulan", amount: "Rp. 1.500.000" },
                            { label: "Registrasi Awal Semester 1", amount: "Rp. 6.100.000" },
                        ],
                    },
                    {
                        name: "D4 Teknologi Lab Medis",
                        fees: [
                            { label: "APP Tiap Bulan", amount: "Rp. 1.500.000" },
                            { label: "Registrasi Awal Semester 1", amount: "Rp. 6.900.000" },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: "feb",
        name: "Fakultas Ekonomi dan Bisnis",
        categories: [
            {
                name: "Program Reguler",
                commonNote: "Biaya sudah termasuk biaya kuliah, praktikum, ujian UTS dan UAS, dan Praktik Kerja Lapangan (PKL)",
                programs: [
                    {
                        name: "S1 Kewirausahaan",
                        fees: [
                            { label: "APP Tiap Bulan", amount: "Rp. 750.000" },
                            { label: "Registrasi Awal Semester 1", amount: "Rp. 4.300.000" },
                        ],
                    },
                    {
                        name: "S1 Bisnis Digital",
                        fees: [
                            { label: "APP Tiap Bulan", amount: "Rp. 750.000" },
                            { label: "Registrasi Awal Semester 1", amount: "Rp. 4.300.000" },
                        ],
                    },
                ],
            },
            {
                name: "Program Pembelajaran Jarak Jauh (PJJ)",
                commonNote: "Biaya sudah termasuk biaya kuliah, praktikum, ujian UTS dan UAS, dan Praktik Kerja Lapangan (PKL)",
                programs: [
                    {
                        name: "S1 Kewirausahaan",
                        fees: [
                            { label: "Registrasi Awal Semester 1", amount: "Rp. 1.750.000" },
                        ],
                    },
                    {
                        name: "S1 Bisnis Digital",
                        fees: [
                            { label: "Registrasi Awal Semester 1", amount: "Rp. 1.750.000" },
                        ],
                    },
                ],
            },
        ],
    },
];

export const getAllTuitionData = () => tuitionData;
