import { useMemo, useState } from "react";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { DataPagination } from "@/Components/ui/data-pagination";
import { Eye, FileText, MapPin, MessageSquare } from "lucide-react";
import type { ReqSupervisionMeter } from "../../../Requests/RequestSupervisionMeter/Models/ReqSupervisionMeter";
import { CommentsSupervisionMeterModal } from "../../../Requests/RequestSupervisionMeter/Components/Comments/CommentsSupervisionMeterModal";
import { formatRequestSupervisionMeterDate } from "../../../Requests/RequestSupervisionMeter/utils/requestSupervisionMeterDate";
import MeterSupervisionDetailModal from "../Modals/RequestSuperVisionMeterr";

type Props = {
  data: ReqSupervisionMeter[];
  total?: number;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

const normalizeState = (value?: string) =>
  value
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim() ?? "";

function getStateClass(stateName?: string) {
  const normalized = normalizeState(stateName);
  if (normalized.includes("aproba")) {
    return "border-[#68D89B]/30 bg-[#E8F8F0] text-[#068A53]";
  }
  if (normalized.includes("rechaz")) {
    return "border-[#F6132D]/30 bg-[#FFE8E8] text-[#F6132D]";
  }
  if (normalized.includes("pend") || normalized.includes("proce")) {
    return "border-[#1789FC]/20 bg-[#E9F2FF] text-[#1789FC]";
  }
  return "border-slate-200 bg-slate-100 text-slate-700";
}

function ReqSupervisionMeterUserCard({
  req,
  onOpenDetails,
  onOpenComments,
}: {
  req: ReqSupervisionMeter;
  onOpenDetails: (req: ReqSupervisionMeter) => void;
  onOpenComments: (req: ReqSupervisionMeter) => void;
}) {
  const justification = req.Justification?.trim() || "Sin justificación registrada.";
  const isLongText = justification.length > 150;
  const [expanded, setExpanded] = useState(false);
  const fullName = useMemo(
    () =>
      `${req.User?.Name ?? ""} ${req.User?.Surname1 ?? ""} ${req.User?.Surname2 ?? ""}`.trim() ||
      "Solicitante",
    [req],
  );

  return (
    <Card className="flex h-full flex-col rounded-none border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="space-y-3 border-b border-slate-100 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <CardTitle className="line-clamp-2 text-base font-medium leading-6">
              {fullName}
            </CardTitle>
            <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
              Solicitud de supervisión de medidor
            </p>
          </div>
          <Badge className={`rounded-none border ${getStateClass(req.StateRequest?.Name)}`}>
            {req.StateRequest?.Name ?? "Sin estado"}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="rounded-none border-slate-300 text-slate-700">
            NIS: {req.NIS ?? "-"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 p-5">
        <div className="grid grid-cols-1 gap-3 text-sm text-slate-600 sm:grid-cols-2">
          <div className="border-l-2 border-slate-200 pl-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Fecha</p>
            <p className="mt-1 font-medium text-slate-900">
              {formatRequestSupervisionMeterDate(req.Date)}
            </p>
          </div>
          <div className="border-l-2 border-slate-200 pl-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Comentarios</p>
            <p className="mt-1 font-medium text-slate-900">{req.CanComment ? "Habilitados" : "Deshabilitados"}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
            <MapPin className="h-4 w-4 text-[#091540]" />
            Ubicación
          </div>
          <p className="text-sm leading-6 text-slate-600">
            {req.Location || "Sin ubicación registrada."}
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-2 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
            <FileText className="h-4 w-4 text-[#091540]" />
            Justificación
          </div>
          <p className={`text-sm leading-6 text-slate-600 ${expanded ? "" : "line-clamp-4 min-h-24"}`}>
            {justification}
          </p>
          {isLongText ? (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="self-start text-xs font-medium text-[#1789FC] hover:text-[#091540]"
            >
              {expanded ? "Ver menos" : "Ver más"}
            </button>
          ) : null}
        </div>

        <div className="mt-auto flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          <Button
            variant="outline"
            size="sm"
            className="rounded-none border-[#091540] text-[#091540] hover:bg-[#091540] hover:text-white"
            onClick={() => onOpenDetails(req)}
          >
            <Eye className="h-4 w-4" />
            Ver detalles
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-none border-[#068A53] text-[#068A53] hover:bg-[#068A53] hover:text-white"
            onClick={() => onOpenComments(req)}
            disabled={!req.CanComment}
          >
            <MessageSquare className="h-4 w-4" />
            Comentarios
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ReqSupervisionMeterUserCards({
  data,
  total,
  page,
  pageCount,
  onPageChange,
}: Props) {
  const [selectedRequest, setSelectedRequest] = useState<ReqSupervisionMeter | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [commentingRequest, setCommentingRequest] = useState<ReqSupervisionMeter | null>(null);

  const handleOpenDetails = (req: ReqSupervisionMeter) => {
    setSelectedRequest(req);
    setShowDetailModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetailModal(false);
    setSelectedRequest(null);
  };

  return (
    <section className="flex w-full flex-col gap-4">
      {selectedRequest ? (
        <MeterSupervisionDetailModal
          open={showDetailModal}
          onClose={handleCloseDetails}
          title="Detalles de Solicitud de Supervisión de Medidor"
          data={selectedRequest}
        />
      ) : null}

      {commentingRequest ? (
        <CommentsSupervisionMeterModal
          open={!!commentingRequest}
          onClose={() => setCommentingRequest(null)}
          request={commentingRequest}
          isAdmin={false}
        />
      ) : null}

      {data.length === 0 ? (
        <div className="flex min-h-[240px] flex-col items-center justify-center border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
          <p className="text-base font-semibold text-slate-900">No hay solicitudes para mostrar</p>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            Ajusta los filtros o crea una nueva solicitud para actualizar este listado.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data.map((req) => (
            <ReqSupervisionMeterUserCard
              key={req.Id}
              req={req}
              onOpenDetails={handleOpenDetails}
              onOpenComments={setCommentingRequest}
            />
          ))}
        </div>
      )}

      <Card className="rounded-none border-none shadow-none">
        <CardContent className="pt-6">
          <DataPagination
            page={page}
            pageCount={pageCount}
            total={total ?? data.length}
            onPageChange={onPageChange}
            labels={{ totalItems: "solicitudes" }}
            compact
          />
        </CardContent>
      </Card>
    </section>
  );
}
