export interface Leader {
  name: string;
  position: string;
  photo: string;
}

export const rektor: Leader = {
  name: "Sarwa, AMK., S.Pd., M.Kes.",
  position: "Rektor Universitas Al-Irsyad Cilacap",
  photo: "/images/pimpinan/rektor.png",
};

export const wakilRektor: Leader[] = [
  {
    name: "apt. Mika Tri Kumala Swandari, M.Sc",
    position: "Wakil Rektor I",
    photo: "/images/pimpinan/warek1.png",
  },
  {
    name: "Yogi Andhi Lestari, S.ST., M.Keb.",
    position: "Wakil Rektor II",
    photo: "/images/pimpinan/warek2.png",
  },
  {
    name: "Agus Prasetyo, M.Kep., Ns.",
    position: "Wakil Rektor III",
    photo: "/images/pimpinan/warek3.png",
  },
];

export const dekanFakultas: Leader[] = [
  {
    name: "Dr. Johariyah., M. Keb.",
    position: "Dekan Fakultas Ilmu Kesehatan",
    photo: "/images/pimpinan/dekan1.png",
  },
  {
    name: "Dr. apt. Yuhansyah Nurfauzi, M.Si.",
    position: "Dekan Fakultas Farmasi, Sains & Teknologi",
    photo: "/images/pimpinan/dekan2.png",
  },
  {
    name: "Dr Opi Irawansyah, M.PdI.",
    position: "Dekan Fakultas Ekonomi & Bisnis",
    photo: "/images/pimpinan/dekan3.png",
  },
];