import MaterialTable from "../Components/TableMateriales/MaterialTable";
import { useGetAllMaterials } from "../Hooks/MaterialHooks";

const ListMaterials = () => {
  const { materials, isLoading, error } = useGetAllMaterials();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        Cargando materiales...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Ocurrió un error al cargar los materiales.
      </div>
    );
  }

  // if (!materials || materials.length === 0) {
  //   return (
  //     <div className="text-center text-gray-500 p-6">
  //       No hay materiales registrados.
  //     </div>
  //   );
  // }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-[#091540]">Lista de Materiales</h2>
      <MaterialTable data={materials ?? []} />
    </div>
  );
};

export default ListMaterials;
