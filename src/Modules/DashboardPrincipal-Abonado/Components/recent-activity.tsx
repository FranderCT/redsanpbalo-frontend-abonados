import { ClipboardList, FileText, AlertCircle, Wrench, MessageSquare, OctagonAlert } from "lucide-react"
import { Badge } from "./badge"
import { Card, CardContent, CardHeader, CardTitle } from "../../DashboardPrincipal-Admin/Components/card"

export type Activity = {
  id: string
  type: "solicitud" | "reporte" | "proyecto" | "comentario"
  title: string
  description?: string
  time: string
  status?: "pendiente" | "urgente" | "completado" | "en-proceso"
}

const typeIcon = {
  solicitud: FileText,
  reporte: OctagonAlert,
  proyecto: Wrench,
  comentario: MessageSquare,
} as const

// Chip de estado coherente con el resto del dashboard
const statusChip: Record<NonNullable<Activity["status"]>, string> = {
  pendiente:   "bg-amber-50 text-amber-700 border border-amber-200",
  urgente:     "bg-red-50 text-red-700 border border-red-200",
  completado:  "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "en-proceso":"bg-blue-50 text-blue-700 border border-blue-200",
}

// Si quieres seguir usando <Badge/>, lo estilizamos con className
function statusClass(status?: Activity["status"]) {
  if (!status) return ""
  return `px-2 py-1 text-xs font-medium capitalize ${statusChip[status]}`
}

export function RecentActivityUser({
  activities,
  title = "Actividad Reciente",
}: {
  activities: Activity[]
  title?: string
}) {
  return (
    <Card className=" overflow-hidden border-neutral-200/70 bg-white hover:shadow-md transition">
      <CardHeader className="border-b border-neutral-200/60 flex items-center gap-2">
        <ClipboardList className="h-5 w-5 text-neutral-600" />
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent className="pt-4">
        <ul className="space-y-3">
          {activities.map((a) => {
            const Icon = typeIcon[a.type]
            return (
              <li
                key={a.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-neutral-200/70 p-3 bg-white"
              >
                <div className="flex items-start gap-3">
                  {/* Badge de icono consistente */}
                  <div className="h-10 w-10 grid place-items-center rounded-xl bg-neutral-100 border border-neutral-200">
                    <Icon className="h-5 w-5 text-neutral-700" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium leading-tight text-neutral-900">{a.title}</p>

                      {a.status ? (
                        <Badge className={statusClass(a.status)}>
                          {a.status.replace("-", " ")}
                        </Badge>
                      ) : null}
                    </div>

                    {a.description ? (
                      <p className="text-sm text-neutral-500 mt-0.5">{a.description}</p>
                    ) : null}

                    <p className="text-xs text-neutral-500 mt-1">{a.time}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
