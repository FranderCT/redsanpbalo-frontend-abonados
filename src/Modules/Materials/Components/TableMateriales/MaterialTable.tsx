// src/Modules/Category/Components/TableCategory/CategoryTable.tsx
import { useState } from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/Components/ui/pagination";

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
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); page > 1 && onPageChange(page - 1); }} className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                      </PaginationItem>
                      {page > 2 && <PaginationItem><PaginationLink href="#" onClick={(e) => { e.preventDefault(); onPageChange(1); }}>1</PaginationLink></PaginationItem>}
                      {page > 3 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                      {page > 1 && <PaginationItem><PaginationLink href="#" onClick={(e) => { e.preventDefault(); onPageChange(page - 1); }}>{page - 1}</PaginationLink></PaginationItem>}
                      <PaginationItem><PaginationLink href="#" isActive>{page}</PaginationLink></PaginationItem>
                      {page < pageCount && <PaginationItem><PaginationLink href="#" onClick={(e) => { e.preventDefault(); onPageChange(page + 1); }}>{page + 1}</PaginationLink></PaginationItem>}
                      {page < pageCount - 2 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                      {page < pageCount - 1 && <PaginationItem><PaginationLink href="#" onClick={(e) => { e.preventDefault(); onPageChange(pageCount); }}>{pageCount}</PaginationLink></PaginationItem>}
                      <PaginationItem>
                        <PaginationNext href="#" onClick={(e) => { e.preventDefault(); page < pageCount && onPageChange(page + 1); }} className={page >= pageCount ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
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
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious onClick={(e) => { e.preventDefault(); page > 1 && onPageChange(page - 1); }} className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                      </PaginationItem>
                      {page > 2 && <PaginationItem><PaginationLink onClick={(e) => { e.preventDefault(); onPageChange(1); }}>1</PaginationLink></PaginationItem>}
                      {page > 3 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                      {page > 1 && <PaginationItem><PaginationLink  onClick={(e) => { e.preventDefault(); onPageChange(page - 1); }}>{page - 1}</PaginationLink></PaginationItem>}
                      <PaginationItem><PaginationLink isActive>{page}</PaginationLink></PaginationItem>
                      {page < pageCount && <PaginationItem><PaginationLink onClick={(e) => { e.preventDefault(); onPageChange(page + 1); }}>{page + 1}</PaginationLink></PaginationItem>}
                      {page < pageCount - 2 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                      {page < pageCount - 1 && <PaginationItem><PaginationLink onClick={(e) => { e.preventDefault(); onPageChange(pageCount); }}>{pageCount}</PaginationLink></PaginationItem>}
                      <PaginationItem>
                        <PaginationNext onClick={(e) => { e.preventDefault(); page < pageCount && onPageChange(page + 1); }} className={page >= pageCount ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

