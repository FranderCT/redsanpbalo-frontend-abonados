import {
  Users,
  FileText,
  Bell,
  MessageSquare,
  OctagonAlert,
  Hammer,
  Forklift,
  UserRoundCog,
} from "lucide-react"
import { StatCardPro } from "../Components/stat-card"
import { QuickActionCardPro } from "../Components/quick-action-card"
import { RecentActivityPro } from "../Components/recent-activity"
import { BarChartCard } from "../Components/chart-card"
import { useGetAllAbonados } from "../../Users/Hooks/UsersHooks"
import { useGetAllReqApprovedDashboard, useGetAllReqPendingsDashboard, useMonthlyAllRequests, useMonthlyReports } from "../Hooks/dashboardHooks"
import { useProjectsInProcessCount } from "../../Project_State/Hooks/ProjectStateHooks"
import { useRecentCommentsCount } from "../../Comment/Hooks/commentHooks"
import { useNavigate } from "@tanstack/react-router"
import { useReportsInProcessCount } from "../../Reports/Hooks/ReportStatesHooks"

export default function AdminDashboard() {
  // comentarios recientes este mes //
  // const { data: recentComments30d, isLoading: loadingRecent } =
  //   useRecentCommentsCount({ days: 30 }); // <-- “Este mes” (30 días)

  // const recentCountValue = loadingRecent
  //   ? "..."
  //   : String(recentComments30d?.count ?? 0);

  //comentarios las 24 horas no leidos
const { data: recentUnread24h, isLoading: loadingUnread } =
useRecentCommentsCount({ hours: 24, unread: true });

const recentUnreadValue = loadingUnread ? "..." : String(recentUnread24h?.count ?? 0);
    
  const {totalAbonados} = useGetAllAbonados();

  const { data: pendingData } = useGetAllReqPendingsDashboard()
  const { data: approvedData } = useGetAllReqApprovedDashboard()

  const { totalProjectsInProcess} = useProjectsInProcessCount();

  const totalReqPendings = pendingData?.totalPendingRequests ?? 0
  const totalReqApproved = approvedData?.totalApprovedRequests ?? 0
  const { totalReportsInProcess } = useReportsInProcessCount();

  const navigate = useNavigate();
  // const solicitudesData = [
  //   { name: "Lun", value: 12 },
  //   { name: "Mar", value: 19 },
  //   { name: "Mié", value: 15 },
  //   { name: "Jue", value: 22 },
  //   { name: "Vie", value: 18 },
  //   { name: "Sáb", value: 8 },
  //   { name: "Dom", value: 5 },
  // ]
  // Solicitudes por mes (últimos 12 meses)
const { chartData: solicitudesMensuales, isLoading: loadingReqMonthly } = useMonthlyAllRequests({ 
  months: 12 });

  // Reportes por mes (últimos 12 meses)
const { chartData: reportesMensuales, isLoading: loadingMonthly } = useMonthlyReports({
  months: 12,
});

  // const reportesData = [
  //   { name: "Lun", value: 3 },
  //   { name: "Mar", value: 5 },
  //   { name: "Mié", value: 2 },
  //   { name: "Jue", value: 7 },
  //   { name: "Vie", value: 4 },
  //   { name: "Sáb", value: 6 },
  //   { name: "Dom", value: 2 },
  // ]

  const recentActivities = [
    {
      id: "1",
      type: "solicitud" as const,
      title: "Nueva solicitud de conexión",
      description: "Juan Pérez - Sector Los Ángeles",
      time: "Hace 5 min",
      status: "pendiente" as const,
    },
    {
      id: "2",
      type: "reporte" as const,
      title: "Reporte de fuga",
      description: "María González - Calle Principal #45",
      time: "Hace 15 min",
      status: "urgente" as const,
    },
    {
      id: "3",
      type: "proyecto" as const,
      title: "Proyecto de tubería completado",
      description: "Sector San José - Fase 2",
      time: "Hace 1 hora",
      status: "completado" as const,
    },
  ]

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Panel Administrativo
          </h1>
          <p className="text-[#091540]/70 text-md">
            Bienvenido al sistema de gestión RedSanPablo
          </p>
        </div>
        <div className="border-b border-dashed border-gray-300 mb-8"></div>
      </div>

      {/* Métricas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCardPro title="Total Abonados" value={totalAbonados?.toString() || "20"} description="Abonados registrados" icon={Users} trend={{ value: 2.5, isPositive: true }} accentColorClass="from-indigo-500/10 to-indigo-500/0" />
        <StatCardPro title="Solicitudes Pendientes" value={totalReqPendings.toString()} description="Requieren atención" icon={FileText} trend={{ value: -5.2, isPositive: false }} accentColorClass="from-rose-500/10 to-rose-500/0" />
        <StatCardPro title="Reportes en Proceso" value={totalReportsInProcess.toString()} description="En sitio (ruta / reparación / pruebas)" icon={OctagonAlert} accentColorClass="from-amber-500/10 to-amber-500/0" />
        <StatCardPro title="Proyectos en Proceso" value={totalProjectsInProcess.toString()} description="Actualmente en ejecución" icon={Hammer} accentColorClass="from-emerald-500/10 to-emerald-500/0" />
      </div>

      {/* Métricas secundarias */}
      <div className="grid gap-4 md:grid-cols-2">
        <StatCardPro
          title="Comentarios Recientes"
          value={recentUnreadValue}
          description="Últimas 24 horas"
          icon={MessageSquare}
          
        />
        {/* <StatCardPro
          title="Notificaciones Enviadas"
          value="156"
          description="Hasta hoy"
          icon={Bell}
        
        /> */}
        <StatCardPro
          title="Solicitudes Resueltas"
          value={totalReqApproved.toString()}
          description="Hasta hoy"
          icon={FileText}
        />
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2">
        <BarChartCard
          title="Reportes por Mes"
          description={loadingMonthly ? "Cargando..." : "Últimos 12 meses"}
          data={reportesMensuales}
          color="hsl(var(--chart-1))"
        />
        <BarChartCard
          title="Solicitudes por Mes"
          description={loadingReqMonthly ? "Cargando..." : "Últimos 12 meses"}
          data={solicitudesMensuales}
          color="hsl(var(--chart-2))"
        />
      </div>

      {/* Acciones rápidas */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <QuickActionCardPro title="Usuarios" description="Revisar todos los usuarios" icon={UserRoundCog } onClick={() => navigate({ to: "/dashboard/users" })}/>
            <QuickActionCardPro title="Notificaciones" description="Crear notificación" icon={Bell}/>
            <QuickActionCardPro title="Reportes" description="Revisar todos los reportes" icon={OctagonAlert} onClick={() => navigate({ to: "/dashboard/reports" })}/>
            <QuickActionCardPro title="Productos" description="Revisar todos los productos" icon={Forklift} onClick={() => navigate({ to: "/dashboard/products" })}/>
            <QuickActionCardPro title="Proyectos" description="Revisar todos los proyectos" icon={Hammer} onClick={() => navigate({ to: "/dashboard/projects" })}/>
            <QuickActionCardPro title="Comentarios" description="Revisar todos los comentarios" icon={MessageSquare} onClick={() => navigate({ to: "/dashboard/comments" })}/>
        </div>
      </section>

      {/* Actividad reciente */}
      <RecentActivityPro activities={recentActivities} />
    </div>
  )
}
