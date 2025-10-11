import { useEffect, useState } from 'react';
import { socket } from './Sockets';
import { ModalBase } from '../Components/Modals/ModalBase';

type ReportEvt = {
  Id: number;
  Location: string;
  Description: string;
  User: {
    Id: number;
    Name: string;
    Email: string;
    FullName: string;
  };
  CreatedAt: string; // llega como string; lo normalizamos a ISO
};

function normalize(r: ReportEvt): ReportEvt {
  // Garantiza que CreatedAt sea ISO string válida
  const iso = new Date(r.CreatedAt as any).toISOString();
  return { ...r, CreatedAt: iso };
}

export default function LiveReports() {
  const [, setReports] = useState<ReportEvt[]>(() => {
    const saved = localStorage.getItem('liveReports');
    return saved ? (JSON.parse(saved) as ReportEvt[]) : [];
  });

  const [showModal, setShowModal] = useState(false);
  const [newReport, setNewReport] = useState<ReportEvt | null>(null);

  useEffect(() => {
    const handler = (payload: ReportEvt) => {
      const report = normalize(payload);

      // mostrar modal
      setNewReport(report);
      setShowModal(true);

      // agregar a la lista, deduplicando por Id
      setReports(prev => {
        const next = [report, ...prev.filter(r => r.Id !== report.Id)];
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
      {/* Modal para nuevo reporte */}
      <ModalBase 
        open={showModal} 
        onClose={() => setShowModal(false)}
        panelClassName="w-full max-w-2xl !p-0 overflow-hidden shadow-2xl"
      >
        {newReport && (
          <>
            {/* Header */}
            <div className="px-6 py-4 text-[#091540] border-b border-gray-200 bg-white">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                🚨 Nuevo Reporte Recibido
              </h3>
              <p className="text-sm opacity-80 mt-1">
                Se ha registrado un nuevo reporte en el sistema
              </p>
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
                    {new Date(newReport.CreatedAt).toLocaleString()}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-red-600 font-medium">UBICACIÓN</span>
                    <p className="text-sm text-red-800 font-medium">{newReport.Location}</p>
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
