import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";



import type { Unit } from "../Models/unit";
import { UnitMeasureColumns } from "./UnitMeasureColumns";
import CreateUnitMeasureModal from "./CreateUnitMeasureModal";
import UpdateUnitMeasureModal from "./UpdateUnitMeasureModal";


type Props = { data: Unit[] };

const UnitMeasureTable = ({ data }: Props) => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  // Estado para modal de edición
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);

  // Estado para modal de eliminación (solo id)
  const [deleteId, setDeleteId] = useState<number | null>(null); // <- NUEVO

  // Handlers
  const handleEdit = (unit: Unit) => {
    setEditingUnit(unit); // abre modal edición
  };

  const handleDelete = (id: number) => {
    setDeleteId(id); // <- abre modal eliminación
  };

  const table = useReactTable({
    data,
    columns: UnitMeasureColumns(handleEdit, handleDelete), // onDelete espera id:number
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  

  return (
    <div className="space-y-4 w-full">
      {/* Controles superiores */}
      <div className="flex items-center gap-3">
        
        <CreateUnitMeasureModal />

        {/* Modal de edición controlado desde aquí */}
        {editingUnit && (
            <UpdateUnitMeasureModal
            unit={editingUnit}
            open={true}
            onClose={() => setEditingUnit(null)}
            onSuccess={() => setEditingUnit(null)}
            />
        )}

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
                  No hay Unidades para mostrar
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
               <h1>shi uwu</h1>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>


      {/* Modal de eliminación (solo id) */}
      
    </div>
  );
};

export default UnitMeasureTable;

