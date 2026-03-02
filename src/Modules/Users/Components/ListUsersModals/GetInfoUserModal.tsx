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
import { Mail, Phone, IdCard, UserCircle } from "lucide-react";
import { useGetUserById } from "../../Hooks/UsersHooks";
import type { User } from "../../Models/User";

type Props = {
  user: User;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

function InfoRow({
  label,
  value,
  className = "",
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-foreground">{value ?? "—"}</dd>
    </div>
  );
}

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
      <DialogContent className="max-h-[90vh] max-w-2xl gap-0 overflow-hidden p-0">
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
                  <div className="rounded-md border bg-muted/40 px-4 py-3 text-sm">
                    <div className="flex flex-wrap items-start gap-x-8 gap-y-4 text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <Mail className="mt-0.5 h-4 w-4" />
                        <div className="flex flex-col">
                          <span className="text-[11px] font-medium uppercase tracking-wide">
                            Correo
                          </span>
                          <span className="max-w-[260px] truncate font-medium text-foreground">
                            {user.Email || "Sin correo"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Phone className="mt-0.5 h-4 w-4" />
                        <div className="flex flex-col">
                          <span className="text-[11px] font-medium uppercase tracking-wide">
                            Teléfono
                          </span>
                          <span className="text-foreground">
                            {user.PhoneNumber || "Sin teléfono"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <IdCard className="mt-0.5 h-4 w-4" />
                        <div className="flex flex-col">
                          <span className="text-[11px] font-medium uppercase tracking-wide">
                            Cédula
                          </span>
                          <span className="text-foreground">
                            {user.IDcard || "Sin cédula"}
                          </span>
                        </div>
                      </div>
                      {user.Nis?.length ? (
                        <div className="flex items-start gap-2">
                          <UserCircle className="mt-0.5 h-4 w-4" />
                          <div className="flex flex-col">
                            <span className="text-[11px] font-medium uppercase tracking-wide">
                              NIS
                            </span>
                            <span className="text-foreground">
                              {user.Nis.join(", ")}
                            </span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="h-px w-full bg-border" />

                  <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <InfoRow
                      label="Fecha de nacimiento"
                      value={
                        user.Birthdate
                          ? new Date(user.Birthdate).toLocaleDateString("es-CR")
                          : "—"
                      }
                    />
                    <InfoRow
                      label="Roles"
                      value={user.Roles?.map((r) => r.Rolname).join(", ") || "—"}
                    />
                  </dl>

                  {user.Address ? (
                    <div className="rounded-md bg-muted/40 px-4 py-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Dirección
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">
                        {user.Address}
                      </p>
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