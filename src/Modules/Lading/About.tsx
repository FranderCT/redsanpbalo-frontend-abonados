export function About() {
  return (
    <section id="sobre-nosotros" className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Image side */}
          <div className="relative max-w-[500px] mx-auto lg:mx-0">
            <div className="absolute -top-4 -left-4 h-24 w-24 bg-[#005CAF] z-0" />
            <div className="relative overflow-hidden rounded-none bg-slate-100 shadow-[0_28px_70px_rgba(9,21,64,0.22)] ring-1 ring-black/5">
              <img
                src="/Tubos.jpeg"
                alt="Instalaciones ASADA"
                className="relative z-10 h-[420px] w-full object-cover object-[center_60%]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#091540]/10 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-white/5 backdrop-blur-[0.8px] pointer-events-none" />
            </div>
            <div className="absolute -bottom-8 -right-8 hidden bg-[#005CAF] p-8 text-white z-20 md:block shadow-[0_18px_40px_rgba(9,21,64,0.22)]">
              <p className="text-4xl font-black">25+</p>
              <p className="text-xs uppercase tracking-widest">Años de Excelencia</p>
            </div>
          </div>

          {/* Text side */}
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-black text-[#091540]">
              Nuestra Historia es{" "}
              <span className="text-[#005CAF]">Transparencia</span>.
            </h2>
            <p className="text-lg text-[#404754] leading-relaxed">
              La ASADA de San Pablo nació de la necesidad comunal por un servicio
              que pusiera la calidad humana y técnica por encima de todo. Hoy, somos
              un referente regional en la gestión de acueductos rurales, operando con
              tecnología de punta y un equipo humano dedicado 24/7.
            </p>
            <p className="text-lg text-[#404754] leading-relaxed">
              Nuestra infraestructura garantiza un suministro ininterrumpido incluso
              en las condiciones climáticas más exigentes de nuestra zona, sirviendo
              a toda la comunidad de San Pablo, Nandayure.
            </p>

            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <h4 className="font-black text-[#005CAF] text-2xl">100%</h4>
                <p className="text-xs uppercase tracking-widest font-bold text-[#091540]">
                  Potabilidad Certificada
                </p>
              </div>
              <div>
                <h4 className="font-black text-[#005CAF] text-2xl">600+</h4>
                <p className="text-xs uppercase tracking-widest font-bold text-[#091540]">
                  Abonados Activos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
