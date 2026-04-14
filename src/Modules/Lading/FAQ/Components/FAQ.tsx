"use client"
import { useState } from "react";
import { Plus } from "lucide-react";
import { useGetAllFAQs } from "../Hooks/FAQHooks";

export function FAQ() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const { faqs, isPending, error } = useGetAllFAQs();

  if (isPending) {
    return (
      <section id="faq" className="py-24 bg-white">
        <div className="container mx-auto px-6 md:px-12 text-center text-[#404754]">
          Cargando preguntas frecuentes...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="faq" className="py-24 bg-white">
        <div className="container mx-auto px-6 md:px-12 text-center text-red-500">
          Error al cargar las preguntas frecuentes
        </div>
      </section>
    );
  }

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-4 text-[#091540]">
            Preguntas Frecuentes
          </h2>
          <p className="text-[#404754]">
            Todo lo que necesita saber sobre su servicio de agua.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs?.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#c0c6d6]"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="flex w-full items-start justify-between gap-4 p-6 text-left transition-colors hover:bg-gray-50"
              >
                <span className="min-w-0 flex-1 font-bold text-lg text-[#091540] break-words [overflow-wrap:anywhere]">
                  {faq.Question}
                </span>
                <Plus
                  className={`ml-4 shrink-0 text-[#005CAF] transition-transform duration-300 ${
                    activeFaq === idx ? "rotate-45" : ""
                  }`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  activeFaq === idx ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <p className="px-6 pb-6 text-[#404754] leading-relaxed break-words [overflow-wrap:anywhere]">
                    {faq.Answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
