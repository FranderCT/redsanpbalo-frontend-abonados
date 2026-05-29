import { Link } from "@tanstack/react-router";


const Hero = () => {
  return (
    <section
      id="inicio"
      className="relative h-[80vh] md:h-[90vh] flex items-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/Hero_image.jpg"
          alt="Fondo agua"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#091540]/80 via-[#091540]/40 to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.9] mb-8">
            Agua Pura para Nuestra Comunidad
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-xl mb-10 leading-relaxed">
            Gestionamos el recurso hídrico con precisión técnica y transparencia
            absoluta para asegurar el bienestar de San Pablo.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/dashboard"
              className="bg-[#005CAF] text-white px-8 md:px-10 py-4 md:py-5 text-base md:text-lg font-bold uppercase tracking-widest shadow-2xl hover:-translate-y-0.5 transition-transform"
            >
              Acceder al Sistema
            </Link>
            <a
              href="#servicios"
              className="bg-white/10 backdrop-blur-md text-white border-2 border-white px-8 md:px-10 py-4 md:py-5 text-base md:text-lg font-bold uppercase tracking-widest hover:bg-white hover:text-[#091540] transition-all"
            >
              Ver Servicios
            </a>
          </div>
        </div>
      </div>

      {/* Geometric accent */}
      <div className="absolute bottom-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-[#005CAF] opacity-20 z-0"></div>
      <div className="absolute top-20 right-20 w-16 h-16 bg-[#005CAF] opacity-30 z-0"></div>
    </section>
  );
};

export default Hero;
