import type { Supplier } from "../../Models/Supplier"


type Props = { data: Supplier }

const HeaderViewSupplier = ({ data }: Props) => {
  return (
    <div className="w-full h-[10%] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-3xl sm:text-4xl font-semibold leading-tight tracking-tight text-[#091540]">
        Proyecto {data?.Name ?? "Nombre de Proyecto no Encontrado."}
      </h1>

      {/* línea de acento opcional (solo borde, sin bg) */}
      <div className="mt-2 w-20 border-t" style={{ borderColor: "#1789FC" }} />

      <span className="mt-2 text-sm sm:text-base text-gray-600">
       Observe aquí toda la información del Proveedor.
      </span>
    </div>
  )
}

export default HeaderViewSupplier
