import { Calendar, FileText, MapPin, Hash, Wrench } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";
import { Skeleton } from "@/Components/ui/skeleton";
import { useGetReqChangeMeterByUser } from "../../../Requests/RequestChangeMeterr/Hooks/RequestChangeMeter";

type Props = { userId: number };

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("es-CR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStateBadgeVariant(name?: string): "default" | "secondary" | "outline" {
  if (!name) return "outline";
  const n = name.toLowerCase();
  if (n.includes("resuelto") || n.includes("aprobado")) return "default";
  if (n.includes("proceso") || n.includes("revisión")) return "secondary";
  return "outline";
}

const UserChangeMeterHistory = ({ userId }: Props) => {
  const { requests, isLoading } = useGetReqChangeMeterByUser(userId);

  const total = requests.length;
  const pendiente = requests.filter((r) => r.StateRequest?.Name?.toLowerCase().includes("pendiente")).length;
  const enProceso = requests.filter((r) => r.StateRequest?.Name?.toLowerCase().includes("proceso")).length;
  const resuelto = requests.filter((r) => r.StateRequest?.Name?.toLowerCase().includes("resuelto") || r.StateRequest?.Name?.toLowerCase().includes("aprobado")).length;

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-64" />
        </CardHeader>
        <Separator />
        <CardContent className="space-y-3 pt-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <Wrench className="h-4 w-4" />
            Cambio de medidor
            {total > 0 && (
              <Badge variant="secondary" className="ml-1 font-normal">
                {total}
              </Badge>
            )}
          </CardTitle>

          {total > 0 && (
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                <span className="text-muted-foreground">Pendiente</span>
                <span className="font-semibold text-foreground">{pendiente}</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span className="text-muted-foreground">En proceso</span>
                <span className="font-semibold text-foreground">{enProceso}</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-muted-foreground">Resuelto</span>
                <span className="font-semibold text-foreground">{resuelto}</span>
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-4">
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <FileText className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Sin solicitudes de cambio de medidor.</p>
          </div>
        ) : (
          <div className="space-y-0 divide-y">
            {requests.map((req) => (
              <div
                key={req.Id}
                className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:gap-4 first:pt-0 last:pb-0"
              >
                <div className="flex shrink-0 flex-row items-center gap-2 sm:w-36 sm:flex-col sm:items-start sm:gap-1">
                  <Badge variant={getStateBadgeVariant(req.StateRequest?.Name)} className="text-xs">
                    {req.StateRequest?.Name ?? "—"}
                  </Badge>
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(req.Date)}
                  </span>
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">NIS {req.NIS}</span>
                  </div>
                  {req.Justification && (
                    <p className="line-clamp-2 text-sm text-foreground">{req.Justification}</p>
                  )}
                  {req.Location && (
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {req.Location}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserChangeMeterHistory;
