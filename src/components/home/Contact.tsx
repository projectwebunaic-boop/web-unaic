"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, Linkedin, MessageCircle, Twitter, Globe, MessageSquare, GraduationCap, Users, Building2 } from "lucide-react";
import { useState, useEffect } from "react";
import SectionTitle from "@/components/shared/SectionTitle";
import { useTranslations, useLocale } from "next-intl";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariantsLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
};

const itemVariantsRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
};

interface SocialMedia {
  name: string;
  url: string;
}

interface Department {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  email: string;
  phone: string;
  head: string;
}

interface ContactData {
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  operationalHours: string;
  operationalHoursEn: string;
  mapsUrl: string;
  socialMedia: SocialMedia[];
  departments: Department[];
}

export default function Contact() {
  const t = useTranslations("Contact");
  const locale = useLocale();
  const isEn = locale === 'en';
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [contactData, setContactData] = useState<ContactData | null>(null);

  useEffect(() => {
    fetch('/api/admin/contacts')
      .then(res => res.json())
      .then(data => setContactData(data))
      .catch(err => console.error("Failed to fetch contact data", err));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedMessage = isEn
      ? `Hello Admin PMB UNAIC 👋\n\nI want to contact you via the UNAIC website form.\n\nName: ${formData.name}\nEmail: ${formData.email}\nMessage:\n${formData.message}\n\nThank you.`
      : `Halo Admin PMB UNAIC 👋\n\nSaya ingin menghubungi melalui form website UNAIC.\n\nNama: ${formData.name}\nEmail: ${formData.email}\nPesan:\n${formData.message}\n\nTerima kasih.`;
    const encodedMessage = encodeURIComponent(formattedMessage);
    const whatsappNumber = contactData?.whatsapp || "6288905905905";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
  };

  const getSocialIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('facebook')) return <Facebook className="w-5 h-5" />;
    if (lower.includes('twitter')) return <Twitter className="w-5 h-5" />;
    if (lower.includes('instagram')) return <Instagram className="w-5 h-5" />;
    if (lower.includes('youtube')) return <Youtube className="w-5 h-5" />;
    if (lower.includes('linkedin')) return <Linkedin className="w-5 h-5" />;
    return <Globe className="w-5 h-5" />;
  };

  if (!contactData) return null; // Or a loading skeleton

  const contactItems = [
    {
      icon: <MapPin className="w-5 h-5" />,
      label: contactData.address,
      link: contactData.mapsUrl ? "https://maps.google.com/?q=" + encodeURIComponent(contactData.address) : null,
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: contactData.phone,
      link: `tel:${contactData.phone}`,
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: contactData.email,
      link: `mailto:${contactData.email}`,
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: isEn ? contactData.operationalHoursEn : contactData.operationalHours,
      link: null,
    },
  ];

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionTitle
          title={t('form.title')}
          subtitle={t('form.subtitle')}
          description={t('form.desc')}
        />

        <motion.div
          className="grid md:grid-cols-2 gap-12 items-start mt-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {/* Contact Info & Form */}
          <motion.div variants={itemVariantsLeft} className="flex flex-col gap-8">
            {/* Info Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-unaicNavy mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-unaicGold rounded-full"></span>
                {t('form.infoTitle')}
              </h3>
              <div className="space-y-5">
                {contactItems.map(({ icon, label, link }, idx) => (
                  <div key={idx} className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-unaicNavy/5 text-unaicNavy flex items-center justify-center flex-shrink-0">
                      {icon}
                    </div>
                    {link ? (
                      <a
                        href={link}
                        target={link.startsWith('http') ? '_blank' : undefined}
                        className="text-gray-600 hover:text-unaicGold transition-colors duration-300 text-sm leading-relaxed mt-1"
                      >
                        {label}
                      </a>
                    ) : (
                      <p className="text-gray-600 text-sm leading-relaxed mt-1">
                        {label}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Social Icons */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100 flex-wrap">
                {contactData.socialMedia.map((sm, idx) => (
                  <a
                    key={idx}
                    href={sm.url}
                    target="_blank"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-unaicNavy text-white hover:bg-unaicGold hover:text-unaicNavy transition-all duration-300 shadow-md hover:scale-110"
                    title={sm.name}
                  >
                    {getSocialIcon(sm.name)}
                  </a>
                ))}
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-gradient-to-br from-unaicNavy to-[#001F54] rounded-2xl shadow-xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">{t('form.fastHelpTitle')}</h3>
              <p className="text-blue-100 text-sm mb-6">{t('form.fastHelpDesc')}</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder={t('form.placeholderName')}
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 placeholder-blue-200 focus:outline-none focus:bg-white/20 transition-colors"
                />
                <button type="submit" className="w-full bg-unaicGold text-unaicNavy font-bold py-3 rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2">
                  <MessageCircle size={18} />
                  {t('form.submitWhatsapp')}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div variants={itemVariantsRight} className="h-full min-h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform hover:scale-[1.01] transition-transform duration-500">
            <iframe
              src={contactData.mapsUrl}
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ filter: "grayscale(10%) contrast(1.1)" }}
            />
          </motion.div>
        </motion.div>

        {/* Departments Section */}
        {contactData.departments.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
            className="mt-24"
          >
            <SectionTitle
              title={isEn ? "Contact Related Departments" : "Hubungi Bagian Terkait"}
              subtitle={isEn ? "Specific Information" : "Informasi Spesifik"}
              description={isEn ? "Contact the relevant department for more specific information according to your needs." : "Hubungi bagian terkait untuk informasi yang lebih spesifik sesuai kebutuhan Anda."}
              className="mb-12"
              align="center"
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {contactData.departments.map((dept) => (
                <motion.div
                  key={dept.id}
                  variants={itemVariantsLeft}
                  className="group bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100/50 hover:shadow-xl hover:bg-white transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-unaicNavy to-blue-600 text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Building2 size={28} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-xl text-unaicNavy mb-2">
                        {isEn ? (dept.nameEn || dept.name) : dept.name}
                      </h4>
                      <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                        {isEn ? (dept.descriptionEn || dept.description) : dept.description}
                      </p>

                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3 text-gray-700 p-2 rounded-lg bg-gray-50 group-hover:bg-blue-50/50 transition-colors">
                          <Users size={18} className="text-unaicGold" />
                          <span className="font-semibold">{dept.head}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700 hover:text-unaicNavy transition-colors group/link cursor-pointer">
                          <Mail size={18} className="text-unaicGold" />
                          <a href={`mailto:${dept.email}`} className="font-medium group-hover/link:underline">{dept.email}</a>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700 hover:text-unaicNavy transition-colors group/link cursor-pointer">
                          <Phone size={18} className="text-unaicGold" />
                          <a href={`tel:${dept.phone}`} className="font-medium group-hover/link:underline">{dept.phone}</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}
