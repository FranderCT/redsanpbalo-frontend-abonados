import { useMemo, useState } from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { DataPagination } from "@/Components/ui/data-pagination";
import { Skeleton } from "@/Components/ui/skeleton";
import { CommentReadCard } from "../Components/CommentReadCard";
import CommentHeaderBar from "../Components/CommentHeaderBar";
import { useSearchComments, useUpdateComment } from "../Hooks/commentHooks";
import type { Comment } from "../Models/Comment";

export default function ListComments() {
  const commentMutation = useUpdateComment();
  const [persistedRead, setPersistedRead] = useState<Record<number, Comment>>({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [read, setRead] = useState<string | undefined>(undefined);

  const params = useMemo(() => ({ page, limit, read }), [page, limit, read]);
  const { data, isLoading, error } = useSearchComments(params);

  const rows: Comment[] = data?.data ?? [];
  const rawMeta = (data?.meta ?? {}) as Partial<{
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    total: number;
    limit: number;
    pageCount: number;
    page: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }>;
  const meta = {
    totalItems: rawMeta.totalItems ?? rawMeta.total ?? rows.length,
    itemCount: rawMeta.itemCount ?? rows.length,
    itemsPerPage: rawMeta.itemsPerPage ?? rawMeta.limit ?? limit,
    totalPages: rawMeta.totalPages ?? rawMeta.pageCount ?? 1,
    currentPage: rawMeta.currentPage ?? rawMeta.page ?? page,
    hasNextPage: rawMeta.hasNextPage ?? false,
    hasPrevPage: rawMeta.hasPrevPage ?? false,
  };

  const displayRows = useMemo(() => {
    const merged = rows.map((comment) => persistedRead[comment.Id] ?? comment);

    if (read === "0") {
      const missingPersisted = Object.values(persistedRead).filter(
        (comment) => !merged.some((item) => item.Id === comment.Id),
      );
      return [...missingPersisted, ...merged];
    }

    return merged;
  }, [persistedRead, read, rows]);
  const visibleTotal =
    read === "0" ? Math.max(meta.totalItems, displayRows.length) : meta.totalItems;

  const handleMarkAsRead = async (id: number) => {
    const baseComment = rows.find((comment) => comment.Id === id) ?? persistedRead[id];
    const updatedComment = await commentMutation.mutateAsync(id);

    if (!baseComment && !updatedComment) return;

    setPersistedRead((current) => ({
      ...current,
      [id]: {
        ...(baseComment ?? updatedComment),
        ...updatedComment,
        IsRead: true,
      },
    }));
  };

  const handleStateChange = (newState: string) => {
    setRead(newState || undefined);
    setPage(1);
  };

  const handleCleanFilters = () => {
    setRead(undefined);
    setLimit(10);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-[#091540]">Lista de Comentarios</h1>
        <p className="text-md text-[#091540]/70">
          Gestione todos los comentarios desde una vista simple y enfocada en acciones.
        </p>
      </section>

      <CommentHeaderBar
        limit={limit}
        total={visibleTotal}
        read={read}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
        onFilterClick={handleStateChange}
        onCleanFilters={handleCleanFilters}
      />

      <div className="flex flex-col">
        {isLoading ? (
          <div className="grid gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="border-slate-200 shadow-sm">
                <CardContent className="space-y-4 p-6">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600">
            Ocurrió un error al cargar los comentarios.
          </div>
        ) : displayRows.length === 0 ? (
          <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
            <p className="text-base font-semibold text-slate-900">No hay comentarios para mostrar</p>
            <p className="mt-2 max-w-md text-sm text-slate-500">
              Ajusta los filtros para revisar los comentarios disponibles.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {displayRows.map((comment) => (
              <CommentReadCard
                key={comment.Id}
                comment={comment}
                onToggleRead={handleMarkAsRead}
              />
            ))}
          </div>
        )}
      </div>

      <DataPagination
        page={page}
        pageCount={meta.totalPages}
        total={visibleTotal}
        pageSize={limit}
        onPageChange={setPage}
        labels={{ totalItems: "comentarios" }}
        compact
      />
    </div>
  );
}
