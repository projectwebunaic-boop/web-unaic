"use client";

import { Link } from '@/i18n/routing';
import { usePathname, useRouter } from "@/i18n/routing";
import {
    LogOut,
    Menu,
    ChevronDown,
    ChevronRight,
    Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { adminMenuGroups } from "@/data/adminMenu";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Initial Auth Check
    useEffect(() => {
        const checkAuth = () => {
            // Check for auth token in cookies
            // For simple implementation without external lib, we check document.cookie
            const hasAuth = document.cookie.split(';').some((item) => item.trim().startsWith('unaic_admin_auth='));

            if (!hasAuth) {
                router.replace('/login');
            } else {
                setIsAuthenticated(true);
            }
            setIsLoading(false);
        };

        checkAuth();
    }, [router]);

    const handleLogout = () => {
        // Clear cookie
        document.cookie = "unaic_admin_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        setIsAuthenticated(false);
        router.replace('/login');
    };

    const isActive = (href: string, match: string = "startsWith") => {
        const leanPath = pathname.replace(/^\/(id|en|ar)/, ""); // Remove locale prefix
        // Handle root admin path special case
        if (href === "/admin" && match === "exact") {
            return leanPath === "/admin";
        }
        return leanPath.startsWith(href);
    };

    // State for collapsible groups
    const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

    // Initialize expanded groups based on active path
    useEffect(() => {
        const currentPath = pathname.replace(/^\/(id|en|ar)/, "");
        const activeGroup = adminMenuGroups.find(group =>
            group.items.some(item =>
                item.match === "exact" ? item.href === currentPath : currentPath.startsWith(item.href)
            )
        );
        if (activeGroup) {
            setExpandedGroups(prev => {
                if (!prev.includes(activeGroup.groupName)) {
                    return [...prev, activeGroup.groupName];
                }
                return prev;
            });
        }
    }, [pathname]);

    const toggleGroup = (groupName: string) => {
        setExpandedGroups(prev =>
            prev.includes(groupName)
                ? prev.filter(g => g !== groupName)
                : [...prev, groupName]
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center gap-4 text-unaicNavy">
                    <Loader2 size={40} className="animate-spin text-unaicGold" />
                    <p className="font-semibold">Memuat Dashboard...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return null; // Will redirect

    return (
        <div className="min-h-screen bg-gray-100 flex font-sans">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 bg-unaicNavy text-white transition-all duration-300 ${isSidebarOpen ? "w-72" : "w-20"
                    } shadow-xl hidden md:flex flex-col overflow-y-auto custom-scrollbar`}
            >
                <div className="h-24 flex flex-col items-center justify-center border-b border-white/10 shrink-0 sticky top-0 bg-unaicNavy z-10 p-4">
                    {isSidebarOpen ? (
                        <div className="flex items-center gap-3 animate-in fade-in duration-300">
                            <div className="relative w-12 h-12 bg-white rounded-full p-1 shadow-md">
                                <Image
                                    src="/images/logo/logoadmin.png"
                                    alt="UNAIC Logo"
                                    fill
                                    className="object-contain p-1"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-lg tracking-wider text-white">ADMIN PANEL</span>
                                <span className="text-xs text-unaicGold font-medium tracking-widest">UNAIC</span>
                            </div>
                        </div>
                    ) : (
                        <div className="relative w-10 h-10 bg-white rounded-full p-1 shadow-md">
                            <Image
                                src="/images/logo-unaic.png"
                                alt="UNAIC Logo"
                                fill
                                className="object-contain p-1"
                            />
                        </div>
                    )}
                </div>

                <nav className="flex-1 py-6 px-3 space-y-6">
                    {adminMenuGroups.map((group, idx) => {
                        const isExpanded = expandedGroups.includes(group.groupName);
                        // Always show items if sidebar is collapsed (icons only mode) or if explicitly expanded
                        const shouldShowItems = isSidebarOpen ? isExpanded : true;

                        if (!isSidebarOpen && idx > 0) {
                            // Divider for collapsed mode
                            return (
                                <div key={idx} className="border-t border-white/10 pt-4">
                                    {group.items.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            title={item.title} // Tooltip
                                            className={`flex items-center justify-center p-3 rounded-xl mb-2 transition-all duration-200 group relative ${isActive(item.href, item.match)
                                                ? "bg-unaicGold text-unaicNavy shadow-lg"
                                                : "text-gray-400 hover:bg-white/10 hover:text-white"
                                                }`}
                                        >
                                            <item.icon size={22} />
                                            {/* Hover Tooltip for collapsed sidebar */}
                                            <span className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none transition-opacity">
                                                {item.title}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            )
                        }

                        return (
                            <div key={idx} className="">
                                {isSidebarOpen && (
                                    <button
                                        onClick={() => toggleGroup(group.groupName)}
                                        className="w-full flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-3 py-1 hover:text-white transition-colors group"
                                    >
                                        <span>{group.groupName}</span>
                                        <div className={`p-1 rounded bg-white/5 group-hover:bg-white/10 transition-colors`}>
                                            {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                        </div>
                                    </button>
                                )}

                                {shouldShowItems && (
                                    <div className={`space-y-1 ${isSidebarOpen ? "animate-in slide-in-from-top-2 duration-200" : ""}`}>
                                        {group.items.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${isActive(item.href, item.match)
                                                    ? "bg-unaicGold text-unaicNavy font-bold shadow-md transform scale-[1.02]"
                                                    : "text-gray-300 hover:bg-white/10 hover:text-white hover:translate-x-1"
                                                    }`}
                                            >
                                                <div className={`${isActive(item.href, item.match) ? "text-unaicNavy" : "text-gray-400 group-hover:text-white"}`}>
                                                    <item.icon size={20} />
                                                </div>
                                                {isSidebarOpen && <span className="text-sm font-medium">{item.title}</span>}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10 bg-unaicNavy/50 backdrop-blur-sm">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 w-full px-4 py-3 text-red-300 bg-red-500/10 hover:bg-red-500/20 hover:text-red-200 rounded-xl transition-all duration-300 group ${!isSidebarOpen && "justify-center"}`}
                    >
                        <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                        {isSidebarOpen && <span className="font-semibold">Keluar Dashboard</span>}
                    </button>
                    {isSidebarOpen && (
                        <p className="text-center text-[10px] text-gray-500 mt-4">
                            UNAIC Admin v2.5.0 <br /> © 2026 Universitas Al-Irsyad Cilacap
                        </p>
                    )}
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? "md:ml-72" : "md:ml-20"}`}>
                {/* Mobile Header */}
                <header className="bg-white shadow-sm h-16 flex md:hidden items-center justify-between px-4 z-40 sticky top-0">
                    <div className="flex items-center gap-2">
                        <Image src="/images/logo-unaic.png" alt="Logo" width={32} height={32} />
                        <span className="font-bold text-unaicNavy">UNAIC ADMIN</span>
                    </div>
                    <button className="p-2 text-gray-600">
                        <Menu size={24} />
                    </button>
                </header>

                {/* Page Content */}
                <main className="p-6 md:p-8 max-w-7xl mx-auto w-full [&_input]:text-gray-900 [&_input]:border-gray-400 [&_textarea]:text-gray-900 [&_textarea]:border-gray-400 [&_select]:text-gray-900 [&_select]:border-gray-400 animate-in fade-in duration-500">
                    {children}
                </main>
            </div>
        </div>
    );
}
