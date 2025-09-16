import type { Project } from "../../Models/Project"

type Props = {
  data : Project;
}

const HeaderViewProject = ({data} : Props) => {
  return (
    <div className="flex justify-center h-[10%]  w-full">
        <h1 className="text-4xl sm:text-4xl font-semibold text-[#091540] mb-1">
          Proyecto {data?.Name ?? "Nombre de Proyecto no Encontrado."}
        </h1>
    </div>
  )
}

export default HeaderViewProject