import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

import { usersColumns as makeUsersColumns } from "./Columns";
import PageSizeSelect from "./Table/PageSizeSelect";
import PaginationControls from "./Table/PaginationControls";

import { useDeleteUser } from "../../Hooks/UsersHooks";
import type { Users } from "../../Models/Users";


type Props = { data: Users[] };

const UsersTable = ({ data }: Props) => {
  const deleteUserMutation = useDeleteUser();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  

  // Handlers para acciones
  const handleEdit = (id: number) => {
    console.log("Editar usuario:", id);
    // aquí abres tu modal de edición
  };

  const handleDelete = (id: number) => {
    const ok = window.confirm("¿Eliminar este usuario?");
    if (!ok) return;
    deleteUserMutation.mutateAsync(id);
    console.log('usuario eliminado');
  };

  const table = useReactTable({
    data,
    columns: makeUsersColumns(handleEdit, handleDelete),
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const { pageIndex, pageSize } = table.getState().pagination;

  return (
    <div className="space-y-4 w-[100%] ">
      {/* Controles superiores compactos */}
      <div className="flex items-center gap-3 ">
        <PageSizeSelect
          value={pageSize}
          onChange={(size) => table.setPageSize(size)}
        />

        

        <span className="ml-auto text-sm text-gray-600">
          Total registros: <b>{data.length}</b>
        </span>
      </div>

      {/* Tabla con bordes colapsados y footer con controles */}
      <div className="overflow-x-auto  shadow-xl">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-[#e9e8e8]">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-left text-[#091540] border border-gray-300"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.original.Id} className="hover:bg-gray-50">
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
                  className="px-4 py-6 text-center text-gray-500 border border-gray-300"
                  colSpan={table.getVisibleLeafColumns().length}
                >
                  No hay datos para mostrar
                </td>
              </tr>
            )}
          </tbody>

          <tfoot className="bg-gray-50">
            <tr>
              <td
                colSpan={table.getVisibleLeafColumns().length}
                className="px-4 py-3 border border-gray-300"
              >
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <div className="mx-auto">
                    <PaginationControls
                      canPrev={table.getCanPreviousPage()}
                      canNext={table.getCanNextPage()}
                      pageIndex={pageIndex}
                      pageCount={table.getPageCount()}
                      onFirst={() => table.setPageIndex(0)}
                      onPrev={() => table.previousPage()}
                      onNext={() => table.nextPage()}
                      onLast={() =>
                        table.setPageIndex(table.getPageCount() - 1)
                      }
                      onGotoPage={(p) => table.setPageIndex(p)}
                    />
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      
    </div>
  );
};

export default UsersTable;
