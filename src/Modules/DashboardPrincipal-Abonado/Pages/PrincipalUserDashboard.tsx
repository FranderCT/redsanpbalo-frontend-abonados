import { Bell, FileText, OctagonAlert, Loader2 } from "lucide-react";
import { StatCardPro } from "../../DashboardPrincipal-Admin/Components/stat-card";
import { QuickActionSolicitudes } from "../Components/quick-action-solicitudes";
import { useMyReportsSummary, useMyRequestsSummary } from "../Hooks/dashboardUserHooks";
import { useGetUserProfile } from "../../Users/Hooks/UsersHooks";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import CreateReportUserModal from "../../Reports/Components/Modals/CreateReportUserModal";
import { set } from "zod";


export default function UserDashboard() {
  const [openReport, setOpenReport] = useState(false);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Encabezado*/}
      <div className="mb-8">
        <div className="bg-white shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-[#091540] tracking-tight">
                    Panel Principal
                  </h1>
                  {loadingUser ? (
                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Cargando información...</span>
                    </div>
                  ) : (
                    <p className="text-gray-600 text-sm sm:text-base mt-1">
                      Bienvenido, <span className="font-semibold text-semibold">{nombreUsuario || "Usuario"}</span>
                    </p>
                  )}
                </div>
              </div>
              <p className="text-gray-500 text-sm max-w-2xl">
                Sistema de gestión <span className="font-medium text-[#091540]">Red San Pablo</span> - Administra tus solicitudes y reportes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs del usuario con diseño mejorado */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-2 mb-8">
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
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <OctagonAlert className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">
            Hubo un problema al cargar tus datos. Por favor, recarga la página.
          </p>
        </div>
      )}

      {/* Acciones rápidas con diseño mejorado y colores temáticos */}
      <section className="space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#091540] mb-2">Acciones Rápidas</h2>
          <p className="text-gray-500 text-sm">Accede rápidamente a las funciones más utilizadas</p>
        </div>
        
        {/* Tarjeta de Solicitudes mejorada - Ocupa todo el ancho */}
        <div className="mb-6">
          <QuickActionSolicitudes
            title="Nueva Solicitud"
            description="Selecciona el tipo de solicitud que necesitas crear"
            icon={FileText}
            onClick={handleSolicitudClick}
          />
        </div>

        {/* Otras acciones en grid */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-2">

          {/* Reportar Problema - Rojo */}
          <div className="group relative">
            <div className="rounded-lg bg-white hover:bg-gradient-to-br hover:from-white hover:to-red-50/30 transition-all duration-300 cursor-pointer border border-red-100 hover:shadow-[0_8px_30px_rgba(246,19,45,0.25)] hover:-translate-y-1"
                  onClick={() => setOpenReport(true)}>
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <OctagonAlert className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#091540] text-lg mb-1 group-hover:text-red-600 transition-colors">
                      Reportar Problema
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Informar una incidencia
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ver Notificaciones - Amarillo/Naranja */}
          <div className="group relative">
            <div className="rounded-lg bg-white hover:bg-gradient-to-br hover:from-white hover:to-amber-50/30 transition-all duration-300 cursor-pointer border border-amber-100 hover:shadow-[0_8px_30px_rgba(251,191,36,0.25)] hover:-translate-y-1"
                  onClick={() => console.log("Ver Notificaciones")}>
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#091540] text-lg mb-1 group-hover:text-amber-600 transition-colors">
                      Ver Notificaciones
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Revisar mensajes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notificaciones importantes */}
      {/* <NotificationCard /> */}
      <CreateReportUserModal open={openReport} setOpen={setOpenReport} />
    </div>
  );
}
