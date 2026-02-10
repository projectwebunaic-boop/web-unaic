"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, UploadCloud, Building2, User, Mail, Phone, FileText } from "lucide-react";

export default function PartnershipForm() {
    const [formData, setFormData] = useState({
        institutionName: "",
        category: "Instansi Pemerintah",
        contactPerson: "",
        email: "",
        phone: "",
        intent: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API Call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            // Reset form after 3 seconds or keep success state
        }, 2000);
    };

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-100 rounded-2xl p-12 text-center"
            >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Pengajuan Berhasil!</h3>
                <p className="text-gray-600 max-w-lg mx-auto mb-8">
                    Terima kasih telah mengajukan permohonan kerjasama. Tim Humas & Kerjasama UNAIC akan meninjau data Anda dan menghubungi via email dalam waktu 2x24 jam.
                </p>
                <div className="bg-white p-4 rounded-lg border border-green-200 inline-block text-sm text-gray-500">
                    Nomor Tiket: <span className="font-mono font-bold text-gray-800">REQ-{Math.floor(Math.random() * 10000)}</span>
                </div>
                <div className="mt-8">
                    <button
                        onClick={() => { setIsSuccess(false); setFormData({ institutionName: "", category: "Instansi Pemerintah", contactPerson: "", email: "", phone: "", intent: "" }); }}
                        className="text-green-700 font-semibold hover:underline"
                    >
                        Ajukan Kerjasama Lain
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Nama Instansi */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-unaicBlue" /> Nama Instansi
                    </label>
                    <input
                        type="text"
                        name="institutionName"
                        required
                        value={formData.institutionName}
                        onChange={handleChange}
                        placeholder="Contoh: PT. Pertamina / Dinas Kesehatan"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-unaicBlue focus:ring-2 focus:ring-unaicBlue/20 outline-none transition-all"
                    />
                </div>

                {/* Kategori */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-unaicBlue" /> Kategori Instansi
                    </label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-unaicBlue focus:ring-2 focus:ring-unaicBlue/20 outline-none transition-all bg-white"
                    >
                        <option>Instansi Pemerintah</option>
                        <option>Perusahaan Swasta / Industri</option>
                        <option>Rumah Sakit / Faskes</option>
                        <option>Perguruan Tinggi Lain</option>
                        <option>NGO / Yayasan</option>
                        <option>Lainnya</option>
                    </select>
                </div>

                {/* Contact Person */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <User className="w-4 h-4 text-unaicBlue" /> Contact Person
                    </label>
                    <input
                        type="text"
                        name="contactPerson"
                        required
                        value={formData.contactPerson}
                        onChange={handleChange}
                        placeholder="Nama Lengkap Penanggung Jawab"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-unaicBlue focus:ring-2 focus:ring-unaicBlue/20 outline-none transition-all"
                    />
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-unaicBlue" /> Email Resmi
                    </label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@instansi.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-unaicBlue focus:ring-2 focus:ring-unaicBlue/20 outline-none transition-all"
                    />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-unaicBlue" /> Nomor WhatsApp / Telp
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="0812xxxx"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-unaicBlue focus:ring-2 focus:ring-unaicBlue/20 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Maksud Kerjasama / Intent */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-unaicBlue" /> Maksud & Tujuan Kerjasama
                </label>
                <textarea
                    name="intent"
                    required
                    rows={4}
                    value={formData.intent}
                    onChange={handleChange}
                    placeholder="Jelaskan secara singkat bentuk kerjasama yang diharapkan (misal: Tempat Magang, Penelitian Bersama, Rekrutmen Lulusan)..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-unaicBlue focus:ring-2 focus:ring-unaicBlue/20 outline-none transition-all"
                />
            </div>

            {/* Mock File Upload */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-unaicBlue" /> Upload Draft MoU / Surat Pengantar (Opsional)
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                    <UploadCloud className="w-10 h-10 text-gray-300 mx-auto mb-3 group-hover:text-unaicBlue transition-colors" />
                    <p className="text-sm text-gray-500">
                        Klik untuk upload file <span className="font-semibold text-gray-700">PDF/DOCX</span> (Maks. 5MB)
                    </p>
                </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-unaicBlue text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Mengirim Data...
                        </>
                    ) : (
                        <>
                            Kirim Pengajuan <Send className="w-5 h-5" />
                        </>
                    )}
                </button>
                <p className="text-center text-xs text-gray-400 mt-4">
                    Dengan mengirim formulir ini, Anda menyetujui kebijakan privasi data Universitas Al-Irsyad Cilacap.
                </p>
            </div>
        </form>
    );
}
