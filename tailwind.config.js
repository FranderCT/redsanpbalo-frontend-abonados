// tailwind.config.js
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // 📦 Escanea todos tus componentes React
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: '#1B6DF5',    // azul (ícono Comunidad)
        accent: '#3DDA7E',     // verde (ícono Compromiso)
        secondary: '#041D35',  // azul oscuro (ícono Confianza)
      },
    },
  },
  plugins: [],
};
