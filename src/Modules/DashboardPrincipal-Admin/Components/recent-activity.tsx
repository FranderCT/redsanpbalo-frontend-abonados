
import { AlertCircle, ClipboardList, FileText, Wrench } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./card"

type Activity = {
  id: string
  type: "solicitud" | "reporte" | "proyecto"
  title: string
  description?: string
  time: string
  status?: "pendiente" | "urgente" | "completado" | "en-proceso"
}

const typeIcon = { solicitud: FileText, reporte: AlertCircle, proyecto: Wrench } as const
const statusChip = {
  pendiente:  "bg-amber-50 text-amber-700 border border-amber-200",
  urgente:    "bg-red-50 text-red-700 border border-red-200",
  completado: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "en-proceso":"bg-blue-50 text-blue-700 border border-blue-200",
} as const

export function RecentActivityPro({ activities }: { activities: Activity[] }) {
  return (
    <Card className="border-neutral-200/70 bg-white hover:shadow-lg transition">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <ClipboardList className="h-5 w-5 text-neutral-500" />
        <CardTitle>Actividad Reciente</CardTitle>
      </CardHeader>

      <CardContent>
        {(!activities || activities.length === 0) ? (
          <p className="text-sm text-neutral-500 text-center py-6">No hay actividad reciente.</p>
        ) : (
          <ul className="space-y-3">
            {activities.map((a) => {
              const Icon = typeIcon[a.type]
              return (
                <li
                  key={a.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-neutral-200/70 p-3
                              bg-gradient-to-b from-white to-neutral-50"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl
                                    bg-neutral-100 border border-neutral-200">
                      <Icon className="h-5 w-5 text-neutral-700" />
                    </div>
                    <div>
                      <p className="font-medium leading-tight">{a.title}</p>
                      {a.description && <p className="text-sm text-neutral-500">{a.description}</p>}
                      <p className="text-xs text-neutral-500 mt-1">{a.time}</p>
                    </div>
                  </div>

                  {a.status && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusChip[a.status]}`}>
                      {a.status.replace("-", " ")}
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
