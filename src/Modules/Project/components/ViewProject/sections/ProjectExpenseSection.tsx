import React from "react";
import { Separator } from "../../../../../Components/ui/separator";
import type { Project } from "../../../Models/Project";

type Props = {
  data: Project;
  totalToRender: any;
  isLoading: boolean;
};

type DiffVariant = "neutral" | "over" | "under";

function getDiffVariant(diff: number): DiffVariant {
  if (diff === 0) return "neutral";
  if (diff > 0) return "over";
  return "under";
}

function DiffCell({ diff }: { diff: number }) {
  const variant = getDiffVariant(diff);
  const cls =
    variant === "neutral"
      ? "text-muted-foreground"
      : variant === "over"
      ? "text-destructive font-semibold"
      : "text-emerald-600 font-semibold";
  const label =
    variant === "neutral"
      ? "Exacto"
      : variant === "over"
      ? `+${diff}`
      : `${diff}`;
  return <span className={`tabular-nums ${cls}`}>{label}</span>;
}

export default function ProjectExpenseSection({
  data,
  totalToRender,
  isLoading,
}: Props) {
  const hasDetails =
    totalToRender?.ProductDetails && totalToRender.ProductDetails.length > 0;

  const summaryRows = React.useMemo(() => {
    if (!totalToRender?.ProductDetails) return [] as Array<any>;
    const map = new Map<number, { product: any; projected: number; used: number }>();
    totalToRender.ProductDetails.forEach((detail: any) => {
      const pid = detail?.Product?.Id ?? Math.random();
      const ex = map.get(pid) ?? { product: detail.Product, projected: 0, used: 0 };
      ex.used += Number(detail.Quantity || 0);
      map.set(pid, ex);
    });
    (data.ProjectProjection?.ProductDetails ?? []).forEach((pd: any) => {
      const pid = pd?.Product?.Id ?? Math.random();
      const ex = map.get(pid) ?? { product: pd.Product, projected: 0, used: 0 };
      ex.projected = Number(pd.Quantity || 0);
      if (!map.has(pid)) map.set(pid, ex);
    });
    return Array.from(map.values());
  }, [totalToRender, data.ProjectProjection]);

  const totals = React.useMemo(
    () =>
      summaryRows.reduce(
        (acc, r) => {
          acc.projected += Number(r.projected || 0);
          acc.used += Number(r.used || 0);
          return acc;
        },
        { projected: 0, used: 0 }
      ),
    [summaryRows]
  );

  return (
    <div className="rounded-lg border bg-card p-5 space-y-5">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Comparativa de gasto real
      </h3>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando comparativa…</p>
      ) : hasDetails ? (
        <>
          {/* Tabla detalle */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Detalle por seguimiento</p>
            <div className="overflow-hidden rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/60">
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Producto</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground hidden sm:table-cell">Tipo</th>
                    <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Proyectado</th>
                    <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Utilizado</th>
                    <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Diferencia</th>
                  </tr>
                </thead>
                <tbody>
                  {totalToRender.ProductDetails.map((detail: any, i: number) => {
                    const projectedQty =
                      data.ProjectProjection?.ProductDetails?.find(
                        (pd: any) => pd.Product?.Id === detail.Product?.Id
                      )?.Quantity ?? 0;
                    const diff = (detail.Quantity || 0) - projectedQty;
                    return (
                      <tr
                        key={detail.Id}
                        className={`border-b last:border-0 transition-colors hover:bg-muted/30 ${
                          i % 2 === 1 ? "bg-muted/20" : ""
                        }`}
                      >
                        <td className="px-4 py-2.5 font-medium">{detail.Product?.Name || "—"}</td>
                        <td className="px-4 py-2.5 text-muted-foreground hidden sm:table-cell">{detail.Product?.Type || "—"}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{projectedQty}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums font-medium">{detail.Quantity || 0}</td>
                        <td className="px-4 py-2.5 text-right"><DiffCell diff={diff} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {summaryRows.length > 0 && (
            <>
              <Separator />

              {/* Tabla resumen */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Resumen agregado total</p>
                <div className="overflow-hidden rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/60">
                        <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Producto</th>
                        <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Proyectado</th>
                        <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Utilizado</th>
                        <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Diferencia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summaryRows.map((row: any, i: number) => {
                        const diff = Number(row.used || 0) - Number(row.projected || 0);
                        return (
                          <tr
                            key={i}
                            className={`border-b last:border-0 transition-colors hover:bg-muted/30 ${
                              i % 2 === 1 ? "bg-muted/20" : ""
                            }`}
                          >
                            <td className="px-4 py-2.5 font-medium">{row.product?.Name || "—"}</td>
                            <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{row.projected}</td>
                            <td className="px-4 py-2.5 text-right tabular-nums font-medium">{row.used}</td>
                            <td className="px-4 py-2.5 text-right"><DiffCell diff={diff} /></td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="border-t bg-muted/40 font-semibold">
                        <td className="px-4 py-2.5 text-sm">Totales</td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{totals.projected}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums">{totals.used}</td>
                        <td className="px-4 py-2.5 text-right">
                          <DiffCell diff={totals.used - totals.projected} />
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="py-8 text-center space-y-1">
          <p className="text-sm text-muted-foreground">Sin datos de comparativa disponibles.</p>
          <p className="text-xs text-muted-foreground">
            Aparecerá cuando haya gastos reales registrados.
          </p>
        </div>
      )}
    </div>
  );
}
