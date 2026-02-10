"use client";

import { Link } from "@/i18n/routing";
import {
    LayoutGrid,
    Users,
    CalendarDays,
    FileText,
    Target,
    ArrowRight
} from "lucide-react";

export default function AdminLPMDashboard() {
    const menuItems = [
        {
            title: "Profil LJM",
            description: "Kelola Tentang, Visi, dan Misi.",
            icon: <Target className="text-white" size={24} />,
            href: "/admin/lpm/profil",
            color: "bg-blue-500"
        },
        {
            title: "Struktur Organisasi",
            description: "Kelola data tim dan struktur.",
            icon: <Users className="text-white" size={24} />,
            href: "/admin/lpm/struktur",
            color: "bg-green-500"
        },
        {
            title: "Agenda Mutu",
            description: "Kelola jadwal dan kegiatan.",
            icon: <CalendarDays className="text-white" size={24} />,
            href: "/admin/lpm/agenda",
            color: "bg-purple-500"
        },
        {
            title: "Dokumen Mutu",
            description: "Upload dan kelola dokumen.",
            icon: <FileText className="text-white" size={24} />,
            href: "/admin/lpm/dokumen",
            color: "bg-orange-500"
        },
        {
            title: "Landasan Hukum",
            description: "Kelola dokumen regulasi & hukum.",
            icon: <FileText className="text-white" size={24} />,
            href: "/admin/lpm/landasan-hukum",
            color: "bg-amber-600"
        },
        {
            title: "9 Kriteria",
            description: "Kelola konten kriteria akreditasi.",
            icon: <LayoutGrid className="text-white" size={24} />,
            href: "/admin/lpm/kriteria",
            color: "bg-pink-500"
        }
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Penjaminan Mutu</h1>
            <p className="text-gray-500 mb-8">Pilih menu untuk mengelola konten website LJM.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item, idx) => (
                    <Link
                        key={idx}
                        href={item.href}
                        className="group bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                        <div>
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${item.color}`}>
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                            <p className="text-gray-500 text-sm">{item.description}</p>
                        </div>
                        <div className="mt-4 flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                            Buka Menu <ArrowRight size={16} className="ml-1" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
