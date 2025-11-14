import { useState } from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import type { ReqChangeNameMeter } from "../../Models/RequestChangeNameMeter";
import { ReqChangeNameMeterColumns } from "./ReqChangeNameMeterColumn";
import ReqChangeNameMeterPager from "../PaginationChangeNameMeter/ReqChangeNameMeterPager";
import UpdateReqChangeNameMeterStateModal from "../Modals/UpdateChangeNameMeter";
import MeterSupervisionDetailModalAdmin from "../Modals/VerInfoAbonadoRequest";
import { CommentsChangeNameMeterModal } from "../Comments/CommentsChangeNameMeterModal";


type Props = {
  data: ReqChangeNameMeter[];
  total?: number;
  page: number;
  pageCount: number;
  onPageChange: (p: number) => void;
};

export default function ReqChangeNameMeterTable({
  data,
  page,
  pageCount,
  onPageChange,
}: Props) {
      const [selectedRequest, setSelectedRequest] = useState<ReqChangeNameMeter | null>(null);
      const [showDetailModal, setShowDetailModal] = useState(false);
      const [editingChangeNameMeter, setEditingReqChangeNameMeter] = useState<ReqChangeNameMeter | null>(null);
      const [commentingRequest, setCommentingRequest] = useState<ReqChangeNameMeter | null>(null);

          const handleGetInfo = (req: ReqChangeNameMeter) => {
            setSelectedRequest(req);
            setShowDetailModal(true);
          };
        
          const handleCloseModal = () => {
            setShowDetailModal(false);
            setSelectedRequest(null);
          }; 

  const table = useReactTable({
    data,
    columns: ReqChangeNameMeterColumns(
      (req) => setEditingReqChangeNameMeter(req),
      handleGetInfo,
      (req) => setCommentingRequest(req)
    ),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      {/* ✅ Renderiza el modal controlado */}
        <UpdateReqChangeNameMeterStateModal
          open={!!editingChangeNameMeter}
          req={editingChangeNameMeter}
          onClose={() => setEditingReqChangeNameMeter(null)}
          onSuccess={() => setEditingReqChangeNameMeter(null)}
        />
              {/* Modal de detalle */}
              {selectedRequest && (
                <MeterSupervisionDetailModalAdmin
                  open={showDetailModal}
                  onClose={handleCloseModal}
                  title="Detalles de Solicitud de cambio nombre de medidor"
                  data={selectedRequest}
                />
              )}

      {commentingRequest && (
        <CommentsChangeNameMeterModal
          open={!!commentingRequest}
          onClose={() => setCommentingRequest(null)}
          request={commentingRequest}
          isAdmin={true}
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
                  <ReqChangeNameMeterPager
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
