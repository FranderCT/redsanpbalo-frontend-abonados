// src/Modules/Projects/Pages/ViewProject.tsx
import { useMemo } from "react";

import { viewSuppliertRoute } from "../Routes/SuppliersRoutes";
import { useGetSupplierById } from "../Hooks/SupplierHooks";
import HeaderViewSupplier from "../Components/ViewSupplier/HeaderViewSupplier";
import DetailsSupplierContainer from "../Components/ViewSupplier/DetailsSupplierContainer";


const ViewSuppliers = () => {
  // obtenemos el parámetro desde la ruta $projectId
  const { supplierId } = viewSuppliertRoute.useParams(); // <- string
  const id = useMemo(() => Number(supplierId), [supplierId]);

  const { supplier, isPending, error } =useGetSupplierById(
    Number.isFinite(id) && id > 0 ? id : undefined
  );

  if (!Number.isFinite(id) || id <= 0) {
    return <p className="p-6 text-red-600">ID de proyecto inválido.</p>;
  }
  if (isPending) return <p className="p-6">Cargando proyecto...</p>;
  if (error) return <p className="p-6 text-red-600">Error al cargar el proyecto.</p>;
  if (!supplier) return <p className="p-6">No se encontró el proyecto.</p>;

  return (
    <div className="p-6 space-y-2 text-[#091540] h-auto flex flex-col justify-center items-center">
      <HeaderViewSupplier data={supplier}/>
      <DetailsSupplierContainer data={supplier} />
    </div>
  );
};

export default ViewSuppliers;


