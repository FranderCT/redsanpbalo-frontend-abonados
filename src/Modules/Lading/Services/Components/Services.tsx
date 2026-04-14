import React from "react";
import {
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useGetAllServices } from "../Hooks/ServicesHooks";
import { Button } from "@/Components/ui/button";

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

function useSlidesPerView() {
  const getSlidesPerView = React.useCallback(() => {
    if (typeof window === "undefined") return 4;
    if (window.innerWidth >= 1024) return 4;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }, []);

  const [slidesPerView, setSlidesPerView] = React.useState(getSlidesPerView);

  React.useEffect(() => {
    const handleResize = () => {
      setSlidesPerView(getSlidesPerView());
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [getSlidesPerView]);

  return slidesPerView;
}

export function Services() {
  const { services, isPending, error } = useGetAllServices();
  const slidesPerView = useSlidesPerView();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const list = services ?? [];
  const hasCarousel = list.length > slidesPerView;
  const maxIndex = Math.max(0, list.length - slidesPerView);

  const getIconComponent = (iconName?: string) => {
    if (!iconName) return Droplets;
    return ICON_MAP[iconName.toLowerCase()] || HelpCircle;
  };

  React.useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

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

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  return (
    <section id="servicios" className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16 flex items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4 text-[#091540]">
              Servicios Institucionales
            </h2>
            <div className="w-24 h-2 bg-[#005CAF]"></div>
          </div>

          {hasCarousel ? (
            <div className="hidden md:flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                aria-label="Ver servicios anteriores"
                className="border-[#005CAF] text-[#005CAF] hover:bg-[#005CAF] hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={goToNext}
                disabled={currentIndex === maxIndex}
                aria-label="Ver más servicios"
                className="border-[#005CAF] text-[#005CAF] hover:bg-[#005CAF] hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ) : null}
        </div>

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{
              transform: hasCarousel
                ? `translateX(-${currentIndex * (100 / slidesPerView)}%)`
                : "translateX(0)",
            }}
          >
            {list.map((service, idx) => {
              const IconComponent = getIconComponent(service.Icon);
              return (
                <div
                  key={idx}
                  className="min-w-0 shrink-0 basis-full px-0 md:basis-1/2 md:px-2 lg:basis-1/4"
                >
                  <article className="group flex h-full min-h-[320px] flex-col border border-[#c0c6d6] p-10 transition-colors hover:bg-[#005CAF]">
                    <IconComponent className="mb-6 h-12 w-12 shrink-0 text-[#005CAF] transition-colors group-hover:text-white" />
                    <h3 className="mb-4 min-w-0 text-xl font-bold text-[#091540] transition-colors break-words [overflow-wrap:anywhere] group-hover:text-white">
                      {service.Title}
                    </h3>
                    <p className="min-w-0 text-sm leading-relaxed text-[#404754] transition-colors break-words [overflow-wrap:anywhere] group-hover:text-white/80">
                      {service.Description}
                    </p>
                  </article>
                </div>
              );
            })}
          </div>
        </div>

        {hasCarousel ? (
          <div className="mt-6 flex items-center justify-center gap-2 md:hidden">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              aria-label="Ver servicios anteriores"
              className="border-[#005CAF] text-[#005CAF] hover:bg-[#005CAF] hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={goToNext}
              disabled={currentIndex === maxIndex}
              aria-label="Ver más servicios"
              className="border-[#005CAF] text-[#005CAF] hover:bg-[#005CAF] hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
