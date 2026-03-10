import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { MoreVertical, Ruler } from "lucide-react";
import { useState } from "react";
import type { Unit } from "../Models/unit";
import DeleteUnitMeasureModal from "./DeleteUnitMeasureModal";
import UpdateUnitMeasureModal from "./UpdateUnitMeasureModal";

type Props = {
  unit: Unit;
};

export default function UnitCard({ unit }: Props) {
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);

  return (
    <>
      {editingUnit ? (
        <UpdateUnitMeasureModal
          unit={editingUnit}
          open={true}
          onClose={() => setEditingUnit(null)}
          onSuccess={() => setEditingUnit(null)}
        />
      ) : null}

      <Card className="w-full transition-shadow hover:shadow-md sm:w-72">
        <CardHeader className="flex flex-row items-start gap-3 space-y-0">
          <Ruler className="mt-0.5 h-5 w-5 shrink-0 text-[#091540]" />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <CardTitle className="truncate text-base font-medium">
              {unit.Name}
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Más acciones">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditingUnit(unit)}>
                Editar unidad
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                <DeleteUnitMeasureModal unitSelected={unit} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="flex flex-col gap-3 pt-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-muted-foreground">Estado</span>
            <Badge variant={unit.IsActive ? "default" : "destructive"}>
              {unit.IsActive ? "Activa" : "Inactiva"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
