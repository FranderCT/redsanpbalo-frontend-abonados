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
import { BarChartCard } from "../Components/chart-card"
import { useGetAllAbonados } from "../../Users/Hooks/UsersHooks"
import { useGetAllReqApprovedDashboard, useGetAllReqPendingsDashboard, useMonthlyAllRequests, useMonthlyReports } from "../Hooks/dashboardHooks"
import { useProjectsInProcessCount } from "../../Project_State/Hooks/ProjectStateHooks"
import { useRecentCommentsCount } from "../../Comment/Hooks/commentHooks"
import { useNavigate } from "@tanstack/react-router"
import { useReportsInProcessCount } from "../../Reports/Hooks/ReportStatesHooks"

export default function AdminDashboard() {
  // comentarios recientes este mes //
  const { data: recentComments30d, isLoading: loadingRecent } =
      useRecentCommentsCount({ days: 30 }); // <-- “Este mes” (30 días)

   const recentCountValue = loadingRecent
     ? "..."
     : String(recentComments30d?.count ?? 0);

  //comentarios las 24 horas no leidos
//const { data: recentUnread24h, isLoading: loadingUnread } =
useRecentCommentsCount({ hours: 24, unread: true });

//const recentUnreadValue = loadingUnread ? "..." : String(recentUnread24h?.count ?? 0);
    
  const {totalAbonados} = useGetAllAbonados();

  const { data: pendingData } = useGetAllReqPendingsDashboard()
  const { data: approvedData } = useGetAllReqApprovedDashboard()

  const { totalProjectsInProcess} = useProjectsInProcessCount();

  const totalReqPendings = pendingData?.totalPendingRequests ?? 0
  const totalReqApproved = approvedData?.totalApprovedRequests ?? 0
  const { totalReportsInProcess } = useReportsInProcessCount();

  const navigate = useNavigate();

  // Solicitudes por mes (últimos 12 meses)
const { chartData: solicitudesMensuales, isLoading: loadingReqMonthly } = useMonthlyAllRequests({ 
  months: 12 });

  // Reportes por mes (últimos 12 meses)
const { chartData: reportesMensuales, isLoading: loadingMonthly } = useMonthlyReports({
  months: 12,
});

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-6 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-white shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3 flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#091540] tracking-tight">
                Panel Administrativo
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">
                Bienvenido al sistema de gestión <span className="font-semibold">Red San Pablo</span>
              </p>
              <p className="text-gray-500 text-sm">Resumen general y acciones clave del sistema</p>
            </div>
          </div>
        </div>
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
          value={recentCountValue}
          description="Este mes"
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
          color="hsl(var(--chart-1))"
        />
      </div>

      {/* Acciones rápidas con diseño mejorado y colores temáticos */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Usuarios - Indigo */}
          <div className="group relative">
            <div className="rounded-lg bg-white hover:bg-gradient-to-br hover:from-white hover:to-indigo-50/30 transition-all duration-300 cursor-pointer border border-indigo-100 hover:shadow-[0_8px_30px_rgba(99,102,241,0.25)] hover:-translate-y-1"
                 onClick={() => navigate({ to: "/dashboard/users" })}>
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <UserRoundCog className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#091540] text-lg mb-1 group-hover:text-indigo-600 transition-colors">Usuarios</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Revisar todos los usuarios</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notificaciones - Amarillo/Naranja */}
          <div className="group relative">
            <div className="rounded-lg bg-white hover:bg-gradient-to-br hover:from-white hover:to-amber-50/30 transition-all duration-300 cursor-pointer border border-amber-100 hover:shadow-[0_8px_30px_rgba(251,191,36,0.25)] hover:-translate-y-1"
                 onClick={() => console.log("Crear notificación") }>
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#091540] text-lg mb-1 group-hover:text-amber-600 transition-colors">Notificaciones</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Crear notificación</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reportes - Rojo */}
          <div className="group relative">
            <div className="rounded-lg bg-white hover:bg-gradient-to-br hover:from-white hover:to-red-50/30 transition-all duration-300 cursor-pointer border border-red-100 hover:shadow-[0_8px_30px_rgba(246,19,45,0.25)] hover:-translate-y-1"
                 onClick={() => navigate({ to: "/dashboard/reports" })}>
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <OctagonAlert className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#091540] text-lg mb-1 group-hover:text-red-600 transition-colors">Reportes</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Revisar todos los reportes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Productos - Verde */}
          <div className="group relative">
            <div className="rounded-lg bg-white hover:bg-gradient-to-br hover:from-white hover:to-emerald-50/30 transition-all duration-300 cursor-pointer border border-emerald-100 hover:shadow-[0_8px_30px_rgba(16,185,129,0.25)] hover:-translate-y-1"
                 onClick={() => navigate({ to: "/dashboard/products" })}>
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Forklift className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#091540] text-lg mb-1 group-hover:text-emerald-600 transition-colors">Productos</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Revisar todos los productos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Proyectos - Azul */}
          <div className="group relative">
            <div className="rounded-lg bg-white hover:bg-gradient-to-br hover:from-white hover:to-sky-50/30 transition-all duration-300 cursor-pointer border border-sky-100 hover:shadow-[0_8px_30px_rgba(14,165,233,0.25)] hover:-translate-y-1"
                 onClick={() => navigate({ to: "/dashboard/projects" })}>
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Hammer className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#091540] text-lg mb-1 group-hover:text-sky-600 transition-colors">Proyectos</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Revisar todos los proyectos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comentarios - Morado */}
          <div className="group relative">
            <div className="rounded-lg bg-white hover:bg-gradient-to-br hover:from-white hover:to-violet-50/30 transition-all duration-300 cursor-pointer border border-violet-100 hover:shadow-[0_8px_30px_rgba(139,92,246,0.25)] hover:-translate-y-1"
                 onClick={() => navigate({ to: "/dashboard/comments" })}>
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#091540] text-lg mb-1 group-hover:text-violet-600 transition-colors">Comentarios</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Revisar todos los comentarios</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
