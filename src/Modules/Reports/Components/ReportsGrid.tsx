import type { Report } from "../Models/Report";
import ReportCard from "./ReportCard";

type Props = {
  reports: Report[];
  onViewDetails?: (report: Report) => void;
  onEditReport?: (report: Report) => void;
  emptyText?: string;
};

export default function ReportsGrid({
  reports,
  onViewDetails,
  onEditReport,
  emptyText = "No se encontraron reportes.",
}: Props) {
  if (reports.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg text-[#091540]/70 mb-2">{emptyText}</p>
          <p className="text-sm text-[#091540]/50">Los reportes aparecerán aquí cuando estén disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reports.map((report) => (
        <ReportCard 
          key={report.Id} 
          report={report} 
          onViewDetails={onViewDetails}
          onEditReport={onEditReport}
        />
      ))}
    </div>
  );
}