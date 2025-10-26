import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { socket } from './Sockets';
import { ModalBase } from '../Components/Modals/ModalBase';
import { useAssignUserInCharge } from '../Modules/Reports/Hooks/ReportsHooks';
import { useGetUsersByRoleFontanero } from '../Modules/Users/Hooks/UsersHooks';

type ReportLocationEvt = {
  Id: number;
  Neighborhood: string;
};

type ReportTypeEvt = {
  Id: number;
  Name: string;
};

type ReportStateEvt = {
  Id: number;
  Name: string;
};

type UserEvt = {
  Id: number;
  Name: string;
  Email: string;
  FullName: string;
};

type ReportEvt = {
  Id: number;
  Location: string; // puede venir ya compuesto “BARRIO - DIRECCIÓN”
  Description: string;
  User: UserEvt;
  ReportLocation?: ReportLocationEvt | null;
  ReportType?: ReportTypeEvt;
  CreatedAt: string | Date;
  ReportState: ReportStateEvt;
  UserInCharge?: UserEvt | null;
};

// Para UI: añadimos displayLocation normalizado y CreatedAt en ISO
type ReportUI = ReportEvt & { displayLocation: string; CreatedAt: string };

function toISO(value: string | Date): string {
  const d = value instanceof Date ? value : new Date(value);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

function buildDisplayLocation(r: ReportEvt): string {
  if (r.ReportLocation?.Neighborhood) {
    return `${r.ReportLocation.Neighborhood} - ${r.Location}`.trim();
  }
  return r.Location;
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
    const saved = localStorage.getItem('liveReports');
    return saved ? (JSON.parse(saved) as ReportUI[]) : [];
  });

  const [showModal, setShowModal] = useState(false);
  const [newReport, setNewReport] = useState<ReportUI | null>(null);
  const [selectedFontanero, setSelectedFontanero] = useState<number>(0);
  const [isAssigning, setIsAssigning] = useState(false);

  // Hooks para asignar fontanero
  const assignUserMutation = useAssignUserInCharge();
  const { fontaneros = [], isPending: fontanerosLoading } = useGetUsersByRoleFontanero();

  const handleAssignFontanero = async () => {
    if (!newReport || !selectedFontanero || selectedFontanero === 0) {
      toast.error("Debes seleccionar un fontanero");
      return;
    }

    setIsAssigning(true);
    try {
      await assignUserMutation.mutateAsync({
        reportId: newReport.Id.toString(),
        userInChargeId: selectedFontanero,
      });
      toast.success("Fontanero asignado exitosamente");
      
      // Actualizar el reporte en el estado
      if (newReport) {
        const assignedFontanero = fontaneros.find(f => f.Id === selectedFontanero);
        setNewReport({
          ...newReport,
          UserInCharge: assignedFontanero ? {
            Id: assignedFontanero.Id,
            Name: assignedFontanero.Name,
            Email: assignedFontanero.Email,
            FullName: `${assignedFontanero.Name} ${assignedFontanero.Surname1}`,
          } : null
        });
      }
      
      setSelectedFontanero(0);
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
        localStorage.setItem('liveReports', JSON.stringify(next));
        return next;
      });
    };

    socket.on('report.created', handler);
    return () => {
      socket.off('report.created', handler);
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
            {/* Header */}
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

            {/* Body */}
            <div className="px-6 py-4 space-y-4">
              {/* Información del reporte */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-red-800">
                    Reporte #{newReport.Id}
                  </h4>
                  <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                    {new Date(newReport.CreatedAt).toLocaleString('es-CR')}
                  </span>
                </div>

                {/* Chip de barrio si existe */}
                {newReport.ReportLocation?.Neighborhood && (
                  <div className="mb-3">
                    <span className="inline-flex items-center text-xs font-medium px-2 py-1 l border border-red-300 bg-white text-red-700">
                      BARRIO DEL REPORTE: {newReport.ReportLocation.Neighborhood}
                    </span>
                  </div>
                )}

                 {/* Chip de tipo de reporte (si viene) */}
                {newReport.ReportType?.Name && (
                  <div className="mb-3">
                    <span className="inline-flex items-center text-xs font-medium px-2 py-1  border border-red-300 bg-white text-red-700">
                      TIPO DE REPORTE: {newReport.ReportType.Name}
                    </span>
                  </div>
                )}
                
                {newReport.ReportState?.Name && (
                  <div className="mb-3">
                    <span className="inline-flex items-center text-xs font-medium px-2 py-1  border border-red-300 bg-white text-red-700">
                      ESTADO DEL REPORTE: {newReport.ReportState.Name}
                    </span>
                  </div>
                )}

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

              {/* Información del usuario */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Reportado por</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-gray-500">Nombre completo</span>
                    <p className="text-sm font-medium text-gray-800">{newReport.User.FullName}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Email</span>
                    <p className="text-sm font-medium text-gray-800">{newReport.User.Email}</p>
                  </div>
                </div>
              </div>

              {/* Información del usuario a cargo (si existe) */}
              {newReport.UserInCharge && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Usuario a cargo</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-gray-500">Nombre completo</span>
                      <p className="text-sm font-medium text-gray-800">{newReport.UserInCharge.FullName}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Email</span>
                      <p className="text-sm font-medium text-gray-800">{newReport.UserInCharge.Email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Asignación de fontanero */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-700 mb-3">
                  {newReport.UserInCharge ? "Reasignar Fontanero" : "Asignar Fontanero"}
                </h4>
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-xs text-blue-600 font-medium mb-1">
                      Seleccionar fontanero
                    </label>
                    <select
                      value={selectedFontanero}
                      onChange={(e) => setSelectedFontanero(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      disabled={fontanerosLoading || isAssigning}
                    >
                      <option value={0}>
                        {fontanerosLoading ? "Cargando fontaneros..." : "Seleccionar fontanero"}
                      </option>
                      {fontaneros.map((fontanero) => (
                        <option key={fontanero.Id} value={fontanero.Id}>
                          {fontanero.Name} {fontanero.Surname1}
                          {newReport.UserInCharge?.Id === fontanero.Id && " (Actual)"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleAssignFontanero}
                    disabled={selectedFontanero === 0 || isAssigning || fontanerosLoading}
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    {isAssigning ? "Asignando..." : "Asignar"}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              {!newReport.UserInCharge && (
                <p className="text-sm text-red-600 font-medium">
                  Debes asignar un fontanero antes de continuar
                </p>
              )}
              {newReport.UserInCharge && (
                <p className="text-sm text-green-600 font-medium">
                  Fontanero asignado correctamente
                </p>
              )}
              <button
                onClick={() => setShowModal(false)}
                disabled={!newReport.UserInCharge}
                className="h-10 px-6 bg-[#091540] text-white hover:bg-[#1789FC] disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
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
