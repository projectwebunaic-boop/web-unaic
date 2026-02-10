import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "../globals.css";
import "@/styles/accessibility.css";
import { AccessibilityProvider } from "@/components/accessibility/useAccessibility";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import MainLayoutWrapper from "@/components/layout/MainLayoutWrapper";
import prisma from "@/lib/prisma";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "Universitas Al-Irsyad Cilacap (UNAIC)",
  description: "Website resmi Universitas Al-Irsyad Cilacap. Menghasilkan lulusan yang unggul, berkarakter, dan berdaya saing global.",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  let messages;
  try {
    messages = await getMessages({ locale });
  } catch (error) {
    notFound();
  }

  const dbFaculties = await prisma.faculty.findMany({
    include: { programs: true },
    orderBy: { name: 'asc' }
  });


  return (
    <html lang={locale} className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <AccessibilityProvider>
        <body className="antialiased font-sans text-gray-800 bg-gray-50">
          <NextIntlClientProvider messages={messages}>
            <MainLayoutWrapper dbFaculties={dbFaculties}>
              {children}
            </MainLayoutWrapper>
          </NextIntlClientProvider>
        </body>
      </AccessibilityProvider>
    </html>
  );
}
