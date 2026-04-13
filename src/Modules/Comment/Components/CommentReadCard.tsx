import type { Comment } from "../Models/Comment";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import { Check, CheckCheck, Clock3, MessageSquareText } from "lucide-react";

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

  return (
    <Card className={`w-full transition-shadow hover:shadow-md ${className}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div
            className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
              comment.IsRead ? "bg-sky-100 text-sky-700" : "bg-emerald-100 text-emerald-700"
            }`}
          >
            <MessageSquareText className="h-5 w-5" />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={comment.IsRead ? "secondary" : "default"}>
                {comment.IsRead ? "Leído" : "Sin leer"}
              </Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock3 className="h-3.5 w-3.5" />
                {formattedDate}
              </span>
            </div>
            <p className="text-sm font-medium text-[#091540]">Comentario recibido</p>
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          variant={comment.IsRead ? "secondary" : "default"}
          onClick={() => !comment.IsRead && onToggleRead?.(comment.Id, !comment.IsRead)}
          disabled={comment.IsRead}
          title={comment.IsRead ? "Ya leído" : "Marcar como leído"}
          className="shrink-0 gap-2"
        >
          {comment.IsRead ? <CheckCheck className="h-4 w-4" /> : <Check className="h-4 w-4" />}
          {comment.IsRead ? "Leído" : "Marcar leído"}
        </Button>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="whitespace-pre-wrap break-words text-sm leading-6 text-[#091540]">
            {comment.Message?.trim() || "Sin contenido disponible."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
