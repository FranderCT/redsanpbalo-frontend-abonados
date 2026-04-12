import type { Project } from "../../../Models/Project";

type Props = { data: Project };

export default function ProjectProjectionSection({ data }: Props) {
  const projection = data.ProjectProjection;
  if (!projection) return null;

  const hasProducts =
    projection.ProductDetails && projection.ProductDetails.length > 0;

  return (
    <div className="rounded-lg border bg-card p-5 space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Proyección del proyecto
      </h3>

      {/* Observación */}
      {projection.Observation && (
        <div
          className="prose prose-sm max-w-none text-foreground
            prose-p:text-muted-foreground prose-headings:font-semibold
            [&_*]:break-words [&_*]:[overflow-wrap:anywhere]"
          dangerouslySetInnerHTML={{ __html: projection.Observation }}
        />
      )}

      {/* Tabla productos estimados */}
      {hasProducts ? (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Productos estimados a utilizar
          </p>
          <div className="overflow-hidden rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/60">
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                    Producto
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground hidden sm:table-cell">
                    Tipo / Material
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground hidden md:table-cell">
                    Categoría
                  </th>
                  <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">
                    Cant. est.
                  </th>
                </tr>
              </thead>
              <tbody>
                {projection.ProductDetails.map((pd: any, i: number) => (
                  <tr
                    key={pd.Id}
                    className={`border-b last:border-0 transition-colors hover:bg-muted/30 ${
                      i % 2 === 1 ? "bg-muted/20" : ""
                    }`}
                  >
                    <td className="px-4 py-2.5 font-medium">{pd.Product?.Name || "—"}</td>
                    <td className="px-4 py-2.5 text-muted-foreground hidden sm:table-cell">
                      {[pd.Product?.Type, pd.Product?.Material?.Name]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground hidden md:table-cell">
                      {pd.Product?.Category?.Name || "—"}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums font-semibold">
                      {pd.Quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic">
          Sin productos estimados registrados.
        </p>
      )}
    </div>
  );
}
