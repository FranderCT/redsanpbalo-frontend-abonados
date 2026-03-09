import { useParams, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Calendar,
  FileText,
  MapPin,
  MessageSquare,
  User,
  Wrench,
  ChevronDown,
  ChevronUp,
  Pencil,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";
import { Textarea } from "@/Components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Label } from "@/Components/ui/label";
import {
  useGetReportById,
  useGetReportAssignments,
  useAddReportAssignment,
  useGetReportStateHistory,
  useGetReportComments,
  useAddReportComment,
} from "../Hooks/ReportsHooks";
import { useGetUsersByRoleFontanero } from "../../Users/Hooks/UsersHooks";
import EditReportModal from "../Components/Modals/EditReportModal";
import ChangeReportStateModal from "../Components/Modals/ChangeReportStateModal";
import type { Report } from "../Models/Report";

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusVariant(
  state?: string
): "default" | "secondary" | "destructive" | "outline" {
  const n = (state ?? "").toLowerCase();
  if (n.includes("resuelto")) return "default";
  if (n.includes("proceso")) return "secondary";
  if (n.includes("pendiente")) return "outline";
  if (n.includes("cancelado")) return "destructive";
  return "secondary";
}

export default function ReportDetailPage() {
  const params = useParams({ strict: false }) as { reportId?: string };
  const reportId = params.reportId != null ? Number(params.reportId) : null;
  const navigate = useNavigate();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [changeStateModalOpen, setChangeStateModalOpen] = useState(false);
  const [assignUserId, setAssignUserId] = useState<number>(0);
  const [assignInstructions, setAssignInstructions] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [commentVisibleToReporter, setCommentVisibleToReporter] = useState(false);
  const [showStateHistory, setShowStateHistory] = useState(true);
  const [showComments, setShowComments] = useState(true);

  const { data: report, isLoading: reportLoading, isError: reportError } = useGetReportById(reportId);
  const { data: assignments = [], isLoading: assignmentsLoading } = useGetReportAssignments(reportId);
  const { data: stateHistory = [] } = useGetReportStateHistory(reportId);
  const { data: comments = [] } = useGetReportComments(reportId);
  const addAssignmentMutation = useAddReportAssignment();
  const addCommentMutation = useAddReportComment();
  const { fontaneros = [] } = useGetUsersByRoleFontanero();

  const handleAddAssignment = async () => {
    if (!reportId || !assignUserId || assignUserId === 0) {
      toast.error("Selecciona un fontanero");
      return;
    }
    try {
      await addAssignmentMutation.mutateAsync({
        reportId,
        payload: { userId: assignUserId, instructions: assignInstructions.trim() || undefined },
      });
      toast.success("Fontanero asignado");
      setAssignUserId(0);
      setAssignInstructions("");
    } catch {
      toast.error("Error al asignar");
    }
  };

  const handleAddComment = async () => {
    if (!reportId || !commentContent.trim()) {
      toast.error("Escribe un comentario");
      return;
    }
    try {
      await addCommentMutation.mutateAsync({
        reportId,
        payload: { content: commentContent.trim(), visibleToReporter: commentVisibleToReporter },
      });
      toast.success("Comentario agregado");
      setCommentContent("");
      setCommentVisibleToReporter(false);
    } catch {
      toast.error("Error al agregar comentario");
    }
  };

  if (reportId == null || isNaN(reportId)) {
    return (
      <section className="p-4">
        <p className="text-destructive">ID de reporte inválido.</p>
        <Button variant="link" onClick={() => navigate({ to: "/dashboard/reports" })}>
          Volver a reportes
        </Button>
      </section>
    );
  }

  if (reportError || (report == null && !reportLoading)) {
    return (
      <section className="p-4 space-y-4">
        <p className="text-destructive">No se pudo cargar el reporte.</p>
        <Button variant="outline" onClick={() => navigate({ to: "/dashboard/reports" })}>
          <ArrowLeft className="size-4 mr-2" />
          Volver a reportes
        </Button>
      </section>
    );
  }

  if (reportLoading || !report) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center p-6">
        <p className="text-muted-foreground">Cargando reporte…</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col p-3 sm:p-6 space-y-6 min-w-0 overflow-x-hidden">
      {/* Breadcrumb / Back */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/dashboard/reports" })}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4 mr-1" />
          Reportes
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#091540]">
            Reporte {report.Code}
          </h1>
          <p className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Calendar className="size-4" />
            {formatDate(report.CreatedAt)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={getStatusVariant(report.State)}>{report.State ?? "—"}</Badge>
          {report.Urgency && (
            <Badge variant="outline" className="capitalize">
              {report.Urgency}
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setChangeStateModalOpen(true)}
          >
            <RefreshCw className="size-4 mr-2" />
            Cambiar estado
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditModalOpen(true)}
          >
            <Pencil className="size-4 mr-2" />
            Editar reporte
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">

          {/* Sidebar: Reportado por */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="size-4" />
                Reportado por
              </CardTitle>
            </CardHeader>
            <CardContent>
              {report.User ? (
                <>
                  <p className="font-medium">
                    {report.User.Name} {report.User.Surname1}
                    {report.User.Surname2 ? ` ${report.User.Surname2}` : ""}
                  </p>
                  {report.User.Email && (
                    <p className="text-sm text-muted-foreground">{report.User.Email}</p>
                  )}
                  {report.User.PhoneNumber && (
                    <p className="text-sm text-muted-foreground">{report.User.PhoneNumber}</p>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">—</p>
              )}
            </CardContent>
          </Card>
        </div>



        {/* Columna principal: Detalles + Asignaciones + Historial + Comentarios */}
        <div className="lg:col-span-2 space-y-6">
          {/* Detalles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="size-4" />
                Detalles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <CardDescription className="mb-1">Tipo</CardDescription>
                <p className="text-sm font-medium">{report.ReportType?.Name ?? "—"}</p>
              </div>
              <Separator />
              <div>
                <CardDescription className="mb-1 flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  Ubicación exacta
                </CardDescription>
                <p className="text-sm font-medium">{report.ExactLocation}</p>
                {report.ReportLocation?.Neighborhood && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Barrio: {report.ReportLocation.Neighborhood}
                  </p>
                )}
              </div>
              <Separator />
              <div>
                <CardDescription className="mb-1">Descripción</CardDescription>
                <p className="text-sm whitespace-pre-wrap">{report.Description}</p>
              </div>
              {report.AdditionalInfo && (
                <>
                  <Separator />
                  <div>
                    <CardDescription className="mb-1">Información adicional / seguimiento</CardDescription>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {report.AdditionalInfo}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Asignaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Wrench className="size-4" />
                Encargados ({assignments.length})
              </CardTitle>
              <CardDescription>
                Fontaneros asignados a este reporte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {assignmentsLoading ? (
                <p className="text-sm text-muted-foreground">Cargando…</p>
              ) : assignments.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin asignar</p>
              ) : (
                <ul className="space-y-2">
                  {assignments.map((a) => (
                    <li
                      key={a.Id}
                      className="rounded-lg border bg-muted/30 p-3 text-sm"
                    >
                      <p className="font-medium">
                        {a.User ? `${a.User.Name} ${a.User.Surname1}` : "—"}
                      </p>
                      {a.User?.Email && (
                        <p className="text-xs text-muted-foreground">{a.User.Email}</p>
                      )}
                      {a.Instructions && (
                        <p className="mt-1 text-xs text-muted-foreground">{a.Instructions}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              <Separator />
              <div className="space-y-2">
                <Label>Asignar fontanero</Label>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                  <Select
                    value={assignUserId === 0 ? "" : String(assignUserId)}
                    onValueChange={(v) => setAssignUserId(Number(v))}
                  >
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontaneros.map((f) => (
                        <SelectItem key={f.Id} value={String(f.Id)}>
                          {f.Name} {f.Surname1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Instrucciones (opcional)"
                    value={assignInstructions}
                    onChange={(e) => setAssignInstructions(e.target.value)}
                    className="min-h-[60px] flex-1"
                    rows={2}
                  />
                  <Button
                    onClick={handleAddAssignment}
                    disabled={assignUserId === 0 || addAssignmentMutation.isPending}
                  >
                    {addAssignmentMutation.isPending ? "Asignando…" : "Asignar"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Historial de estado */}
          <Card>
            <CardHeader
              className="cursor-pointer"
              onClick={() => setShowStateHistory((v) => !v)}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Historial de estado</CardTitle>
                {showStateHistory ? (
                  <ChevronUp className="size-4" />
                ) : (
                  <ChevronDown className="size-4" />
                )}
              </div>
            </CardHeader>
            {showStateHistory && (
              <CardContent>
                {stateHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Sin cambios registrados</p>
                ) : (
                  <ul className="space-y-3">
                    {stateHistory.map((entry, i) => (
                      <li key={i} className="flex flex-col gap-0.5 text-sm">
                        <span className="font-medium">
                          {entry.FromState} → {entry.ToState}
                        </span>
                        {entry.ChangedBy && (
                          <span className="text-xs text-muted-foreground">
                            Por {entry.ChangedBy.Name} {entry.ChangedBy.Surname1} ·{" "}
                            {formatDate(entry.ChangedAt)}
                          </span>
                        )}
                        {entry.Note && (
                          <span className="text-xs text-muted-foreground">{entry.Note}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            )}
          </Card>

          {/* Comentarios */}
          <Card>
            <CardHeader
              className="cursor-pointer"
              onClick={() => setShowComments((v) => !v)}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageSquare className="size-4" />
                  Comentarios ({comments.length})
                </CardTitle>
                {showComments ? (
                  <ChevronUp className="size-4" />
                ) : (
                  <ChevronDown className="size-4" />
                )}
              </div>
            </CardHeader>
            {showComments && (
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {comments.map((c) => (
                    <li key={c.Id} className="rounded-lg border p-3 text-sm">
                      <p className="whitespace-pre-wrap">{c.Content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {c.User?.Name} {c.User?.Surname1} · {formatDate(c.CreatedAt)}
                        {c.VisibleToReporter && (
                          <Badge variant="secondary" className="ml-2 text-[10px]">
                            Visible para el ciudadano
                          </Badge>
                        )}
                      </p>
                    </li>
                  ))}
                </ul>
                <Separator />
                <div className="space-y-2">
                  <Label>Nuevo comentario</Label>
                  <Textarea
                    placeholder="Escribe un comentario…"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    rows={3}
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={commentVisibleToReporter}
                      onChange={(e) => setCommentVisibleToReporter(e.target.checked)}
                    />
                    Visible para el ciudadano (creador del reporte)
                  </label>
                  <Button
                    onClick={handleAddComment}
                    disabled={!commentContent.trim() || addCommentMutation.isPending}
                  >
                    {addCommentMutation.isPending ? "Enviando…" : "Enviar comentario"}
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </div>

      </div>

      {/* Modal Editar (mismo componente, solo se abre desde aquí) */}
      <EditReportModal
        report={report as Report}
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
      />

      {/* Modal Cambiar estado — PATCH /reports/:id/state (historial + socket) */}
      <ChangeReportStateModal
        report={report}
        open={changeStateModalOpen}
        onClose={() => setChangeStateModalOpen(false)}
      />
    </section>
  );
}
