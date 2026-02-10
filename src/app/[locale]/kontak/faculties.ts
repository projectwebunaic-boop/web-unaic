import { FaHeartbeat, FaFlask, FaChartLine } from "react-icons/fa";
import type { IconType } from "react-icons";

export interface Faculty {
  name: string;
  slug: string;
  icon: IconType;
  link: string;
  programs: {
    name: string;
    slug: string;
  }[];
}

export const faculties: Faculty[] = [
  {
    name: "Fakultas Ilmu Kesehatan",
    slug: "ilmu-kesehatan",
    icon: FaHeartbeat,
    link: "/fakultas/ilmu-kesehatan",
    programs: [
      { name: "D3 Kebidanan", slug: "d3-kebidanan" },
      { name: "D3 Keperawatan", slug: "d3-keperawatan" },
      { name: "Profesi Bidan", slug: "profesi-bidan" },
      { name: "Profesi Ners", slug: "profesi-ners" },
      { name: "S1 Fisioterapi", slug: "s1-fisioterapi" },
      { name: "S1 Kebidanan", slug: "s1-kebidanan" },
      { name: "S1 Keperawatan", slug: "s1-keperawatan" },
    ],
  },
  {
    name: "Fakultas Farmasi, Sains & Teknologi",
    slug: "farmasi-sains-teknologi",
    icon: FaFlask,
    link: "/fakultas/farmasi-sains-teknologi",
    programs: [
      { name: "D3 Farmasi", slug: "d3-farmasi" },
      { name: "D4 Teknologi Laboratorium Medis", slug: "d4-tlm" },
      { name: "Profesi Apoteker", slug: "profesi-apoteker" },
      { name: "S1 Farmasi", slug: "s1-farmasi" },
      { name: "S1 Informatika", slug: "s1-informatika" },
    ],
  },
  {
    name: "Fakultas Ekonomi & Bisnis",
    slug: "ekonomi-bisnis",
    icon: FaChartLine,
    link: "/fakultas/ekonomi-bisnis",
    programs: [
      { name: "S1 Bisnis Digital", slug: "s1-bisnis-digital" },
      { name: "S1 Kewirausahaan", slug: "s1-kewirausahaan" },
    ],
  },
];