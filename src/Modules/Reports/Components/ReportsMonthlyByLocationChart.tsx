"use client";

import { useMemo, useState } from "react";
import { toast } from "react-toastify";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Skeleton } from "@/Components/ui/skeleton";
import { Label } from "@/Components/ui/label";
import { useGetMonthlyCountsByLocation, useExportReportsPdf } from "../Hooks/ReportsHooks";
import { FileDown } from "lucide-react";
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
  const [openExportDialog, setOpenExportDialog] = useState(false);
  const [exportYear, setExportYear] = useState(CURRENT_YEAR);
  const [exportMonth, setExportMonth] = useState(CURRENT_MONTH);

  const { data: rawData, isLoading, isError, error } =
    useGetMonthlyCountsByLocation({ months: 12, year, month });
  const exportPdf = useExportReportsPdf();

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
            <p className="text-sm font-medium text-foreground">Mes y año del reporte</p>
            <p className="text-xs text-muted-foreground">
              Elija el mes y el año. El gráfico y el PDF exportado usarán esta selección.
            </p>
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
              <Dialog open={openExportDialog} onOpenChange={setOpenExportDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setExportYear(year);
                      setExportMonth(month);
                    }}
                  >
                    <FileDown className="size-4 mr-1.5" />
                    Exportar PDF
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] gap-0 overflow-hidden sm:max-w-md">
                  <DialogHeader className="space-y-1.5 border-b px-6 py-5">
                    <DialogTitle>Exportar reporte en PDF</DialogTitle>
                    <DialogDescription>
                      Elija el mes y el año del reporte que desea descargar.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 px-6 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="export-year">Año</Label>
                      <Select
                        value={String(exportYear)}
                        onValueChange={(v) => setExportYear(Number(v))}
                      >
                        <SelectTrigger id="export-year">
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
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="export-month">Mes</Label>
                      <Select
                        value={String(exportMonth)}
                        onValueChange={(v) => setExportMonth(Number(v))}
                      >
                        <SelectTrigger id="export-month">
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
                  <DialogFooter className="gap-2 border-t px-4 py-4">
                    <div className="w-full flex flex-col-reverse sm:flex-row-reverse sm:justify-between sm:space-x-2">
                      <DialogClose asChild>
                        <Button type="button" variant="outline">
                          Cancelar
                        </Button>
                      </DialogClose>
                      <Button
                        disabled={exportPdf.isPending}
                        onClick={() => {
                          exportPdf.mutate(
                            { year: exportYear, month: exportMonth },
                            {
                              onSuccess: () => {
                                toast.success("PDF descargado correctamente");
                                setOpenExportDialog(false);
                              },
                              onError: (err) => {
                                toast.error(
                                  err instanceof Error ? err.message : "Error al exportar el PDF"
                                );
                              },
                            }
                          );
                        }}
                      >
                        <FileDown className="size-4 mr-1.5" />
                        {exportPdf.isPending ? "Exportando…" : "Descargar PDF"}
                      </Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
