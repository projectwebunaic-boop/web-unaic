"use client";

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Tampilkan tombol ketika halaman digulir ke bawah
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Tambahkan event listener saat komponen dimuat dan hapus saat dilepas
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Fungsi untuk menggulir ke atas halaman
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  // Posisi: Kanan Bawah (Paling Bawah)
  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-4 right-4 z-40 p-2 md:p-3 rounded-full bg-unaicNavy/80 backdrop-blur-sm text-white border border-unaicGold/70 shadow-lg hover:bg-unaicGold hover:text-unaicNavy transition-all duration-300 hover:scale-110 md:bottom-6 md:right-6 md:border-2 md:bg-unaicNavy"
      aria-label="Kembali ke atas"
    >
      <ArrowUp size={20} className="md:w-6 md:h-6" />
    </button>
  );
}