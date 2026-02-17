// src/Modules/Category/Components/TableCategory/CategoryTable.tsx
import { useState } from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import MaterialPager from "../PaginationMaterial/MaterialPager";
import UpdateMaterialModal from "../ModalsMaterial/UpdateMaterialModal";
import type { Material } from "../../Models/Material";
import { MaterialColumns } from "./MaterialColumns";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
} from "@/Components/ui/table";

type Props = {
  data: Material[];
  total?: number;
  page: number;                 // <- NUEVO
  pageCount: number;            // <- NUEVO
  onPageChange: (p: number) => void; // <- NUEVO
};

export default function MaterialTable({ data, total, page, pageCount, onPageChange }: Props) {
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  const table = useReactTable({
    data,
    columns: MaterialColumns(
      (material) => setEditingMaterial(material),
    ),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      {editingMaterial && (
        <UpdateMaterialModal
          material={editingMaterial}
          open={true}
          onClose={() => setEditingMaterial(null)}
          onSuccess={() => setEditingMaterial(null)}
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
                No hay Materiales para mostrar
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
                <MaterialPager
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

// Alternative table using shadcn `Table` components for comparison
export function MaterialTableShadcn({ data, total, page, pageCount, onPageChange }: Props) {
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  const table = useReactTable({
    data,
    columns: MaterialColumns((material) => setEditingMaterial(material)),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      {editingMaterial && (
        <UpdateMaterialModal
          material={editingMaterial}
          open={true}
          onClose={() => setEditingMaterial(null)}
          onSuccess={() => setEditingMaterial(null)}
        />
      )}

      <Table className="min-w-full border-collapse border border-gray-300">
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead key={header.id} className="px-4 py-2 text-left text-[#091540] border border-gray-300">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="px-4 py-2 border border-gray-300">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}

          {table.getRowModel().rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={table.getVisibleLeafColumns().length} className="px-4 py-6 text-center text-gray-500 border border-gray-300">
                No hay Materiales para mostrar
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={table.getVisibleLeafColumns().length} className="px-4 py-3 border border-gray-300">
              <div className="w-full flex items-center justify-between gap-3">
                <span className="flex-none text-sm">Total registros: <b>{total ?? data.length}</b></span>
                <div className="flex-1 flex justify-center">
                  <MaterialPager
                    page={page}
                    pageCount={pageCount}
                    onPageChange={onPageChange}
                    variant="inline"
                  />
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

