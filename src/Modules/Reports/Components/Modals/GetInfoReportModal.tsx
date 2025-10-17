import { ModalBase } from "../../../../Components/Modals/ModalBase";
import type { Report } from "../../Models/Report";

type Props = {
  report: Report;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const Field = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="bg-gray-50 p-3">
    <dt className="text-[11px] uppercase text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-[#091540] break-words">{value ?? "—"}</dd>
  </div>
);

export default function GetInfoReportModal({
  report,
  open,
  onClose,
  onSuccess,
}: Props) {
  const close = () => { onClose(); onSuccess?.(); };

  return (
    <ModalBase open={open} onClose={close} panelClassName="w-full max-w-2xl !p-0 overflow-hidden shadow-2xl">
      <div className="px-6 py-5 border-b border-gray-200 bg-white">
        <h3 className="text-xl font-bold text-[#091540]">Información del reporte</h3>
        <span className="text-gray-600">Detalles del reporte #{report.Id}</span>
      </div>

      <div className="p-6 bg-white">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Número de Reporte" value={`#${report.Id}`} />
          <Field 
            label="Fecha de Creación" 
            value={new Date(report.CreatedAt).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })} 
          />
          
          <Field label="Ubicación" value={report.Location} />
          <Field label="Barrio" value={report.ReportLocation?.Neighborhood} />
          
          <Field label="Tipo de Reporte" value={report.ReportType?.Name} />
          <Field 
            label="Estado" 
            value={
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-200">
                {report.ReportState?.Name}
              </span>
            } 
          />
          
          <div className="sm:col-span-2">
            <Field label="Descripción" value={report.Description} />
          </div>
          
          {report.UserInCharge && (
            <>
              <Field label="Usuario a Cargo" value={report.UserInCharge.Name} />
              <Field label="Email del Responsable" value={report.UserInCharge.Email} />
            </>
          )}
          
          {report.User && (
            <div className="sm:col-span-2">
              <Field 
                label="Usuario que Reportó" 
                value={
                  <div className="space-y-1">
                    <div className="font-medium">
                      {report.User.Name} {report.User.Surname1} {report.User.Surname2}
                    </div>
                    <div className="text-xs text-gray-500">Número de Teléfono: {report.User.PhoneNumber}</div>
                  </div>
                } 
              />
            </div>
          )}
        </dl>

        <div className="mt-6 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={close} 
            className="h-10 px-4 bg-gray-200 hover:bg-gray-300 text-[#091540] font-medium transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </ModalBase>
  );
}