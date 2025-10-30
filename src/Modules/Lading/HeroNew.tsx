import { Link } from "@tanstack/react-router";


const Hero = () => {
  return (
    <section id="inicio" className="relative min-h-screen bg-[#F9F5FF] pt-20">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#091540]/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#091540]/15 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-[#091540]/10 rounded-full blur-lg"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          
          {/* Content Side */}
          <div className="space-y-8">
            <div className="space-y-6">
              {/* Badge */}
              

              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="block text-[#091540]">ASADA</span>
                <span className="block text-[#091540]">San Pablo</span>
                <span className="block text-[#091540]">Nandayure</span>
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-[#091540]/80 leading-relaxed max-w-lg">
                Brindamos servicios de agua potable de calidad a la comunidad de San Pablo, 
                garantizando acceso confiable y sostenible para todos nuestros usuarios.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#091540] text-white font-semibold hover:bg-[#1789FC] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Acceder al Sistema
              </Link>
              
              <a 
                href="#servicios"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/80 backdrop-blur-sm text-[#091540] font-semibold border border-[#091540]/20 hover:bg-[#091540] hover:text-white transition-all duration-300 shadow-sm"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                Conocer Servicios
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-[#091540]">600+</div>
                <div className="text-sm text-[#091540]/70">Abonados Activos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-[#091540]">24/7</div>
                <div className="text-sm text-[#091540]/70">Servicio Continuo</div>
              </div>
            </div>
          </div>

          {/* Visual Side */}
          <div className="relative">
            {/* Main visual container */}
            <div className="relative">
              {/* Background card */}
              <div className="absolute inset-0 bg-gradient-to-br from-white to-[#F9F5FF] rounded-3xl shadow-2xl transform rotate-3"></div>
              
              {/* Main card */}
              <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                {/* Logo showcase */}


                {/* Features grid */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#091540]/10 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#091540]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#091540]">Agua Potable Certificada</h3>
                      <p className="text-sm text-[#091540]/70">Calidad garantizada</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#091540]/10 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#091540]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#091540]">Servicio 24/7</h3>
                      <p className="text-sm text-[#091540]/70">Disponibilidad continua</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#091540]/10 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#091540]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#091540]">Atención Personalizada</h3>
                      <p className="text-sm text-[#091540]/70">Soporte dedicado</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#091540] rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom wave */}
      
    </section>
  );
};

export default Hero;