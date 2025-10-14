import { useEffect, useState } from 'react';
import { socket } from './Sockets';
import { ModalBase } from '../Components/Modals/ModalBase';

type ReportLocationEvt = {
  Id: number;
  Neighborhood: string;
};

type ReportTypeEvt = {
  Id: number;
  Name: string;
};

type ReportEvt = {
  Id: number;
  Location: string; // puede venir ya compuesto “BARRIO - DIRECCIÓN”
  Description: string;
  User: {
    Id: number;
    Name: string;
    Email: string;
    FullName: string;
  };
  ReportLocation?: ReportLocationEvt | null;
  ReportType?: ReportTypeEvt; // 👈 nuevo
  CreatedAt: string | Date;
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
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="h-10 px-6 bg-[#091540] text-white hover:bg-[#1789FC] transition font-medium"
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
