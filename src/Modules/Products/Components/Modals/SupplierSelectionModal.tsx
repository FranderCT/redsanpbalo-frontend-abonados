import { useEffect, useMemo, useState } from "react";
import { Building2, Check, Mail, MapPin, Phone, Search, User } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import type { Supplier } from "../../../Supplier/Models/Supplier";

type SupplierSelectionModalProps = {
  open: boolean;
  onClose: () => void;
  suppliers: Supplier[];
  selectedSupplierIds: number[];
  onToggleSupplier: (supplierId: number) => void;
  isLoading?: boolean;
};

export function SupplierSelectionModal({
  open,
  onClose,
  suppliers,
  selectedSupplierIds,
  onToggleSupplier,
  isLoading = false,
}: SupplierSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (open) {
      setSearchTerm("");
    }
  }, [open]);

  const filteredSuppliers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return suppliers;

    return suppliers.filter((supplier) =>
      supplier.Name.toLowerCase().includes(term) ||
      supplier.Email?.toLowerCase().includes(term) ||
      supplier.Location?.toLowerCase().includes(term)
    );
  }, [suppliers, searchTerm]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-[#091540]">Seleccionar proveedores</DialogTitle>
          <DialogDescription>
            Busca y selecciona uno o varios proveedores para este producto.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-2 px-6">
          <Badge variant="secondary">
            {selectedSupplierIds.length} seleccionado{selectedSupplierIds.length === 1 ? "" : "s"}
          </Badge>
        </div>

        <div className="flex flex-col gap-4 px-6 pb-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar por nombre, correo o ubicación"
              className="pl-9"
            />
          </div>

          <div className="grid max-h-[55vh] gap-3 overflow-y-auto">
            {isLoading ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
                Cargando proveedores...
              </div>
            ) : filteredSuppliers.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
                No se encontraron proveedores con ese criterio.
              </div>
            ) : filteredSuppliers.map((supplier) => {
              const isSelected = selectedSupplierIds.includes(supplier.Id);

              return (
                <button
                  key={supplier.Id}
                  type="button"
                  onClick={() => onToggleSupplier(supplier.Id)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
                      {supplier.Type === "PHYSICAL" ? <User className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-[#091540]">{supplier.Name}</p>
                        <Badge variant="outline">
                          {supplier.Type === "PHYSICAL" ? "Físico" : "Jurídico"}
                        </Badge>
                      </div>

                      <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{supplier.Email || "Sin correo"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{supplier.PhoneNumber || "Sin teléfono"}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:col-span-2">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{supplier.Location || "Sin ubicación"}</span>
                        </div>
                      </div>
                    </div>

                    {isSelected ? (
                      <div className="rounded-full bg-primary p-1 text-primary-foreground">
                        <Check className="h-4 w-4" />
                      </div>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end">
            <Button type="button" onClick={onClose}>
              Confirmar selección
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
