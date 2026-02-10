'use client';

import { Link } from '@/i18n/routing';
import { Mail, MapPin, Phone } from 'lucide-react';
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok, FaLink } from 'react-icons/fa';

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="bg-unaicNavy text-white">
      {/* Quick Links Section */}
      <div className="container mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Kolom 1: Tentang UNAIC */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4 text-unaicGold">Universitas Al-Irsyad Cilacap (UNAIC)</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              {t('description')}
            </p>
          </div>

          {/* Kolom 2: Akses Cepat */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4 text-unaicGold">{t('quickLinks')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/pmb" className="hover:text-unaicGold transition-colors">{t('links.pmb')}</Link></li>
              <li><Link href="/tentang/mitra" className="hover:text-unaicGold transition-colors">{t('links.mitra')}</Link></li>
              <li><Link href="/alumni-karir" className="hover:text-unaicGold transition-colors">{t('links.career')}</Link></li>
              <li><Link href="/galeri" className="hover:text-unaicGold transition-colors">{t('links.gallery')}</Link></li>
            </ul>
          </div>

          {/* Kolom 3: Layanan & Informasi */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4 text-unaicGold">{t('services')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/layanan-aduan" className="hover:text-unaicGold transition-colors">{t('links.complaints')}</Link></li>
              <li><Link href="/jelajah-kampus" className="hover:text-unaicGold transition-colors">{t('links.explore')}</Link></li>
              <li><Link href="/faq" className="hover:text-unaicGold transition-colors">{t('links.faq')}</Link></li>
              <li><Link href="/kontak" className="hover:text-unaicGold transition-colors">{t('links.contact')}</Link></li>
            </ul>
          </div>

          {/* Kolom 3: Kontak & Lokasi */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4 text-unaicGold">{t('contact')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-unaicGold transition-colors flex items-start gap-3"><MapPin size={16} className="mt-1 text-unaicGold flex-shrink-0" />Jl. Cerme No.24, Wanasari, Sidanegara, Kec. Cilacap Tengah, Kabupaten Cilacap, Jawa Tengah 53223</Link></li>
              <li><a href="mailto:pmb.unaic@universitasalirsyad.ac.id" className="hover:text-unaicGold transition-colors flex items-center gap-3"><Mail size={16} className="text-unaicGold flex-shrink-0" />pmb.unaic@universitasalirsyad.ac.id</a></li>
              <li><a href="tel:+6288905905905" className="hover:text-unaicGold transition-colors flex items-center gap-3"><Phone size={16} className="text-unaicGold flex-shrink-0" />088905905905</a></li>
            </ul>
          </div>

          {/* Kolom 4: Ikuti Kami */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4 text-unaicGold">{t('followUs')}</h3>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/universitas.alirsyad.7" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white hover:text-unaicGold transition-colors"><FaFacebook size={24} /></a>
              <a href="https://www.instagram.com/pmb_unaic?igsh=cWs1aXpkNW1xaXFy" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white hover:text-unaicGold transition-colors"><FaInstagram size={24} /></a>
              <a href="https://youtube.com/@universitasalirsyad?feature=shared" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-white hover:text-unaicGold transition-colors"><FaYoutube size={24} /></a>
              <a href="https://www.tiktok.com/@univalirsyad?_t=ZS-90ku92VFoij&_r=1" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-white hover:text-unaicGold transition-colors"><FaTiktok size={24} /></a>
              <a href="https://linktr.ee/unaicofficial" target="_blank" rel="noopener noreferrer" aria-label="Linktree" className="text-white hover:text-unaicGold transition-colors"><FaLink size={24} /></a>
            </div>
          </div>
        </div>

        {/* Lokasi Kampus Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <h3 className="font-heading text-2xl font-semibold mb-6 text-unaicGold text-center">{t('location')}</h3>

          <div className="max-w-4xl mx-auto">
            {/* Google Maps Embed */}
            <div className="mb-6">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.724802320238!2d109.01627601087732!3d-7.712649976375444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6512bf1e8d045b%3A0x3198d942ee271d20!2sUniversitas%20Al-Irsyad%20Cilacap%20(UNAIC)!5e0!3m2!1sen!2sid!4v1758526679425!5m2!1sen!2sid"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg shadow-md w-full max-w-[600px] mx-auto block"
                title={`Google Maps ${t('location')}`}
              />
            </div>

            {/* Button Lihat Arah */}
            <div className="text-center">
              <a
                href="https://goo.gl/maps/jDXM2P8VqPSX2Z4u8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-unaicNavy text-white rounded-lg shadow hover:bg-unaicGold transition"
              >
                <MapPin size={18} />
                <span>{t('viewDirections')}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
          <p className="text-sm text-gray-400 mb-4 sm:mb-0">
            &copy; {new Date().getFullYear()} Universitas UNAIC. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
