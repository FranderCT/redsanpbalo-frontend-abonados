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
  color: string;
  shadowColor: string;
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
      color: "from-blue-500 to-cyan-600",
      shadowColor: " hover:shadow-[0_8px_30px_rgba(59,130,246,0.25)]"
    },
    {
      id: "revision",
      title: "Revisión de Medidor",
      description: "Solicita revisión técnica del medidor",
      icon: FileSearch,
      route: "/dashboard/requests/supervision-meter",
      color: "from-blue-500 to-cyan-600",
      shadowColor: " hover:shadow-[0_8px_30px_rgba(59,130,246,0.25)]"
    },
    {
      id: "cambio-medidor",
      title: "Cambio de Medidor",
      description: "Solicita reemplazo de medidor",
      icon: CircleGauge,
      route: "/dashboard/requests/change-meter",
      color: "from-blue-500 to-cyan-600",
      shadowColor: " hover:shadow-[0_8px_30px_rgba(59,130,246,0.25)]"
    },
    {
      id: "cambio-nombre",
      title: "Cambio de Nombre",
      description: "Actualiza el nombre del medidor",
      icon: ClipboardPen,
      route: "/dashboard/requests/change-name-meter",
      color: "from-blue-500 to-cyan-600",
      shadowColor: " hover:shadow-[0_8px_30px_rgba(59,130,246,0.25)]"
    },
    {
      id: "asociado",
      title: "Solicitud de Asociado",
      description: "Registro como nuevo asociado",
      icon: UserStar,
      route: "/dashboard/requests/associated",
      color: "from-blue-500 to-cyan-600",
      shadowColor: " hover:shadow-[0_8px_30px_rgba(59,130,246,0.25)]"
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
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 backdrop-blur-sm flex items-center justify-center">
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
                      className={`group relative bg-white border border-gray-200 p-6 cursor-pointer transition-all duration-300 ${solicitud.shadowColor} hover:-translate-y-1 w-full max-w-md`}
                    >
                      {/* Icono con gradiente */}
                      <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${solicitud.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>

                      {/* Contenido */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-[#091540] text-sm leading-tight group-hover:text-[#1789FC] transition-colors">
                          {solicitud.title}
                        </h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {solicitud.description}
                        </p>
                      </div>

                      {/* Flecha indicadora */}
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowRight className="w-4 h-4 text-[#1789FC]" />
                      </div>

                      {/* Efecto de brillo en hover */}
                      {/* <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-transparent transition-all duration-300 pointer-events-none" /> */}
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
                    className={`group relative bg-white border border-gray-200 p-5 cursor-pointer transition-all duration-300 ${solicitud.shadowColor} hover:-translate-y-1`}
                  >
                    {/* Icono con gradiente */}
                    <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${solicitud.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>

                    {/* Contenido */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-[#091540] text-sm leading-tight group-hover:text-[#1789FC] transition-colors">
                        {solicitud.title}
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {solicitud.description}
                      </p>
                    </div>

                    {/* Flecha indicadora */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowRight className="w-4 h-4 text-[#1789FC]" />
                    </div>

                    {/* Efecto de brillo en hover */}
                    {/* <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-transparent transition-all duration-300 pointer-events-none" /> */}
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
