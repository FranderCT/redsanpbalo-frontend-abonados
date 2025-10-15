import { AlertCircle, Bell, FileText, MessageSquare, Wrench } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../DashboardPrincipal-Admin/Components/card"
import { QuickActionCardPro } from "../../DashboardPrincipal-Admin/Components/quick-action-card"
import { StatCardPro } from "../../DashboardPrincipal-Admin/Components/stat-card"
import { RecentActivity } from "../Components/recent-activity"


// Si luego conectas a tu API, reemplaza este array por los datos reales.
const myActivities = [
  {
    id: "1",
    type: "solicitud" as const,
    title: "Solicitud de reparación",
    description: "Fuga en medidor - En proceso",
    time: "Hace 2 días",
    status: "en-proceso" as const,
  },
  {
    id: "2",
    type: "comentario" as const,
    title: "Comentario publicado",
    description: "Sobre mejoras en el servicio",
    time: "Hace 5 días",
    status: "completado" as const,
  },
  {
    id: "3",
    type: "reporte" as const,
    title: "Reporte enviado",
    description: "Baja presión de agua",
    time: "Hace 1 semana",
    status: "completado" as const,
  },
]

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mi Panel</h1>
          <p className="text-muted-foreground">Bienvenido, Juan Pérez - Abonado #1234</p>
        </div>
      </div>

      {/* KPIs del usuario */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCardPro title="Mis Solicitudes" value="2" description="1 en proceso" icon={FileText} />
        <StatCardPro title="Mis Reportes" value="3" description="1 activo" icon={AlertCircle} />
        <StatCardPro title="Mis Comentarios" value="8" description="Este mes" icon={MessageSquare} />
        <StatCardPro title="Notificaciones" value="5" description="3 sin leer" icon={Bell} />
      </div>

      {/* Acciones rápidas */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <QuickActionCardPro
            title="Nueva Solicitud"
            description="Crear una solicitud"
            icon={FileText}
            onClick={() => console.log("Nueva Solicitud")}
          />
          <QuickActionCardPro
            title="Reportar Problema"
            description="Informar una incidencia"
            icon={AlertCircle}
            onClick={() => console.log("Reportar Problema")}
          />
          <QuickActionCardPro
            title="Nuevo Comentario"
            description="Dejar un comentario"
            icon={MessageSquare}
            onClick={() => console.log("Nuevo Comentario")}
          />
          <QuickActionCardPro
            title="Ver Notificaciones"
            description="Revisar mensajes"
            icon={Bell}
            onClick={() => console.log("Ver Notificaciones")}
          />
        </div>
      </section>

      {/* Notificaciones importantes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificaciones Importantes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-lg bg-accent/50">
            <Wrench className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">Mantenimiento Programado</p>
              <p className="text-sm text-muted-foreground">
                Corte de agua el sábado 20 de julio de 8:00 AM a 12:00 PM en su sector
              </p>
              <span className="text-xs text-muted-foreground">Hace 2 horas</span>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
            <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">Respuesta a tu comentario</p>
              <p className="text-sm text-muted-foreground">
                La administración ha respondido a tu comentario sobre el servicio
              </p>
              <span className="text-xs text-muted-foreground">Hace 1 día</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mi actividad reciente */}
      <RecentActivity activities={myActivities} title="Mi Actividad Reciente" />
    </div>
  )
}
