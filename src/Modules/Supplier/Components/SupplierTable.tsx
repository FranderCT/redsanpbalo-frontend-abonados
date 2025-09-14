// src/Modules/Supplier/Components/TableSupplier/SupplierTable.tsx
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { useState } from "react";
import type { Supplier } from "../Models/Supplier";
import { SupplierColumns } from "./SupplierColumns";
import UpdateSupplierModal from "./UpdateSupplierModal";
import CategoryPager from "../../Category/Components/PaginationCategory/CategoryPager";


type Props = {
  data: Supplier[];
  total?: number;
  page: number;
  pageCount: number;
  onPageChange: (p: number) => void;
};

export default function SupplierTable({ data, total, page, pageCount, onPageChange }: Props) {
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const table = useReactTable({
    data,
    columns: SupplierColumns(
      (supplier) => setEditingSupplier(supplier),  // Función para editar el proveedor
    ),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      {editingSupplier && (
        <UpdateSupplierModal
          supplier={editingSupplier}
          open={true}
          onClose={() => setEditingSupplier(null)}
          onSuccess={() => setEditingSupplier(null)}
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
                No hay Proveedores para mostrar
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
                  <CategoryPager
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
