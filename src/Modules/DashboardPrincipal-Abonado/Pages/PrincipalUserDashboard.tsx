import { Bell, FileText, OctagonAlert, Loader2 } from "lucide-react";
import { QuickActionCardPro } from "../../DashboardPrincipal-Admin/Components/quick-action-card";
import { StatCardPro } from "../../DashboardPrincipal-Admin/Components/stat-card";
import { QuickActionSolicitudes } from "../Components/quick-action-solicitudes";
import { useMyReportsSummary, useMyRequestsSummary } from "../Hooks/dashboardUserHooks";
import { useGetUserProfile } from "../../Users/Hooks/UsersHooks";
import { useNavigate } from "@tanstack/react-router";


export default function UserDashboard() {
  const navigate = useNavigate();
  // KPIs Solicitudes
  const {
    summary: reqSummary,
    isLoading: loadingReq,
    isError: isErrorReq,
  } = useMyRequestsSummary();

  // KPIs Reportes
  const {
    summary: repSummary,
    isLoading: loadingRep,
    isError: isErrorRep,
  } = useMyReportsSummary();

  // Perfil usuario
  const { UserProfile, isLoading: loadingUser } = useGetUserProfile();

  const handleSolicitudClick = () => {
    console.log("Solicitud seleccionada");
  };

  // Texto KPIs (con loading y fallback)
  const solicitudesValor = loadingReq ? "…" : String(reqSummary?.total ?? 0);
  const solicitudesDesc =
    loadingReq ? "cargando…" : `${reqSummary?.pending ?? 0} en proceso`;

  const reportesValor = loadingRep ? "…" : String(repSummary?.total ?? 0);
  const reportesDesc =
    loadingRep ? "cargando…" : `${repSummary?.inProcess ?? 0} en proceso`;

  // Capitaliza solo primeras letras (nombre y apellido1)
  const formatName = (name?: string) =>
    !name
      ? ""
      : name.toLowerCase().replace(/(^|\s)\S/g, (l) => l.toUpperCase());

  const nombreUsuario =
    loadingUser || !UserProfile
      ? null
      : `${formatName(UserProfile.Name)} ${formatName(UserProfile.Surname1)}`;

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Panel Principal</h1>

          {loadingUser ? (
            <div className="flex items-center gap-2 text-[#091540]/70 text-md">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Cargando usuario...</span>
            </div>
          ) : (
            <p className="text-[#091540]/70 text-md">
              Bienvenido, {nombreUsuario || "Usuario"} al sistema de gestión
              RedSanPablo
            </p>
          )}
        </div>
        <div className="border-b border-dashed border-gray-300 mb-8"></div>
      </div>

      {/* KPIs del usuario */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* MIS SOLICITUDES */}
        {loadingReq ? (
          <StatCardPro
            title="Mis Solicitudes"
            value="Cargando..."
            description="Obteniendo datos"
            icon={FileText}
          />
        ) : isErrorReq ? (
          <StatCardPro
            title="Mis Solicitudes"
            value="Error"
            description="No se pudo cargar"
            icon={FileText}
          />
        ) : (
          <StatCardPro
            title="Mis Solicitudes"
            value={solicitudesValor}
            description={solicitudesDesc}
            icon={FileText}
          />
        )}

        {/* MIS REPORTES */}
        {loadingRep ? (
          <StatCardPro
            title="Mis Reportes"
            value="Cargando..."
            description="Obteniendo datos"
            icon={OctagonAlert}
          />
        ) : isErrorRep ? (
          <StatCardPro
            title="Mis Reportes"
            value="Error"
            description="No se pudo cargar"
            icon={OctagonAlert}
          />
        ) : (
          <StatCardPro
            title="Mis Reportes"
            value={reportesValor}
            description={reportesDesc}
            icon={OctagonAlert}
          />
        )}

        {/* Si luego agregas notificaciones: */}
        {/* <StatCardPro title="Notificaciones" value="5" description="3 sin leer" icon={Bell} /> */}
      </div>

      {/* Mensajes globales de error (si alguno falló) */}
      {(isErrorReq || isErrorRep) && (
        <p className="text-sm text-red-600 mt-2">
          Hubo un problema al cargar tus datos. Por favor, recarga la página.
        </p>
      )}

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
            onClick={() => navigate({ to: "/dashboard/reports" })}
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
      {/* <NotificationCard /> */}
    </div>
  );
}
