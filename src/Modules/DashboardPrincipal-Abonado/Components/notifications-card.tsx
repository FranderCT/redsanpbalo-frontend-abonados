import { Bell, MessageSquare, Wrench } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../DashboardPrincipal-Admin/Components/card"

export function NotificationCard() {
  return (
    <Card className="overflow-hidden border-neutral-200/70 bg-white hover:shadow-md transition rounded-xl">
      <CardHeader className="border-b border-neutral-200/60 flex items-center gap-2">
        <Bell className="h-5 w-5 text-neutral-600" />
        <CardTitle>Notificaciones Importantes</CardTitle>
      </CardHeader>

      <CardContent className="pt-4 space-y-3">
        {/* Notificación 1 */}
        <div className="flex items-start justify-between gap-3 rounded-lg border border-neutral-200/70 p-3 bg-white">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 grid place-items-center rounded-xl bg-neutral-100 border border-neutral-200">
              <Wrench className="h-5 w-5 text-neutral-700" />
            </div>
            <div>
              <p className="font-medium leading-tight text-neutral-900">Mantenimiento Programado</p>
              <p className="text-sm text-neutral-500">
                Corte de agua el sábado 20 de julio de 8:00 AM a 12:00 PM en su sector
              </p>
              <p className="text-xs text-neutral-500 mt-1">Hace 2 horas</p>
            </div>
          </div>
        </div>

        {/* Notificación 2 */}
        <div className="flex items-start justify-between gap-3 rounded-lg border border-neutral-200/70 p-3 bg-white">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 grid place-items-center rounded-xl bg-neutral-100 border border-neutral-200">
              <MessageSquare className="h-5 w-5 text-neutral-700" />
            </div>
            <div>
              <p className="font-medium leading-tight text-neutral-900">Respuesta a tu comentario</p>
              <p className="text-sm text-neutral-500">
                La administración ha respondido a tu comentario sobre el servicio
              </p>
              <p className="text-xs text-neutral-500 mt-1">Hace 1 día</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
