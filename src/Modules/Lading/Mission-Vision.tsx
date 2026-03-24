import { Target, Eye } from "lucide-react";

export function MissionVision() {
  return (
    <section id="mision-y-vision" className="flex flex-col lg:flex-row">
      {/* Misión */}
      <div className="flex-1 bg-[#091540] text-white p-16 md:p-24 flex flex-col justify-center">
        <Target className="w-16 h-16 text-[#005CAF] mb-8" />
        <h2 className="text-4xl font-black mb-6 uppercase tracking-tighter">
          Nuestra Misión
        </h2>
        <p className="text-xl leading-relaxed text-white/80 italic border-l-4 border-[#005CAF] pl-6">
          "Garantizar el acceso a agua potable de calidad a la comunidad de San Pablo
          y sus alrededores, mediante el uso responsable de los recursos, la gestión
          eficiente y la rendición transparente de cuentas a la comunidad."
        </p>
      </div>

      {/* Visión */}
      <div className="flex-1 bg-[#005CAF] text-white p-16 md:p-24 flex flex-col justify-center">
        <Eye className="w-16 h-16 text-white mb-8" />
        <h2 className="text-4xl font-black mb-6 uppercase tracking-tighter">
          Nuestra Visión
        </h2>
        <p className="text-xl leading-relaxed text-white/90 italic border-l-4 border-white pl-6">
          "Ser una institución modelo en la gestión y distribución de agua potable en
          la región, consolidándonos como una organización reconocida por su
          transparencia, responsabilidad y sostenibilidad, contribuyendo al bienestar
          de todas las comunidades."
        </p>
      </div>
    </section>
  );
}
