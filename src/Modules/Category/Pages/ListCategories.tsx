import CategoryTable from "../Components/CategoryTable";
import { useGetAllCategory } from "../Hooks/CategoryHooks";


const ListCategories = () => {
  const {category, isLoading, error} = useGetAllCategory();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        Cargando Categorías...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Ocurrió un error al cargar las Categorías.
      </div>
    );
  }

  return (
    <div>
      <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-[#091540]">Lista de Categorías</h2>
      <CategoryTable data={category ?? []} />
    </div>
    </div>
  )
}

export default ListCategories