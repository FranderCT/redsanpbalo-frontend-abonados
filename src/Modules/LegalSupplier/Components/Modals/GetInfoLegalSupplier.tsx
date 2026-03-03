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
import { Mail, Phone, Building2, Globe, MapPin } from "lucide-react";
import type { LegalSupplier } from "../../Models/LegalSupplier";

type Props = {
  supplier: LegalSupplier;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function GetInfoLegalSupplierModal({
  supplier,
  open,
  onClose,
  onSuccess,
}: Props) {
  const s = supplier?.Supplier;
  const companyName = s?.Name ?? "—";
  const isActive = s?.IsActive ?? true;

  const handleClose = (v: boolean) => {
    if (!v) {
      onClose();
      onSuccess?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="flex max-h-[70vh] max-w-2xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 space-y-1.5 border-b px-6 py-5">
          <DialogTitle>Información del proveedor</DialogTitle>
          <DialogDescription>
            Ficha del proveedor jurídico y su estado en el sistema.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-6 py-4">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-col gap-4 border-b bg-muted/40 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted ring-2 ring-border">
                  <Building2 className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-lg font-semibold leading-tight">
                    {companyName}
                  </CardTitle>
                  <p className="text-xs font-medium text-muted-foreground">
                    Cédula jurídica: {s?.IDcard ?? "—"}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex items-start gap-2 sm:mt-0 sm:flex-col sm:items-end">
                <Badge variant={isActive ? "outline" : "destructive"} className="text-xs">
                  {isActive ? "Activo" : "Inactivo"}
                </Badge>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  ID interno: <span className="font-semibold text-foreground">{supplier.Id}</span>
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
                      {s?.Email ? (
                        <a
                          href={`mailto:${s.Email}`}
                          className="hover:text-primary"
                        >
                          {s.Email}
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
                      {s?.PhoneNumber ? (
                        <a href={`tel:${s.PhoneNumber}`} className="hover:text-primary">
                          {s.PhoneNumber}
                        </a>
                      ) : (
                        "Sin teléfono"
                      )}
                    </p>
                  </Field>
                  {supplier?.WebSite ? (
                    <Field className="gap-2">
                      <FieldLabel className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        <Globe className="h-4 w-4" />
                        Sitio web
                      </FieldLabel>
                      <p className="text-sm font-medium text-foreground">
                        <a
                          href={supplier.WebSite.startsWith("http") ? supplier.WebSite : `https://${supplier.WebSite}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary"
                        >
                          {supplier.WebSite}
                        </a>
                      </p>
                    </Field>
                  ) : null}
                  <Field className="gap-2">
                    <FieldLabel className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      Ubicación
                    </FieldLabel>
                    <p className="text-sm font-medium text-foreground whitespace-pre-wrap">
                      {s?.Location ?? "—"}
                    </p>
                  </Field>
                </FieldGroup>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="shrink-0 flex-row flex-wrap items-center justify-end gap-2 border-t px-6 py-4">
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
