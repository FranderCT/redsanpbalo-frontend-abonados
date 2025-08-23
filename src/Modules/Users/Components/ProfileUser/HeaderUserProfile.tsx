import { useNavigate } from "@tanstack/react-router";


const HeaderUserProfile = () => {

  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#091540]">Perfil</h1>
          <p className="text-[#091540]/70 text-md">
            Observe todos los detalles de su perfil aquí
          </p>
        </div>
        <button 
          type="button"
          className="flex items-center gap-2 text-[#F6132D] text-xl px-3 py-1 rounded-sm border-solid border-3 border-[#F6132D] hover:bg-red-200 mt-3 md:mt-0"
          onClick={() => navigate({ to: "/dashboard/users/profile/edit" })}
        >
          {/* ícono lápiz */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M3 17.25V21h3.75L18.81 8.94l-3.75-3.75L3 17.25z" stroke="#F6132D" />
            <path d="M14.06 5.19l3.75 3.75" stroke="#F6132D" />
          </svg>
          Editar
        </button>
    </div>
  )
}

export default HeaderUserProfile