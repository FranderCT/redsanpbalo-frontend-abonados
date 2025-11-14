import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ModalBase } from "../../../Components/Modals/ModalBase";
import { useLegalSupplierById } from "../../LegalSupplier/Hooks/LegalSupplierHooks";
import CreateAgentSupplierModal from "./Modals/CreateAgentSupplierModal";
import EditAgentSupplierModal from "./Modals/EditAgentSupplierModal";
import DeleteAgentSupplierButton from "./Modals/DeleteAgentSupplierButton";

// Tipos
import type { AgentSupppliers } from "../Models/SupplierAgent";
import type { AgentSupplier as AgentSupplierModel } from "../../Supplier/Models/AgentSupplier";
import { Edit2 } from "lucide-react";

type Props = {
  legalSupplierId: number;
  open: boolean;
  onClose: () => void;
};

// Helper de compatibilidad de tipos (si ambos modelos tienen misma forma)
const asAgentSupplierModel = (a: AgentSupppliers) => a as unknown as AgentSupplierModel;

const isActiveFlag = (v: unknown) => {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v === 1;
  if (typeof v === "string") return v === "1" || v.toLowerCase() === "true";
  return false;
};

const AgentSupplierModal = ({ legalSupplierId, open, onClose }: Props) => {
  const queryClient = useQueryClient();
  // Hook que NO retorna refetch
  const { legalSup, isLoading, error } = useLegalSupplierById(legalSupplierId);

  // Función para refrescar datos invalidando la query
  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["legalSupplier", legalSupplierId] });

  const agents: AgentSupppliers[] = legalSup?.AgentSupppliers ?? [];

  // Estado para editar
  const [editOpen, setEditOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentSupppliers | null>(null);

  const openEdit = (agent: AgentSupppliers) => {
    setSelectedAgent(agent);
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setSelectedAgent(null);
  };

  return (
    <>
      <ModalBase
        open={open}
        onClose={onClose}
        panelClassName="w-full max-w-6xl max-h-[90vh] bg-white shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header fijo */}
        <header className="p-6 border-b border-gray-200 flex justify-between items-start sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-semibold text-[#091540]">
              Gestión de Agentes del Proveedor
            </h2>
            <p className="text-sm text-gray-600">
              Administra los agentes asociados a este proveedor desde este panel.
            </p>
          </div>

          {/* Crear (refresca al terminar) */}
          <CreateAgentSupplierModal
            LegalSupplierId={legalSup?.Id}
            //onSuccess={refresh}
          />
        </header>

        {/* Contenido Scrollable */}
        <main className="flex-1 p-6 overflow-auto space-y-8">
          {/* Info del proveedor */}
          {legalSup && (
            <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-[#091540] mb-3">
                Información del Proveedor
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <span className="text-xs uppercase text-gray-500">Nombre</span>
                  <p className="text-sm text-gray-800">{legalSup.Supplier?.Name ?? "-"}</p>
                </div>
                <div>
                  <span className="text-xs uppercase text-gray-500">Cédula Jurídica</span>
                  <p className="text-sm text-gray-800">{legalSup.Supplier?.IDcard ?? "-"}</p>
                </div>
              </div>
            </section>
          )}

          {/* Agentes */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-[#091540]">Agentes Registrados</h3>
            </div>

            {isLoading && <p>Cargando...</p>}
            {error && <p className="text-red-600">Error al cargar los datos</p>}

            {agents.length === 0 ? (
              <p className="text-sm text-gray-500 mt-3">No hay agentes registrados.</p>
            ) : (
              <div className="overflow-auto rounded-lg border border-gray-200">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="px-4 py-2">Nombre</th>
                      <th className="px-4 py-2">Teléfono</th>
                      <th className="px-4 py-2">Correo electrónico</th>
                      <th className="px-4 py-2">Estado</th>
                      <th className="px-4 py-2 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agents.map((u) => {
                      const agentModel = asAgentSupplierModel(u); // compatibilidad para el botón eliminar
                      const active = isActiveFlag(u.IsActive);
                      return (
                        <tr key={u.Id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-2">
                            {[u.Name, u.Surname1, u.Surname2].filter(Boolean).join(" ") || "-"}
                          </td>
                          <td className="px-4 py-2">{u.PhoneNumber ?? "-"}</td>
                          <td className="px-4 py-2">{u.Email ?? "-"}</td>
                          <td className="px-4 py-2">
                            <span
                              className={`inline-flex w-full items-center gap-1 border px-2.5 py-0.5 text-xs font-medium
                                ${active
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                                }`}
                            >
                              
                              {active ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                className="flex items-center gap-1 px-3 py-1 text-xs font-medium border 
                                text-[#1789FC] border-[#1789FC]
                                hover:bg-[#1789FC] hover:text-[#F9F5FF] transition"
                                onClick={() => openEdit(u)}
                              >
                                <Edit2 className="w-4 h-4" />
                                Editar
                              </button>

                              <DeleteAgentSupplierButton
                                agent={agentModel}
                                onSuccess={refresh}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>

        {/* Footer */}
        <footer className="p-4 border-t border-gray-200 bg-white flex justify-end space-x-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
          >
            Cerrar
          </button>
        </footer>
      </ModalBase>

      {/* Modal de edición (refresca al guardar) */}
      {selectedAgent && (
        <EditAgentSupplierModal
          agent={selectedAgent}
          open={editOpen}
          onClose={closeEdit}
          onSuccess={() => {
            refresh();
            closeEdit();
          }}
        />
      )}
    </>
  );
};

export default AgentSupplierModal;
