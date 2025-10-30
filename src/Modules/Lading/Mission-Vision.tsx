import { Target, Eye } from "lucide-react"

export function MissionVision() {
    return (
        <section id="mision-y-vision" className="px-6 py-20 md:py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl">
            {/* Misión / Visión */}
            <div className="grid items-start gap-8 md:gap-12 md:grid-cols-2">
            {/* Misión */}
            <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                <div className="relative bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-xl hover:border-cyan-200/50 transition-all duration-300 space-y-6">
                <div className="mb-2 inline-flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/25 group-hover:scale-110 transition-transform duration-300">
                    <Target className="h-7 w-7 text-white" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                    Nuestra Misión
                    </h2>
                </div>

                <div className="h-1 w-16 bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full"></div>

                <p className="text-base md:text-lg leading-relaxed text-slate-600">
                    Nuestra razón de ser es garantizar el acceso a agua potable de calidad a la comunidad de San Pablo y sus alrededores,
                    atendiendo una necesidad vital para la salud y el bienestar. Nos dirigimos a todas las familias,
                    instituciones y comercios de la zona, brindando el servicio mediante el uso responsable de los recursos,
                    la gestión eficiente y la rendición transparente de cuentas a la comunidad.
                </p>
                </div>
            </div>

            {/* Visión */}
            <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                <div className="relative bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-xl hover:border-emerald-200/50 transition-all duration-300 space-y-6">
                <div className="mb-2 inline-flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform duration-300">
                    <Eye className="h-7 w-7 text-white" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                    Nuestra Visión
                    </h2>
                </div>

                <div className="h-1 w-16 bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full"></div>

                <p className="text-base md:text-lg leading-relaxed text-slate-600">
                    Ser una institución modelo en la gestión y distribución de agua potable en la región,
                    logrando la expansión de los servicios hacia Cangelito y Pavones mediante la integración de las ASADAS,
                    y consolidándonos como una organización reconocida por su transparencia, responsabilidad y sostenibilidad,
                    que contribuya al bienestar y desarrollo de todas las comunidades.
                </p>
                </div>
            </div>
            </div>

            {/* Imagen */}
            <div className="mt-16 group relative">
            <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-emerald-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"></div>
            <div className="relative overflow-hidden rounded-2xl ring-1 ring-slate-900/10 shadow-xl hover:shadow-2xl transition-all duration-300">
                <img
                // src="src/assets/images/community-water-project-people-working-together.jpg"
                src="https://dynamoprojects.com/wp-content/uploads/2022/12/no-image.jpg"
                alt="Comunidad trabajando junta"
                className="h-[420px] w-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            </div>
        </div>
        </section>
    )
}
