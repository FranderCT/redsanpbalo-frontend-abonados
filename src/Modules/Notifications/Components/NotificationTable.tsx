import { useMemo, useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import type { Notification } from "../Types/Notification";

type NotificationTableProps = {
  notifications: Notification[];
  isLoading: boolean;
  isMobile: boolean;
  onRowClick: (notification: Notification) => void;
};

const dateFormatter = new Intl.DateTimeFormat("es-CR", {
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

const STATUS_STYLES: Record<Notification["status"], { label: string; className: string }> = {
  READ: {
    label: "LEIDA",
    className: "border-emerald-200 bg-emerald-100 text-emerald-700",
  },
  UNREAD: {
    label: "NO LEIDA",
    className: "border-amber-200 bg-amber-100 text-amber-700",
  },
  URGENT: {
    label: "URGENTE",
    className: "border-red-200 bg-red-100 text-red-700",
  },
};

export default function NotificationTable({
  notifications,
  isLoading,
  isMobile,
  onRowClick,
}: NotificationTableProps) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const columns = useMemo<ColumnDef<Notification>[]>(
    () => [
      {
        accessorKey: "subject",
        header: "SUBJECT",
        cell: ({ row }) => (
          <span className="line-clamp-2 font-semibold text-[#091540]">
            {row.original.subject}
          </span>
        ),
      },
      {
        accessorKey: "description",
        header: "DESCRIPTION",
        cell: ({ row }) => (
          <span className="line-clamp-2 text-slate-600">{row.original.description}</span>
        ),
      },
      {
        accessorKey: "targetRoleName",
        header: "DESTINATARIO",
        cell: ({ row }) => (
          <span className="text-slate-600">{row.original.targetRoleName ?? "General"}</span>
        ),
      },
      {
        accessorKey: "date",
        header: "FECHA",
        cell: ({ row }) => (
          <span className="text-slate-500">{dateFormatter.format(new Date(row.original.date))}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "ESTADO",
        cell: ({ row }) => {
          const status = STATUS_STYLES[row.original.status];

          return (
            <Badge
              className={`rounded-none border px-2 py-0.5 text-[11px] font-semibold ${status.className}`}
              variant="outline"
            >
              {status.label}
            </Badge>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: notifications,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  });

  const currentRows = table.getRowModel().rows;

  if (isLoading) {
    return (
      <section className="rounded-none border bg-white p-8 text-center text-sm text-slate-500">
        Cargando notificaciones...
      </section>
    );
  }

  return (
    <section className="rounded-none border border-slate-200 bg-white">
      {!isMobile ? (
        <Table>
          <TableHeader className="bg-slate-100/80">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-11 px-4 text-xs font-semibold tracking-[0.14em] text-slate-500">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {currentRows.length > 0 ? (
              currentRows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => onRowClick(row.original)}
                  className="cursor-pointer border-slate-200 hover:bg-slate-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-slate-500">
                  No hay notificaciones que coincidan con el filtro.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      ) : (
        <div className="space-y-3 p-4">
          {currentRows.length > 0 ? (
            currentRows.map((row) => {
              const item = row.original;
              const status = STATUS_STYLES[item.status];

              return (
                <Card
                  key={item.id}
                  onClick={() => onRowClick(item)}
                  className="rounded-none border-slate-200 bg-white shadow-none"
                >
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold leading-5 text-[#091540]">{item.subject}</p>
                      <Badge
                        variant="outline"
                        className={`rounded-none border px-2 py-0.5 text-[10px] font-semibold ${status.className}`}
                      >
                        {status.label}
                      </Badge>
                    </div>
                    <p className="line-clamp-2 text-sm text-slate-600">{item.description}</p>
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                      {item.targetRoleName ?? "General"}
                    </p>
                    <p className="text-xs text-slate-500">{dateFormatter.format(new Date(item.date))}</p>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="rounded-none border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
              No hay notificaciones que coincidan con el filtro.
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
        <p className="text-xs text-slate-500">
          Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + (currentRows.length ? 1 : 0)} -{" "}
          {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + currentRows.length} de {notifications.length} notificaciones
        </p>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 w-8 rounded-none border border-slate-200"
          >
            <ChevronLeft className="size-4" />
          </Button>

          <span className="text-xs font-semibold text-[#091540]">
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}
          </span>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 w-8 rounded-none border border-slate-200"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
