import { memo, useMemo, useState } from "react";
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, type SortingState } from "@tanstack/react-table";
import { DataPagination } from "@/Components/ui/data-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import type { Product } from "../../Models/CreateProduct";
import GetInfoProductModal from "../Modals/GetInfoProductModal";
import UpdateProductModal from "../Modals/UpdateProductModal";
import DeleteProductModal from "../Modals/DeleteProductModal";
import { ProductColumns } from "./ProductColumns";

type Props = {
  data: Product[];
  total?: number;
  page: number;
  pageCount: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
};

function ProductTable({
  data,
  total,
  page,
  pageCount,
  pageSize = 10,
  onPageChange,
}: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [infoProduct, setInfoProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const columns = useMemo(
    () => ProductColumns(
      (product) => setEditingProduct(product),
      (product) => setInfoProduct(product),
      (product) => setDeletingProduct(product),
    ),
    [],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      {editingProduct ? (
        <UpdateProductModal
          product={editingProduct}
          open={true}
          onClose={() => setEditingProduct(null)}
          onSuccess={() => setEditingProduct(null)}
        />
      ) : null}

      {infoProduct ? (
        <GetInfoProductModal
          product={infoProduct}
          open={true}
          onClose={() => setInfoProduct(null)}
          onSuccess={() => setInfoProduct(null)}
        />
      ) : null}

      {deletingProduct ? (
        <DeleteProductModal
          product={deletingProduct}
          open={true}
          onOpenChange={(open) => {
            if (!open) setDeletingProduct(null);
          }}
          onSuccess={() => setDeletingProduct(null)}
        />
      ) : null}

      <div className="w-full overflow-hidden rounded-lg border">
        <div className="border-b bg-slate-50 px-4 py-2 text-xs text-slate-500 md:hidden">
          Desliza horizontalmente para ver más columnas.
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-muted/40 hover:bg-muted/40">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={`whitespace-nowrap py-3 ${String(header.column.columnDef.meta?.headerClassName ?? "")}`}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length > 0 ? table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="transition-colors hover:bg-muted/30">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`py-3 ${String(cell.column.columnDef.meta?.cellClassName ?? "")}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getVisibleLeafColumns().length}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No hay productos para mostrar con los filtros actuales.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-col gap-3 border-t bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-muted-foreground">
            {total ?? data.length} producto{(total ?? data.length) !== 1 ? "s" : ""} en total
          </span>
          {pageCount > 1 ? (
            <DataPagination
              page={page}
              pageCount={pageCount}
              total={total ?? data.length}
              pageSize={pageSize}
              onPageChange={onPageChange}
              labels={{ totalItems: "productos" }}
              compact
            />
          ) : null}
        </div>
      </div>
    </>
  );
}

export default memo(ProductTable);
