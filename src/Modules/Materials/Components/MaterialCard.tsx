import { useState } from "react";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Box, MoreVertical } from "lucide-react";
import type { Material } from "../Models/Material";
import DeleteMaterialModal from "./DeleteMaterialModal";
import UpdateMaterialModal from "./UpdateMaterialModal";

type Props = {
  material: Material;
};

export default function MaterialCard({ material }: Props) {
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  return (
    <>
      {editingMaterial ? (
        <UpdateMaterialModal
          material={editingMaterial}
          open={true}
          onClose={() => setEditingMaterial(null)}
          onSuccess={() => setEditingMaterial(null)}
        />
      ) : null}

      <Card className="w-full transition-shadow hover:shadow-md sm:w-72">
        <CardHeader className="flex flex-row items-start gap-3 space-y-0">
          <Box className="mt-0.5 h-5 w-5 shrink-0 text-[#091540]" />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <CardTitle className="truncate text-base font-medium">
              {material.Name}
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Más acciones">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditingMaterial(material)}>
                Editar material
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                <DeleteMaterialModal materialSelected={material} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="flex flex-col gap-3 pt-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-muted-foreground">Estado</span>
            <Badge variant={material.IsActive ? "default" : "destructive"}>
              {material.IsActive ? "Activo" : "Inactivo"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
