import prisma from "@/lib/prisma";
import { getLocale, getTranslations } from "next-intl/server";
import PmbContent from "./PmbContent";

export const dynamic = 'force-dynamic';

async function getPmbConfig() {
    let config = await prisma.pmbConfig.findUnique({
        where: { id: "singleton" },
    });

    if (!config) {
        config = await prisma.pmbConfig.create({
            data: { id: "singleton" }
        });
    }

    return config;
}

export default async function PMBPage() {
    const config = await getPmbConfig();
    const t = await getTranslations("PMB");
    const locale = await getLocale();

    const isEn = locale === 'en';

    const heroTitle = isEn ? (config.heroTitleEn || config.heroTitle) : config.heroTitle;
    const heroSubtitle = isEn ? (config.heroSubtitleEn || config.heroSubtitle) : config.heroSubtitle;

    const ctaTitle = isEn ? (config.ctaTitleEn || config.ctaTitle) : config.ctaTitle;
    const ctaDesc = isEn ? (config.ctaDescEn || config.ctaDesc) : config.ctaDesc;

    return (
        <PmbContent
            heroTitle={heroTitle || t("heroTitle")}
            heroSubtitle={heroSubtitle || ""}
            ctaTitle={ctaTitle || "Siap untuk Memulai Masa Depan Gemilang?"}
            ctaDesc={ctaDesc || t("wavesDesc")}
            registrationUrl={config.registrationUrl || "https://pmb.universitasalirsyad.ac.id/"}
            translations={{
                registerNow: t("registerNow"),
                viewProdi: t("viewProdi"),
                whyChooseTitle: t("whyChooseTitle"),
                wavesTitle: t("wavesTitle"),
                wavesDesc: t("wavesDesc"),
                scheduleBtn: t("scheduleBtn"),
                reasons: {
                    accredited: t("reasons.accredited"),
                    accreditedDesc: t("reasons.accreditedDesc"),
                    lecturers: t("reasons.lecturers"),
                    lecturersDesc: t("reasons.lecturersDesc"),
                    curriculum: t("reasons.curriculum"),
                    curriculumDesc: t("reasons.curriculumDesc"),
                    facilities: t("reasons.facilities"),
                    facilitiesDesc: t("reasons.facilitiesDesc")
                }
            }}
        />
    );
}
