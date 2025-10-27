import type { Report } from "../Models/Report";

type Props = {
  report: Report;
  onViewDetails?: (report: Report) => void;
  onEditReport?: (report: Report) => void;
};

const ReportCard = ({ report, onViewDetails, onEditReport }: Props) => {
  return (
    <div className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden group">
        {/* Header Section */}
        <div className="border-b border-gray-100 p-4">
            <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg text-[#091540]">{`Reporte #${report.Id}`}</h2>
                <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 font-medium">
                    {new Date(report.CreatedAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })}
                </span>
            </div>
        </div>
        
        <div className="p-5 space-y-4">
            {/* Description Section */}
            <div>
                <h3 className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Descripción</h3>
                <p className="text-sm text-gray-800 leading-relaxed">
                    {report.Description}
                </p>
            </div>
            
            {/* Location Section */}
            <div>
                <h3 className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Ubicación</h3>
                <p className="text-sm text-gray-800">
                    {report.Location}
                    {report.ReportLocation?.Neighborhood && (
                        <span className="text-gray-600"> • {report.ReportLocation.Neighborhood}</span>
                    )}
                </p>
            </div>

            {/* Tags Section */}
            <div className="flex flex-wrap gap-2">
                {report.ReportType?.Name && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-200">
                        {report.ReportType.Name}
                    </span>
                )}
                {report.ReportState?.Name && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-200">
                        {report.ReportState.Name}
                    </span>
                )}
            </div>

            {/* User in Charge Section */}
            {report.UserInCharge?.Name && (
                <div className="border-t border-gray-100 pt-4">
                    <h3 className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Fontanero a Cargo</h3>
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 flex items-center justify-center text-gray-700 text-sm font-medium">
                            {report.UserInCharge.Name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-800">{report.UserInCharge.Name}</p>
                            <p className="text-xs text-gray-500">{report.UserInCharge.Email}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
        
        {/* Footer Actions */}
        <div className="border-t border-gray-100 group-hover:bg-gray-50 transition-all duration-300 p-3">
            <div className="flex gap-2">
                {onEditReport && (
                    <button
                        className="flex-1 text-sm font-medium text-white bg-[#091540] hover:bg-[#1789FC] transition-colors duration-300 py-2 px-3"
                        onClick={() => onEditReport(report)}
                    >
                        Gestionar
                    </button>
                )}
                <button
                    className="flex-1 text-sm font-medium text-gray-600 hover:text-[#091540] transition-colors duration-300 py-2 px-3 border border-gray-200 hover:border-[#091540] hover:bg-white"
                    onClick={() => onViewDetails?.(report)}
                >
                    Ver detalles
                </button>
                
            </div>
        </div>
    </div>
);
};

export default ReportCard;
