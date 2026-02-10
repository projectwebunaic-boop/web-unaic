"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Building2, GraduationCap, Briefcase, UserCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import Image from 'next/image';

interface Category {
    id: string;
    name: string;
    nameEn?: string | null;
    slug: string;
}

interface Staff {
    id: string;
    name: string;
    role: string;
    roleEn?: string | null;
    nidn?: string | null;
    categoryId: string;
    image?: string | null;
    scholarUrl?: string | null;
}

// Helper for Color & Icon based on Group
const getGroupStyles = (group: string) => {
    switch (group) {
        case 'pimpinan':
            return {
                bg: 'bg-gradient-to-r from-amber-500 to-orange-600',
                icon: <UserCircle size={48} className="text-white/20" />,
                badge: 'text-orange-600 bg-orange-50'
            };
        case 'dosen':
            return {
                bg: 'bg-gradient-to-r from-unaicNavy to-blue-800',
                icon: <GraduationCap size={48} className="text-white/20" />,
                badge: 'text-blue-600 bg-blue-50'
            };
        case 'tendik':
            return {
                bg: 'bg-gradient-to-r from-emerald-600 to-teal-600',
                icon: <Briefcase size={48} className="text-white/20" />,
                badge: 'text-emerald-600 bg-emerald-50'
            };
        default:
            return {
                bg: 'bg-gradient-to-r from-gray-600 to-gray-800',
                icon: <Building2 size={48} className="text-white/20" />,
                badge: 'text-gray-600 bg-gray-50'
            };
    }
};

