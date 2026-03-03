import { toast } from "react-toastify";
import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import { Button } from "@/Components/ui/button";
import { useDeleteAgentSupplier } from "../../Hooks/SupplierAgentHooks";
import type { AgentSupplier } from "../../../Supplier/Models/AgentSupplier";

type Props = {
  agent: AgentSupplier;
  onSuccess?: () => void;
};

export default function DeleteAgentSupplierButton({ agent, onSuccess }: Props) {
  const deleteMutation = useDeleteAgentSupplier();
  const displayName = [agent.Name, agent.Surname1, agent.Surname2]
    .filter(Boolean)
    .join(" ")
    .trim() || agent.Name || "sin nombre";

  const handleConfirm = async () => {
    if (typeof agent.Id !== "number") {
      toast.error("No se encontró el Id del agente");
      return;
    }
    try {
      await deleteMutation.mutateAsync(agent.Id);
      toast.success("Agente inhabilitado");
      onSuccess?.();
    } catch (err) {
      console.error("Error al inhabilitar agente:", err);
      toast.error("No se pudo inhabilitar el agente");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          Inhabilitar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Inhabilitar agente?</AlertDialogTitle>
          <AlertDialogDescription>
            Se inhabilitará el agente &quot;{displayName}&quot;.
            Esta acción puede revertirse desde la edición del agente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div className="flex flex-row-reverse">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Inhabilitando…" : "Inhabilitar"}
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
