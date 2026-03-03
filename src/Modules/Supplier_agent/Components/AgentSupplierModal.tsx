import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { useLegalSupplierById } from "../../LegalSupplier/Hooks/LegalSupplierHooks";
import { useDeleteAgentSupplier } from "../Hooks/SupplierAgentHooks";
import CreateAgentSupplierModal from "./Modals/CreateAgentSupplierModal";
import EditAgentSupplierModal from "./Modals/EditAgentSupplierModal";
import type { AgentSupppliers } from "../Models/SupplierAgent";
import { Building2, Mail, MoreVertical, Phone, User } from "lucide-react";

type Props = {
  legalSupplierId: number;
  open: boolean;
  onClose: () => void;
};

const isActiveFlag = (v: unknown): boolean => {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v === 1;
  if (typeof v === "string") return v === "1" || v.toLowerCase() === "true";
  return false;
};

export default function AgentSupplierModal({
  legalSupplierId,
  open,
  onClose,
}: Props) {
  const queryClient = useQueryClient();
  const { legalSup, isLoading, error } = useLegalSupplierById(legalSupplierId);
  const agents: AgentSupppliers[] = legalSup?.AgentSupppliers ?? [];

  const [editOpen, setEditOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentSupppliers | null>(null);
  const [agentToDelete, setAgentToDelete] = useState<AgentSupppliers | null>(null);
  const deleteMutation = useDeleteAgentSupplier();

  const refresh = () =>
    queryClient.invalidateQueries({
      queryKey: ["legal-supplier", legalSupplierId, "agent-supplier"],
    });

  const openEdit = (agent: AgentSupppliers) => {
    setSelectedAgent(agent);
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setSelectedAgent(null);
  };

  const handleConfirmDelete = async () => {
    if (!agentToDelete || typeof agentToDelete.Id !== "number") return;
    try {
      await deleteMutation.mutateAsync(agentToDelete.Id);
      toast.success("Agente inhabilitado");
      setAgentToDelete(null);
      refresh();
    } catch (err) {
      console.error("Error al inhabilitar agente:", err);
      toast.error("No se pudo inhabilitar el agente");
    }
  };

  const supplierName = legalSup?.Supplier?.Name ?? "—";
  const supplierIdCard = legalSup?.Supplier?.IDcard ?? "—";

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
        <DialogContent className="flex max-h-[70vh] max-w-4xl flex-col gap-0 overflow-hidden p-0">
          <DialogHeader className="shrink-0 space-y-1.5 border-b px-6 py-5">
            <DialogTitle>Gestión de agentes del proveedor</DialogTitle>
            <DialogDescription>
              Administra los agentes asociados a este proveedor jurídico.
            </DialogDescription>
          </DialogHeader>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            {legalSup && (
              <section className="shrink-0 border-b px-6 py-4">
                <Card className="overflow-hidden border-0 bg-muted/40 shadow-none">
                  <CardHeader className="pb-2 pt-3">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      Información del proveedor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-4 pt-0 text-sm">
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Nombre
                      </span>
                      <p className="font-medium text-foreground">{supplierName}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Cédula jurídica
                      </span>
                      <p className="font-medium text-foreground">{supplierIdCard}</p>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            <section className="flex-1 px-6 py-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-medium text-foreground">
                  Agentes registrados
                </h3>
                {legalSup?.Id != null && (
                  <CreateAgentSupplierModal
                    LegalSupplierId={legalSup.Id}
                    onSuccess={refresh}
                  />
                )}
              </div>

              {isLoading && (
                <p className="py-4 text-sm text-muted-foreground">Cargando…</p>
              )}
              {error && (
                <p className="py-4 text-sm text-destructive">
                  Error al cargar los datos.
                </p>
              )}

              {!isLoading && !error && agents.length === 0 && (
                <p className="py-4 text-sm text-muted-foreground">
                  No hay agentes registrados.
                </p>
              )}

              {!isLoading && !error && agents.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {agents.map((u) => {
                    const active = isActiveFlag(u.IsActive);
                    const fullName = [u.Name, u.Surname1, u.Surname2]
                      .filter(Boolean)
                      .join(" ") || "—";
                    return (
                      <Card
                        key={u.Id}
                        className="flex flex-col overflow-hidden transition-shadow hover:shadow-md"
                      >
                        <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-2">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted ring-2 ring-border">
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="truncate text-sm font-semibold">
                              {fullName}
                            </CardTitle>
                            <Badge
                              variant={active ? "default" : "destructive"}
                              className="mt-1 text-xs"
                            >
                              {active ? "Activo" : "Inactivo"}
                            </Badge>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0"
                                aria-label="Acciones del agente"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="min-w-[160px]">
                              <DropdownMenuItem onClick={() => openEdit(u)}>
                                Editar agente
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                onClick={() => setAgentToDelete(u)}
                              >
                                Inhabilitar agente
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col gap-2 pt-0 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span className="truncate">{u.Email ?? "—"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span className="truncate">{u.PhoneNumber ?? "—"}</span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          <DialogFooter className="shrink-0 flex-row flex-wrap items-center justify-end gap-2 border-t px-6 py-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedAgent && (
        <EditAgentSupplierModal
          agent={selectedAgent}
          open={editOpen}
          onClose={closeEdit}
          onSuccess={() => {
            refresh();
            closeEdit();
          }}
        />
      )}

      <AlertDialog
        open={!!agentToDelete}
        onOpenChange={(v) => { if (!v) setAgentToDelete(null); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Inhabilitar agente?</AlertDialogTitle>
            <AlertDialogDescription>
              Se inhabilitará el agente &quot;
              {agentToDelete
                ? [agentToDelete.Name, agentToDelete.Surname1, agentToDelete.Surname2]
                    .filter(Boolean)
                    .join(" ") || agentToDelete.Name || "sin nombre"
                : ""}
              &quot;. Esta acción puede revertirse desde la edición del agente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row flex-wrap items-center justify-end gap-2">
            <AlertDialogCancel onClick={() => setAgentToDelete(null)} className="w-full sm:w-auto">
              Cancelar
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="w-full sm:w-auto"
            >
              {deleteMutation.isPending ? "Inhabilitando…" : "Inhabilitar"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
