import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { Button } from "@/Components/ui/button";
import { useDeleteAgentSupplier } from "../../Hooks/SupplierAgentHooks";
import type { AgentSupppliers } from "../../Models/SupplierAgent";

type Props = {
  agent: AgentSupppliers | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

function getDisplayName(agent: AgentSupppliers | null): string {
  if (!agent) return "sin nombre";
  const full = [agent.Name, agent.Surname1, agent.Surname2]
    .filter(Boolean)
    .join(" ")
    .trim();
  return full || agent.Name || "sin nombre";
}

export default function DeleteAgentSupplierModal({
  agent,
  open,
  onClose,
  onSuccess,
}: Props) {
  const deleteMutation = useDeleteAgentSupplier();
  const displayName = getDisplayName(agent);

  const handleConfirm = async () => {
    if (!agent || typeof agent.Id !== "number") return;
    try {
      await deleteMutation.mutateAsync(agent.Id);
      toast.success("Agente inhabilitado");
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error("Error al inhabilitar agente:", err);
      toast.error("No se pudo inhabilitar el agente");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Inhabilitar agente?</AlertDialogTitle>
          <AlertDialogDescription>
            Se inhabilitará el agente &quot;{displayName}&quot;.
            Esta acción puede revertirse desde la edición del agente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div className="w-full flex flex-row-reverse items-center justify-between ">
            <AlertDialogCancel onClick={onClose} className="w-full sm:w-auto">
              Cancelar
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={deleteMutation.isPending}
              className="w-full sm:w-auto"
            >
              {deleteMutation.isPending ? "Inhabilitando…" : "Inhabilitar"}
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
