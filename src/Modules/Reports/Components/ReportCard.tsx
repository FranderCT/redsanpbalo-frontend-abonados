import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";

import { MapPin, Calendar, Wrench } from "lucide-react";
import type { Report } from "../Models/Report";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

type Props = {
  report: Report;
  onViewDetails?: (report: Report) => void;
  onEditReport?: (report: Report) => void;
};

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusVariant(
  name?: string
): "default" | "secondary" | "destructive" | "outline" {
  const n = (name ?? "").toLowerCase();
  if (n.includes("resuelto") || n.includes("completado")) return "default";
  if (n.includes("curso") || n.includes("proceso")) return "secondary";
  if (n.includes("pendiente") || n.includes("espera")) return "outline";
  return "secondary";
}

export default function ReportCard({ report, onViewDetails, onEditReport }: Props) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-3">
        <div>
          <CardTitle className="text-lg">Número de reporte</CardTitle>
          <CardDescription className="">
            {report.Code}
          </CardDescription>
        </div>
        <Badge variant={getStatusVariant(report.ReportState?.Name)}>
          {report.ReportState?.Name ?? "—"}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
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
          <p className="text-sm font-medium text-foreground">{report.Location}</p>
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
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Wrench className="size-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <CardDescription className="text-xs font-medium uppercase tracking-wider">
                Encargado
              </CardDescription>
              {report.UserInCharge ? (
                <>
                  <p className="truncate text-sm font-medium text-foreground">
                    {report.UserInCharge.Name} {report.UserInCharge.Surname1}
                  </p>
                  {report.UserInCharge.Email && (
                    <p className="truncate text-xs text-muted-foreground">
                      {report.UserInCharge.Email}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm font-medium italic text-amber-600 dark:text-amber-500">
                  Asigne un encargado
                </p>
              )}
            </div>
          </div>
        </>
      </CardContent>

      <CardFooter className="flex gap-2 border-t pt-4">
        {onEditReport && (
          <Button 
            size="sm"
            className="flex-1"
            onClick={() => onEditReport(report)}
          >
            Gestionar
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={() => onViewDetails?.(report)}
        >
          Ver detalles
        </Button>
      </CardFooter>
    </Card>
  );
}
