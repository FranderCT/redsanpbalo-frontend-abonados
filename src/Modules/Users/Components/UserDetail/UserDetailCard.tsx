import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Can } from "../../../Auth/Components/Can";
import { Role } from "../../Models/Roles";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Hash,
  Pencil,
  ShieldCheck,
  CreditCard,
  IdCard,
} from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";
import type { User } from "../../Models/User";
import EditUserModal from "../ListUsersModals/EditUserModal";
import UserReportsHistory from "./UserReportsHistory";
import UserAvailWaterHistory from "./UserAvailWaterHistory";
import UserChangeMeterHistory from "./UserChangeMeterHistory";
import UserChangeNameMeterHistory from "./UserChangeNameMeterHistory";
import UserSupervisionMeterHistory from "./UserSupervisionMeterHistory";
import UserAssociatedHistory from "./UserAssociatedHistory";

const DEFAULT_AVATAR = "/Image02.png";

const ID_CARD_LABELS: Record<string, string> = {
  Cedula: "Cédula",
  Pasaporte: "N.º de pasaporte",
  Otro: "N.º de identificación",
};

const TYPE_DNI_LABELS: Record<string, string> = {
  Cedula: "Cédula",
  Pasaporte: "Pasaporte",
  Otro: "Otro",
};

type Props = {
  user: User;
};

const UserDetailCard = ({ user }: Props) => {
  const [editOpen, setEditOpen] = useState(false);

  const fullName = [user.Name, user.Surname1, user.Surname2].filter(Boolean).join(" ");
  const photoSrc = user.ProfilePhoto || DEFAULT_AVATAR;
  const typeDNI = user.TypeDNI ?? "Cedula";
  const birthdate = user.Birthdate
    ? new Date(user.Birthdate).toLocaleDateString("es-CR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4 sm:p-6 lg:p-8">

      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard/users"
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>
        <Can rule={{ none: [Role.BOD] }}>
          <Button size="sm" variant="outline" onClick={() => setEditOpen(true)}>
            <Pencil className="mr-1.5 h-3.5 w-3.5" />
            Editar
          </Button>
        </Can>
      </div>

      {/* Hero card */}
      <Card className="overflow-hidden">
        <div className="h-16" />
        <CardContent className="px-4 pb-5 pt-0 sm:px-6">
          <div className="-mt-10 flex flex-col gap-3 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">

            {/* Avatar + name */}
            <div className="flex items-end gap-3 sm:gap-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-4 border-background bg-muted shadow-sm sm:h-20 sm:w-20">
                <img
                  src={photoSrc}
                  alt={fullName || "Foto de perfil"}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
                  }}
                />
              </div>
              <div className="pb-0.5 sm:pb-1">
                <h1 className="text-lg font-bold leading-tight text-foreground sm:text-xl">
                  {fullName || "Usuario sin nombre"}
                </h1>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  {user.Roles?.map((r) => r.Rolname).join(" · ") || "Sin roles asignados"}
                </p>
              </div>
            </div>

            {/* Status + ID */}
            <div className="flex flex-row items-center gap-3 sm:flex-col sm:items-end sm:pb-1">
              <Badge variant={user.IsActive ? "default" : "destructive"} className="text-xs">
                {user.IsActive ? "Activo" : "Inactivo"}
              </Badge>
              <span className="text-xs text-muted-foreground">ID #{user.Id}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

        {/* Contacto */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <Mail className="h-4 w-4" />
              Contacto
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Correo</p>
                <p className="mt-0.5 truncate text-sm font-medium">{user.Email || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Teléfono</p>
                <p className="mt-0.5 text-sm font-medium">{user.PhoneNumber || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Dirección</p>
                <p className="mt-0.5 whitespace-pre-wrap text-sm font-medium">{user.Address || "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Identificación */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <IdCard className="h-4 w-4" />
              Identificación
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Tipo</p>
                <p className="mt-0.5 text-sm font-medium">{TYPE_DNI_LABELS[typeDNI] ?? typeDNI}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <IdCard className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {ID_CARD_LABELS[typeDNI] ?? "Identificación"}
                </p>
                <p className="mt-0.5 text-sm font-medium">{user.IDcard || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Fecha de nacimiento</p>
                <p className="mt-0.5 text-sm font-medium">{birthdate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NIS */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <Hash className="h-4 w-4" />
              NIS asignados
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            {user.Nis?.length ? (
              <div className="flex flex-wrap gap-2">
                {user.Nis.map((n) => (
                  <span
                    key={n}
                    className="inline-flex items-center rounded-md bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20"
                  >
                    {n}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Sin NIS asignados</p>
            )}
          </CardContent>
        </Card>

        {/* Roles */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              Roles y acceso
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            {user.Roles?.length ? (
              <div className="flex flex-wrap gap-2">
                {user.Roles.map((r) => (
                  <Badge key={r.Id} variant="secondary" className="font-normal">
                    {r.Rolname}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Sin roles asignados</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Historial de actividad */}
      <UserReportsHistory userId={user.Id} />
      <UserAvailWaterHistory userId={user.Id} />
      <UserChangeMeterHistory userId={user.Id} />
      <UserChangeNameMeterHistory userId={user.Id} />
      <UserSupervisionMeterHistory userId={user.Id} />
      <UserAssociatedHistory userId={user.Id} />

      {editOpen && (
        <EditUserModal
          user={user}
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSuccess={() => setEditOpen(false)}
        />
      )}
    </div>
  );
};

export default UserDetailCard;
