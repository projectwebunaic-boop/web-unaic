"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import PublicComponents from "@/components/layout/PublicComponents";

export default function MainLayoutWrapper({
    children,
    dbFaculties
}: {
    children: React.ReactNode;
    dbFaculties?: any[];
}) {
    const pathname = usePathname();
    const isAdminOrLogin = pathname?.includes('/admin') || pathname?.includes('/login');

    if (isAdminOrLogin) {
        return <>{children}</>;
    }

    return (
        <>
            <Header dbFaculties={dbFaculties} />
            <main className="flex-grow min-h-screen">
                {children}
            </main>
            <Footer />
            <PublicComponents />
        </>
    );
}
