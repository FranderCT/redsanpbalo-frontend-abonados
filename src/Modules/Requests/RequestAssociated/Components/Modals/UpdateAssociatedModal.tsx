import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import type { ReqAssociated } from "../../Models/RequestAssociated";
import { useGetAllRequestStates, useUpdateAssociatedreq, useUpdateCanComment } from "../../Hooks/ReqAssociatedHooks";

type Props = {
  open: boolean;
  req: ReqAssociated | null;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function UpdateReqAssociatedStateModal({
  open,
  req,
  onClose,
  onSuccess,
}: Props) {
  const { requestStates = [], isPending, error } = useGetAllRequestStates();
  const updateMutation = useUpdateAssociatedreq();
  const updateCanCommentMutation = useUpdateCanComment();

  const [stateId, setStateId] = useState<string>("");
  const [canComment, setCanComment] = useState<boolean>(false);

  useEffect(() => {
    if (!req) return;
    const current = req.StateRequest?.Id;

    setStateId(current ? String(current) : "");
    const initialCanComment = req.CanComment ?? false;
    setCanComment(initialCanComment);
  }, [req, req?.CanComment]); // Agregar req?.CanComment como dependencia

    useEffect(()=>{if(requestStates.length>0){}}, [requestStates]);

  if (!open || !req) return null;

  const busy = updateMutation.isPending || updateCanCommentMutation.isPending;

  const handleToggleCanComment = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (busy) return;
    
    const newValue = !canComment;
    console.log('🔄 Cambiando CanComment:', { actual: canComment, nuevo: newValue, requestId: req.Id });
    
    // Actualización optimista
    setCanComment(newValue);
    
    try {
      const result = await updateCanCommentMutation.mutateAsync({
        id: req.Id,
        canComment: newValue,
      });
      console.log('✅ CanComment actualizado en servidor:', result);
      toast.success(
        newValue 
          ? "Comentarios habilitados para el abonado" 
          : "Comentarios deshabilitados para el abonado",
        { position: "top-right", autoClose: 3000 }
      );
    } catch (err: any) {
      setCanComment(!newValue);
      toast.error(err?.response?.data?.message || "No se pudo actualizar el permiso de comentarios");
    }
  };

  const handleCancel = () => {
    toast.warning("Edición cancelada", { position: "top-right", autoClose: 3000 });
    onClose();
  };

  const handleConfirm = async () => {
    if (!stateId || stateId === "") {
      toast.warn("Selecciona un estado", { position: "top-right", autoClose: 2500 });
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: req.Id,
        data: { StateRequestId: Number(stateId) },
      });
      toast.success("Estado actualizado");
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "No se pudo actualizar el estado");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className="max-w-md rounded-none border-slate-200 p-0">
        <DialogHeader className="border-b border-slate-200 px-6 py-4">
          <DialogTitle className="text-[#091540]">Editar estado</DialogTitle>
          <DialogDescription>
            {`${req.User?.Name ?? ""} ${req.User?.Surname1 ?? ""} ${req.User?.Surname2 ?? ""}`.trim() || "-"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 px-6 py-5">
          <div className="space-y-2">
            <Label htmlFor="request-associated-state-select">Estado</Label>
            {isPending ? (
              <div className="border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                Cargando estados…
              </div>
            ) : error ? (
              <div className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                No se pudieron cargar los estados: {error.message}
              </div>
            ) : requestStates.length === 0 ? (
              <div className="border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-700">
                No hay estados disponibles
              </div>
            ) : (
              <Select value={stateId} onValueChange={setStateId} disabled={busy}>
                <SelectTrigger id="request-associated-state-select" className="rounded-none">
                  <SelectValue placeholder="Seleccione un estado" />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  {requestStates.map((s) => {
                    const id = (s as any).Id;
                    if (!id) return null;
                    return (
                      <SelectItem key={id} value={String(id)}>
                        {(s as any).Name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-3 border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <Label className="text-[#091540]">Permisos de comentarios</Label>
              <Badge variant="outline" className={canComment ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-300 bg-white text-slate-700"}>
                {canComment ? "Habilitados" : "Deshabilitados"}
              </Badge>
            </div>
            <p className="text-xs text-slate-600">
              {canComment
                ? "El abonado puede ver y agregar comentarios a esta solicitud."
                : "El abonado no puede acceder a los comentarios de esta solicitud."}
            </p>
            <Button
              type="button"
              variant={canComment ? "destructive" : "secondary"}
              className="rounded-none"
              onMouseDown={handleToggleCanComment}
              disabled={busy}
            >
              {busy ? "Actualizando..." : canComment ? "Deshabilitar comentarios" : "Habilitar comentarios"}
            </Button>
          </div>
        </div>

        <DialogFooter className="border-t border-slate-200 px-6 py-4">
          <Button type="button" variant="ghost" className="rounded-none" onClick={handleCancel} disabled={busy}>
            Cancelar
          </Button>
          <Button
            type="button"
            className="rounded-none bg-[#1789FC] text-white hover:bg-[#0f6fd1]"
            onClick={handleConfirm}
            disabled={busy || !stateId}
          >
            {busy ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
