import { useState } from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import type { ReqChangeMeter } from "../../Models/RequestChangeMeter";
import { ReqChangeMeterColumns } from "./RequestChangeMeterColumns";
import ReqChangeMeterPager from "../PaginationRequestChangeMeter/RequestChangeMeterPager";
import UpdateReqChangeMeterStateModal from "../../Modals/UpdateChangeMeter";
import MeterSupervisionDetailModal from "../../../../Request-Abonados/Components/Modals/RequestDetailModal";

type Props = {
  data: ReqChangeMeter[];
  total?: number;
  page: number;
  pageCount: number;
  onPageChange: (p: number) => void;
};

export default function ReqChangeMeterTable({
  data,
  page,
  pageCount,
  onPageChange,
}: Props) {
    const [selectedRequest, setSelectedRequest] = useState<ReqChangeMeter | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingChangename, setEditingChangeName] = useState<ReqChangeMeter | null>(null);
  // const [getInfoReqAvailWater, setGetInfoReqAvailWater] = useState<ReqAvailWater | null>(null);
  
  const handleGetInfo = (req: ReqChangeMeter) => {
    setSelectedRequest(req);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedRequest(null);
  };
  const table = useReactTable({
    data,
    columns: ReqChangeMeterColumns((req) => setEditingChangeName(req),
    handleGetInfo
  ),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
        <UpdateReqChangeMeterStateModal
          open={!!editingChangename}
          req={editingChangename}
          onClose={() => setEditingChangeName(null)}
          onSuccess={() => setEditingChangeName(null)}
        />
              {/* Modal de detalle */}
              {selectedRequest && (
                <MeterSupervisionDetailModal
                  open={showDetailModal}
                  onClose={handleCloseModal}
                  title="Detalles de Solicitud de Disponibilidad de Agua"
                  data={selectedRequest}
                />
              )}
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
                  <ReqChangeMeterPager
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
