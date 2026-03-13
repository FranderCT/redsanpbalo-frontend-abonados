import * as React from "react"
import { FileText, Droplets, UserStar, ClipboardPen, FileSearch, CircleGauge, ArrowRight } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { Can } from "../../Auth/Components/Can";

interface SolicitudOption {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  route: string;
}

export function QuickActionSolicitudes({
  title = "Nueva Solicitud",
  description = "Selecciona el tipo de solicitud",
  icon: Icon = FileText,
  onClick,
}: {
  title: string
  description: string
  icon: React.ElementType
  onClick: () => void
}) {

  const navigate = useNavigate();

  const solicitudes: SolicitudOption[] = [
    {
      id: "disponibilidad",
      title: "Disponibilidad de Agua",
      description: "Solicita información sobre disponibilidad",
      icon: Droplets,
      route: "/dashboard/requests/availability-water",
    },
    {
      id: "revision",
      title: "Revisión de Medidor",
      description: "Solicita revisión técnica del medidor",
      icon: FileSearch,
      route: "/dashboard/requests/supervision-meter",
    },
    {
      id: "cambio-medidor",
      title: "Cambio de Medidor",
      description: "Solicita reemplazo de medidor",
      icon: CircleGauge,
      route: "/dashboard/requests/change-meter",
    },
    {
      id: "cambio-nombre",
      title: "Cambio de Nombre",
      description: "Actualiza el nombre del medidor",
      icon: ClipboardPen,
      route: "/dashboard/requests/change-name-meter",
    },
    {
      id: "asociado",
      title: "Solicitud de Asociado",
      description: "Registro como nuevo asociado",
      icon: UserStar,
      route: "/dashboard/requests/associated",
    },
  ];

  const handleNavigate = (route: string) => {
    onClick();
    navigate({ to: route });
  };

  return (
    <div className="col-span-full">
      <div className="bg-white  border border-gray-100 shadow-sm overflow-hidden">
        {/* Header*/}
        <div className="bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary shadow-lg">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#091540]">{title}</h3>
              <p className=" text-gray-500 text-sm mt-0.5">{description}</p>
            </div>
          </div>
        </div>

        {/* Grid de solicitudes mejorado */}
        <div className="p-6">
          {/* Para usuarios GUEST: Card centrado */}
          <Can rule={{ any: ["GUEST"] }}>
            <div className="flex justify-center items-center">
              {solicitudes
                .filter(s => s.id === "disponibilidad")
                .map((solicitud) => {
                  const IconComponent = solicitud.icon;
                  return (
                    <div
                      key={solicitud.id}
                      onClick={() => handleNavigate(solicitud.route)}
                      className="group relative w-full max-w-md cursor-pointer border border-primary/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-md"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary shadow-lg transition-transform duration-300 group-hover:scale-110">
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="mb-1 text-lg font-semibold text-[#091540]">
                            {solicitud.title}
                          </h4>
                          <p className="text-sm leading-relaxed text-[#091540]/70">
                            {solicitud.description}
                          </p>
                        </div>
                      </div>
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowRight className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  );
                })}
            </div>
          </Can>

          {/* Para otros roles: Grid con todas las solicitudes */}
          <Can rule={{ none: ["GUEST"] }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {solicitudes.map((solicitud) => {
                const IconComponent = solicitud.icon;
                return (
                  <div
                    key={solicitud.id}
                    onClick={() => handleNavigate(solicitud.route)}
                    className="group relative cursor-pointer border border-primary/10 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-md"
                  >
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary shadow-lg transition-transform duration-300 group-hover:scale-110">
                      <IconComponent className="h-7 w-7 text-white" />
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold leading-tight text-[#091540]">
                        {solicitud.title}
                      </h4>
                      <p className="text-xs leading-relaxed text-[#091540]/70">
                        {solicitud.description}
                      </p>
                    </div>

                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                );
              })}
            </div>
          </Can>
        </div>
      </div>
    </div>
  )
}
