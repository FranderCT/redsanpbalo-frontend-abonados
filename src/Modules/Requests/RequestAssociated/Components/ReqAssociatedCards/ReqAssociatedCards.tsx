import { useMemo, useState } from "react";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { DataPagination } from "@/Components/ui/data-pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Eye, FileText, MoreVertical } from "lucide-react";
import type { ReqAssociated } from "../../Models/RequestAssociated";
import UpdateReqAssociatedStateModal from "../Modals/UpdateAssociatedModal";
import ReqAssociatedAdminModal from "../Modals/VerinfoRequestAboando";
import CommentsAssociatedModal from "../Comments/CommentsAssociatedModal";
import { formatAssociatedRequestDate } from "../../utils/associatedRequestDate";

type Props = {
  data: ReqAssociated[];
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
  if (normalized.includes("aproba")) return "border-[#68D89B]/30 bg-[#E8F8F0] text-[#068A53]";
  if (normalized.includes("rechaz")) return "border-[#F6132D]/30 bg-[#FFE8E8] text-[#F6132D]";
  if (normalized.includes("pend") || normalized.includes("proce")) {
    return "border-[#1789FC]/20 bg-[#E9F2FF] text-[#1789FC]";
  }
  return "border-slate-200 bg-slate-100 text-slate-700";
}

function formatApplicant(req: ReqAssociated) {
  return `${req.User?.Name ?? ""} ${req.User?.Surname1 ?? ""} ${req.User?.Surname2 ?? ""}`.trim() || "Sin nombre";
}

function ReqAssociatedCard({
  req,
  onEdit,
  onOpenDetails,
  onOpenComments,
}: {
  req: ReqAssociated;
  onEdit: (req: ReqAssociated) => void;
  onOpenDetails: (req: ReqAssociated) => void;
  onOpenComments: (req: ReqAssociated) => void;
}) {
  const applicant = useMemo(() => formatApplicant(req), [req]);
  const justification = req.Justification?.trim() || "Sin justificacion registrada.";
  const isLongText = justification.length > 150;
  const [expanded, setExpanded] = useState(false);
  const profilePhoto = req.User?.ProfilePhoto?.trim();

  return (
    <Card className="flex h-full flex-col rounded-none border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-start gap-3 space-y-0 border-b border-slate-100 pb-4">
        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt={`Foto de perfil de ${applicant}`}
            className="mt-0.5 h-10 w-10 shrink-0 rounded-none border border-slate-200 object-cover"
          />
        ) : null}

        <div className="min-w-0 flex-1">
          <CardTitle className="line-clamp-2 text-base font-medium leading-6">
            {applicant}
          </CardTitle>
          <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">Solicitud de asociación</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-none">
            <DropdownMenuItem onSelect={(event) => event.preventDefault()} className="rounded-none p-0">
              <button type="button" onClick={() => onOpenDetails(req)} className="w-full px-2 py-1.5 text-left">
                Ver mas
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(event) => event.preventDefault()} className="rounded-none p-0">
              <button type="button" onClick={() => onEdit(req)} className="w-full px-2 py-1.5 text-left">
                Editar estado
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(event) => event.preventDefault()} className="rounded-none p-0">
              <button type="button" onClick={() => onOpenComments(req)} className="w-full px-2 py-1.5 text-left">
                Comentarios
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={`rounded-none border ${getStateClass(req.StateRequest?.Name)}`}>
            {req.StateRequest?.Name ?? "Sin estado"}
          </Badge>
          <Badge variant="outline" className="rounded-none border-slate-300 text-slate-700">
            NIS: {req.NIS ?? "-"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-3 text-sm text-slate-600 sm:grid-cols-2">
          <div className="border-l-2 border-slate-200 pl-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Fecha</p>
            <p className="mt-1 font-medium text-slate-900">{formatAssociatedRequestDate(req.Date)}</p>
          </div>
          <div className="border-l-2 border-slate-200 pl-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Comentarios</p>
            <p className="mt-1 font-medium text-slate-900">
              {req.CanComment ? "Habilitados" : "Deshabilitados"}
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
            <FileText className="h-4 w-4 text-[#091540]" />
            Justificacion
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
              {expanded ? "Ver menos" : "Ver mas"}
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
        </div>
      </CardContent>
    </Card>
  );
}

export default function ReqAssociatedCards({
  data,
  total,
  page,
  pageCount,
  onPageChange,
}: Props) {
  const [selectedRequest, setSelectedRequest] = useState<ReqAssociated | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingReqAssociated, setEditingReqAssociated] = useState<ReqAssociated | null>(null);
  const [commentingRequest, setCommentingRequest] = useState<ReqAssociated | null>(null);

  const handleOpenDetails = (req: ReqAssociated) => {
    setSelectedRequest(req);
    setShowDetailModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetailModal(false);
    setSelectedRequest(null);
  };

  return (
    <section className="flex w-full flex-col gap-4">
      <UpdateReqAssociatedStateModal
        open={!!editingReqAssociated}
        req={editingReqAssociated}
        onClose={() => setEditingReqAssociated(null)}
        onSuccess={() => setEditingReqAssociated(null)}
      />

      {selectedRequest ? (
        <ReqAssociatedAdminModal
          open={showDetailModal}
          onClose={handleCloseDetails}
          title="Detalles solicitud para ser Asociado"
          data={selectedRequest}
        />
      ) : null}

      {commentingRequest ? (
        <CommentsAssociatedModal
          open={!!commentingRequest}
          onClose={() => setCommentingRequest(null)}
          request={commentingRequest}
          isAdmin={true}
        />
      ) : null}

      {data.length === 0 ? (
        <div className="flex min-h-[240px] flex-col items-center justify-center border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
          <p className="text-base font-semibold text-slate-900">No hay solicitudes para mostrar</p>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            Ajusta los filtros o registra una nueva solicitud para actualizar este listado.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data.map((req) => (
            <ReqAssociatedCard
              key={req.Id}
              req={req}
              onEdit={setEditingReqAssociated}
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
