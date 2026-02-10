"use client"

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ChevronDown, ChevronRight, Search, Menu, X, User, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "@/i18n/routing";
import LanguageSwitcher from "./LanguageSwitcher";
import { navigation } from "@/data/navigation";
import { useTranslations, useLocale } from "next-intl";

export default function Header({ dbFaculties }: { dbFaculties?: any[] }) {
  const t = useTranslations("Common");
  const tMenu = useTranslations();
  const locale = useLocale();
  const isEn = locale === 'en';

  // Build dynamic faculties menu if data available
  const dynamicNavigation: any[] = navigation.map(item => {
    if (item.key === "Navigation.menu.faculties" && dbFaculties && dbFaculties.length > 0) {
      return {
        ...item,
        submenu: dbFaculties.map(f => ({
          title: isEn ? (f.nameEn || f.name) : f.name,
          href: `/fakultas/${f.slug}`,
          key: `Faculties.${f.key}.name`,
          submenu: f.programs?.map((p: any) => ({
            title: isEn ? (p.nameEn || p.name) : p.name,
            href: `/fakultas/${f.slug}/${p.slug}`,
            key: `Faculties.${f.key}.programs.${p.key}`
          }))
        }))
      };
    }
    return item;
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState<string | null>(null);
  const [activeMobileNestedSubmenu, setActiveMobileNestedSubmenu] = useState<string | null>(null);

  const [activeDesktopDropdown, setActiveDesktopDropdown] = useState<string | null>(null);
  const [activeDesktopNestedDropdown, setActiveDesktopNestedDropdown] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  // Mobile Menu Toggles
  const toggleMobileSubmenu = (title: string) => {
    setActiveMobileSubmenu(activeMobileSubmenu === title ? null : title);
    setActiveMobileNestedSubmenu(null); // Reset nested when main closes
  };

  const toggleMobileNestedSubmenu = (title: string) => {
    setActiveMobileNestedSubmenu(activeMobileNestedSubmenu === title ? null : title);
  };

  // Search Handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
    }
  };

  // Reset state on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveMobileSubmenu(null);
    setActiveMobileNestedSubmenu(null);
    setActiveDesktopDropdown(null);
    setActiveDesktopNestedDropdown(null);
  }, [pathname]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
      if (!target.closest('.desktop-dropdown-container')) {
        setActiveDesktopDropdown(null);
        setActiveDesktopNestedDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <header className="w-full shadow-card fixed top-0 z-50">
      {/* 🔹 Topbar */}
      <div className="bg-white text-unaicGray px-6 h-16 flex justify-center lg:justify-between items-center border-b">
        <LanguageSwitcher />

        <div className="hidden lg:flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative w-64">
            <input
              type="text"
              placeholder={t("search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-unaicGray rounded-full px-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-unaicGold"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-unaicGray hover:text-unaicGold transition-colors">
              <Search size={16} />
            </button>
          </form>

          <a
            href="https://universitasalirsyad.siakadcloud.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-unaicNavy text-white rounded-full text-sm font-semibold hover:bg-unaicGold hover:text-unaicNavy transition-all duration-300 shadow-sm"
          >
            <User size={16} />
            <span>{t("portal_btn")}</span>
          </a>
        </div>
      </div>

      {/* 🔹 Navbar */}
      <nav className="bg-gradient-to-r from-unaicNavy to-blue-600 px-6 py-3 md:py-4 lg:py-5 flex items-center justify-between shadow-card">
        {/* ... Logo ... */}
        <Link href="/" className="flex-shrink-0 min-w-0">
          <Image src="/images/logo/logo2.png" alt="Logo UNAIC" width={160} height={120} priority className="w-auto h-auto max-h-12 md:max-h-14 lg:max-h-16" />
        </Link>

        {/* ... Mobile Toggles ... */}
        <div className="flex items-center gap-4 lg:hidden">
          <button aria-label="Cari" className="text-white" onClick={() => setIsMobileMenuOpen(true)}>
            <Search size={22} />
          </button>
          <button className="text-white" onClick={() => setIsMobileMenuOpen(true)} aria-label="Buka menu">
            <Menu size={24} />
          </button>
        </div>

        {/* 💻 Desktop Menu */}
        <ul className="hidden items-center lg:flex gap-2 font-heading capitalize font-normal text-white tracking-wide text-[14px]">
          {dynamicNavigation.map((item) => (
            <li key={item.key || item.title} className="relative desktop-dropdown-container group">
              {item.submenu ? (
                <>
                  <button
                    onClick={() => setActiveDesktopDropdown(activeDesktopDropdown === item.title ? null : item.title)}
                    onMouseEnter={() => setActiveDesktopDropdown(item.title)}
                    className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-unaicGold hover:text-unaicNavy transition-all duration-200 whitespace-nowrap cursor-pointer"
                  >
                    {item.key ? tMenu(item.key) : item.title} <ChevronDown size={14} />
                  </button>

                  {/* Level 1 Dropdown */}
                  <ul
                    onMouseLeave={() => {
                      setActiveDesktopDropdown(null);
                      setActiveDesktopNestedDropdown(null);
                    }}
                    className={`absolute left-0 top-full min-w-[16rem] bg-white text-blue-600 shadow-xl rounded-lg z-40 p-2 transition-all duration-300 transform origin-top-left ${activeDesktopDropdown === item.title ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
                      }`}>
                    {item.submenu.map((subItem: any) => (
                      <li
                        key={subItem.key || subItem.title}
                        className="relative"
                        onMouseEnter={() => setActiveDesktopNestedDropdown(subItem.title)}
                        onMouseLeave={() => setActiveDesktopNestedDropdown(null)}
                      >
                        {subItem.submenu ? (
                          /* Level 2 Item with Submenu */
                          <>
                            <div className={`flex justify-between items-center w-full px-4 py-2 rounded-md hover:bg-unaicGold hover:text-unaicNavy font-medium transition-colors cursor-pointer ${activeDesktopNestedDropdown === subItem.title ? 'bg-unaicGold text-unaicNavy' : 'text-unaicNavy'}`}>
                              {subItem.href ? (
                                <Link href={subItem.href} className="flex-grow">{subItem.key ? tMenu(subItem.key) : subItem.title}</Link>
                              ) : (
                                <span className="flex-grow">{subItem.key ? tMenu(subItem.key) : subItem.title}</span>
                              )}
                              <ChevronRight size={14} className={`text-gray-400 ${activeDesktopNestedDropdown === subItem.title ? 'text-unaicNavy' : ''}`} />
                            </div>

                            {/* Level 2 Dropdown */}
                            <ul className={`absolute left-full top-0 min-w-[16rem] bg-white text-blue-600 shadow-xl rounded-lg z-50 p-2 transition-all duration-200 transform origin-top-left ${activeDesktopNestedDropdown === subItem.title
                              ? 'opacity-100 visible scale-100'
                              : 'opacity-0 invisible scale-95'
                              }`}>
                              {subItem.submenu.map((nestedItem: any) => (
                                <li key={nestedItem.key || nestedItem.title}>
                                  <Link
                                    href={nestedItem.href || '#'}
                                    className="block px-4 py-2 rounded-md hover:bg-unaicGold hover:text-unaicNavy text-unaicNavy text-sm transition-colors"
                                  >
                                    {nestedItem.key ? tMenu(nestedItem.key) : nestedItem.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          /* Standard Level 1 Item */
                          <Link
                            href={subItem.href || '#'}
                            className="block px-4 py-2 rounded-md hover:bg-unaicGold hover:text-unaicNavy text-unaicNavy font-medium transition-colors"
                          >
                            {subItem.key ? tMenu(subItem.key) : subItem.title}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link href={item.href || '#'} className="px-3 py-2 rounded-md hover:bg-unaicGold hover:text-unaicNavy transition-all duration-200">
                  {item.key ? tMenu(item.key) : item.title}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* 📱 Mobile Menu Drawer */}
      <div className={`fixed inset-0 bg-white text-blue-600 z-[60] transform transition-transform duration-300 ease-in-out lg:hidden mobile-menu-container ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full bg-white">
          <div className="flex justify-between items-center p-4 border-b">
            <Link href="/" className="font-heading text-xl font-bold text-unaicNavy">UNAIC</Link>
            <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Tutup menu" className="text-unaicNavy p-2">
              <X size={24} />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto pb-20">
            {/* Mobile Search */}
            <div className="p-4 border-b bg-gray-50">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder={t("search_placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-unaicGold"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={18} />
                </button>
              </form>
            </div>

            {/* Mobile Portal Button */}
            <div className="p-4 border-b">
              <a
                href="https://universitasalirsyad.siakadcloud.com/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 bg-unaicNavy text-white rounded-lg font-semibold shadow-sm active:bg-blue-800"
              >
                <LogIn size={18} />
                <span>{t("portal_btn")}</span>
              </a>
            </div>

            {/* Mobile Navigation */}
            <ul className="flex flex-col py-2">
              <li>
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-6 py-3 font-medium text-unaicNavy hover:bg-gray-50">
                  {t("home_btn")}
                </Link>
              </li>

              {dynamicNavigation.map((item) => (
                <li key={item.key || item.title} className="border-b border-gray-50 last:border-0">
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() => toggleMobileSubmenu(item.title)}
                        className="w-full flex justify-between items-center px-6 py-3 font-medium text-unaicNavy hover:bg-gray-50"
                      >
                        {item.key ? tMenu(item.key) : item.title}
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-300 ${activeMobileSubmenu === item.title ? 'rotate-180 text-unaicGold' : 'text-gray-400'}`}
                        />
                      </button>

                      <div className={`overflow-hidden transition-all duration-300 bg-gray-50 ${activeMobileSubmenu === item.title ? 'max-h-[1000px]' : 'max-h-0'}`}>
                        <ul className="py-2">
                          {item.submenu.map((subItem: any) => (
                            <li key={subItem.key || subItem.title}>
                              {subItem.submenu ? (
                                <>
                                  <button
                                    onClick={() => toggleMobileNestedSubmenu(subItem.title)}
                                    className="w-full flex justify-between items-center pl-10 pr-6 py-3 text-sm font-medium text-gray-700 hover:text-unaicNavy"
                                  >
                                    {subItem.key ? tMenu(subItem.key) : subItem.title}
                                    <ChevronDown
                                      size={16}
                                      className={`transition-transform duration-300 ${activeMobileNestedSubmenu === subItem.title ? 'rotate-180' : ''}`}
                                    />
                                  </button>

                                  <div className={`overflow-hidden transition-all duration-300 bg-gray-100 ${activeMobileNestedSubmenu === subItem.title ? 'max-h-[500px]' : 'max-h-0'}`}>
                                    {subItem.href && (
                                      <Link
                                        href={subItem.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block pl-14 pr-6 py-2 text-sm text-unaicGold italic"
                                      >
                                        Lihat Halaman Fakultas
                                      </Link>
                                    )}
                                    {subItem.submenu.map((nested: any) => (
                                      <Link
                                        key={nested.key || nested.title}
                                        href={nested.href || '#'}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block pl-14 pr-6 py-2 text-sm text-gray-600 hover:text-unaicNavy"
                                      >
                                        {nested.key ? tMenu(nested.key) : nested.title}
                                      </Link>
                                    ))}
                                  </div>
                                </>
                              ) : (
                                <Link
                                  href={subItem.href || '#'}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="block pl-10 pr-6 py-3 text-sm text-gray-700 hover:text-unaicNavy"
                                >
                                  {subItem.key ? tMenu(subItem.key) : subItem.title}
                                </Link>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href || '#'}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-6 py-3 font-medium text-unaicNavy hover:bg-gray-50"
                    >
                      {item.key ? tMenu(item.key) : item.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

    </header>
  )
}
