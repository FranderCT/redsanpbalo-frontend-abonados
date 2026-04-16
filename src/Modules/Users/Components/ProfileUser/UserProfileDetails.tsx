import type { User } from "../../Models/User";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Separator } from "@/Components/ui/separator";
import { Badge } from "@/Components/ui/badge";
import { cn } from "@/lib/utils";

type Props = {
  User?: User;
};

function ProfileField({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      <p className="text-sm font-medium text-foreground break-words">
        {value ?? "—"}
      </p>
    </div>
  );
}

const UserProfileDetails = ({ User }: Props) => {
  const nisLabel =
    User?.Nis && User.Nis.length > 0 ? User.Nis.join(", ") : "—";
  const birthdateLabel = User?.Birthdate
    ? new Date(User.Birthdate).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <Card className="user-profile-details md:col-span-2 overflow-hidden border-border bg-card shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground">
          Información personal
        </CardTitle>
        <CardDescription>
          Datos de su cuenta y perfil en el sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-0">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <ProfileField label="Correo" value={User?.Email} />
          <ProfileField label="Fecha de nacimiento" value={birthdateLabel} />
          <ProfileField label="Teléfono" value={User?.PhoneNumber} />
          <ProfileField
            label="Tipo de identificación"
            value={TYPE_DNI_LABELS[User?.TypeDNI ?? "Cedula"] ?? "Cédula"}
          />
          <ProfileField
            label={ID_CARD_LABELS[User?.TypeDNI ?? "Cedula"] ?? "Cédula"}
            value={User?.IDcard}
          />
          <ProfileField label="NIS" value={nisLabel} />
          <div className="space-y-1.5">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Rol
            </Label>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {User?.Roles?.length ? (
                User.Roles.map((role) => (
                  <Badge key={role.Id} variant="secondary" className="font-normal">
                    {role.Rolname}
                  </Badge>
                ))
              ) : (
                <span className="text-sm font-medium text-muted-foreground">—</span>
              )}
            </div>
          </div>
        </div>

        <Separator className="bg-border" />

        <ProfileField label="Dirección" value={User?.Address} />
      </CardContent>
    </Card>
  );
};

export default UserProfileDetails;
