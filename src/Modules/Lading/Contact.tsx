"use client"

import { useRef } from "react"
import { MapPin, Phone, Mail, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "../../Components/Cards"

export function Contact() {
    const listRef = useRef<HTMLDivElement>(null)
    const scrollBy = (dx: number) => listRef.current?.scrollBy({ left: dx, behavior: "smooth" })

    return (
        <section id="contacto" className="py-24 px-6 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                {/* Encabezado */}
                <div className="text-center mb-10 md:mb-14">
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3">
                    Contáctenos
                </h2>
                <p className="text-lg md:text-xl text-slate-600">
                    Estamos aquí para atender sus consultas, sugerencias y emergencias
                </p>
                </div>

                {/* Carrusel */}
                <div className="relative mt-6">
                {/* Flechas */}
                <button
                    aria-label="Anterior"
                    onClick={() => scrollBy(-380)}
                    className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-white/90 ring-1 ring-black/10 shadow hover:bg-white"
                >
                    <ChevronLeft className="h-5 w-5 text-slate-700" />
                </button>
                <button
                    aria-label="Siguiente"
                    onClick={() => scrollBy(380)}
                    className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-white/90 ring-1 ring-black/10 shadow hover:bg-white"
                >
                    <ChevronRight className="h-5 w-5 text-slate-700" />
                </button>

                {/* Contenedor scrollable */}
                <div
                    ref={listRef}
                    className="
                    flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2
                    pl-6 pr-6 md:pl-14 md:pr-14
                    [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
                    [scroll-padding-inline:1.5rem] md:[scroll-padding-inline:3.5rem]
                    "
                >
                    {/* Card: Ubicación */}
                    <Card className="shrink-0 w-[320px] md:w-[360px] bg-white text-slate-900 ring-1 ring-black/10 shadow-sm hover:shadow-md transition snap-start">
                    <CardContent className="p-6 md:p-7">
                        <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#0b4e78]/10 flex items-center justify-center flex-shrink-0">
                            <MapPin className="h-6 w-6 text-[#0b4e78]" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-2xl font-bold leading-tight text-slate-900 mb-2">Ubicación</h3>
                            <p className="text-slate-600 leading-relaxed">
                            200 metros norte de la Iglesia Central<br/>
                            Provincia, Cantón, Distrito<br/>
                            Costa Rica
                            </p>
                        </div>
                        </div>
                    </CardContent>
                    </Card>

                    {/* Card: Teléfono */}
                    <Card className="shrink-0 w-[320px] md:w-[360px] bg-white text-slate-900 ring-1 ring-black/10 shadow-sm hover:shadow-md transition snap-start">
                    <CardContent className="p-6 md:p-7">
                        <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#3DDA7E]/10 flex items-center justify-center flex-shrink-0">
                            <Phone className="h-6 w-6 text-[#3DDA7E]" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-2xl font-bold leading-tight text-slate-900 mb-2">Teléfono</h3>
                            <p className="text-slate-600 leading-relaxed">
                            Oficina: 2XXX-XXXX<br/>
                            Emergencias: 8XXX-XXXX<br/>
                            WhatsApp: 8XXX-XXXX
                            </p>
                        </div>
                        </div>
                    </CardContent>
                    </Card>

                    {/* Card: Correo */}
                    <Card className="shrink-0 w-[320px] md:w-[360px] bg-white text-slate-900 ring-1 ring-black/10 shadow-sm hover:shadow-md transition snap-start">
                    <CardContent className="p-6 md:p-7">
                        <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#1B6DF5]/10 flex items-center justify-center flex-shrink-0">
                            <Mail className="h-6 w-6 text-[#1B6DF5]" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-2xl font-bold leading-tight text-slate-900 mb-2">Correo Electrónico</h3>
                            <p className="text-slate-600 leading-relaxed">
                            info@asada.cr<br/>
                            emergencias@asada.cr
                            </p>
                        </div>
                        </div>
                    </CardContent>
                    </Card>

                    {/* Card: Horario */}
                    <Card className="shrink-0 w-[320px] md:w-[360px] bg-white text-slate-900 ring-1 ring-black/10 shadow-sm hover:shadow-md transition snap-start">
                    <CardContent className="p-6 md:p-7">
                        <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#0b4e78]/10 flex items-center justify-center flex-shrink-0">
                            <Clock className="h-6 w-6 text-[#0b4e78]" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-2xl font-bold leading-tight text-slate-900 mb-2">Horario de Atención</h3>
                            <p className="text-slate-600 leading-relaxed">
                            Lunes a Viernes: 8:00 AM - 4:00 PM<br/>
                            Sábados: 8:00 AM - 12:00 PM<br/>
                            Emergencias: 24/7
                            </p>
                        </div>
                        </div>
                    </CardContent>
                    </Card>
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

