import { useMemo, useState } from "react";
import { useSearchComments, useUpdateComment } from "../../Hooks/commentHooks";
import { CommentReadCard } from "../Cards/CommentReadCard";
import CommentHeaderBar from "../PaginationComment/CommentHeaderBar";
import type { Comment } from "../../Models/Comment";
import CategoryPager from "../../../Category/Components/PaginationCategory/CategoryPager";

export default function CommentsList() {
    //const {comments, } = useGetAllComments();
    const commentMutation = useUpdateComment();

    const handleMarkAsRead = async (id: number) => {
        commentMutation.mutateAsync(id);
    };

    const [page, setPage] = useState(1);   // 1-based
    const [limit, setLimit] = useState(10);

    const [read, setRead] = useState<string | undefined>(undefined);

     // Manejo de filtro por estado
    const handleStateChange = (newState: string) => {
        setRead(newState || undefined);
        setPage(1);
    };

    const handleCleanFilters = () => {
        setRead("");
        setPage(1);
    }
    
    const params = useMemo(() => ({ page, limit, name, read }), [page, limit, read]);
    const { data, isLoading, error } = useSearchComments(params);

    const rows: Comment[] = data?.data ?? [];
    const meta = data?.meta ?? {
        total: 0, page: 1, limit, pageCount: 1, hasNextPage: false, hasPrevPage: false,
    };

    return (
        <div className="min-h-screen flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-[#091540]">Lista de Comentarios</h1>
            <p className="text-[#091540]/70 text-md">
                Gestione todos los Comentarios
            </p>
            <div className="border-b border-dashed border-gray-300 mb-8"></div>

            <CommentHeaderBar
                limit={meta.limit}
                total={meta.total}
                onLimitChange={(l) => { setLimit(l); setPage(1); }}
                onFilterClick={handleStateChange}
                onCleanFilters={handleCleanFilters}
            />

            {isLoading ? (
            <div className="p-6 text-center text-gray-500">Cargando…</div>
            ) : error ? (
            <div className="p-6 text-center text-red-600">Ocurrió un error al cargar las Categorías.</div>
            ) : (
                <div className="flex flex-col gap-6">
                    {rows?.map((c) => (
                    <div key={c.Id} className="w-full ">
                    <CommentReadCard comment={c} onToggleRead={handleMarkAsRead}/>
                    </div>
                    ))}
                </div>
            )}
            <CategoryPager
                page={page}
                pageCount={meta.pageCount}
                onPageChange={setPage}
                variant="inline"  // <- sin caja/borde
            />
        </div>
    );
}
