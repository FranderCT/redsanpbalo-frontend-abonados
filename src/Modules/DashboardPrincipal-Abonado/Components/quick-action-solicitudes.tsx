import * as React from "react"
import { FileText,Droplets,UserStar, ClipboardPen, FileSearch, CircleGauge } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { useNavigate } from "@tanstack/react-router"

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
  const handleSelection = (tipo: string) => {
    console.log(`Seleccionado: ${tipo}`)
    onClick() // Llama a la función onClick para realizar la acción
  }

  return (
    <Card className="overflow-hidden border-neutral-200/70 bg-white hover:shadow-md transition col-span-2 lg:col-span-4">
      <CardHeader className="border-b border-neutral-200/60 flex items-center gap-2">
        <Icon className="h-5 w-5 text-neutral-600" />
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent className="pt-4">
        <p className="text-sm text-neutral-600 mb-3">{description}</p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {/* Botones de tipo de solicitud con estilo limpio */}
          <div
            className="p-2 text-center cursor-pointer hover:text-neutral-900 hover:bg-neutral-100 text-xs transition-all"
            onClick={ () => navigate({ to: "/dashboard/requests/availability-water" })}
          >
            <Droplets className="h-5 w-5 mx-auto mb-1 text-neutral-700" />
            <p className="font-medium">Disponibilidad de Agua</p>
          </div>
          <div
            className="p-2 text-center cursor-pointer hover:text-neutral-900 hover:bg-neutral-100 text-xs transition-all"
            onClick={() => navigate({ to: "/dashboard/requests/supervision-meter" })}
          >
            <FileSearch className="h-5 w-5 mx-auto mb-1 text-neutral-700" />
            <p className="font-medium">Revisión de Medidor</p>
          </div>
          <div
            className="p-2  text-center cursor-pointer hover:text-neutral-900 hover:bg-neutral-100 text-xs transition-all"
            onClick={() => navigate({ to: "/dashboard/requests/change-meter" })}
          >
            <CircleGauge className="h-5 w-5 mx-auto mb-1 text-neutral-700" />
            <p className="font-medium">Cambio de Medidor</p>
          </div>
          <div
            className="p-2 text-center cursor-pointer hover:text-neutral-900 hover:bg-neutral-100 text-xs transition-all"
            onClick={() => navigate({ to: "/dashboard/requests/change-meter" })}
          >
            <ClipboardPen className="h-5 w-5 mx-auto mb-1 text-neutral-700" />
            <p className="font-medium">Cambio Nombre de Medidor</p>
          </div>
          <div
            className="p-2 text-center cursor-pointer hover:text-neutral-900 hover:bg-neutral-100 text-xs transition-all"
            onClick={() => navigate({ to: "/dashboard/requests/associated" })}
          >
            <UserStar className="h-5 w-5 mx-auto mb-1 text-neutral-700" />
            <p className="font-medium">Asociado</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
