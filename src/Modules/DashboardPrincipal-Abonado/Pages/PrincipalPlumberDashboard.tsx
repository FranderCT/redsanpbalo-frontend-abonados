import { Bell, Loader2, OctagonAlert } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { StatCardPro } from "../../DashboardPrincipal-Admin/Components/stat-card";
import { useMyReportsSummary } from "../Hooks/dashboardUserHooks";
import { useGetUserProfile } from "../../Users/Hooks/UsersHooks";
import CreateReportUserModal from "../../Reports/Components/Modals/CreateReportUserModal";

export default function PrincipalPlumberDashboard() {
  const navigate = useNavigate();
  const [openReport, setOpenReport] = useState(false);
  const {
    summary: repSummary,
    isLoading: loadingRep,
    isError: isErrorRep,
  } = useMyReportsSummary();
  const { UserProfile, isLoading: loadingUser } = useGetUserProfile();

  const reportesValor = loadingRep ? "…" : String(repSummary?.total ?? 0);
  const reportesDesc =
    loadingRep ? "cargando…" : `${repSummary?.inProcess ?? 0} pendiente`;

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
                Sistema de gestión <span className="font-medium text-[#091540]">Red San Pablo</span> - Administra tus reportes y revisa tus notificaciones
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-1 lg:grid-cols-1 mb-8">
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
      </div>

      {isErrorRep && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <OctagonAlert className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">
            Hubo un problema al cargar tus reportes. Por favor, recarga la página.
          </p>
        </div>
      )}

      <section className="space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#091540] mb-2">Acciones Rápidas</h2>
          <p className="text-gray-500 text-sm">Accede rápidamente a las funciones disponibles</p>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-2">
          <div className="group relative">
            <div
              className="cursor-pointer border border-primary/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-md"
              onClick={() => setOpenReport(true)}
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <OctagonAlert className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="mb-1 text-lg font-semibold text-[#091540]">
                      Reportar Problema
                    </h3>
                    <p className="text-sm leading-relaxed text-[#091540]/70">
                      Registrar una incidencia o seguimiento de campo
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div
              className="cursor-pointer border border-primary/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-md"
              onClick={() => navigate({ to: "/dashboard/notifications" })}
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Bell className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="mb-1 text-lg font-semibold text-[#091540]">
                      Ver Notificaciones
                    </h3>
                    <p className="text-sm leading-relaxed text-[#091540]/70">
                      Revisar avisos y mensajes recientes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CreateReportUserModal open={openReport} setOpen={setOpenReport} />
    </div>
  );
}
