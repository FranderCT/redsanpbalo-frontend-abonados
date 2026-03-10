import { Card, CardContent } from "@/Components/ui/card";
import { DataPagination } from "@/Components/ui/data-pagination";
import type { Material } from "../Models/Material";
import MaterialCard from "./MaterialCard";

type Props = {
  data: Material[];
  total?: number;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

export default function MaterialCards({
  data,
  total,
  page,
  pageCount,
  onPageChange,
}: Props) {
  return (
    <section className="flex w-full flex-col gap-4">
      {data.length === 0 ? (
        <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
          <p className="text-base font-semibold text-slate-900">No hay materiales para mostrar</p>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            Ajusta los filtros o registra un nuevo material para empezar a gestionar este módulo.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {data.map((material) => (
            <MaterialCard key={material.Id} material={material} />
          ))}
        </div>
      )}

      <Card className="border-none shadow-none">
        <CardContent className="pt-6">
          <DataPagination
            page={page}
            pageCount={pageCount}
            total={total ?? data.length}
            onPageChange={onPageChange}
            labels={{ totalItems: "materiales" }}
            compact
          />
        </CardContent>
      </Card>
    </section>
  );
}
