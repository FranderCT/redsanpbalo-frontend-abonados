import { useGetAllComments, useUpdateComment } from "../../Hooks/commentHooks";
import { CommentReadCard } from "../Cards/CommentReadCard";

export default function CommentsList() {
    const {comments, } = useGetAllComments();
    const commentMutation = useUpdateComment();

    const handleMarkAsRead = async (id: number) => {
        commentMutation.mutateAsync(id);
    };

    return (
        <div className="min-h-screen flex flex-col gap-4">
        {comments?.map((c) => (
            <div key={c.Id} className="w-full">
            <CommentReadCard comment={c} onToggleRead={handleMarkAsRead} className="mt-2"/>
            </div>
        ))}
        </div>
    );
}
