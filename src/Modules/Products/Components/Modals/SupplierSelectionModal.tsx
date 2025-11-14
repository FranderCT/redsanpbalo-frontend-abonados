import { useState, useMemo, useEffect } from "react";
import { ModalBase } from "../../../../Components/Modals/ModalBase";
import type { Supplier } from "../../../Supplier/Models/Supplier";
import { User, Building2, Mail, Phone, MapPin, Check } from "lucide-react";

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
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Reset estado cuando se abre/cierra el modal
  useEffect(() => {
    if (open) {
      setSearchTerm("");
      setSelectedIndex(0);
    }
  }, [open]);

  // Filtrar proveedores basado en el término de búsqueda
  const filteredSuppliers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return suppliers;
    return suppliers.filter(supplier => 
      supplier.Name.toLowerCase().includes(term) ||
      supplier.Email?.toLowerCase().includes(term) ||
      supplier.Location?.toLowerCase().includes(term)
    );
  }, [suppliers, searchTerm]);

  const handleSupplierToggle = (supplierId: number) => {
    onToggleSupplier(supplierId);
  };

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      closeOnOutside={true}
      panelClassName="w-[600px] max-w-[90vw] max-h-[80vh]"
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#091540]">
            Seleccionar Proveedores
          </h3>
          {selectedSupplierIds.length > 0 && (
            <span className="text-sm text-blue-600 font-medium">
              {selectedSupplierIds.length} seleccionado{selectedSupplierIds.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Campo de búsqueda */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar proveedores... (Use ↑↓ para navegar, Enter para seleccionar)"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => Math.min(prev + 1, filteredSuppliers.length - 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => Math.max(prev - 1, 0));
              } else if (e.key === 'Enter' && filteredSuppliers[selectedIndex]) {
                e.preventDefault();
                handleSupplierToggle(filteredSuppliers[selectedIndex].Id);
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none transition"
            autoFocus
          />
          {!isLoading && (
            <div className="text-sm text-gray-500 mt-2">
              {searchTerm ? 
                `${filteredSuppliers.length} proveedor(es) encontrado(s)` : 
                `${suppliers.length} proveedor(es) disponible(s)`
              }
            </div>
          )}
        </div>

        {/* Lista de proveedores */}
        <div className="flex-1 overflow-y-auto border border-gray-200 rounded max-h-96 bg-gray-50">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">
              Cargando proveedores...
            </div>
          ) : filteredSuppliers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm ? "No se encontraron proveedores que coincidan con la búsqueda" : "No hay proveedores disponibles"}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredSuppliers.map((supplier, index) => {
                const isSelected = selectedSupplierIds.includes(supplier.Id);
                return (
                  <div
                    key={supplier.Id}
                    className={`p-4 cursor-pointer transition-all border-l-4 ${
                      index === selectedIndex 
                        ? 'bg-blue-50 border-blue-500 shadow-sm' 
                        : isSelected
                        ? 'bg-green-50 border-green-500'
                        : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-300'
                    }`}
                    onClick={() => handleSupplierToggle(supplier.Id)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="flex gap-3">
                      {/* Icono del proveedor */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                        supplier.Type === "PHYSICAL" 
                          ? "bg-blue-100 text-blue-600" 
                          : "bg-purple-100 text-purple-600"
                      }`}>
                        {supplier.Type === "PHYSICAL" ? (
                          <User className="w-5 h-5" />
                        ) : (
                          <Building2 className="w-5 h-5" />
                        )}
                      </div>

                      {/* Información del proveedor */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-[#091540] truncate">
                            {supplier.Name}
                          </h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
                            supplier.Type === "PHYSICAL" 
                              ? "bg-blue-100 text-blue-700" 
                              : "bg-purple-100 text-purple-700"
                          }`}>
                            {supplier.Type === "PHYSICAL" ? "Físico" : "Jurídico"}
                          </span>
                        </div>
                        
                        <div className="space-y-1 text-xs text-gray-600">
                          {supplier.Email && (
                            <div className="flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                              <span className="truncate">{supplier.Email}</span>
                            </div>
                          )}
                          {supplier.PhoneNumber && (
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                              <span>{supplier.PhoneNumber}</span>
                            </div>
                          )}
                          {supplier.Location && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                              <span className="truncate">{supplier.Location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Indicador de selección */}
                      {isSelected && (
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Confirmar
          </button>
        </div>
      </div>
    </ModalBase>
  );
}
