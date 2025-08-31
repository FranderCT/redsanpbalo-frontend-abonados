import { useNavigate } from "@tanstack/react-router";
import g28 from "../../../Auth/Assets/g28.png";
import { Home, OctagonAlert, Settings, LogOut, FileText, Hammer, Bell, User2 } from "lucide-react";

const listOptions = [
  { name: "Principal", to: "/dashboard", icon: Home },
  { name: "Solicitudes", to: "/solicitudes", icon: FileText },
  { name: "Notificaciones", to: "/notificaciones", icon: Bell },
  { name: "Reportes", to: "/reportes", icon: OctagonAlert },
  { name: "Proyectos", to: "/proyectos", icon: Hammer },
  { name: "Ajustes", to: "/ajustes", icon: Settings },
];

const AsideDashboard = () => {
  const navigate = useNavigate();

  const goLogin = () =>{
    navigate({to: "/login"});
  }

  return (
    <div className="bg-[#F9F5FF] h-dvh flex flex-col">
      {/* Branding */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4 flex-col">
        <img src={g28} alt="Logo ASADA" className="w-20 h-20 object-contain" />
        <h1 className="text-3xl text-[#091540] font-bold leading-tight">RedSanPablo</h1>
      </div>

      {/* Línea separadora */}
      <div className="h-px bg-black/10 mx-4 mb-2" />

      {/* Navegación */}
      <nav className="flex-1 px-2 py-2 flex flex-col gap-2">
        {listOptions.map(({ name, to, icon: Icon }) => (
          <button
            key={name}
            type="button"
            onClick={() => navigate({ to })}
            className="
              group relative z-10
              flex w-full items-center gap-3
              px-4 py-2
              transition-all
              hover:bg-[#091540] hover:text-white
              hover:translate-x-1 hover:shadow-md hover:shadow-[#091540]/40
            "
          >
            <Icon className="size-[23px] transition-colors group-hover:text-white" />
            <span className="transition-colors ">{name}</span>
          </button>
        ))}
      </nav>

      {/* Cerrar sesión pegado abajo */}
      <div className="px-2 pb-4 pt-2">
        <button
          onClick={goLogin}
          type="button"
          className="group flex w-full items-center gap-3 px-4 py-2 transition-all hover:bg-[#F6132D] hover:text-white"
        >
          <LogOut className="size-[23px] text-[#F6132D] group-hover:text-white" />
          <span className="text-[#F6132D] group-hover:text-white">Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
};

export default AsideDashboard;
