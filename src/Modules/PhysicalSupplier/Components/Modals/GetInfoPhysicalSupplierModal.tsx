import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Field, FieldGroup, FieldLabel } from "@/Components/ui/field";
import { Mail, Phone, IdCard, MapPin } from "lucide-react";
import type { PhysicalSupplier } from "../../Models/PhysicalSupplier";

type Props = {
  supplier: PhysicalSupplier;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function GetInfoPhysicalSupplierModal({
  supplier: physicalSupplier,
  open,
  onClose,
  onSuccess,
}: Props) {
  const supplier = physicalSupplier.Supplier;
  const fullName = [supplier?.Name, physicalSupplier.Surname1, physicalSupplier.Surname2]
    .filter(Boolean)
    .join(" ")
    .trim();
  const isActive = supplier?.IsActive ?? true;

  const handleClose = (v: boolean) => {
    if (!v) {
      onClose();
      onSuccess?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl gap-0 overflow-hidden p-0">
        <DialogHeader className="space-y-1.5 border-b px-6 py-5">
          <DialogTitle>Información del proveedor</DialogTitle>
          <DialogDescription>
            Ficha del proveedor físico y su estado en el sistema.
          </DialogDescription>
        </DialogHeader>

        <div className="flex max-h-[50vh] flex-col gap-3 overflow-y-auto overflow-x-hidden px-6 py-4">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-col gap-4 border-b bg-muted/40 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted ring-2 ring-border">
                  <IdCard className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-lg font-semibold leading-tight">
                    {fullName || supplier?.Email || "Proveedor sin nombre"}
                  </CardTitle>
                  <p className="text-xs font-medium text-muted-foreground">
                    Cédula: {supplier?.IDcard || "—"}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex items-start gap-2 sm:mt-0 sm:flex-col sm:items-end">
                <Badge variant={isActive ? "outline" : "destructive"} className="text-xs">
                  {isActive ? "Activo" : "Inactivo"}
                </Badge>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  ID interno: <span className="font-semibold text-foreground">{physicalSupplier.Id}</span>
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 px-6 py-5">
              <div className="rounded-lg border bg-muted/40 px-4 py-3">
                <FieldGroup className="gap-4">
                  <Field className="gap-2">
                    <FieldLabel className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      Correo
                    </FieldLabel>
                    <p className="text-sm font-medium text-foreground">
                      {supplier?.Email ? (
                        <a
                          href={`mailto:${supplier.Email}`}
                          className="hover:text-primary"
                        >
                          {supplier.Email}
                        </a>
                      ) : (
                        "Sin correo"
                      )}
                    </p>
                  </Field>
                  <Field className="gap-2">
                    <FieldLabel className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      Teléfono
                    </FieldLabel>
                    <p className="text-sm font-medium text-foreground">
                      {supplier?.PhoneNumber ? (
                        <a
                          href={`tel:${supplier.PhoneNumber}`}
                          className=" hover:text-primary"
                        >
                          {supplier.PhoneNumber}
                        </a>
                      ) : (
                        "Sin teléfono"
                      )}
                    </p>
                  </Field>
                  {supplier?.Location ? (
                    <Field className="gap-2">
                      <FieldLabel className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        Ubicación
                      </FieldLabel>
                      <p className="whitespace-pre-wrap text-sm font-medium text-foreground">
                        {supplier.Location}
                      </p>
                    </Field>
                  ) : null}
                </FieldGroup>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex-row flex-wrap items-center justify-end gap-2 border-t px-6 py-4">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              onClose();
              onSuccess?.();
            }}
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
