"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, Linkedin } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariantsLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const itemVariantsRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const contactItems = [
  {
    icon: <MapPin className="h-5 w-5" />,
    label: "Jl. Jend. Sudirman No. 123, Cilacap",
    textSize: "text-lg",
  },
  {
    icon: <Phone className="h-5 w-5" />,
    label: "+62 812-3456-7890",
    textSize: "text-base",
  },
  {
    icon: <Mail className="h-5 w-5" />,
    label: "info@unaic.ac.id",
    textSize: "text-lg",
  },
  {
    icon: <Clock className="h-5 w-5" />,
    label: "Senin - Jumat, 08.00 - 16.00",
    textSize: "text-base",
  },
];

const socialIcons = [
  { icon: <Facebook className="h-5 w-5" />, link: "https://facebook.com/unaic" },
  { icon: <Instagram className="h-5 w-5" />, link: "https://instagram.com/unaic" },
  { icon: <Youtube className="h-5 w-5" />, link: "https://youtube.com/unaic" },
  { icon: <Linkedin className="h-5 w-5" />, link: "https://linkedin.com/company/unaic" },
];

export default function Contact() {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}
        >
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-unaicNavy">
            Kontak & Lokasi UNAIC
          </h2>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Hubungi kami atau kunjungi kampus Universitas Al-Irsyad Cilacap.
          </p>
        </motion.div>
        <motion.div
          className="grid md:grid-cols-2 gap-12 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariantsLeft}>
            <div className="bg-white rounded-2xl shadow-lg border-l-4 border-unaicGold p-8">
              {contactItems.map(({ icon, label, textSize }, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 text-gray-700 hover:text-unaicGold transition cursor-pointer"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex-shrink-0 rounded-full bg-unaicNavy p-2 text-white hover:bg-unaicGold hover:text-unaicNavy transition-all duration-300"
                  >
                    {icon}
                  </motion.div>
                  <span className={`${textSize} self-center`}>{label}</span>
                </div>
              ))}
              <div className="flex items-center gap-4 pt-6 mt-6 border-t">
                {socialIcons.map(({ icon, link }, idx) => (
                  <motion.a
                    key={idx}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    className="rounded-full bg-unaicNavy p-3 text-white hover:bg-unaicGold hover:text-unaicNavy transition-all duration-300"
                  >
                    {icon}
                  </motion.a>
                ))}
              </div>

              {/* Contact Form */}
              <form className="mt-8 space-y-4">
                <h3 className="text-xl font-semibold text-unaicNavy">Kirim Pesan Cepat</h3>
                <div>
                  <label htmlFor="name" className="sr-only">Nama</label>
                  <input type="text" name="name" id="name" className="w-full rounded-md border-gray-300 shadow-sm focus:border-unaicGold focus:ring-unaicGold" placeholder="Nama Anda" required />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input type="email" name="email" id="email" className="w-full rounded-md border-gray-300 shadow-sm focus:border-unaicGold focus:ring-unaicGold" placeholder="Email Anda" required />
                </div>
                <div>
                  <label htmlFor="message" className="sr-only">Pesan</label>
                  <textarea name="message" id="message" rows={4} className="w-full rounded-md border-gray-300 shadow-sm focus:border-unaicGold focus:ring-unaicGold" placeholder="Pesan Anda" required></textarea>
                </div>
                <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-unaicNavy text-white px-6 py-3 rounded-lg shadow-lg hover:bg-unaicGold hover:text-unaicNavy transition-all duration-300 transform hover:scale-105">
                  <Mail className="h-5 w-5" />
                  Kirim Pesan
                </button>
              </form>
            </div>
          </motion.div>
          <motion.div variants={itemVariantsRight}>
            <motion.iframe
              whileHover={{ scale: 1.05 }}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.1234567890123!2d109.0123456789!3d-7.716123456789012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e655f1234567890%3A0x123456789abcdef!2sUniversitas%20Al-Irsyad%20Cilacap!5e0!3m2!1sen!2sid!4v1234567890123!5m2!1sen!2sid"
              className="w-full h-80 md:h-full rounded-xl shadow-md transition-transform duration-300"
              allowFullScreen
              loading="lazy"
              title="UNAIC Cilacap Location"
              referrerPolicy="no-referrer-when-downgrade"
            ></motion.iframe>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
