import { useState } from "react";
import { Edit3, Eye, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import type { Product } from "../Models/CreateProduct";
import DeleteProductModal from "./Modals/DeleteProductModal";
import GetInfoProductModal from "./Modals/GetInfoProductModal";
import UpdateProductModal from "./Modals/UpdateProductModal";

type Props = {
  product: Product;
  mode?: "menu" | "inline";
  onEdit?: (product: Product) => void;
  onView?: (product: Product) => void;
  onDelete?: (product: Product) => void;
};

export default function ProductRowActions({
  product,
  mode = "menu",
  onEdit,
  onView,
  onDelete,
}: Props) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [infoProduct, setInfoProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const openEdit = () => {
    onEdit?.(product);
    if (!onEdit) setEditingProduct(product);
  };

  const openView = () => {
    onView?.(product);
    if (!onView) setInfoProduct(product);
  };

  const openDelete = () => {
    onDelete?.(product);
    if (!onDelete) setDeletingProduct(product);
  };

  return (
    <>
      {editingProduct ? (
        <UpdateProductModal
          product={editingProduct}
          open={true}
          onClose={() => setEditingProduct(null)}
          onSuccess={() => setEditingProduct(null)}
        />
      ) : null}

      {infoProduct ? (
        <GetInfoProductModal
          product={infoProduct}
          open={true}
          onClose={() => setInfoProduct(null)}
          onSuccess={() => setInfoProduct(null)}
        />
      ) : null}

      {deletingProduct ? (
        <DeleteProductModal
          product={deletingProduct}
          open={true}
          onOpenChange={(open) => {
            if (!open) setDeletingProduct(null);
          }}
          onSuccess={() => setDeletingProduct(null)}
        />
      ) : null}

      {mode === "inline" ? (
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={openView}>
            <Eye className="h-4 w-4" />
            Ver
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={openEdit}>
            <Edit3 className="h-4 w-4" />
            Editar
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={openDelete}
            disabled={!product.IsActive}
          >
            <Trash2 className="h-4 w-4" />
            Inhabilitar
          </Button>
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon" aria-label="Acciones del producto">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={openView}>
              <Eye className="h-4 w-4" />
              Ver detalle
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={openEdit}>
              <Edit3 className="h-4 w-4" />
              Editar producto
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={openDelete}
              disabled={!product.IsActive}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              Inhabilitar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
