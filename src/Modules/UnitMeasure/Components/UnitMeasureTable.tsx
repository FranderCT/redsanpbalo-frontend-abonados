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
import DeleteUnitMeasureModal from "./DeleteUnitMeasureModal";

type Props = { data: Unit[] };

const UnitMeasureTable = ({ data }: Props) => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  // Modales
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [deleteUnit, setDeleteUnit] = useState<Unit | null>(null); 

  // Handlers
  const handleEdit = (unit: Unit) => setEditingUnit(unit);
  const handleDelete = (unit: Unit) => setDeleteUnit(unit);

  const table = useReactTable({
    data,
    columns: UnitMeasureColumns(handleEdit, handleDelete), // asegúrate que el onDelete reciba Unit
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

        {/* Modal de edición */}
        {editingUnit && (
          <UpdateUnitMeasureModal
            unit={editingUnit}
            open={true}
            onClose={() => setEditingUnit(null)}
            onSuccess={() => setEditingUnit(null)}
          />
        )}

        {/* Modal de eliminación */}
        {deleteUnit && (
          <DeleteUnitMeasureModal
            unit={deleteUnit}
            open={true}
            onClose={() => setDeleteUnit(null)}   // <- corrige tipo
            onSuccess={() => setDeleteUnit(null)} // opcional: cerrar al terminar
          />
        )}

        <span className="ml-auto text-sm text-gray-600">
          Total registros: <b>{data.length}</b>
        </span>
      </div>

      {/* Tabla */}
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
                  No hay Unidades para mostrar
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
                {/* aquí podrías mover tu paginador si quieres */}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default UnitMeasureTable;
