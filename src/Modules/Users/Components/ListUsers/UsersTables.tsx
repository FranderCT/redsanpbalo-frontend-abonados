import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { usersColumns as makeUsersColumns } from "./usersColumns";
import PageSizeSelect from "./Table/PageSizeSelect";
import PaginationControls from "./Table/PaginationControls";
import { useDeleteUser } from "../../Hooks/UsersHooks";
import type { Users } from "../../Models/Users";
import DeleteActionModal from "../../../../Components/Modals/DeleteActionModal";
import CreateNewUser from "./Table/CreateNewUser";
import { useQueryClient } from "@tanstack/react-query";
import g28 from "../../../Auth/Assets/g28.png";
import { toast } from "react-toastify";

type Props = { data: Users[] };

const UsersTable = ({ data }: Props) => {
  const deleteUserMutation = useDeleteUser();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  // estado para modal de crear usuario
  const [openCreate, setOpenCreate] = useState(false);

  // Estado para el modal de confirmación (eliminar)
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

 const queryClient = useQueryClient(); 

  const handleEdit = (id: number) => {
    console.log("Editar usuario:", id);
  };

  const handleDelete = (id: number) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const onConfirmDelete = async () => {
    if (pendingDeleteId == null) return;
    try {
      await deleteUserMutation.mutateAsync(pendingDeleteId);
      console.log("usuario eliminado");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } finally {
      setPendingDeleteId(null);
      setConfirmOpen(false);
    }
  };

  const onCancelDelete = () => {
  setPendingDeleteId(null);
  setConfirmOpen(false);
  toast.info("Acción cancelada", { position: "top-right", autoClose: 3000 });
  };

  const handleCloseCreate = () => {
  setOpenCreate(false);
  toast.info("Registro cancelado", { position: "top-right", autoClose: 3000 });
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
        <button
          className="px-3 py-1 text-sm bg-[#091540] text-white hover:bg-[#1789FC] transition"
          onClick={() => setOpenCreate(true)}
        >
          Añadir un nuevo usuario
        </button>

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

          <tfoot>
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
                  onLast={() =>
                    table.setPageIndex(table.getPageCount() - 1)
                  }
                  onGotoPage={(p) => table.setPageIndex(p)}
                />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Modal de ELIMINAR */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="presentation"
          onClick={onCancelDelete}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <DeleteActionModal
              confirmLabel={deleteUserMutation.isPending ? "..." : "Inhabilitar"}
              cancelLabel="Cancelar"
              onConfirm={onConfirmDelete}
              onCancel={onCancelDelete}
              onClose={onCancelDelete}
            />
          </div>
        </div>
      )}

      {/* Modal de CREAR USUARIO */}
      {openCreate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="presentation"
          onClick={handleCloseCreate} 
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl rounded-sm shadow-xl border border-gray-200 bg-[#F9F5FF]"
          >
            {/* Header modal */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-dashed border-gray-300">
              <img src={g28} alt="Logo ASADA" className="w-15 h-15 object-contain" />
              <button
                type="button"
                onClick={handleCloseCreate}
                className="px-3 py-1 text-[#091540] border border-[#091540]/30 hover:bg-[#F6132D] hover:text-white transition"
                aria-label="Cerrar modal"
              >
                Cerrar
              </button>
            </div>

            {/* Body modal (scroll) */}
            <div className="max-h-[75vh] overflow-y-auto px-5 py-6">
              <CreateNewUser
                onSuccess={() => {
                  queryClient.invalidateQueries({ queryKey: ["users"] });
                  setOpenCreate(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
