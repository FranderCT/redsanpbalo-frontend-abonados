import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { usersColumns as makeUsersColumns } from "./usersColumns";
import PaginationControls from "./Table/PaginationControls";
import type { Users } from "../../Models/Users";
import AddUserModal from "../ListUsersModals/AddUserModal";
import EditUserModal from "../ListUsersModals/EditUserModal"; // ⬅️ importa el modal
import GetInfoUserModal from "../ListUsersModals/GetInfoUserModal";
import DeleteUserModal from "../ListUsersModals/DeleteUserModal";

type Props = { data: Users[] };

const UsersTable = ({ data }: Props) => {


  const [editingUser, setEditingUser] = useState<Users | null>(null);
  const [getInfoUser, setGetinfoUser] = useState<Users | null>(null);
  const [deleteUser, setdeleteUser] = useState<Users | null>(null);

  const handleEdit = (user: Users) => {
    setEditingUser(user);
  };

  const handleGetInfo = (user: Users)=> {
    setGetinfoUser(user);
  }

  const handleDelete = (user: Users) => {
    setdeleteUser(user);
  };

  const table = useReactTable({
    data,
    columns: makeUsersColumns(handleEdit, handleDelete, handleGetInfo),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const { pageIndex } = table.getState().pagination;

  return (
    <div className="space-y-4 w-full">

      <AddUserModal />
      {/* Modal de edición controlado desde aquí */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          open={true}
          onClose={() => setEditingUser(null)}
          onSuccess={() => setEditingUser(null)}
        />
      )}

      {/* Modal de información */}
      {getInfoUser && (
        <GetInfoUserModal
          user={getInfoUser}
          open={true}
          onClose={() => setGetinfoUser(null)}
          onSuccess={() => setGetinfoUser(null)}
        />
      )}

      {/* Modal de información */}
      {deleteUser && (
        <DeleteUserModal
          user={deleteUser}
          open={true}
          onClose={() => setdeleteUser(null)}
          onSuccess={() => setdeleteUser(null)}
        />
      )}


      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-auto max-h-[70vh]">
          <table className="w-full table-auto border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur supports-[backdrop-filter]:bg-gray-50/60">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="text-left">
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className="px-4 py-3 first:pl-5 last:pr-5 text-xs font-semibold uppercase tracking-wide text-gray-600 border-b border-gray-200"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.original.Id}
                  className="odd:bg-white even:bg-gray-50 hover:bg-indigo-50/40 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={[
                        "px-4 py-3 first:pl-5 last:pr-5 border-b border-gray-100 text-gray-800 align-middle",
                        cell.column.id === "actions"
                          ? "sticky left-0 z-10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-r border-gray-200"
                          : "",
                      ].join(" ")}
                    >
                      <div
                        className={`truncate max-w-[240px] ${
                          cell.column.id === "Address" ? "max-w-[360px]" : ""
                        }`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}

              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td
                    className="px-4 py-8 text-center text-gray-500 border-t border-gray-200"
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
                  className="px-4 py-3 first:pl-5 last:pr-5 text-xs text-gray-600 border-t border-gray-200"
                >
                  <div className="flex justify-center">
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
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
