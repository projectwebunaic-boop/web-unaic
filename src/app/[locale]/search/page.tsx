"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { Link } from '@/i18n/routing';
import { Search, ArrowRight } from "lucide-react";
import { faculties } from "@/data/faculties"; // Importing faculties for data
import { navigation } from "@/data/navigation";

// Placeholder data for search (Simulated)
const generateSearchData = () => {
    const data = [];

    // Add Faculties
    faculties.forEach(f => {
        data.push({
            title: f.name,
            url: f.link,
            category: "Fakultas",
            description: `Informasi mengenai ${f.name} di Universitas Al-Irsyad Cilacap.`
        });
        f.programs.forEach(p => {
            data.push({
                title: `Prodi ${p.name}`,
                url: `${f.link}/${p.slug}`,
                category: "Program Studi",
                description: `Program Studi ${p.name} yang unggul dan kompetitif.`
            });
        });
    });

    // Add Navigation items
    navigation.forEach(n => {
        if (n.href) {
            data.push({
                title: n.title,
                url: n.href,
                category: "Halaman",
                description: `Halaman ${n.title} resmi website UNAIC.`
            });
        }
        if (n.submenu) {
            n.submenu.forEach(s => {
                data.push({
                    title: s.title,
                    url: s.href,
                    category: "Halaman",
                    description: `Informasi lengkap mengenai ${s.title}.`
                });
            });
        }
    });

    return data;
};

const searchData = generateSearchData();

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [results, setResults] = useState<any[]>([]);

    useEffect(() => {
        if (query) {
            const lowerQuery = query.toLowerCase();
            const filtered = searchData.filter(item =>
                item.title.toLowerCase().includes(lowerQuery) ||
                item.description.toLowerCase().includes(lowerQuery) ||
                item.category.toLowerCase().includes(lowerQuery)
            );
            setResults(filtered);
        } else {
            setResults([]);
        }
    }, [query]);

    return (
        <div className="container mx-auto px-6 py-12 min-h-screen">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-heading font-bold text-unaicNavy mb-2">Hasil Pencarian</h1>
                <p className="text-gray-600 mb-8">Menampilkan hasil untuk: <span className="font-semibold text-unaicGold">"{query}"</span></p>

                {query.trim() === "" ? (
                    <div className="text-center py-20 bg-gray-50 rounded-lg">
                        <Search size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">Silakan masukkan kata kunci untuk mencari.</p>
                    </div>
                ) : results.length > 0 ? (
                    <div className="space-y-6">
                        {results.map((result, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                                <span className="text-xs font-semibold tracking-wider text-unaicGold uppercase mb-2 block">{result.category}</span>
                                <Link href={result.url}>
                                    <h2 className="text-xl font-heading font-semibold text-blue-600 hover:text-blue-800 hover:underline mb-2">{result.title}</h2>
                                </Link>
                                <p className="text-gray-600 text-sm leading-relaxed mb-4">{result.description}</p>
                                <Link href={result.url} className="inline-flex items-center text-sm font-medium text-unaicNavy hover:text-unaicGold transition-colors">
                                    Kunjungi Halaman <ArrowRight size={14} className="ml-1" />
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-lg">
                        <Search size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak ada hasil ditemukan</h3>
                        <p className="text-gray-500">Coba kata kunci lain atau periksa ejaan Anda.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="container mx-auto px-6 py-12 text-center">Loading...</div>}>
            <SearchResults />
        </Suspense>
    );
}
