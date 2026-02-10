"use client";

import { Link } from '@/i18n/routing';
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { adminMenuGroups } from "@/data/adminMenu";

export default function AdminDashboard() {
    // Filter groups to show in Quick Access (exclude "Menu Utama" and maybe "Sistem" if desired, or keep all)
    const dashboardGroups = adminMenuGroups.filter(g => g.groupName !== "Menu Utama");

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-unaicNavy to-blue-800 rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden group">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-3 tracking-tight">Selamat Datang di UNAIC Admin</h1>
                    <p className="text-blue-100 max-w-2xl text-lg opacity-90">
                        Pusat kendali konten dan layanan digital Universitas Al-Irsyad Cilacap.
                        Pilih menu di bawah atau gunakan sidebar untuk mulai mengelola.
                    </p>
                </div>
                {/* Decoration */}
                <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 transform translate-x-12 group-hover:translate-x-8 transition-transform duration-700"></div>
                <div className="absolute right-20 top-0 h-full w-1/3 bg-white/5 skew-x-12 transform translate-x-12 group-hover:translate-x-4 transition-transform duration-1000"></div>

                <div className="absolute -bottom-10 -right-10 text-white/5 transform rotate-12">
                    <LayoutDashboard size={200} />
                </div>
            </div>

            {/* Quick Access Grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardGroups.map((section, idx) => (
                    <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full hover:shadow-md transition-shadow duration-300">
                        <div className="mb-5 pb-4 border-b border-gray-50">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <span className="w-1 h-6 bg-unaicGold rounded-full"></span>
                                {section.groupName}
                            </h2>
                        </div>

                        <div className="space-y-3 flex-1">
                            {section.items.map((item, i) => (
                                <Link
                                    key={i}
                                    href={item.href}
                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group/item border border-transparent hover:border-gray-100"
                                >
                                    <div className={`w-12 h-12 ${item.color || "bg-gray-100 text-gray-600"} rounded-xl flex items-center justify-center shrink-0 shadow-sm group-hover/item:scale-105 transition-transform`}>
                                        <item.icon size={22} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-700 group-hover/item:text-unaicNavy transition-colors truncate">{item.title}</h3>
                                        {item.description && (
                                            <p className="text-xs text-gray-400 truncate mt-0.5">{item.description}</p>
                                        )}
                                    </div>
                                    <ArrowRight size={16} className="text-gray-300 group-hover/item:text-unaicNavy -translate-x-2 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* System Status (Example) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Status Sistem</h2>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">Operational</span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Versi Sistem</p>
                        <p className="font-bold text-xl text-unaicNavy">v2.5.0</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Terakhir Update</p>
                        <p className="font-bold text-xl text-unaicNavy">Jan 2026</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Server Uptime</p>
                        <p className="font-bold text-xl text-green-600 flex items-center gap-2">
                            99.9%
                        </p>
                    </div>
                    <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 hover:bg-blue-50 transition-colors">
                        <Link href="/admin/settings" className="text-blue-600 font-bold hover:underline flex items-center justify-between h-full group">
                            <span className="text-sm">Pengaturan & Konfigurasi</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
