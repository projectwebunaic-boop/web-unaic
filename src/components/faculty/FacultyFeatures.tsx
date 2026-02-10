"use client";

import { motion } from "framer-motion";
import { Users, BookOpen, Trophy, Building } from "lucide-react";

const features = [
    { label: "Mahasiswa Aktif", value: "1200+", icon: Users },
    { label: "Dosen Tetap", value: "80+", icon: BookOpen },
    { label: "Penelitian", value: "50+", icon: Trophy },
    { label: "Laboratorium", value: "12", icon: Building },
];

export default function FacultyFeatures() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-16">
            {features.map((feature, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow"
                >
                    <div className="inline-flex p-3 rounded-full bg-unaicBlue/5 text-unaicBlue mb-3">
                        <feature.icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-1">{feature.value}</h4>
                    <p className="text-sm text-gray-500 font-medium">{feature.label}</p>
                </motion.div>
            ))}
        </div>
    );
}
