import { memo } from "react";
import { Badge } from "@/Components/ui/badge";
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
import type { Category } from "../Models/Category";
import { Layers3, MoreVertical } from "lucide-react";
import { Button } from "@/Components/ui/button";

type Props = {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
};

function CategoryCard({ category, onEdit, onDelete }: Props) {
  return (
    <Card className="w-full transition-shadow hover:shadow-md sm:w-72">
      <CardHeader className="flex flex-row items-start gap-3 space-y-0">
        <Layers3 className="mt-0.5 h-5 w-5 shrink-0 text-[#091540]" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <CardTitle className="truncate text-base font-medium">
            {category.Name}
          </CardTitle>
          <span className="text-xs text-muted-foreground line-clamp-2">
            {category.Description?.trim() || "Sin descripción registrada"}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Más acciones">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => onEdit(category)}>
              Editar categoría
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => onDelete(category)}
              className="text-red-600 focus:text-red-600"
            >
              Inhabilitar categoría
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pt-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground">Estado</span>
          <Badge variant={category.IsActive ? "default" : "destructive"}>
            {category.IsActive ? "Activa" : "Inactiva"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(CategoryCard);
