import type { Comment } from "../Models/Comment";

interface CommentCardProps {
    comment: Comment;
    onMarkAsRead?: (id: number) => Promise<void> | void;
    className?: string;
}

export function CommentCard({ comment, onMarkAsRead, className = "" }: CommentCardProps) {
    const formattedDate = new Date(comment.CreatedAt).toLocaleDateString("es-CR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    return (
        <div
        className={[
            "rounded-xl bg-white shadow-lg ring-1 ring-black/5",
            className,
        ].join(" ")}
        >
        <div className="p-6">
            {/* Encabezado anónimo */}
            <div className="mb-4 flex items-center justify-between">
            <p className="text-sm">{formattedDate}</p>
            </div>

            {/* Mensaje */}
            <div className="prose max-w-none min-w-0 text-[#091540]">
            <p className="leading-relaxed break-words [overflow-wrap:anywhere]">{comment.Message}</p>
            </div>

            {/* Botón de acción */}
            <div className="mt-6 flex justify-end">
            <button
                onClick={() => onMarkAsRead?.(comment.Id)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition focus:outline-none ${
                comment.IsRead
                    ? "bg-[#68d89b] hover:bg-[#68d89b] focus:ring-[#68d89b]"
                    : "bg-[#1789fc] hover:bg-[#091540] focus:ring-[#1789fc]"
                }`}
                style={{
                    textShadow: "0 1px 3px rgba(0,0,0,0.5)", // 👈 sombra sutil al texto
                }}
            >
                {comment.IsRead ? "Leído" : "Marcar como leído"}
            </button>
            </div>
        </div>
        </div>
    );
}
