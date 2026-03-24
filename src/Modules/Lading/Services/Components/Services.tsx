import React from "react";
import {
  ArrowRight,
  HelpCircle,
  Droplets,
  Activity,
  BadgeCheck,
  BellRing,
  MessageCircle,
  Zap,
  Wrench,
  FileText,
  Phone,
} from "lucide-react";
import { useGetAllServices } from "../Hooks/ServicesHooks";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  "activity": Activity,
  "badge-check": BadgeCheck,
  "bell-ring": BellRing,
  "message-circle": MessageCircle,
  "zap": Zap,
  "droplets": Droplets,
  "wrench": Wrench,
  "file-text": FileText,
  "phone": Phone,
};

export function Services() {
  const { services, isPending, error } = useGetAllServices();

  const getIconComponent = (iconName?: string) => {
    if (!iconName) return Droplets;
    return ICON_MAP[iconName.toLowerCase()] || HelpCircle;
  };

  if (isPending) {
    return (
      <section id="servicios" className="py-24 bg-white">
        <div className="container mx-auto px-6 md:px-12 text-center text-[#404754]">
          Cargando servicios...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="servicios" className="py-24 bg-white">
        <div className="container mx-auto px-6 md:px-12 text-center text-red-500">
          Error al cargar los servicios
        </div>
      </section>
    );
  }

  const list = services ?? [];

  return (
    <section id="servicios" className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4 text-[#091540]">
            Servicios Institucionales
          </h2>
          <div className="w-24 h-2 bg-[#005CAF]"></div>
        </div>

        {/* Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 ${
            list.length >= 4 ? "lg:grid-cols-4" : `lg:grid-cols-${Math.min(list.length, 3)}`
          }`}
        >
          {list.map((service, idx) => {
            const IconComponent = getIconComponent(service.Icon);
            return (
              <div
                key={idx}
                className="p-10 border border-[#c0c6d6] hover:bg-[#005CAF] group transition-colors cursor-pointer"
              >
                <IconComponent className="w-12 h-12 text-[#005CAF] group-hover:text-white mb-6 transition-colors" />
                <h3 className="text-xl font-bold mb-4 text-[#091540] group-hover:text-white transition-colors">
                  {service.Title}
                </h3>
                <p className="text-[#404754] group-hover:text-white/80 mb-6 transition-colors text-sm leading-relaxed">
                  {service.Description}
                </p>
                <span className="inline-flex items-center text-[#005CAF] group-hover:text-white font-bold uppercase text-xs tracking-widest transition-colors">
                  Ver más <ArrowRight className="ml-2 w-4 h-4" />
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
