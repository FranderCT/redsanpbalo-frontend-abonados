import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import ReqAvailWaterPager from "../../../Requests/RequestAvailabilityWater/Components/PaginationReqAvailabilityWater/ReqAvailWaterPager";
import type { ReqSupervisionMeter } from "../../../Requests/RequestSupervisionMeter/Models/ReqSupervisionMeter";
import { ReqSupervisionMeterUserColumns } from "./ReqSupervisionMeterUserColumn";
import { useState } from "react";
import MeterSupervisionDetailModal from "../Modals/RequestSuperVisionMeterr";
import { CommentsSupervisionMeterModal } from "../../../Requests/RequestSupervisionMeter/Components/Comments/CommentsSupervisionMeterModal";

type Props = {
  data: ReqSupervisionMeter[];
  page: number;
  pageCount: number;
  onPageChange: (p: number) => void;
};

export default function ReqSupervisionMeterUserTable({
  data,
  page,
  pageCount,
  onPageChange,
}: Props) {
  const [selectedRequest, setSelectedRequest] = useState<ReqSupervisionMeter | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [commentingRequest, setCommentingRequest] = useState<ReqSupervisionMeter | null>(null);

  const handleGetInfo = (req: ReqSupervisionMeter) => {
    setSelectedRequest(req);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedRequest(null);
  };

  // Use the same column definitions as the main table, but wired to this table's edit handler
  const columns = ReqSupervisionMeterUserColumns(
    handleGetInfo,
    (req) => setCommentingRequest(req)
  );

  // const [editingReqAvailWater, setEditingReqAvailWater] = useState<ReqAvailWater | null>(null);

  const table = useReactTable({
    data,
    columns: columns as any,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">

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
                <span className="flex-none text-sm">
                  Total registros: <b>{data.length}</b>
                </span>
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

      {selectedRequest && (
        <MeterSupervisionDetailModal
          open={showDetailModal}
          onClose={handleCloseModal}
          title="Detalles de Solicitud de Supervisión de Medidor"
          data={selectedRequest}
        />
      )}

      {commentingRequest && (
        <CommentsSupervisionMeterModal
          open={!!commentingRequest}
          onClose={() => setCommentingRequest(null)}
          request={commentingRequest}
          isAdmin={false}
        />
      )}
    </div>
  );
}
