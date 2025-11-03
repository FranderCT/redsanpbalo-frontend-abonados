import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import type { ReqAvailWater } from "../../Models/ReqAvailWater";
import { ReqAvailWaterColumns } from "./ReqAvailWaterColumns";
import { useState } from "react";
import ReqAvailWaterPager from "../PaginationReqAvailabilityWater/ReqAvailWaterPager";
import UpdateReqAvailWaterStateModal from "../../Modals/UpdateRequestModal";
import RequestDetailModalAdmin from "../../../GeneralGetUser/VerInfoAbonadoModal";
import RequestAvailWaterDetailModalAdmin from "../../../GeneralGetUser/VerInfoAbonadoModal";

type Props = {
  data: ReqAvailWater[];
  total?: number;
  page: number;
  pageCount: number;
  onPageChange: (p: number) => void;
};

export default function ReqAvailWaterTable({
  data,
  page,
  pageCount,
  onPageChange,
}: Props) {
  const [selectedRequest, setSelectedRequest] = useState<ReqAvailWater | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingReqAvailWater, setEditingReqAvailWater] = useState<ReqAvailWater | null>(null);

  const handleGetInfo = (req: ReqAvailWater) => {
    setSelectedRequest(req);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedRequest(null);
  };


  const table = useReactTable({
    data,
    columns: ReqAvailWaterColumns(
      (req) => setEditingReqAvailWater(req),
      handleGetInfo  
    ),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      {/* Modal de edición */}
      <UpdateReqAvailWaterStateModal
        open={!!editingReqAvailWater}
        req={editingReqAvailWater}
        onClose={() => setEditingReqAvailWater(null)}
        onSuccess={() => setEditingReqAvailWater(null)}
      />

      {/* Modal de detalle */}
      {selectedRequest && (
        <RequestAvailWaterDetailModalAdmin
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