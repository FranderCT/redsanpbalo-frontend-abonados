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
import { Mail, Phone, IdCard, UserCircle } from "lucide-react";
import { useGetUserById } from "../../Hooks/UsersHooks";
import type { User } from "../../Models/User";

type Props = {
  user: User;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function GetInfoUserModal({
  user: selectedUser,
  open,
  onClose,
  onSuccess,
}: Props) {
  const { user, isLoading, error } = useGetUserById(selectedUser.Id);

  const DEFAULT_AVATAR = "/Image02.png";
  const fullName = user
    ? [user.Name, user.Surname1, user.Surname2].filter(Boolean).join(" ")
    : "";
  const photoSrc = user?.ProfilePhoto || DEFAULT_AVATAR;

  const handleClose = (v: boolean) => {
    if (!v) {
      onClose();
      onSuccess?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[70vh] max-w-2xl gap-0 overflow-hidden p-0">
        <DialogHeader className="space-y-1.5 border-b px-6 py-5">
          <DialogTitle>Información del usuario</DialogTitle>
          <DialogDescription>
            Ficha detallada del abonado y su estado en el sistema.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center px-6 py-10">
            <p className="text-sm text-muted-foreground">Cargando información…</p>
          </div>
        ) : error ? (
          <div className="flex min-h-[200px] items-center justify-center px-6 py-10">
            <p className="text-sm text-destructive">
              No se pudo cargar la información del usuario.
            </p>
          </div>
        ) : user ? (
          <>
            <div className="flex max-h-[50vh] flex-col gap-3 overflow-y-auto overflow-x-hidden px-6 py-4">
              <Card className="overflow-hidden">
                <CardHeader className="flex flex-col gap-4 border-b bg-muted/40 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 overflow-hidden rounded-full ring-2 ring-border bg-background">
                        <img
                          src={photoSrc}
                          alt={fullName || "Foto de perfil"}
                          className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-semibold leading-tight">
                        {fullName || user.Email || "Usuario sin nombre"}
                      </CardTitle>
                      {user.Roles?.length ? (
                        <p className="text-xs font-medium text-muted-foreground">
                          {user.Roles.map((r) => r.Rolname).join(" · ")}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-2 flex items-start gap-2 sm:mt-0 sm:flex-col sm:items-end">
                    <Badge variant={user.IsActive ? "outline" : "destructive"} className="text-xs">
                      {user.IsActive ? "Activo" : "Inactivo"}
                    </Badge>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      ID interno: <span className="font-semibold text-foreground">{user.Id}</span>
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
                        <p className="max-w-[260px] truncate text-sm font-medium text-foreground">
                          {user.Email || "Sin correo"}
                        </p>
                      </Field>
                      <Field className="gap-2">
                        <FieldLabel className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          Teléfono
                        </FieldLabel>
                        <p className="text-sm font-medium text-foreground">
                          {user.PhoneNumber || "Sin teléfono"}
                        </p>
                      </Field>
                      <Field className="gap-2">
                        <FieldLabel className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          <IdCard className="h-4 w-4" />
                          Cédula
                        </FieldLabel>
                        <p className="text-sm font-medium text-foreground">
                          {user.IDcard || "Sin cédula"}
                        </p>
                      </Field>
                      {user.Nis?.length ? (
                        <Field className="gap-2">
                          <FieldLabel className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            <UserCircle className="h-4 w-4" />
                            NIS
                          </FieldLabel>
                          <p className="text-sm font-medium text-foreground">
                            {user.Nis.join(", ")}
                          </p>
                        </Field>
                      ) : null}
                    </FieldGroup>
                  </div>

                  <div className="h-px w-full bg-border" />

                  <FieldGroup className="gap-4">
                    <Field className="gap-2">
                      <FieldLabel className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Fecha de nacimiento
                      </FieldLabel>
                      <p className="text-sm font-medium text-foreground">
                        {user.Birthdate
                          ? new Date(user.Birthdate).toLocaleDateString("es-CR")
                          : "—"}
                      </p>
                    </Field>
                    <Field className="gap-2">
                      <FieldLabel className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Roles
                      </FieldLabel>
                      <p className="text-sm font-medium text-foreground">
                        {user.Roles?.map((r) => r.Rolname).join(", ") || "—"}
                      </p>
                    </Field>
                  </FieldGroup>

                  {user.Address ? (
                    <div className="rounded-lg border bg-muted/40 px-4 py-3">
                      <Field className="gap-2">
                        <FieldLabel className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Dirección
                        </FieldLabel>
                        <p className="whitespace-pre-wrap text-sm font-medium text-foreground">
                          {user.Address}
                        </p>
                      </Field>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </div>

            <DialogFooter className="flex-row flex-wrap items-center justify-end gap-2 border-t px-6 py-4">
              <div className="flex w-full flex-col-reverse items-center justify-between sm:flex-row-reverse">
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
              </div>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}