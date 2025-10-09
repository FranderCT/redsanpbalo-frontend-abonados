import { useState } from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import type { ReqAvailWater } from "../../Models/ReqAvailWater";
import ReqAvailWaterPager from "../PaginationReqAvailabilityWater/ReqAvailWaterPager";
import { ReqAvailWaterColumns } from "./ReqAvailWaterColumns";

type Props = {
  data: ReqAvailWater[];
  total?: number;
  page: number;
  pageCount: number;
  onPageChange: (p: number) => void;
};

export default function ReqAvailWaterTable({
  data,
  total,
  page,
  pageCount,
  onPageChange,
}: Props) {
  const [editingReqAvailWater, setEditingReqAvailWater] = useState<ReqAvailWater | null>(null);
  // const [getInfoReqAvailWater, setGetInfoReqAvailWater] = useState<ReqAvailWater | null>(null);

  const table = useReactTable({
    data,
    columns: ReqAvailWaterColumns((req) => setEditingReqAvailWater(req)),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      {/* Si no tienes modal, evita JSX vacío */}
      {editingReqAvailWater && null}

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
                No hay Solicitudes para mostrar
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
              <div className="w-full flex items-center justify-between gap-3">
                {/* <span className="flex-none text-sm">
                  Total registros: <b>{total ?? data.length}</b>
                </span> */}
                <div className="flex-1 flex justify-center">
                  <ReqAvailWaterPager
                    page={page}
                    pageCount={pageCount}
                    onPageChange={onPageChange}
                    variant="inline"
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
