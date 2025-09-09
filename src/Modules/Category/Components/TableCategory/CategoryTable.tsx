import { useState } from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import type { Category } from "../../Models/Category";
import UpdateCategoryModal from "../ModalsCategory/UpdateCategoryModal";
import { CategoryColumns } from "./CategoryColumns";

type Props = {
  data: Category[];
  total?: number; // meta.total del backend
};

export default function CategoryTable({ data, total }: Props) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const table = useReactTable({
    data,
    columns: CategoryColumns(
      (category) => setEditingCategory(category), // onEdit
      (id) => setDeleteId(id)                    // onDelete
    ),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4 w-full">
      {/* Modal de edición */}
      {editingCategory && (
        <UpdateCategoryModal
          category={editingCategory}
          open={true}
          onClose={() => setEditingCategory(null)}
          onSuccess={() => setEditingCategory(null)}
        />
      )}
      <div className="overflow-x-auto shadow-xl">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-left text-[#091540] border border-gray-300"
                  >
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
                <td
                  colSpan={table.getVisibleLeafColumns().length}
                  className="px-4 py-6 text-center text-gray-500 border border-gray-300"
                >
                  No hay Categorías para mostrar
                </td>
              </tr>
            )}
          </tbody>

          <tfoot>
            <tr>
              <td
                colSpan={table.getVisibleLeafColumns().length}
                className="px-4 py-3 border border-gray-300"
              >
                Total registros: <b>{total ?? data.length}</b>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
