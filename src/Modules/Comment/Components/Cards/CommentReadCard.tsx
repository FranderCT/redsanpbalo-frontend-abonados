import * as React from "react";
import type { Comment } from "../../Models/Comment";
import { Check, CheckCheck } from "lucide-react";

interface CommentReadCardProps {
  comment: Comment;
  onToggleRead?: (id: number, next: boolean) => Promise<void> | void;
  className?: string;
}

export function CommentReadCard({
  comment,
  onToggleRead,
  className = "",
}: CommentReadCardProps) {
  const dateObj = new Date(comment.CreatedAt);
  const formattedDate = `${dateObj.toLocaleDateString("es-CR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })} ${dateObj.toLocaleTimeString("es-CR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

  const borderClass = comment.IsRead ? "border-[#1789fc]" : "border-[#68d89b]";
  const btnClass = comment.IsRead
    ? "bg-[#1789fc] opacity-60 cursor-not-allowed"
    : "bg-green-600 hover:bg-green-700";

  return (
    <div
      className={`relative w-full overflow-hidden rounded-lg border-l-4 bg-white p-5 shadow-sm transition-colors duration-300 ease-in-out ${borderClass} ${className}`}
    >

      {/* Contenido: reservamos espacio a la derecha desde sm para el botón absoluto */}
      <div className="min-w-0 sm:pr-28">
        <p className="mb-1 text-sm text-[#091540]/50">{formattedDate}</p>
        <p className="text-[#091540] whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
          {comment.Message}
        </p>
      </div>

      {/* Botón: en mobile va en flujo; desde sm: absoluto arriba/derecha */}
      <button
        onClick={() => !comment.IsRead && onToggleRead?.(comment.Id, !comment.IsRead)}
        disabled={comment.IsRead}
        title={comment.IsRead ? "Ya leído" : "Marcar como leído"}
        className={`z-10 shrink-0 self-end rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition flex items-center gap-1
                    sm:absolute sm:right-5 sm:top-5 ${btnClass}`}
      >
        {comment.IsRead ? <CheckCheck size={18} /> : <Check size={18} />}
        {comment.IsRead ? "Leído" : "Marcar"}
      </button>
    </div>
  );
}
