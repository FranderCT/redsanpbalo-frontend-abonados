import React from "react";
import {
  ChevronLeft,
  ChevronRight,
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

import { Card, CardContent, CardDescription, CardIcon, CardTitle } from "../../../../Components/Cards";
import { useGetAllServices } from "../Hooks/ServicesHooks";

// Mapa de iconos
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
  const scrollerRef = React.useRef<HTMLDivElement>(null);

  const getIconComponent = (iconName?: string) => {
    if (!iconName) return Droplets;
    return ICON_MAP[iconName.toLowerCase()] || HelpCircle;
  };

  const scrollPage = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir === "left" ? -el.clientWidth : el.clientWidth,
      behavior: "smooth",
    });
  };

  if (isPending) return <div>Cargando servicios...</div>;
  if (error) return <div>Error al cargar los servicios</div>;

  const list = services ?? [];
  const useCarousel = list.length > 4;

  // ✅ Si hay pocos, definimos columnas para que llenen el espacio
  const colsForFew =
    list.length === 1
      ? "grid-cols-1"
      : list.length === 2
      ? "grid-cols-2"
      : list.length === 3
      ? "grid-cols-3"
      : "lg:grid-cols-4";

  return (
    <section id="servicios" className="py-24 px-6 bg-[#091540] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Nuestros Servicios</h2>
          <p className="text-lg md:text-xl text-white/85 max-w-3xl mx-auto">
            Ofrecemos servicios integrales para garantizar el acceso al agua potable y saneamiento
          </p>
        </div>

        {/*  GRID cuando hay 4 o menos (llenan el espacio) */}
        {!useCarousel && (
          <div className={`grid gap-6 ${colsForFew} w-full`}>
            {list.map((s, i) => {
              const IconComponent = getIconComponent(s.Icon);
              return (
                <Card key={i} className="backdrop-blur w-full">
                  <CardContent>
                    <CardIcon>
                      <IconComponent className="w-16 h-16" />
                    </CardIcon>
                    <CardTitle>{s.Title}</CardTitle>
                    <CardDescription>{s.Description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/*  Carrusel paginado cuando hay más de 4 */}
        {useCarousel && (
          <div className="relative">
            <button
            onClick={() => scrollPage("left")}
            className="hidden md:flex absolute -left-16 top-1/2 -translate-y-1/2 z-10
                        h-11 w-11 items-center justify-center rounded-full
                        bg-white/10 hover:bg-white/20 border border-white/20"
            aria-label="Anterior"
            >
            <ChevronLeft className="w-6 h-6" />
            </button>

            <button
            onClick={() => scrollPage("right")}
            className="hidden md:flex absolute -right-16 top-1/2 -translate-y-1/2 z-10
                        h-11 w-11 items-center justify-center rounded-full
                        bg-white/10 hover:bg-white/20 border border-white/20"
            aria-label="Siguiente"
            >
            <ChevronRight className="w-6 h-6" />
            </button>

            <div
              ref={scrollerRef}
              className="flex w-full overflow-x-auto scroll-smooth snap-x snap-mandatory
                         [scrollbar-width:none] [-ms-overflow-style:none]"
            >
              <style>{`div::-webkit-scrollbar{display:none;}`}</style>

              {chunk(list, 4).map((page, pageIndex) => (
                <div key={pageIndex} className="snap-start shrink-0 w-full px-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {page.map((s, i) => {
                      const IconComponent = getIconComponent(s.Icon);
                      return (
                        <Card key={`${pageIndex}-${i}`} className="backdrop-blur w-full">
                          <CardContent>
                            <CardIcon>
                              <IconComponent className="w-16 h-16" />
                            </CardIcon>
                            <CardTitle>{s.Title}</CardTitle>
                            <CardDescription>{s.Description}</CardDescription>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <p className="md:hidden text-center text-white/60 text-sm mt-2">
              Deslice para ver más →
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function chunk<T>(arr: T[], size: number) {
  const pages: T[][] = [];
  for (let i = 0; i < arr.length; i += size) pages.push(arr.slice(i, i + size));
  return pages;
}
