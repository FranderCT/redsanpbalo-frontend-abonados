import UnitMeasureTable from "../Components/UnitMeasureTable";
import { useGetAllUnitsMeasure } from "../Hooks/UnitMeasureHooks"


const ListUnitMeasures = () => {
  const {unit, isLoading, error} = useGetAllUnitsMeasure();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        Cargando Unidades...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Ocurrió un error al cargar las Unidades.
      </div>
    );
  }

  return (
    <div>
      <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-[#091540]">Lista de Unidades de Medida</h2>
      <UnitMeasureTable data={unit ?? []} />
    </div>
    </div>
  )
}

export default ListUnitMeasures