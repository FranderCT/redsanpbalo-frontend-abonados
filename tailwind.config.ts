import type { Config } from "tailwindcss";
import scrollbar from "tailwind-scrollbar";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",   // ajusta rutas si usas otra estructura
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        oswald: ["Oswald", "sans-serif"],
      },
    },
  },
} satisfies Config;