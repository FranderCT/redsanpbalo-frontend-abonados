export function About() {
  return (
    <section id="sobre-nosotros" className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#006D42] z-0"></div>
            <img
              src="/ASADA-San Pablo.jpg"
              alt="Instalaciones ASADA"
              className="relative z-10 w-full h-[400px] md:h-[500px] object-cover shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-8 -right-8 p-8 bg-[#005CAF] text-white z-20 hidden md:block">
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
