import { Target, Eye } from "lucide-react"

export function MissionVision() {
    return (
        <section className="px-6 py-20 md:py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl">
            {/* Misión / Visión */}
            <div className="grid items-start gap-12 md:grid-cols-2">
            {/* Misión */}
            <div className="space-y-6">
                <div className="mb-2 inline-flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-600/15 ring-1 ring-cyan-600/20">
                    <Target className="h-6 w-6 text-cyan-700" />
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                    Nuestra Misión
                </h2>
                </div>

                <p className="text-base md:text-lg leading-relaxed text-slate-600">
                Proveer servicios de acueducto y alcantarillado sanitario de calidad, garantizando el acceso al agua
                potable para toda nuestra comunidad, mediante una gestión eficiente, sostenible y transparente de los
                recursos hídricos.
                </p>
                <p className="text-base md:text-lg leading-relaxed text-slate-600">
                Nos comprometemos a mantener y mejorar continuamente nuestra infraestructura, promoviendo el uso
                responsable del agua y el cuidado del medio ambiente.
                </p>
            </div>

            {/* Visión */}
            <div className="space-y-6">
                <div className="mb-2 inline-flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/15 ring-1 ring-emerald-600/20">
                    <Eye className="h-6 w-6 text-emerald-700" />
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                    Nuestra Visión
                </h2>
                </div>

                <p className="text-base md:text-lg leading-relaxed text-slate-600">
                Ser reconocidos como una organización modelo en la gestión comunitaria del agua, brindando servicios de
                excelencia que contribuyan al desarrollo sostenible y al bienestar de nuestra comunidad.
                </p>
                <p className="text-base md:text-lg leading-relaxed text-slate-600">
                Aspiramos a ser líderes en innovación y sostenibilidad, garantizando el acceso al agua potable para las
                generaciones presentes y futuras.
                </p>
            </div>
            </div>

            {/* Imagen */}
            <div className="mt-16 overflow-hidden rounded-2xl ring-1 ring-black/10 shadow-lg">
            <img
                src="src/assets/images/community-water-project-people-working-together.jpg"
                alt="Comunidad trabajando junta"
                className="h-[420px] w-full object-cover"
                loading="lazy"
            />
            </div>
        </div>
        </section>
    )
}
