import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";

import { MapPin, Calendar, Wrench, UserCircle, ArrowRight } from "lucide-react";
import type { Report } from "../Models/Report";
import { Separator } from "@/Components/ui/separator";
import { Button } from "@/Components/ui/button";

type Props = {
  report: Report;
};

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusVariant(
  state?: string
): "default" | "secondary" | "destructive" | "outline" {
  const n = (state ?? "").toLowerCase();
  if (n.includes("resuelto") || n.includes("completado")) return "default";
  if (n.includes("proceso")) return "secondary";
  if (n.includes("pendiente") || n.includes("espera")) return "outline";
  if (n.includes("cancelado")) return "destructive";
  return "secondary";
}

export default function ReportCard({ report }: Props) {
  const navigate = useNavigate();
  const assignments = report.Assignments ?? [];
  const firstAssigned = assignments[0]?.User;

  const goToDetail = () => {
    navigate({ to: "/dashboard/reports/$reportId", params: { reportId: String(report.Id) } });
  };

  return (
    <Card
      className="overflow-hidden transition-shadow hover:shadow-md cursor-pointer group"
      onClick={goToDetail}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-3">
        <div>
          <CardTitle className="text-xl">
            Código de reporte <br />{" "}
            <span className="text-primary text-lg font-normal">{report.Code}</span>
          </CardTitle>
          <CardDescription className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            {formatDate(report.CreatedAt)}
          </CardDescription>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <Badge variant={getStatusVariant(report.State)}>
            {report.State ?? "—"}
          </Badge>
          {report.Urgency && (
            <Badge variant="outline" className="text-xs capitalize">
              {report.Urgency}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <Separator />

        <div>
          <CardDescription className="mb-1 text-xs font-medium uppercase tracking-wider">
            Descripción
          </CardDescription>
          <p className="line-clamp-2 text-sm leading-relaxed text-foreground">
            {report.Description}
          </p>
        </div>

        <Separator />

        <div>
          <CardDescription className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider">
            <MapPin className="size-3.5" />
            Dirección exacta
          </CardDescription>
          <p className="text-sm font-medium text-foreground">{report.ExactLocation}</p>
          {report.ReportLocation?.Neighborhood && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              Barrio: {report.ReportLocation.Neighborhood}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {report.ReportType?.Name && (
            <Badge variant="secondary" className="text-xs">
              {report.ReportType.Name}
            </Badge>
          )}
        </div>

        <>
          <Separator />
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <UserCircle className="size-4 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <CardDescription className="text-xs font-medium uppercase tracking-wider">
                Reportado por
              </CardDescription>
              {report.User ? (
                <>
                  <p className="truncate text-sm font-medium text-foreground">
                    {report.User.Name} {report.User.Surname1}
                  </p>
                  {report.User.Email && (
                    <p className="truncate text-xs text-muted-foreground">
                      {report.User.Email}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm font-medium italic text-muted-foreground">—</p>
              )}
            </div>
          </div>
        </>

        <>
          <Separator />
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Wrench className="size-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <CardDescription className="text-xs font-medium uppercase tracking-wider">
                Encargados
              </CardDescription>
              {assignments.length > 0 ? (
                <p className="truncate text-sm font-medium text-foreground">
                  {firstAssigned
                    ? `${firstAssigned.Name} ${firstAssigned.Surname1}`
                    : "—"}
                  {assignments.length > 1 && ` +${assignments.length - 1} más`}
                </p>
              ) : (
                <p className="text-sm font-medium italic text-amber-600 dark:text-amber-500">
                  Sin asignar
                </p>
              )}
            </div>
          </div>
        </>
      </CardContent>

      <CardFooter className="border-t pt-4" onClick={(e) => e.stopPropagation()}>
        <Button
          size="sm"
          className="w-full group-hover:bg-primary/90"
          onClick={goToDetail}
        >
          Ver y gestionar
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}
