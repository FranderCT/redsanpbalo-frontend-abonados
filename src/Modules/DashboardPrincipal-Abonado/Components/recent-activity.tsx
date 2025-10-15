
import { ClipboardList, FileText, AlertCircle, Wrench, MessageSquare } from "lucide-react"
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
  reporte: AlertCircle,
  proyecto: Wrench,
  comentario: MessageSquare,
} as const

function statusVariant(status?: Activity["status"]) {
  switch (status) {
    case "pendiente":
      return "outline" as const
    case "urgente":
      return "destructive" as const
    case "completado":
      return "default" as const
    case "en-proceso":
      return "secondary" as const
    default:
      return "outline" as const
  }
}

export function RecentActivity({ activities, title = "Actividad Reciente" }: { activities: Activity[]; title?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <ul className="space-y-2">
          {activities.map((a) => {
            const Icon = typeIcon[a.type]
            return (
              <li key={a.id} className="px-2 py-2 rounded-lg hover:bg-accent/50">
                <div className="flex items-start gap-3">
                  <div className="rounded-md p-2 bg-muted">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium truncate">{a.title}</p>
                      {a.status ? (
                        <Badge variant={statusVariant(a.status)} className="capitalize">
                          {a.status.replace("-", " ")}
                        </Badge>
                      ) : null}
                    </div>
                    {a.description ? <p className="text-xs text-muted-foreground mt-0.5">{a.description}</p> : null}
                    <p className="text-[10px] text-muted-foreground mt-1">{a.time}</p>
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
