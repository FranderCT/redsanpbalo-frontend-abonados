import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { socket } from "./Sockets";
import { ModalBase } from "../Components/Modals/ModalBase";
import { useAddReportAssignment } from "../Modules/Reports/Hooks/ReportsHooks";
import { useGetUsersByRoleFontanero } from "../Modules/Users/Hooks/UsersHooks";

type ReportLocationEvt = {
  Id: number;
  Neighborhood: string;
};

type ReportTypeEvt = {
  Id: number;
  Name: string;
};

type UserEvt = {
  Id: number;
  Name: string;
  Email: string;
  FullName?: string;
};

/** Payload refactorizado: ExactLocation, State, Urgency; sin ReportState ni UserInCharge */
type ReportEvt = {
  Id: number;
  Code?: string;
  ExactLocation: string;
  Description: string;
  User: UserEvt;
  ReportLocation?: ReportLocationEvt | null;
  ReportType?: ReportTypeEvt;
  CreatedAt: string | Date;
  State: string;
  Urgency?: string;
};

type ReportUI = ReportEvt & { displayLocation: string; CreatedAt: string };

function toISO(value: string | Date): string {
  const d = value instanceof Date ? value : new Date(value);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

function buildDisplayLocation(r: ReportEvt): string {
  if (r.ReportLocation?.Neighborhood) {
    return `${r.ReportLocation.Neighborhood} - ${r.ExactLocation}`.trim();
  }
  return r.ExactLocation;
}

function normalize(r: ReportEvt): ReportUI {
  return {
    ...r,
    CreatedAt: toISO(r.CreatedAt),
    displayLocation: buildDisplayLocation(r),
  };
}

export default function LiveReports() {
  const [, setReports] = useState<ReportUI[]>(() => {
    const saved = localStorage.getItem("liveReports");
    return saved ? (JSON.parse(saved) as ReportUI[]) : [];
  });

  const [showModal, setShowModal] = useState(false);
  const [newReport, setNewReport] = useState<ReportUI | null>(null);
  const [selectedFontanero, setSelectedFontanero] = useState<number>(0);
  const [instructions, setInstructions] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  const addAssignmentMutation = useAddReportAssignment();
  const { fontaneros = [], isPending: fontanerosLoading } =
    useGetUsersByRoleFontanero();

  const handleAssignFontanero = async () => {
    if (!newReport || !selectedFontanero || selectedFontanero === 0) {
      toast.error("Debes seleccionar un fontanero");
      return;
    }

    setIsAssigning(true);
    try {
      await addAssignmentMutation.mutateAsync({
        reportId: newReport.Id,
        payload: {
          userId: selectedFontanero,
          instructions: instructions.trim() || undefined,
        },
      });
      toast.success("Fontanero asignado correctamente");
      setSelectedFontanero(0);
      setInstructions("");
    } catch (error) {
      toast.error("Error al asignar fontanero");
      console.error(error);
    } finally {
      setIsAssigning(false);
    }
  };

  useEffect(() => {
    const handler = (payload: ReportEvt) => {
      const report = normalize(payload);

      setNewReport(report);
      setShowModal(true);

      setReports((prev) => {
        const next = [report, ...prev.filter((r) => r.Id !== report.Id)];
        localStorage.setItem("liveReports", JSON.stringify(next));
        return next;
      });
    };

    socket.on("report.created", handler);
    return () => {
      socket.off("report.created", handler);
    };
  }, []);

  return (
    <div>
      <ModalBase
        open={showModal}
        onClose={() => setShowModal(false)}
        panelClassName="w-full max-w-2xl !p-0 overflow-hidden shadow-2xl"
      >
        {newReport && (
          <>
            <div className="px-6 py-4 text-[#091540] border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    Nuevo Reporte Recibido
                  </h3>
                  <p className="text-sm opacity-80 mt-1">
                    Se ha registrado un nuevo reporte en el sistema
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-red-800">
                    Reporte #{newReport.Code ?? newReport.Id}
                  </h4>
                  <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                    {new Date(newReport.CreatedAt).toLocaleString("es-CR")}
                  </span>
                </div>

                {newReport.ReportLocation?.Neighborhood && (
                  <div className="mb-3">
                    <span className="inline-flex items-center text-xs font-medium px-2 py-1 border border-red-300 bg-white text-red-700">
                      BARRIO: {newReport.ReportLocation.Neighborhood}
                    </span>
                  </div>
                )}

                {newReport.ReportType?.Name && (
                  <div className="mb-3">
                    <span className="inline-flex items-center text-xs font-medium px-2 py-1 border border-red-300 bg-white text-red-700">
                      TIPO: {newReport.ReportType.Name}
                    </span>
                  </div>
                )}

                <div className="mb-3 flex gap-2 flex-wrap">
                  <span className="inline-flex items-center text-xs font-medium px-2 py-1 border border-red-300 bg-white text-red-700">
                    ESTADO: {newReport.State}
                  </span>
                  {newReport.Urgency && (
                    <span className="inline-flex items-center text-xs font-medium px-2 py-1 border border-red-300 bg-white text-red-700 capitalize">
                      URGENCIA: {newReport.Urgency}
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-red-600 font-medium">UBICACIÓN</span>
                    <p className="text-sm text-red-800 font-medium">
                      {newReport.displayLocation}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-red-600 font-medium">DESCRIPCIÓN</span>
                    <p className="text-sm text-red-800">{newReport.Description}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Reportado por</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-gray-500">Nombre completo</span>
                    <p className="text-sm font-medium text-gray-800">
                      {newReport.User.FullName ??
                        `${newReport.User.Name} ${newReport.User.Surname1 ?? ""}`}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Email</span>
                    <p className="text-sm font-medium text-gray-800">
                      {newReport.User.Email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-700 mb-3">
                  Asignar fontanero (opcional)
                </h4>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-xs text-blue-600 font-medium mb-1">
                      Fontanero
                    </label>
                    <select
                      value={selectedFontanero}
                      onChange={(e) => setSelectedFontanero(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm rounded-md"
                      disabled={fontanerosLoading || isAssigning}
                    >
                      <option value={0}>
                        {fontanerosLoading
                          ? "Cargando..."
                          : "Seleccionar fontanero"}
                      </option>
                      {fontaneros.map((f) => (
                        <option key={f.Id} value={f.Id}>
                          {f.Name} {f.Surname1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-blue-600 font-medium mb-1">
                      Instrucciones (opcional)
                    </label>
                    <input
                      type="text"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="Contexto o instrucciones para el fontanero"
                      className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm"
                      disabled={isAssigning}
                    />
                  </div>
                  <button
                    onClick={handleAssignFontanero}
                    disabled={
                      selectedFontanero === 0 || isAssigning || fontanerosLoading
                    }
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium rounded-md"
                  >
                    {isAssigning ? "Asignando..." : "Asignar"}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600">
                Puedes asignar más fontaneros desde el detalle del reporte.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="h-10 px-6 bg-[#091540] text-white hover:bg-[#1789FC] transition font-medium rounded-md"
              >
                Entendido
              </button>
            </div>
          </>
        )}
      </ModalBase>
    </div>
  );
}
