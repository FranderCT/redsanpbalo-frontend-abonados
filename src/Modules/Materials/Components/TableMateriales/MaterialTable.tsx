import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

import type { Material } from "../../Models/Material";
import { MaterialColumns } from "./MaterialColumns";
import PageSizeSelect from "../../../Users/Components/ListUsers/Table/PageSizeSelect";
import PaginationControls from "../../../Users/Components/ListUsers/Table/PaginationControls";
import CreateMaterialModal from "../../Modals/CreateMaterialModal";
import EditMaterialModal from "../../Modals/EditMaterialModal";
import DeleteMaterialModal from "../../Modals/DeleteMaterialModal";


type Props = { data: Material[] };

const MaterialTable = ({ data }: Props) => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  // Estado para modal de edición
  const [selected, setSelected] = useState<Material | null>(null);

  // Estado para modal de eliminación (solo id)
  const [deleteId, setDeleteId] = useState<number | null>(null); // <- NUEVO

  // Handlers
  const handleEdit = (material: Material) => {
    setSelected(material); // abre modal edición
  };

  const handleDelete = (id: number) => {
    setDeleteId(id); // <- abre modal eliminación
  };

  const table = useReactTable({
    data,
    columns: MaterialColumns(handleEdit, handleDelete), // onDelete espera id:number
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const { pageIndex, pageSize } = table.getState().pagination;

  return (
    <div className="space-y-4 w-full">
      {/* Controles superiores */}
      <div className="flex items-center gap-3">
        <PageSizeSelect
          value={pageSize}
          onChange={(size) => table.setPageSize(size)}
          options={[5, 10, 20, 50]}
        />

        <CreateMaterialModal />

        <span className="ml-auto text-sm text-gray-600">
          Total registros: <b>{data.length}</b>
        </span>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto shadow-xl">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="">
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
                  No hay materiales para mostrar
                </td>
              </tr>
            )}
          </tbody>

          <tfoot className="">
            <tr>
              <td
                colSpan={table.getVisibleLeafColumns().length}
                className="px-4 py-3 border border-gray-300"
              >
                <PaginationControls
                  canPrev={table.getCanPreviousPage()}
                  canNext={table.getCanNextPage()}
                  pageIndex={pageIndex}
                  pageCount={table.getPageCount()}
                  onFirst={() => table.setPageIndex(0)}
                  onPrev={() => table.previousPage()}
                  onNext={() => table.nextPage()}
                  onLast={() => table.setPageIndex(table.getPageCount() - 1)}
                  onGotoPage={(p) => table.setPageIndex(p)}
                />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Modal de edición */}
      

      {/* Modal de eliminación (solo id) */}
      <DeleteMaterialModal id={deleteId} onClose={() => setDeleteId(null)} />
    </div>
  );
};

export default MaterialTable;
