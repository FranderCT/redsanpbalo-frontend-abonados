"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { MapPin, Phone, Mail, Clock, ChevronLeft, ChevronRight } from "lucide-react"
// import { Card, CardContent } from "../../Components/Cards"

type Item = {
    key: string
    title: string
    lines: string[]
    Icon: React.ComponentType<{ className?: string }>
    accents: { badge: string; header: string; ring: string }
}

export function Contact() {
    const listRef = useRef<HTMLDivElement>(null)
    const [activeIndex, setActiveIndex] = useState(0)
    // Eliminados atStart y atEnd (no se usan)

    // Data de tarjetas
    const items: Item[] = useMemo(
        () => [
            {
                key: "ubicacion",
                title: "Ubicación",
                lines: [
                    "200 m norte de la Iglesia Central",
                    "Provincia, Cantón, Distrito",
                    "Costa Rica",
                ],
                Icon: MapPin,
                accents: {
                    badge: "bg-gradient-to-br from-sky-500 to-blue-600 shadow-sky-500/25",
                    header: "from-sky-500 to-blue-400",
                    ring: "ring-sky-300",
                },
            },
            {
                key: "telefono",
                title: "Teléfono",
                lines: ["Oficina: 2101-7345", "WhatsApp: 8843-4072"],
                Icon: Phone,
                accents: {
                    badge: "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/25",
                    header: "from-emerald-500 to-teal-400",
                    ring: "ring-emerald-300",
                },
            },
            {
                key: "correo",
                title: "Correo Electrónico",
                lines: ["asadasanpablo.2014@gmail.com"],
                Icon: Mail,
                accents: {
                    badge: "bg-gradient-to-br from-indigo-500 to-blue-600 shadow-indigo-500/25",
                    header: "from-indigo-500 to-blue-400",
                    ring: "ring-indigo-300",
                },
            },
            {
                key: "horario",
                title: "Horario de Atención",
                lines: [
                    "Lunes a Viernes: 8:00 AM - 5:00 PM",
                ],
                Icon: Clock,
                accents: {
                    badge: "bg-gradient-to-br from-sky-500 to-blue-600 shadow-sky-500/25",
                    header: "from-sky-500 to-blue-400",
                    ring: "ring-sky-300",
                },
            },
        ],
        []
    )

    const getScrollDelta = useCallback(() => {
        const el = listRef.current
        if (!el) return 360
        return Math.max(280, Math.min(520, Math.floor(el.clientWidth * 0.9)))
    }, [])

    const scrollBy = (dx: number) => listRef.current?.scrollBy({ left: dx, behavior: "smooth" })

    const scrollToIndex = (index: number) => {
        const el = listRef.current
        if (!el) return
        const child = el.children[index] as HTMLElement | undefined
        if (!child) return
        child.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
    }

    // Teclado
    useEffect(() => {
        const el = listRef.current
        if (!el) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") {
                e.preventDefault()
                if (activeIndex < items.length - 1) {
                    scrollToIndex(activeIndex + 1)
                } else {
                    scrollBy(getScrollDelta())
                }
            } else if (e.key === "ArrowLeft") {
                e.preventDefault()
                if (activeIndex > 0) {
                    scrollToIndex(activeIndex - 1)
                } else {
                    scrollBy(-getScrollDelta())
                }
            }
        }
        el.addEventListener("keydown", onKey)
        return () => el.removeEventListener("keydown", onKey)
    }, [getScrollDelta, activeIndex, items.length])

    // Observación de activo + bordes
    useEffect(() => {
        const el = listRef.current
        if (!el) return

        // Eliminado updateEdges (ya no se usa setAtStart/setAtEnd)
        const updateEdges = () => {} // noop

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
                if (!visible) return
                const idx = Array.from(el.children).indexOf(visible.target as Element)
                if (idx >= 0) setActiveIndex(idx)
            },
            { root: el, threshold: [0.5, 0.75, 1] }
        )

        Array.from(el.children).forEach((child) => observer.observe(child))
        updateEdges()
        const onScroll = () => updateEdges()
        el.addEventListener("scroll", onScroll, { passive: true })
        return () => {
            el.removeEventListener("scroll", onScroll)
            observer.disconnect()
        }
    }, [])


    // Nuevo carrusel tipo "stacked cards"
    const goTo = (idx: number) => {
        if (idx < 0 || idx >= items.length) return;
        setActiveIndex(idx);
    };

    return (
        <section id="contacto" className="py-24 px-6 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                {/* Encabezado */}
                <div className="text-center mb-10 md:mb-14">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3">Contáctenos</h2>
                    <p className="text-lg md:text-xl text-slate-600">
                        Estamos aquí para atender sus consultas, sugerencias y emergencias
                    </p>
                </div>

                {/* Carrusel con 2 cards visibles */}
                <div className="relative mt-6 flex flex-col items-center">
                    <div className="flex items-center justify-center gap-4 w-full max-w-4xl">
                        {/* Flecha izquierda */}
                        <button
                            aria-label="Anterior"
                            onClick={() => goTo(Math.max(0, activeIndex - 2))}
                            disabled={activeIndex === 0}
                            className={`flex items-center justify-center rounded-full h-10 w-10 bg-white ring-1 ring-black/10 shadow transition ${activeIndex === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-slate-100"}`}
                        >
                            <ChevronLeft className="h-5 w-5 text-slate-700" />
                        </button>

                        {/* Grid de 2 cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                            {items.slice(activeIndex, activeIndex + 2).map((item) => (
                                <div
                                    key={item.key}
                                    className="relative bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-xl h-[280px] flex flex-col"
                                    style={{ boxShadow: "0 4px 24px 0 rgba(2,6,23,0.08)" }}
                                >
                                    {/* Barra superior decorativa - PRIMERO */}
                                    <div className={`w-full h-2 bg-gradient-to-r ${item.accents.header} flex-shrink-0`} />
                                    
                                    {/* Detalle visual extra: fondo decorativo */}
                                    <div className="absolute inset-0 pointer-events-none">
                                        <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-blue-100/60 via-transparent to-transparent rounded-full blur-2xl opacity-70" />
                                        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-tr from-emerald-100/60 via-transparent to-transparent rounded-full blur-2xl opacity-60" />
                                    </div>
                                    
                                    <div className="flex flex-col items-center gap-3 py-6 px-6 relative z-10 flex-1 justify-center">
                                        <div className={`w-12 h-12 rounded-xl ${item.accents.badge} shadow-lg flex items-center justify-center mb-1`}>
                                            <item.Icon className="h-7 w-7 text-white" />
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-1 text-center tracking-tight min-h-[32px]">{item.title}</h3>
                                        <div className="space-y-2 text-center flex-1 flex flex-col justify-center">
                                            {item.lines.map((l, idx) => {
                                                const parts = l.split(":");
                                                const hasLabel = parts.length > 1;
                                                const label = hasLabel ? parts[0] : null;
                                                const value = hasLabel ? parts.slice(1).join(":").trim() : l;
                                                return (
                                                    <div key={idx} className="flex flex-col items-center">
                                                        {hasLabel ? (
                                                            <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 mb-1 shadow-sm">{label}</span>
                                                        ) : null}
                                                        <span className="text-slate-700 text-base md:text-lg font-medium">{value}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Flecha derecha */}
                        <button
                            aria-label="Siguiente"
                            onClick={() => goTo(Math.min(items.length - 2, activeIndex + 2))}
                            disabled={activeIndex >= items.length - 2}
                            className={`flex items-center justify-center rounded-full h-10 w-10 bg-white ring-1 ring-black/10 shadow transition ${activeIndex >= items.length - 2 ? "opacity-40 cursor-not-allowed" : "hover:bg-slate-100"}`}
                        >
                            <ChevronRight className="h-5 w-5 text-slate-700" />
                        </button>
                    </div>
                    {/* Dots */}
                    <div className="mt-8 flex items-center justify-center gap-2">
                        {Array.from({ length: Math.ceil(items.length / 2) }).map((_, i) => (
                            <button
                                key={i}
                                aria-label={`Ir a la página ${i + 1}`}
                                onClick={() => goTo(i * 2)}
                                className={`h-2.5 rounded-full transition-all ${
                                    Math.floor(activeIndex / 2) === i ? "w-6 bg-slate-800" : "w-2.5 bg-slate-300 hover:bg-slate-400"
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Mapa */}
                <div className="mt-12 rounded-2xl overflow-hidden h-[400px] bg-slate-100">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1124.7047465969597!2d-85.23129771762576!3d10.030591325105627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f9f99a09c433749%3A0x5cc371d9f957b2f3!2sAsada%20san%20pablo%20nandayure!5e1!3m2!1ses-419!2scr!4v1760098074295!5m2!1ses-419!2scr"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Ubicación ASADA"
                    />
                </div>
            </div>
        </section>
    )
}

