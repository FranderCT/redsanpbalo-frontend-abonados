import { useState } from "react";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { CircleHelp, MoreVertical } from "lucide-react";
import type { FAQ } from "../Models/FAQ";
import UpdateFAQModal from "./ModalsFAQ/UpdateFAQModal";
import DeleteFAQButton from "./ModalsFAQ/DeleteFAQModal";

type Props = {
  faq: FAQ;
};

export default function FAQCard({ faq }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const answer = faq.Answer?.trim() || "Sin respuesta registrada.";
  const isLongAnswer = answer.length > 180;

  return (
    <>
      {isEditing ? (
        <UpdateFAQModal
          faq={faq}
          open={isEditing}
          onClose={() => setIsEditing(false)}
          onSuccess={() => setIsEditing(false)}
        />
      ) : null}

      <Card className="flex h-full w-full flex-col border-slate-200 bg-white/95 transition-shadow hover:shadow-lg rounded-none">
        <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-4">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#091540]/10 text-[#091540]">
            <CircleHelp className="h-5 w-5" />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <CardTitle className="line-clamp-2 text-base font-medium leading-6">
              {faq.Question}
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              Pregunta frecuente visible en la landing.
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Más acciones">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="w-full text-left"
                >
                  Editar FAQ
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                onSelect={(event) => event.preventDefault()}
              >
                <DeleteFAQButton faqSelected={faq} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-4 pt-0">
          <div className="flex flex-1 flex-col gap-2">
            <p className={`text-sm leading-6 text-muted-foreground ${isExpanded ? "" : "line-clamp-4 min-h-24"}`}>
              {answer}
            </p>

            {isLongAnswer ? (
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="self-start text-xs font-medium text-[#1789FC] transition-colors hover:text-[#091540]"
              >
                {isExpanded ? "Ver menos" : "Ver más"}
              </button>
            ) : null}
          </div>

          <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
            <span className="text-sm text-muted-foreground">Estado</span>
            <Badge variant={faq.IsActive ? "default" : "destructive"}>
              {faq.IsActive ? "Activo" : "Inactivo"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
