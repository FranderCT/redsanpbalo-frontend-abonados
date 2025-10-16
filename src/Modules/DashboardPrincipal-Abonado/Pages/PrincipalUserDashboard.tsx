import { Bell, FileText, MessageSquare, OctagonAlert } from "lucide-react"
import { QuickActionCardPro } from "../../DashboardPrincipal-Admin/Components/quick-action-card"
import { StatCardPro } from "../../DashboardPrincipal-Admin/Components/stat-card"
import { RecentActivityUser } from "../Components/recent-activity"
import { NotificationCard } from "../Components/notifications-card"
import { QuickActionSolicitudes } from "../Components/quick-action-solicitudes"


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
  const handleSolicitudClick = () => {
    console.log("Solicitud seleccionada");
  }
  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Panel Principal
          </h1>
          <p className="text-[#091540]/70 text-md">
            Bienvenido, Juan Pérez al sistema de gestión RedSanPablo
          </p>
        </div>
        <div className="border-b border-dashed border-gray-300 mb-8"></div>
      </div>
      {/* KPIs del usuario */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCardPro title="Mis Solicitudes" value="2" description="1 en proceso" icon={FileText} />
        <StatCardPro title="Mis Reportes" value="3" description="1 activo" icon={OctagonAlert} />
        <StatCardPro title="Mis Comentarios" value="8" description="Este mes" icon={MessageSquare} />
        <StatCardPro title="Notificaciones" value="5" description="3 sin leer" icon={Bell} />
      </div>

      {/* Acciones rápidas */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <QuickActionSolicitudes
            title="Nueva Solicitud"
            description="Selecciona el tipo de solicitud"
            icon={FileText}
            onClick={handleSolicitudClick}
          />
          <QuickActionCardPro
            title="Reportar Problema"
            description="Informar una incidencia"
            icon={OctagonAlert}
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
      <NotificationCard />

      {/* Mi actividad reciente */}
      <RecentActivityUser activities={myActivities} title="Mi Actividad Reciente" />
    </div>
  )
}
