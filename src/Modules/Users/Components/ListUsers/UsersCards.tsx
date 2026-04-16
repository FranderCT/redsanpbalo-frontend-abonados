import { useState } from "react";
import { Link } from "@tanstack/react-router";
import type { User } from "../../Models/User";
import EditUserModal from "../ListUsersModals/EditUserModal";
import { DataPagination } from "@/Components/ui/data-pagination";
import { useDeleteUser } from "../../Hooks/UsersHooks";
import InhabilityActionModal from "../../../../Components/Modals/InhabilyActionModal";
import { toast } from "sonner";
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
import { Mail, Phone, IdCard, MoreVertical } from "lucide-react";

const ID_CARD_LABELS: Record<string, string> = {
  Cedula: "Cédula",
  Pasaporte: "Pasaporte",
  Otro: "ID",
};

type Props = {
  data: User[];
  total?: number;
  page: number;
  pageCount: number;
  onPageChange: (p: number) => void;
};

export default function UsersCards({ data, total, page, pageCount, onPageChange }: Props) {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [disableUser, setDisableUser] = useState<User | null>(null);
  const [isDisabling, setIsDisabling] = useState(false);
  const deleteUserMutation = useDeleteUser();

  const DEFAULT_AVATAR = "/Image02.png";

  const handleConfirmDisable = async () => {
    if (!disableUser) return;
    try {
      setIsDisabling(true);
      await deleteUserMutation.mutateAsync(disableUser.Id);
      toast.success("Usuario inhabilitado");
      setDisableUser(null);
    } catch (err) {
      console.error("Error al inhabilitar usuario:", err);
      toast.error("No se pudo inhabilitar el usuario");
    } finally {
      setIsDisabling(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {editingUser && (
        <EditUserModal
          user={editingUser}
          open={true}
          onClose={() => setEditingUser(null)}
          onSuccess={() => setEditingUser(null)}
        />
      )}

      {data.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">No hay usuarios para mostrar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map((user) => {
            const fullName = `${user.Name} ${user.Surname1} ${user.Surname2}`.trim();
            const nisList = user.Nis ?? [];
            const roles =
              user.Roles?.map((r) => r.Rolname).filter(Boolean).join(", ") || "Sin roles";
            const photoSrc = user.ProfilePhoto || DEFAULT_AVATAR;

            return (
              <Card
                key={user.Id}
                className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md"
              >
                <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted ring-2 ring-border">
                    <img
                      src={photoSrc}
                      alt={fullName ? `Foto de ${fullName}` : "Foto de perfil"}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="truncate text-base font-semibold text-foreground">
                      {fullName || "—"}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 text-xs flex-wrap">
                      <IdCard className="h-3 w-3 shrink-0" />
                      <span className="truncate">{user.IDcard || "Sin identificación"}</span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 shrink-0">
                        {ID_CARD_LABELS[user.TypeDNI ?? "Cedula"] ?? "Cédula"}
                      </Badge>
                    </CardDescription>
                  </div>
                  <Badge
                    variant={user.IsActive ? "default" : "destructive"}
                    className="shrink-0 text-xs"
                  >
                    {user.IsActive ? "Activo" : "Inactivo"}
                  </Badge>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col gap-3 pt-0">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{user.Email || "Sin correo"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{user.PhoneNumber || "Sin teléfono"}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">NIS: </span>
                    {nisList.length > 0 ? nisList.join(", ") : "—"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Roles: </span>
                    {roles}
                  </div>
                </CardContent>

                <CardFooter className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                  <div className="flex flex-1 flex-wrap gap-2">
                    <Link
                      to="/dashboard/users/$userId"
                      params={{ userId: String(user.Id) }}
                      className="flex-1 min-w-[130px]"
                    >
                      <Button variant="outline" className="w-full">
                        Ver detalles
                      </Button>
                    </Link>
                  </div>
                  <div className="flex items-center gap-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8"
                          aria-label="Más acciones sobre el usuario"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingUser(user)}>
                          Editar usuario
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            to="/dashboard/users/$userId"
                            params={{ userId: String(user.Id) }}
                          >
                            Ver detalles
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                          onClick={() => setDisableUser(user)}
                        >
                          Inhabilitar usuario
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

      <div className="border-t pt-4">
        <DataPagination
          page={page}
          pageCount={pageCount}
          total={total ?? data.length}
          onPageChange={onPageChange}
          labels={{ totalItems: "usuarios" }}
          compact
        />
      </div>

      {disableUser && (
        <div className="fixed inset-0 z-[999] grid place-items-center bg-black/40">
          <InhabilityActionModal
            title="¿Inhabilitar usuario?"
            description={`Se inhabilitará el usuario "${disableUser.Name ?? ""} ${
              disableUser.Surname1 ?? ""
            } ${disableUser.Surname2 ?? ""}".`}
            cancelLabel="Cancelar"
            confirmLabel={isDisabling ? "Inhabilitando..." : "Inhabilitar"}
            onConfirm={handleConfirmDisable}
            onClose={() => {
              if (!isDisabling) setDisableUser(null);
            }}
            onCancel={() => {
              if (!isDisabling) setDisableUser(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
