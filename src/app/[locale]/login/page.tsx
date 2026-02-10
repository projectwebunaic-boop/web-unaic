"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import Image from "next/image";
import { Lock, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pin }),
            });

            const data = await response.json();

            if (response.ok) {
                router.push("/admin");
            } else {
                setError(data.error || "PIN Akses Salah. Silakan coba lagi.");
                setLoading(false);
            }
        } catch (err) {
            setError("Gagal menghubungi server. Periksa koneksi Anda.");
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
                {/* Header */}
                <div className="bg-unaicNavy p-8 text-center relative overflow-hidden">
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 bg-white rounded-full p-2 mb-4 shadow-lg">
                            <div className="relative w-full h-full">
                                <Image
                                    src="/images/logo/logoadmin.png"
                                    alt="Logo UNAIC"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-wider">UNAIC ADMIN</h1>
                        <p className="text-blue-200 text-sm mt-1">Portal Manajemen Terpadu</p>
                    </div>

                    {/* Decor */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                </div>

                {/* Form */}
                <div className="p-8 md:p-10">
                    <div className="mb-8 text-center">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Login Akses</h2>
                        <p className="text-gray-500 text-sm">Masukkan PIN keamanan untuk mengakses dashboard.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">PIN Keamanan</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Lock size={20} />
                                </span>
                                <input
                                    type="password"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    placeholder="••••"
                                    maxLength={8}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-unaicGold/50 focus:border-unaicGold outline-none transition-all text-center tracking-[0.5em] font-bold text-xl text-unaicNavy placeholder-gray-300"
                                    autoFocus
                                />
                            </div>
                            {error && (
                                <p className="text-red-500 text-xs mt-2 text-center font-medium animate-pulse">{error}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-unaicGold text-unaicNavy hover:bg-yellow-400 hover:-translate-y-0.5"}`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={24} className="animate-spin" />
                                    <span>Memproses...</span>
                                </>
                            ) : (
                                <>
                                    <span>Masuk Dashboard</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                    <p className="text-xs text-gray-400">© 2026 Universitas Al-Irsyad Cilacap</p>
                </div>
            </div>
        </div>
    );
}
