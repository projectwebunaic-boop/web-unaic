import { FaHeartbeat, FaFlask, FaChartLine } from "react-icons/fa";
import type { IconType } from "react-icons";

export interface Faculty {
    name: string;
    slug: string;
    key: string;
    icon: IconType;
    link: string;
    programs: {
        name: string;
        slug: string;
        key: string;
    }[];
}

export const faculties: Faculty[] = [
    {
        name: "Fakultas Ilmu Kesehatan",
        slug: "ilmu-kesehatan",
        key: "health",
        icon: FaHeartbeat,
        link: "/fakultas/ilmu-kesehatan",
        programs: [
            { name: "D3 Kebidanan", slug: "d3-kebidanan", key: "d3_midwifery" },
            { name: "D3 Keperawatan", slug: "d3-keperawatan", key: "d3_nursing" },
            { name: "Profesi Bidan", slug: "profesi-bidan", key: "prof_midwife" },
            { name: "Profesi Ners", slug: "profesi-ners", key: "prof_nurse" },
            { name: "S1 Fisioterapi", slug: "s1-fisioterapi", key: "s1_physio" },
            { name: "S1 Kebidanan", slug: "s1-kebidanan", key: "s1_midwifery" },
            { name: "S1 Keperawatan", slug: "s1-keperawatan", key: "s1_nursing" },
        ],
    },
    {
        name: "Fakultas Farmasi, Sains & Teknologi",
        slug: "farmasi-sains-teknologi",
        key: "science",
        icon: FaFlask,
        link: "/fakultas/farmasi-sains-teknologi",
        programs: [
            { name: "D3 Farmasi", slug: "d3-farmasi", key: "d3_pharmacy" },
            { name: "D4 Teknologi Laboratorium Medis", slug: "d4-tlm", key: "d4_tlm" },
            { name: "Profesi Apoteker", slug: "profesi-apoteker", key: "prof_apothecary" },
            { name: "S1 Farmasi", slug: "s1-farmasi", key: "s1_pharmacy" },
            { name: "S1 Informatika", slug: "s1-informatika", key: "s1_informatics" },
        ],
    },
    {
        name: "Fakultas Ekonomi & Bisnis",
        slug: "ekonomi-bisnis",
        key: "business",
        icon: FaChartLine,
        link: "/fakultas/ekonomi-bisnis",
        programs: [
            { name: "S1 Bisnis Digital", slug: "s1-bisnis-digital", key: "s1_digital_business" },
            { name: "S1 Kewirausahaan", slug: "s1-kewirausahaan", key: "s1_entrepreneurship" },
        ],
    },
];