import { CalendarDays, Package } from "lucide-react";
import { Badge } from "../../../../../Components/ui/badge";
import { Separator } from "../../../../../Components/ui/separator";

type Props = {
  traces: any[];
  isLoading: boolean;
};

function formatDate(d?: Date | string | null) {
  if (!d) return "—";
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? "—" : dt.toLocaleDateString("es-CR");
}

export default function ProjectTracesSection({ traces, isLoading }: Props) {
  return (
    <div className="rounded-lg border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Seguimientos
        </h3>
        {!isLoading && traces.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            {traces.length}
          </Badge>
        )}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando seguimientos…</p>
      ) : traces.length === 0 ? (
        <div className="py-8 text-center space-y-1">
          <p className="text-sm text-muted-foreground">Sin seguimientos registrados.</p>
          <p className="text-xs text-muted-foreground">
            Los seguimientos aparecerán aquí cuando se agreguen.
          </p>
        </div>
      ) : (
        <div className="space-y-0">
          {traces.map((trace: any, idx: number) => {
            const productCount =
              trace.ActualExpense?.ProductDetails?.reduce(
                (s: number, pd: any) => s + (pd.Quantity || 0),
                0
              ) ?? 0;

            return (
              <div key={trace.Id}>
                {idx > 0 && <Separator className="my-5" />}

                <div className="space-y-3">
                  {/* Header del seguimiento */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">{trace.Name}</p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarDays className="size-3" />
                        {formatDate(trace.date)}
                      </div>
                    </div>
                    {productCount > 0 && (
                      <div className="flex items-center gap-1.5 shrink-0 text-xs text-muted-foreground">
                        <Package className="size-3.5" />
                        {productCount} uds. utilizadas
                      </div>
                    )}
                  </div>

                  {/* Observación */}
                  {trace.Observation && (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {trace.Observation}
                    </p>
                  )}

                  {/* Tabla de productos */}
                  {trace.ActualExpense?.ProductDetails?.length > 0 && (
                    <div className="overflow-hidden rounded-md border">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/60">
                            <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Producto</th>
                            <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground hidden sm:table-cell">Tipo</th>
                            <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground hidden md:table-cell">Unidad</th>
                            <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground hidden md:table-cell">Categoría</th>
                            <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Cantidad</th>
                          </tr>
                        </thead>
                        <tbody>
                          {trace.ActualExpense.ProductDetails.map(
                            (detail: any, i: number) => (
                              <tr
                                key={detail.Id}
                                className={`border-b last:border-0 transition-colors hover:bg-muted/30 ${
                                  i % 2 === 1 ? "bg-muted/20" : ""
                                }`}
                              >
                                <td className="px-4 py-2.5 font-medium">{detail.Product?.Name || "—"}</td>
                                <td className="px-4 py-2.5 text-muted-foreground hidden sm:table-cell">{detail.Product?.Type || "—"}</td>
                                <td className="px-4 py-2.5 text-muted-foreground hidden md:table-cell">{detail.Product?.UnitMeasure?.Name || "—"}</td>
                                <td className="px-4 py-2.5 hidden md:table-cell">
                                  <Badge variant="outline" className="text-[11px] font-normal">
                                    {detail.Product?.Category?.Name || "—"}
                                  </Badge>
                                </td>
                                <td className="px-4 py-2.5 text-right tabular-nums font-semibold">
                                  {detail.Quantity}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
