import { useState, type ComponentType } from "react";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
  Activity,
  BadgeCheck,
  BellRing,
  Droplets,
  FileText,
  HelpCircle,
  MessageCircle,
  MoreVertical,
  Phone,
  Wrench,
  Zap,
} from "lucide-react";
import type { Service } from "../Models/Services";
import UpdateServiceModal from "./ModalsServices/UpdateServiceModal";
import DeleteServiceButton from "./ModalsServices/DeleteServiceModal";

const ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  activity: Activity,
  "badge-check": BadgeCheck,
  "bell-ring": BellRing,
  "message-circle": MessageCircle,
  zap: Zap,
  droplets: Droplets,
  wrench: Wrench,
  "file-text": FileText,
  phone: Phone,
};

type Props = {
  service: Service;
};

export default function ServiceCard({ service }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = ICON_MAP[service.Icon?.toLowerCase()] ?? HelpCircle;
  const description = service.Description?.trim() || "Sin descripción registrada.";
  const isLongDescription = description.length > 140;

  return (
    <>
      {isEditing ? (
        <UpdateServiceModal
          service={service}
          open={isEditing}
          onClose={() => setIsEditing(false)}
          onSuccess={() => setIsEditing(false)}
        />
      ) : null}

      <Card className="flex h-full w-full flex-col border-slate-200 bg-white/95 transition-shadow hover:shadow-lg rounded-none">
        <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-4">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#091540]/10 text-[#091540]">
            <Icon className="h-5 w-5" />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <CardTitle className="truncate text-base font-medium">
              {service.Title}
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              Servicio configurado para la landing informativa.
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Más acciones">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="w-full text-left"
                >
                  Editar servicio
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                <DeleteServiceButton serviceSelected={service} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-4 pt-0">
          <div className="flex flex-1 flex-col gap-2">
            <p className={`text-sm leading-6 text-muted-foreground ${isExpanded ? "" : "line-clamp-4 min-h-24"}`}>
              {description}
            </p>

            {isLongDescription ? (
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="self-start text-xs font-medium text-[#1789FC] transition-colors hover:text-[#091540]"
              >
                {isExpanded ? "Ver menos" : "Ver más"}
              </button>
            ) : null}
          </div>

          <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
            <span className="text-sm text-muted-foreground">Estado</span>
            <Badge variant={service.IsActive ? "default" : "destructive"}>
              {service.IsActive ? "Activo" : "Inactivo"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
