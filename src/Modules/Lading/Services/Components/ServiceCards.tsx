import { Card, CardContent } from "@/Components/ui/card";
import { DataPagination } from "@/Components/ui/data-pagination";
import type { Service } from "../Models/Services";
import ServiceCard from "./ServiceCard";

type Props = {
  data: Service[];
  total?: number;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

export default function ServiceCards({
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
          <p className="text-base font-semibold text-slate-900">No hay servicios para mostrar</p>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            Ajusta los filtros o registra un nuevo servicio para actualizar la landing.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {data.map((service) => (
            <ServiceCard key={service.Id} service={service} />
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
            labels={{ totalItems: "servicios" }}
            compact
          />
        </CardContent>
      </Card>
    </section>
  );
}
