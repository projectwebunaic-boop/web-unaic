import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Karena kita menggunakan @theme di globals.css,
      // Tailwind v4 akan otomatis mengambil nilai-nilai tersebut.
      // Blok ini bisa digunakan untuk ekstensi tambahan jika diperlukan.
    },
  },
  plugins: [],
}

export default config