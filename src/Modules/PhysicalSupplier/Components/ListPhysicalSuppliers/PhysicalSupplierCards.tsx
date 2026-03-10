import { useState } from "react";
import type { PhysicalSupplier } from "../../Models/PhysicalSupplier";
import EditPhysicalSupplierModal from "../Modals/EditPhysicalSupplierModal";
import GetInfoPhysicalSupplierModal from "../Modals/GetInfoPhysicalSupplierModal";
import { DataPagination } from "@/Components/ui/data-pagination";
import { useDeletePhysicalSupplier } from "../../Hooks/PhysicalSupplierHooks";
import InhabilityActionModal from "../../../../Components/Modals/InhabilyActionModal";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Mail, Phone, IdCard, MapPin, MoreVertical } from "lucide-react";

type Props = {
  data: PhysicalSupplier[];
  total?: number;
  page: number;
  pageCount: number;
  onPageChange: (p: number) => void;
};

export default function PhysicalSupplierCards({
  data,
  total,
  page,
  pageCount,
  onPageChange,
}: Props) {
  const [editingSupplier, setEditingSupplier] = useState<PhysicalSupplier | null>(null);
  const [getInfoSupplier, setGetInfoSupplier] = useState<PhysicalSupplier | null>(null);
  const [disableSupplier, setDisableSupplier] = useState<PhysicalSupplier | null>(null);
  const [isDisabling, setIsDisabling] = useState(false);
  const deleteSupplierMutation = useDeletePhysicalSupplier();

  const handleConfirmDisable = async () => {
    if (!disableSupplier) return;
    try {
      setIsDisabling(true);
      await deleteSupplierMutation.mutateAsync(disableSupplier.Id);
      toast.success("Proveedor inhabilitado");
      setDisableSupplier(null);
    } catch (err) {
      console.error("Error al inhabilitar proveedor:", err);
      toast.error("No se pudo inhabilitar el proveedor");
    } finally {
      setIsDisabling(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {editingSupplier && (
        <EditPhysicalSupplierModal
          supplier={editingSupplier}
          open={true}
          onClose={() => setEditingSupplier(null)}
          onSuccess={() => setEditingSupplier(null)}
        />
      )}

      {getInfoSupplier && (
        <GetInfoPhysicalSupplierModal
          supplier={getInfoSupplier}
          open={true}
          onClose={() => setGetInfoSupplier(null)}
          onSuccess={() => setGetInfoSupplier(null)}
        />
      )}

      {data.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">
            No hay proveedores físicos para mostrar
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => {
            const supplier = item.Supplier;
            const fullName = [supplier?.Name, item.Surname1, item.Surname2]
              .filter(Boolean)
              .join(" ")
              .trim();
            const isActive = supplier?.IsActive ?? true;

            return (
              <Card
                key={item.Id}
                className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md "
              >
                <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted ring-2 ring-border">
                    <IdCard className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="truncate text-base font-semibold text-foreground">
                      {fullName || "—"}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 text-xs">
                      <IdCard className="h-3 w-3" />
                      <span className="truncate">{supplier?.IDcard || "Sin cédula"}</span>
                    </CardDescription>
                  </div>
                  <Badge
                    variant={isActive ? "default" : "destructive"}
                    className="shrink-0 text-xs"
                  >
                    {isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col gap-3 pt-0">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{supplier?.Email || "Sin correo"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{supplier?.PhoneNumber || "Sin teléfono"}</span>
                  </div>
                  {supplier?.Location ? (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="line-clamp-2">{supplier.Location}</span>
                    </div>
                  ) : null}
                </CardContent>

                <CardFooter className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                  <div className="flex flex-1 flex-wrap gap-2">
                    <Button
                      variant="outline"
                      className="min-w-[130px] flex-1"
                      onClick={() => setGetInfoSupplier(item)}
                    >
                      Ver detalles
                    </Button>
                  </div>
                  <div className="flex items-center gap-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8"
                          aria-label="Más acciones sobre el proveedor"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingSupplier(item)}>
                          Editar proveedor
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setGetInfoSupplier(item)}>
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                          onClick={() => setDisableSupplier(item)}
                        >
                          Inhabilitar proveedor
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      <div className="border-t border-border pt-4">
        <DataPagination
          page={page}
          pageCount={pageCount}
          total={total ?? data.length}
          onPageChange={onPageChange}
          labels={{ totalItems: "proveedores" }}
          compact
        />
      </div>

      {disableSupplier && (
        <div className="fixed inset-0 z-[999] grid place-items-center bg-black/40">
          <InhabilityActionModal
            title="¿Inhabilitar proveedor?"
            description={`Se inhabilitará el proveedor "${[
              disableSupplier.Supplier?.Name,
              disableSupplier.Surname1,
              disableSupplier.Surname2,
            ]
              .filter(Boolean)
              .join(" ")}".`}
            cancelLabel="Cancelar"
            confirmLabel={isDisabling ? "Inhabilitando..." : "Inhabilitar"}
            onConfirm={handleConfirmDisable}
            onClose={() => {
              if (!isDisabling) setDisableSupplier(null);
            }}
            onCancel={() => {
              if (!isDisabling) setDisableSupplier(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
