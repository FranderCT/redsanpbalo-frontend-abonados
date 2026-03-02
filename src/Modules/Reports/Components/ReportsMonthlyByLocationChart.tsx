"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Skeleton } from "@/Components/ui/skeleton";
import { useGetMonthlyCountsByLocation } from "../Hooks/ReportsHooks";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth() + 1;
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);
const MONTHS = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];

const CHART_COLORS = ["#091540", "#1789FC", "#3DDA7E", "#1B6DF5", "#6B7280"];

/**
 * Agrega los conteos por ubicación (barrio) para el período seleccionado.
 * Devuelve [{ name: neighborhood, count: total }] para el BarChart.
 */
function aggregateByNeighborhood(
  rows: Array<{ locationId: number; neighborhood: string; year: number; month: number; count: number }>
): Array<{ name: string; count: number }> {
  const byLocation = new Map<number, { neighborhood: string; count: number }>();
  for (const r of rows) {
    const neighborhood = r.neighborhood || `Ubicación ${r.locationId}`;
    const current = byLocation.get(r.locationId);
    if (current) {
      current.count += r.count;
    } else {
      byLocation.set(r.locationId, { neighborhood, count: r.count });
    }
  }
  return Array.from(byLocation.values())
    .map(({ neighborhood, count }) => ({ name: neighborhood, count }))
    .sort((a, b) => b.count - a.count);
}

export default function ReportsMonthlyByLocationChart() {
  const [year, setYear] = useState(CURRENT_YEAR);
  const [month, setMonth] = useState(CURRENT_MONTH);

  const { data: rawData, isLoading, isError, error } =
    useGetMonthlyCountsByLocation({ months: 12, year, month });

  const chartData = useMemo(
    () => (rawData ? aggregateByNeighborhood(rawData) : []),
    [rawData]
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-[#091540]">
            Reportes por barrio
          </CardTitle>
          <CardDescription>
            Cantidad total de reportes por ubicación (barrio) en el período seleccionado.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Filtros</p>
            <div className="flex flex-wrap items-center gap-3">
              <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Mes" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m) => (
                    <SelectItem key={m.value} value={String(m.value)}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isError && (
            <p className="text-sm text-destructive py-8 text-center">
              {error?.message ?? "Error al cargar el reporte."}
            </p>
          )}
          {!isError && isLoading && (
            <Skeleton className="h-[280px] w-full rounded-md" />
          )}
          {!isError && !isLoading && chartData.length === 0 && (
            <p className="text-sm text-muted-foreground py-8 text-center">
              Sin datos para el período seleccionado.
            </p>
          )}
          {!isError && !isLoading && chartData.length > 0 && (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 11 }}
                />
                <YAxis allowDecimals={false} />
                <Tooltip
                  formatter={(value: number) => [value, "Reportes"]}
                  contentStyle={{ borderRadius: "6px" }}
                />
                <Bar
                  dataKey="count"
                  name="Reportes"
                  radius={[4, 4, 0, 0]}
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
