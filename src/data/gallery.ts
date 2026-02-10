export interface GalleryItem {
    id: string;
    type: 'image' | 'video';
    src: string;
    category: 'Akademik' | 'Kemahasiswaan' | 'Fasilitas' | 'Event' | 'Semua';
    title: string;
    titleEn?: string;
    description?: string;
    descriptionEn?: string;
    date: string;
    featured?: boolean;
}

export const galleryItems: GalleryItem[] = [
    {
        id: '1',
        type: 'image',
        src: '/images/galeri/galeri1.jpg',
        category: 'Akademik',
        title: 'Kegiatan Belajar Mengajar',
        titleEn: 'Teaching and Learning Activities',
        description: 'Suasana pembelajaran interaktif di kelas modern UNAIC.',
        descriptionEn: 'Interactive learning atmosphere in modern UNAIC classrooms.',
        date: '2024-02-15',
        featured: true,
    },
    {
        id: '2',
        type: 'image',
        src: '/images/galeri/galeri2.jpg',
        category: 'Fasilitas',
        title: 'Laboratorium Keperawatan',
        titleEn: 'Nursing Laboratory',
        description: 'Fasilitas laboratorium lengkap untuk praktik mahasiswa.',
        descriptionEn: 'Complete laboratory facilities for student practice.',
        date: '2024-02-10',
    },
    {
        id: '3',
        type: 'image',
        src: '/images/galeri/galeri3.jpg',
        category: 'Kemahasiswaan',
        title: 'Kegiatan Organisasi Mahasiswa',
        titleEn: 'Student Organization Activities',
        description: 'Mahasiswa aktif berdiskusi dalam kegiatan himpunan.',
        descriptionEn: 'Students actively discussing in association activities.',
        date: '2024-01-20',
    },
    {
        id: '4',
        type: 'image',
        src: '/images/galeri/galeri4.jpg',
        category: 'Akademik',
        title: 'Seminar Nasional Kesehatan',
        titleEn: 'National Health Seminar',
        description: 'Menghadirkan pembicara ahli di bidang teknologi kesehatan.',
        descriptionEn: 'Presenting expert speakers in the field of health technology.',
        date: '2023-12-05',
        featured: true,
    },
    {
        id: '5',
        type: 'image',
        src: '/images/galeri/galeri5.jpg',
        category: 'Event',
        title: 'Wisuda Angkatan XVI',
        titleEn: 'Graduation Batch XVI',
        description: 'Momen sakral pelepasan wisudawan dan wisudawati UNAIC.',
        descriptionEn: 'Sacred moment of releasing UNAIC graduates.',
        date: '2023-11-15',
        featured: true,
    },
    {
        id: '6',
        type: 'image',
        src: '/images/galeri/galeri6.jpg',
        category: 'Kemahasiswaan',
        title: 'Bakti Sosial Masyarakat',
        titleEn: 'Community Social Service',
        description: 'Pengabdian mahasiswa kepada masyarakat sekitar Cilacap.',
        descriptionEn: 'Student dedication to the surrounding community of Cilacap.',
        date: '2023-10-28',
    },
    {
        id: '7',
        type: 'image',
        src: '/images/galeri/galeri7.jpg',
        category: 'Fasilitas',
        title: 'Perpustakaan Digital',
        titleEn: 'Digital Library',
        description: 'Akses ribuan koleksi buku dan jurnal internasional.',
        descriptionEn: 'Access thousands of book collections and international journals.',
        date: '2023-09-10',
    },
    {
        id: '8',
        type: 'image',
        src: '/images/galeri/galeri8.jpg',
        category: 'Event',
        title: 'Pekan Olahraga Kampus',
        titleEn: 'Campus Sports Week',
        description: 'Kompetisi futsal antar fakultas yang meriah.',
        descriptionEn: 'Lively inter-faculty futsal competition.',
        date: '2023-08-17',
    },
];

export const galleryCategories = ['Semua', 'Akademik', 'Kemahasiswaan', 'Fasilitas', 'Event'];
