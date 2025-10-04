import { useState, useMemo, useEffect } from "react";
import { ModalBase } from "../../../../Components/Modals/ModalBase";
import type { Product } from "../../../Products/Models/CreateProduct";

type ProductSelectionModalProps = {
  open: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  isLoading?: boolean;
  selectedProductIds?: number[]; // IDs de productos ya seleccionados
};

export function ProductSelectionModal({
  open,
  onClose,
  products,
  onSelectProduct,
  isLoading = false,
  selectedProductIds = [],
}: ProductSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Reset estado cuando se abre/cierra el modal
  useEffect(() => {
    if (open) {
      setSearchTerm("");
      setSelectedIndex(0);
    }
  }, [open]);

  // Filtrar productos basado en el término de búsqueda
  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return products;
    return products.filter(product => 
      product.Name.toLowerCase().includes(term) ||
      product.Observation?.toLowerCase().includes(term) ||
      product.Type?.toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

  const handleProductSelect = (product: Product) => {
    onSelectProduct(product);
    onClose();
    setSearchTerm(""); // Limpiar búsqueda al cerrar
  };

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      closeOnOutside={true}
      panelClassName="w-[600px] max-w-[90vw] max-h-[80vh]"
    >
      <div className="flex flex-col h-full">
        <h3 className="text-lg font-semibold text-[#091540] mb-4">
          Seleccionar Producto
        </h3>

        {/* Campo de búsqueda */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar productos... (Use ↑↓ para navegar, Enter para seleccionar)"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedIndex(0); // Reset selection when searching
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => Math.min(prev + 1, filteredProducts.length - 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => Math.max(prev - 1, 0));
              } else if (e.key === 'Enter' && filteredProducts[selectedIndex]) {
                e.preventDefault();
                handleProductSelect(filteredProducts[selectedIndex]);
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none transition"
            autoFocus
          />
          {!isLoading && (
            <div className="text-sm text-gray-500 mt-2 flex justify-between">
              <span>
                {searchTerm ? 
                  `${filteredProducts.length} producto(s) encontrado(s)` : 
                  `${products.length} producto(s) disponible(s)`
                }
              </span>
              {selectedProductIds.length > 0 && (
                <span className="text-green-600">
                  {selectedProductIds.length} ya agregado(s)
                </span>
              )}
            </div>
          )}
        </div>

        {/* Lista de productos */}
        <div className="flex-1 overflow-y-auto border border-gray-200 rounded max-h-96 bg-gray-50">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">
              Cargando productos...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm ? "No se encontraron productos que coincidan con la búsqueda" : "No hay productos disponibles"}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredProducts.map((product, index) => {
                const isAlreadySelected = selectedProductIds.includes(product.Id);
                return (
                  <div
                    key={product.Id}
                    className={`p-4 cursor-pointer transition-colors border-l-4 ${
                      index === selectedIndex 
                        ? 'bg-blue-100 border-blue-500' 
                        : isAlreadySelected
                        ? 'bg-green-50 border-green-400'
                        : 'bg-white border-transparent hover:bg-blue-50 hover:border-blue-400'
                    }`}
                    onClick={() => handleProductSelect(product)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    title={isAlreadySelected ? "Producto ya agregado - clic para agregar más cantidad" : "Clic para seleccionar producto"}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-[#091540] mb-1">
                          {product.Name}
                          {isAlreadySelected && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Ya agregado
                            </span>
                          )}
                        </h4>
                        {product.Observation && (
                          <p className="text-sm text-gray-600 mb-2">
                            {product.Observation}
                          </p>
                        )}
                        <div className="flex gap-4 text-xs text-gray-500">
                          {product.Type && (
                            <span>Tipo: {product.Type}</span>
                          )}
                          {product.Category && (
                            <span>Categoría: {product.Category.Name}</span>
                          )}
                          {product.Material && (
                            <span>Material: {product.Material.Name}</span>
                          )}
                        </div>
                      </div>
                      <button
                        className="ml-4 px-3 py-1 bg-[#091540] text-white text-sm rounded hover:opacity-90 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductSelect(product);
                        }}
                      >
                        {isAlreadySelected ? "Agregar más" : "Seleccionar"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              setSearchTerm("");
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </ModalBase>
  );
}