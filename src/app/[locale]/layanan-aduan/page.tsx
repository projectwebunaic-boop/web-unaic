"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import HeroSection from "@/components/shared/HeroSection";
import {
    ShieldAlert,
    School,
    Wrench,
    Banknote,
    ChevronRight,
    Send,
    Lock,
    CheckCircle2
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function LayananAduanPage() {
    const t = useTranslations("Complaint");

    // Fallback for categories if translation fails or for type safety
    const categoryKeys = ["academic", "facilities", "ethics", "admin"] as const;
    const stepKeys = ["1", "2", "3", "4"] as const;

    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isMaintenance, setIsMaintenance] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // File Upload State
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        checkMaintenanceStatus();
    }, []);

    const checkMaintenanceStatus = async () => {
        try {
            const res = await fetch("/api/admin/settings");
            if (res.ok) {
                const data = await res.json();
                if (data.general?.maintenanceMode) {
                    setIsMaintenance(true);
                }
            }
        } catch (e) {
            console.error("Failed to check maintenance status");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    // Form States
    const [formData, setFormData] = useState({
        reporter: "",
        title: "",
        desc: "",
    });

    const categories = [
        {
            id: "AKADEMIK",
            title: t("categories.academic.title"),
            desc: t("categories.academic.desc"),
            icon: School,
            color: "bg-blue-100 text-blue-600",
            border: "hover:border-blue-500",
        },
        {
            id: "FASILITAS",
            title: t("categories.facilities.title"),
            desc: t("categories.facilities.desc"),
            icon: Wrench,
            color: "bg-amber-100 text-amber-600",
            border: "hover:border-amber-500",
        },
        {
            id: "ETIK",
            title: t("categories.ethics.title"),
            desc: t("categories.ethics.desc"),
            icon: ShieldAlert,
            color: "bg-rose-100 text-rose-600",
            border: "hover:border-rose-500",
        },
        {
            id: "ADMINISTRASI",
            title: t("categories.admin.title"),
            desc: t("categories.admin.desc"),
            icon: Banknote,
            color: "bg-emerald-100 text-emerald-600",
            border: "hover:border-emerald-500",
        },
    ];

    const steps = [
        { number: 1, title: t("steps.1.title"), desc: t("steps.1.desc") },
        { number: 2, title: t("steps.2.title"), desc: t("steps.2.desc") },
        { number: 3, title: t("steps.3.title"), desc: t("steps.3.desc") },
        { number: 4, title: t("steps.4.title"), desc: t("steps.4.desc") },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeCategory) {
            alert(t("categoryTitle")); // Reusing this for alert
            return;
        }
        if (!formData.title || !formData.desc) {
            alert("Please complete the form"); // Basic fallback
            return;
        }

        setIsSubmitting(true);

        try {
            const formDataToSubmit = new FormData();
            formDataToSubmit.append('category', activeCategory);
            formDataToSubmit.append('title', formData.title);
            formDataToSubmit.append('desc', formData.desc);
            formDataToSubmit.append('reporter', formData.reporter || "Anonim");
            if (file) {
                formDataToSubmit.append('file', file);
            }

            const res = await fetch("/api/admin/aduan", {
                method: "POST",
                body: formDataToSubmit,
            });

            if (res.ok) {
                setIsSuccess(true);
                setFormData({ reporter: "", title: "", desc: "" });
                setFile(null);
                setActiveCategory(null);
                // Scroll to top
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                alert("Failed to submit report.");
            }
        } catch (error) {
            console.error(error);
            alert("System error.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return null; // Or a simple loader

    if (isMaintenance) {
        return (
            <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
                <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <Wrench size={40} />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-3">{t("maintenance.title")}</h1>
                <p className="text-gray-600 max-w-lg mx-auto leading-relaxed">
                    {t("maintenance.desc")}
                </p>
                <div className="mt-8">
                    <button onClick={() => window.location.reload()} className="px-6 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition">
                        {t("maintenance.reload")}
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            <HeroSection
                title={t("heroTitle")}
                subtitle={t("heroSubtitle")}
                backgroundImage="/images/hero-bg.jpg"
            />

            <div className="container mx-auto px-4 -mt-20 relative z-10">
                {/* Intro Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border-t-4 border-unaicGold text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full mb-4 border border-green-200">
                        <Lock size={16} />
                        <span className="text-sm font-semibold">{t("privacyBadge")}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        {t("privacyTitle")}
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        {t("privacyDesc")}
                    </p>
                </div>

                {/* Success Message */}
                {isSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded-xl mb-8 flex items-center gap-4 shadow-md"
                    >
                        <div className="bg-green-200 p-2 rounded-full"><CheckCircle2 size={24} /></div>
                        <div>
                            <h4 className="font-bold text-lg">{t("successTitle")}</h4>
                            <p className="text-sm">{t("successDesc")}</p>
                            <button
                                onClick={() => setIsSuccess(false)}
                                className="text-sm underline mt-1 font-bold hover:text-green-900"
                            >
                                {t("newReport")}
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Categories Grid */}
                <div className="mb-20">
                    <h3 className="text-center text-xl font-bold text-gray-800 mb-8 flex items-center justify-center gap-2">
                        <span className="w-8 h-1 bg-unaicNavy rounded-full"></span>
                        {t("categoryTitle")}
                        <span className="w-8 h-1 bg-unaicNavy rounded-full"></span>
                    </h3>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((cat) => (
                            <motion.button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                whileHover={{ y: -5 }}
                                className={`bg-white p-6 rounded-xl shadow-sm border-2 transition-all text-left group
                                    ${activeCategory === cat.id ? 'border-unaicBlue ring-2 ring-blue-100 bg-blue-50' : 'border-transparent ' + cat.border}
                                `}
                            >
                                <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <cat.icon size={28} />
                                </div>
                                <h4 className="font-bold text-gray-800 text-lg mb-2">{cat.title}</h4>
                                <p className="text-sm text-gray-500 leading-relaxed">{cat.desc}</p>
                                {activeCategory === cat.id && (
                                    <div className="mt-3 flex items-center gap-1 text-blue-600 font-bold text-sm">
                                        <CheckCircle2 size={16} /> {t("selected")}
                                    </div>
                                )}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Flow Section */}
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-20">
                    <h3 className="text-center text-2xl font-bold text-unaicNavy mb-12">{t("flowTitle")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[25px] left-0 w-full h-1 bg-gray-100 -z-0"></div>

                        {steps.map((step) => (
                            <div key={step.number} className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-14 h-14 bg-white border-4 border-unaicBlue text-unaicBlue rounded-full flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
                                    {step.number}
                                </div>
                                <h4 className="font-bold text-gray-800 mb-2">{step.title}</h4>
                                <p className="text-sm text-gray-500">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Section */}
                <div id="form-aduan" className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-unaicNavy p-6 text-white">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Send size={20} />
                            {t("formTitle")}
                        </h3>
                        <p className="text-blue-100 text-sm mt-1">{t("formSubtitle")}</p>
                    </div>

                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("form.name")}</label>
                                    <input
                                        type="text"
                                        placeholder={t("form.namePlaceholder")}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-400 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-unaicBlue focus:border-transparent outline-none transition-all"
                                        value={formData.reporter}
                                        onChange={(e) => setFormData({ ...formData, reporter: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("form.category")}</label>
                                    <div className="px-4 py-2 rounded-lg border border-gray-400 bg-gray-100 text-gray-700 cursor-not-allowed">
                                        {activeCategory ? categories.find(c => c.id === activeCategory)?.title : t("form.categoryPlaceholder")}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t("form.title")}</label>
                                <input
                                    type="text"
                                    required
                                    placeholder={t("form.titlePlaceholder")}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-400 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-unaicBlue focus:border-transparent outline-none transition-all"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t("form.desc")}</label>
                                <textarea
                                    required
                                    rows={5}
                                    placeholder={t("form.descPlaceholder")}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-400 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-unaicBlue focus:border-transparent outline-none transition-all resize-none"
                                    value={formData.desc}
                                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t("form.file")}</label>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    onChange={handleFileChange}
                                />
                                <div
                                    onClick={handleUploadClick}
                                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer flex flex-col items-center justify-center
                                        ${file ? 'border-unaicBlue bg-blue-50' : 'border-gray-400 hover:bg-gray-50 hover:border-unaicBlue'}
                                    `}
                                >
                                    {file ? (
                                        <>
                                            <div className="bg-unaicBlue text-white p-2 rounded-full mb-2">
                                                <CheckCircle2 size={24} />
                                            </div>
                                            <p className="font-bold text-unaicNavy text-sm break-all">{file.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            <p className="text-xs text-red-500 mt-2 hover:underline">{t("form.changeFile")}</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-gray-700 text-sm font-medium">{t("form.fileLabel")}</p>
                                            <p className="text-xs text-gray-500 mt-1">{t("form.fileHelp")}</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg">
                                <CheckCircle2 size={20} className="text-blue-600 mt-0.5 shrink-0" />
                                <p className="text-sm text-blue-800">
                                    {t("form.disclaimer")}
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full text-unaicNavy font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl active:scale-[0.98] transform duration-200 flex items-center justify-center gap-2
                                    ${isSubmitting ? 'bg-gray-300 cursor-wait' : 'bg-unaicGold hover:bg-yellow-500'}
                                `}
                            >
                                {isSubmitting ? t("form.submitting") : (
                                    <>
                                        <Send size={20} /> {t("form.submit")}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
