import type { Config } from "tailwindcss";

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
      colors: {
        primary: '#1B6DF5',    // azul (ícono Comunidad)
        accent: '#3DDA7E',     // verde (ícono Compromiso)
        secondary: '#041D35',  // azul oscuro (ícono Confianza)
      },
    },
  },
} satisfies Config;