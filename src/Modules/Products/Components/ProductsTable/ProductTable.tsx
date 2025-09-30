// src/Modules/Category/Components/TableCategory/CategoryTable.tsx
import { useState } from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { ProductColumns } from "./ProductColumns";
import type { Product } from "../../Models/CreateProduct";
import UpdateProductModal from "../Modals/UpdateProductModal";
import ProductPager from "../PaginationProducts/ProductPager";
import GetInfoProductModal from "../Modals/GetInfoProductModal";

type Props = {
  data: Product[];
  total?: number;
  page: number;                 // <- NUEVO
  pageCount: number;            // <- NUEVO
  onPageChange: (p: number) => void; // <- NUEVO
};

export default function ProductsTable({ data, total, page, pageCount, onPageChange }: Props) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [getInfoProduct, setGetInfoProduct] = useState<Product | null>(null);

  const table = useReactTable({
    data,
    columns: ProductColumns(
      (product) => setEditingProduct(product),
      (product) => setGetInfoProduct(product),
    ),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      {editingProduct && (
        <UpdateProductModal
          product={editingProduct}
          open={true}
          onClose={() => setEditingProduct(null)}
          onSuccess={() => setEditingProduct(null)}
        />
      )}

      {getInfoProduct && (
        <GetInfoProductModal 
          product={getInfoProduct}
          open={true}
          onClose={() => setGetInfoProduct(null)}
          onSuccess={() => setGetInfoProduct(null)}
        />
      )}

      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id} className="px-4 py-2 text-left text-[#091540] border border-gray-300">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2 border border-gray-300">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}

          {table.getRowModel().rows.length === 0 && (
            <tr>
              <td colSpan={table.getVisibleLeafColumns().length} className="px-4 py-6 text-center text-gray-500 border border-gray-300">
                No hay Productos para mostrar
              </td>
            </tr>
          )}
        </tbody>

        <tfoot>
          <tr>
            <td colSpan={table.getVisibleLeafColumns().length} className="px-4 py-3 border border-gray-300">
              {/* Total (izq) + Paginación incrustada (der) */}
              <div className="w-full flex items-center justify-between gap-3">
                <span className="flex-none text-sm">Total registros: <b>{total ?? data.length}</b></span>
                <div className="flex-1 flex justify-center">
                <ProductPager
                  page={page}
                  pageCount={pageCount}
                  onPageChange={onPageChange}
                  variant="inline"  // <- sin caja/borde
                />
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
