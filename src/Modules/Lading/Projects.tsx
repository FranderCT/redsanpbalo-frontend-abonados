import { Calendar, MapPin } from "lucide-react"

export function Projects() {
    const projects = [
        {
        title: "Ampliación Red de Distribución",
        description:
            "Expansión de la red de distribución de agua potable para nuevas zonas de la comunidad",
        image: "src/assets/images/water-pipes-construction-infrastructure.jpg",
        date: "2024",
        location: "Sector Norte",
        },
        {
        title: "Modernización Planta de Tratamiento",
        description:
            "Actualización de equipos y tecnología en la planta de tratamiento de agua",
        image: "src/assets/images/water-treatment-plant-modern-facility.jpg",
        date: "2023-2024",
        location: "Planta Central",
        },
        {
        title: "Sistema de Monitoreo Digital",
        description:
            "Implementación de sistema digital para monitoreo en tiempo real de la calidad del agua",
        image: "src/assets/images/digital-monitoring-system-technology-water.jpg",
        date: "2024",
        location: "Toda la red",
        },
    ]

    return (
        <section id="proyectos" className="bg-[#091540] px-6 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
            {/* Encabezado */}
            <div className="mb-16 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                Nuestros Proyectos
            </h2>
            <p className="mx-auto max-w-3xl text-lg md:text-xl text-white/85">
                Trabajamos constantemente en mejorar y expandir nuestros servicios para la comunidad
            </p>
            </div>

            {/* Grid de tarjetas */}
            <div className="grid gap-8 md:grid-cols-3">
            {projects.map((p, i) => (
                <div
                key={i}
                className="
                    overflow-hidden rounded-2xl bg-white
                    ring-1 ring-black/10 shadow-sm
                    transition hover:shadow-lg
                "
                >
                {/* Imagen */}
                <div className="aspect-video overflow-hidden">
                    <img
                    src={"https://dynamoprojects.com/wp-content/uploads/2022/12/no-image.jpg"}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                </div>

                {/* Contenido */}
                <div className="p-6">
                    <h3 className="mb-3 text-2xl font-extrabold leading-tight tracking-tight text-slate-900">
                    {p.title}
                    </h3>
                    <p className="mb-4 text-slate-600 leading-relaxed">
                    {p.description}
                    </p>

                    {/* Meta */}
                    <div className="flex flex-col gap-2 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{p.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{p.location}</span>
                    </div>
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>
        </section>
    )
}
