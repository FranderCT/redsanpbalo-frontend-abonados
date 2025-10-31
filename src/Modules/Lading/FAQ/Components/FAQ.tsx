"use client"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { useGetAllFAQs } from "../Hooks/FAQHooks"

export function FAQ() {
    // const faqs = [
    //     { question: "¿Qué es una ASADA?", answer: "Una ASADA (Asociación Administradora de Sistemas de Acueductos y Alcantarillados Comunales) es una organización comunitaria sin fines de lucro que administra y opera los sistemas de agua potable y alcantarillado sanitario en comunidades rurales y urbanas de Costa Rica." },
    //     { question: "¿Cómo puedo afiliarme a la ASADA?", answer: "Para afiliarse, debe presentar una solicitud en nuestras oficinas con los documentos requeridos: cédula de identidad, escritura de la propiedad o contrato de alquiler, y comprobante de domicilio. Nuestro personal le guiará en el proceso de inscripción." },
    //     { question: "¿Cuál es el horario de atención?", answer: "Nuestro horario de atención al público es de lunes a viernes de 8:00 AM a 4:00 PM. Para emergencias fuera de horario, contamos con un servicio de guardia disponible las 24 horas." },
    //     { question: "¿Cómo reporto una fuga o emergencia?", answer: "Puede reportar emergencias llamando a nuestro número de atención 24/7, enviando un mensaje por WhatsApp, o visitando nuestras oficinas. Es importante reportar las fugas lo antes posible para evitar desperdicios y daños mayores." },
    //     { question: "¿Cómo se calcula la tarifa del agua?", answer: "La tarifa se calcula según el consumo mensual medido por el contador. Aplicamos tarifas progresivas aprobadas por ARESEP, donde el costo por metro cúbico aumenta según el nivel de consumo. También incluye un cargo fijo por mantenimiento del sistema." },
    //     { question: "¿Qué hago si mi recibo viene muy alto?", answer: "Si nota un aumento inusual en su consumo, primero revise si hay fugas en su propiedad. Puede solicitar una revisión del medidor en nuestras oficinas. También ofrecemos planes de pago para facilitar el cumplimiento de sus obligaciones." },
    //     { question: "¿El agua es potable y segura?", answer: "Sí, realizamos análisis de calidad del agua regularmente según los estándares del Ministerio de Salud. Nuestro sistema cuenta con procesos de tratamiento y desinfección para garantizar agua segura para el consumo humano." },
    //     { question: "¿Puedo participar en las decisiones de la ASADA?", answer: "Sí, todos los usuarios afiliados tienen derecho a participar en las asambleas generales donde se toman decisiones importantes. También pueden postularse para formar parte de la Junta Directiva durante las elecciones anuales." },
    // ]

    const [openIndex, setOpenIndex] = useState<number | null>(0)
    const { faqs, isPending, error } = useGetAllFAQs()

    if (isPending) {
        return <div>Cargando preguntas frecuentes...</div>
    }

    if (error) {
        return <div>Error al cargar las preguntas frecuentes</div>
    }

    return (
        <section id="faq" className="bg-slate-50 px-6 py-20 md:py-24">
        <div className="mx-auto max-w-4xl">
            <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                Preguntas Frecuentes
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-slate-600">
                Encuentra respuestas a las preguntas más comunes sobre nuestros servicios
            </p>
            </div>

            <div className="space-y-4">
            {faqs?.map((faq, index) => {
                const isOpen = openIndex === index
                const contentId = `faq-panel-${index}`
                return (
                <div
                    key={index}
                    className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/10 transition hover:shadow-md"
                >
                    {/* Header */}
                    <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-start justify-between gap-4 p-6 text-left"
                    >
                    <h3 className="pr-8 text-lg font-semibold text-slate-900">
                        {faq.Question}
                    </h3>
                    <ChevronDown
                        className={`h-5 w-5 flex-shrink-0 text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                    </button>

                    {/* Contenido colapsable */}
                    <div
                    id={contentId}
                    className={`grid transition-all duration-300 ease-in-out min-h-0 ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                    >
                    <div className="min-h-0 overflow-hidden px-6">
                        <p className="leading-relaxed text-slate-600 px-2 pb-6">
                        {faq.Answer}
                        </p>
                    </div>
                    </div>
                </div>
                )
            })}
            </div>
        </div>
        </section>
    )
}