const StaffCard = ({ data, categoryName, categoryNameEn, groupType, isEn }: { data: Staff, categoryName: string, categoryNameEn?: string | null, groupType: string, isEn: boolean }) => {
    const styles = getGroupStyles(groupType);
    const displayRole = (isEn && data.roleEn) ? data.roleEn : data.role;
    const displayCategory = (isEn && categoryNameEn) ? categoryNameEn : categoryName;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
        >
            <div className={`h-24 w-full ${styles.bg} relative`}>
                <div className="absolute top-4 right-4">
                    {styles.icon}
                </div>
            </div>

            <div className="-mt-12 px-6 pb-6 flex-1 flex flex-col">
                <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100 mx-auto sm:mx-0">
                    {data.image ? (
                        <Image src={data.image} alt={data.name} fill className="object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400"><UserCircle size={48} /></div>
                    )}
                </div>

                <div className="mt-4 text-center sm:text-left">
                    <h3 className="text-lg font-bold text-gray-800 leading-tight mb-1 group-hover:text-unaicNavy transition-colors text-balance min-h-[3rem]">
                        {data.name}
                    </h3>
                    <p className={`text-sm font-semibold mb-3 ${styles.badge.split(' ')[0]} h-10 line-clamp-2`}>{displayRole}</p>

                    <div className="flex flex-col gap-2 text-sm text-gray-500 mb-4">
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                            <Building2 size={14} className="shrink-0" />
                            <span className="line-clamp-1">{displayCategory}</span>
                        </div>
                        {data.nidn && (
                            <div className="flex items-center justify-center sm:justify-start gap-2">
                                <span className="bg-gray-100 text-[10px] px-2 py-0.5 rounded font-bold">NIDN: {data.nidn}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default function StaffBrowser({ initialCategories, initialStaff, locale }: { initialCategories: Category[], initialStaff: Staff[], locale: string }) {
    const isEn = locale === 'en';

    // 1. Define Groups
    const GROUPS = [
        { id: 'pimpinan', label: isEn ? 'Leaders' : 'Pimpinan', keywords: ['pimpinan', 'rektor', 'wakil', 'ketua', 'direktur', 'leader', 'rector', 'dean'] },
        { id: 'dosen', label: isEn ? 'Lecturers' : 'Dosen', keywords: ['dosen', 'pengajar', 'lecturer', 'faculty'] },
        { id: 'tendik', label: isEn ? 'Staff' : 'Tendik', keywords: ['tendik', 'tenaga', 'staf', 'staff', 'kepala'] }
    ];

    const [activeGroup, setActiveGroup] = useState<string>('dosen');
    const [searchTerm, setSearchTerm] = useState('');

    // 2. Logic to map category -> group
    const getGroupForCategory = (catId: string) => {
        const cat = initialCategories.find(c => c.id === catId);
        if (!cat) return 'other';
        const lowerName = cat.name.toLowerCase();
        const lowerSlug = cat.slug.toLowerCase();

        // Pimpinan check (priority)
        if (GROUPS[0].keywords.some(k => lowerName.includes(k) || lowerSlug.includes(k))) return 'pimpinan';
        // Dosen check
        if (GROUPS[1].keywords.some(k => lowerName.includes(k) || lowerSlug.includes(k))) return 'dosen';
        // Tendik check
        if (GROUPS[2].keywords.some(k => lowerName.includes(k) || lowerSlug.includes(k))) return 'tendik';

        return 'other';
    };

    // 3. Filter & Sort Logic
    const filteredStaff = initialStaff.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.role.toLowerCase().includes(searchTerm.toLowerCase());

        const itemGroup = getGroupForCategory(item.categoryId);
        const matchesGroup = itemGroup === activeGroup;

        return matchesSearch && matchesGroup;
    }).sort((a, b) => {
        if (activeGroup === 'pimpinan') {
            const getWeight = (role: string) => {
                const r = role.toLowerCase();
                if (r.includes('rektor') && !r.includes('wakil')) return 1;
                if (r.includes('wakil rektor i') || r.includes('wakil rektor 1')) return 2;
                if (r.includes('wakil rektor ii') || r.includes('wakil rektor 2')) return 3;
                if (r.includes('wakil rektor iii') || r.includes('wakil rektor 3')) return 4;
                if (r.includes('dekan') && r.includes('kesehatan')) return 5; // FIKES
                if (r.includes('dekan') && (r.includes('sains') || r.includes('teknologi') || r.includes('fastek'))) return 6; // FASTEK
                if (r.includes('dekan') && (r.includes('ekonomi') || r.includes('bisnis'))) return 7; // FEB
                return 99; // Others
            };

            const weightA = getWeight(a.role);
            const weightB = getWeight(b.role);

            if (weightA !== weightB) return weightA - weightB;
        }
        return a.name.localeCompare(b.name);
    });

    return (
        <div className="container mx-auto px-4 max-w-7xl -mt-8 relative z-20">
            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 mb-8 max-w-3xl mx-auto flex gap-4 items-center">
                <Search className="text-gray-400 ml-2" />
                <input
                    type="text"
                    placeholder={isEn ? "Search Directory..." : "Cari Pegawai..."}
                    className="flex-1 outline-none text-gray-700 bg-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Group Tabs (Fixed Centered) */}
            <div className="flex justify-center mb-10">
                <div className="inline-flex bg-white p-1.5 rounded-full shadow-sm border border-gray-200">
                    {GROUPS.map(group => (
                        <button
                            key={group.id}
                            onClick={() => setActiveGroup(group.id)}
                            className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${activeGroup === group.id
                                ? 'bg-unaicNavy text-white shadow-md'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            {group.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Grid */}
            <div className="mb-8 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                    {GROUPS.find(g => g.id === activeGroup)?.label || (isEn ? 'Directory' : 'Daftar Pegawai')}
                </h2>
                <span className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold">
                    {filteredStaff.length} {isEn ? 'People' : 'Orang'}
                </span>
            </div>

            {filteredStaff.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {filteredStaff.map((item) => {
                            const cat = initialCategories.find(c => c.id === item.categoryId);
                            return (
                                <StaffCard
                                    key={item.id}
                                    data={item}
                                    categoryName={cat?.name || ''}
                                    categoryNameEn={cat?.nameEn}
                                    groupType={activeGroup}
                                    isEn={isEn}
                                />
                            );
                        })}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <UserCircle size={64} className="mx-auto text-gray-200 mb-4" />
                    <h3 className="text-xl font-bold text-gray-400">{isEn ? 'Data not found' : 'Data tidak ditemukan'}</h3>
                    <p className="text-gray-400">{isEn ? 'No staff found in this category.' : 'Tidak ada data pegawai di kategori ini.'}</p>
                </div>
            )}
        </div>
    );
}
