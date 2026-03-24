import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { cn } from "@/lib/utils";

import type { Product } from "../../../Products/Models/CreateProduct";

type Props = {
  open: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  isLoading?: boolean;
  selectedProductIds?: number[];
};

export function ProductSelectionModal({
  open,
  onClose,
  products,
  onSelectProduct,
  isLoading = false,
  selectedProductIds = [],
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(0);

  useEffect(() => {
    if (open) {
      setSearchTerm("");
      setHoveredIndex(0);
    }
  }, [open]);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return products;
    return products.filter(
      (p) =>
        p.Name.toLowerCase().includes(term) ||
        p.Observation?.toLowerCase().includes(term) ||
        p.Type?.toLowerCase().includes(term),
    );
  }, [products, searchTerm]);

  const handleSelect = (product: Product) => {
    onSelectProduct(product);
    onClose();
    setSearchTerm("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="flex max-h-[80vh] w-full max-w-xl flex-col gap-0 p-0">
        <DialogHeader className="border-b px-6 py-5">
          <DialogTitle>Seleccionar producto</DialogTitle>
        </DialogHeader>

        {/* Buscador */}
        <div className="border-b px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Buscar por nombre, tipo, observación…"
              value={searchTerm}
              autoFocus
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setHoveredIndex(0);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setHoveredIndex((p) => Math.min(p + 1, filteredProducts.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setHoveredIndex((p) => Math.max(p - 1, 0));
                } else if (e.key === "Enter" && filteredProducts[hoveredIndex]) {
                  e.preventDefault();
                  handleSelect(filteredProducts[hoveredIndex]);
                }
              }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {searchTerm
                ? `${filteredProducts.length} resultado(s)`
                : `${products.length} producto(s) disponible(s)`}
            </span>
            {selectedProductIds.length > 0 && (
              <span className="text-green-600 dark:text-green-400">
                {selectedProductIds.length} ya agregado(s)
              </span>
            )}
          </div>
        </div>

        {/* Lista */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
              Cargando productos…
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
              {searchTerm
                ? "No se encontraron productos"
                : "No hay productos disponibles"}
            </div>
          ) : (
            <ul className="divide-y">
              {filteredProducts.map((product, index) => {
                const alreadyAdded = selectedProductIds.includes(product.Id);
                return (
                  <li
                    key={product.Id}
                    className={cn(
                      "flex cursor-pointer items-start justify-between gap-4 border-l-2 px-6 py-3 transition-colors",
                      index === hoveredIndex
                        ? "border-primary bg-accent"
                        : alreadyAdded
                          ? "border-green-500 bg-green-50/60 dark:bg-green-950/20"
                          : "border-transparent hover:bg-accent/50",
                    )}
                    onClick={() => handleSelect(product)}
                    onMouseEnter={() => setHoveredIndex(index)}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium">{product.Name}</p>
                        {alreadyAdded && (
                          <Badge
                            variant="outline"
                            className="shrink-0 border-green-500 text-green-600 text-xs"
                          >
                            Ya agregado
                          </Badge>
                        )}
                      </div>
                      {product.Observation && (
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {product.Observation}
                        </p>
                      )}
                      <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
                        {product.Type && <span>Tipo: {product.Type}</span>}
                        {product.Category && (
                          <span>Categoría: {product.Category.Name}</span>
                        )}
                        {product.Material && (
                          <span>Material: {product.Material.Name}</span>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={alreadyAdded ? "outline" : "default"}
                      className="mt-0.5 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(product);
                      }}
                    >
                      {alreadyAdded ? "Agregar más" : "Seleccionar"}
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
