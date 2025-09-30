import { ModalBase } from "../../../Components/Modals/ModalBase";
import { useLegalSupplierById } from "../../LegalSupplier/Hooks/LegalSupplierHooks";
import CreateAgentSupplierModal from "./Modals/CreateAgentSupplierModal";

type Props = {
  legalSupplierId: number;
  open: boolean;
  onClose: () => void;
};

const AgentSupplierModal = ({ legalSupplierId, open, onClose }: Props) => {
  const { legalSup, isLoading, error } = useLegalSupplierById(legalSupplierId);

  const agents = legalSup?.AgentSupppliers ?? []; // asegúrate de que el nombre esté correcto

  return (
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

      </header>

      {/* Contenido Scrollable */}
      <main className="flex-1 p-6 overflow-auto space-y-8">
        {/* Sección de info general del proveedor */}
        {legalSup && (
          <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-[#091540] mb-3">
              Información del Proveedor
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <span className="text-xs uppercase text-gray-500">Nombre</span>
                <p className="text-sm text-gray-800">{legalSup.CompanyName ?? "-"}</p>
              </div>
              <div>
                <span className="text-xs uppercase text-gray-500">Cédula Jurídica</span>
                <p className="text-sm text-gray-800">{legalSup.LegalID ?? "-"}</p>
              </div>
              
            </div>
          </section>
        )}

        {/* Sección de agentes */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-[#091540]">Agentes Registrados</h3>
            <CreateAgentSupplierModal LegalSupplierId={legalSup?.Id}/>
          </div>

          {isLoading && <p>Cargando...</p>}
          {error && <p className="text-red-600">Error al cargar los datos</p>}

          {agents.length === 0 ? (
            <p className="text-sm text-gray-500 mt-3">
              No hay agentes registrados.
            </p>
          ) : (
            <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2">Nombre</th>
                  <th className="px-4 py-2">Teléfono</th>
                  <th className="px-4 py-2">Correo electrónico</th>
                  <th className="px-4 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((u: any) => (
                  <tr key={u.Id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">
                      {[u.Name, u.Surname1, u.Surname2]
                        .filter(Boolean)
                        .join(" ") || "-"}
                    </td>
                    <td className="px-4 py-2">{u.PhoneNumber ?? "-"}</td>
                    <td className="px-4 py-2">{u.Email ?? "-"}</td>
                    <td className="px-4 py-2 text-center space-x-2">
                      <button className="text-blue-600 hover:underline text-sm">
                        Editar
                      </button>
                      <button className="text-red-600 hover:underline text-sm">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>

      {/* Footer fijo */}
      <footer className="p-4 border-t border-gray-200 bg-white flex justify-end space-x-3 sticky bottom-0">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
        >
          Cerrar
        </button>
      </footer>
    </ModalBase>
  );
};

export default AgentSupplierModal;
