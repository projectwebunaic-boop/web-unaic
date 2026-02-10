"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useState, useEffect, useTransition } from "react";
import { Globe, Check } from "lucide-react";
import { Listbox } from "@headlessui/react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const languages = [
    { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
    { code: "en", label: "English", flag: "🇬🇧" },
  ];

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className="relative z-50">
      <Listbox value={locale} onChange={handleLanguageChange}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-full bg-gray-100 pl-3 pr-10 py-1.5 text-left text-unaicNavy focus:outline-none focus-visible:border-unaicBlue focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm hover:bg-gray-200 transition-colors">
            <span className="flex items-center gap-2 truncate">
              <Globe className="w-4 h-4 text-unaicNavy" />
              <span className="uppercase font-bold">{locale}</span>
            </span>
          </Listbox.Button>
          <Listbox.Options className="absolute left-0 mt-2 max-h-60 w-40 overflow-auto rounded-md bg-white py-1 text-base shadow-xl ring-1 ring-black/5 focus:outline-none sm:text-sm z-[100]">
            {languages.map((lang) => (
              <Listbox.Option
                key={lang.code}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? "bg-unaicBlue/10 text-unaicBlue" : "text-gray-900"
                  }`
                }
                value={lang.code}
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? "font-bold" : "font-normal"}`}>
                      {lang.flag} {lang.label}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-unaicBlue">
                        <Check className="h-4 w-4" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
}
