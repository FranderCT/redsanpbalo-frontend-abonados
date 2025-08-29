import { useNavigate } from "@tanstack/react-router";
import g28 from '../../../Auth/Assets/g28.png';
import {
  Home,
  OctagonAlert,
  Settings,
  LogOut,
  FileText,
  Hammer,
  Bell,
} from "lucide-react";

const AsideDashboard = () => {
  const navigate = useNavigate();

  const goLogin = () => {
        navigate({ to: '/auth/login' }) // Navega a la ruta raíz
  }
  return (
    <div className="bg-[#F9F5FF] flex flex-col w-50 h-dvh justify-around">
      
      {/* Branding o logo */}
      <div className="flex flex-col items-center justify-center h-1/3 p-6">
        <img src={g28} alt="Logo ASADA" className="w-13 mb-3" />
        <h1 className="text-2xl text-[#091540] font-bold mb-10">RedSanPablo</h1>
      </div>
            {/* Navegación */}
      
        <nav className="flex flex-col justify-around h-1/2 text-sm text-gray-700">
          <button
            type="button"
            className="
              group relative z-10
              flex w-full items-center gap-3
              px-4 py-2
              transition-all
              hover:bg-[#091540] hover:text-white
              hover:translate-x-1 hover:shadow-md hover:shadow-[#091540]/40
            "
          >
            <Home className="size-[23px] transition-colors group-hover:text-white" />
            <span className="transition-colors">Principal</span>
          </button>
          <button
            type="button"
            className="
              group relative z-10
              flex w-full items-center gap-3
              px-4 py-2
              transition-all
              hover:bg-[#091540] hover:text-white
              hover:translate-x-1 hover:shadow-md hover:shadow-[#091540]/40
            "
          >
            <FileText className="size-[23px] transition-colors group-hover:text-white" />
            <span className="transition-colors">Solicitudes</span>
          </button>
          <button
            type="button"
            className="
              group relative z-10
              flex w-full items-center gap-3
              px-4 py-2
              transition-all
              hover:bg-[#091540] hover:text-white
              hover:translate-x-1 hover:shadow-md hover:shadow-[#091540]/40
            "
          >
            <Bell className="size-[23px] transition-colors group-hover:text-white" />
            <span className="transition-colors">Notificaciones</span>
          </button>
          <button
            type="button"
            className="
              group relative z-10
              flex w-full items-center gap-3
              px-4 py-2
              transition-all
              hover:bg-[#091540] hover:text-white
              hover:translate-x-1 hover:shadow-md hover:shadow-[#091540]/40
            "
          >
            <OctagonAlert className="size-[23px] transition-colors group-hover:text-white" />
            <span className="transition-colors">Reportes</span>
          </button>
          <button
            type="button"
            className="
              group relative z-10
              flex w-full items-center gap-3
              px-4 py-2
              transition-all
              hover:bg-[#091540] hover:text-white
              hover:translate-x-1 hover:shadow-md hover:shadow-[#091540]/40
            "
          >
            <Hammer className="size-[23px] transition-colors group-hover:text-white" />
            <span className="transition-colors">Proyectos</span>
          </button>
          <button
            type="button"
            className="
              group relative z-10
              flex w-full items-center gap-3
              px-4 py-2
              transition-all
              hover:bg-[#091540] hover:text-white
              hover:translate-x-1 hover:shadow-md hover:shadow-[#091540]/40
            "
          >
            <Settings className="size-[23px] transition-colors group-hover:text-white" />
            <span className="transition-colors">Ajustes</span>
          </button>
        </nav>
    

      {/* Opción de cerrar sesión abajo */}
      <div>
        <button onClick={goLogin}
            type="button"
            className="
              group relative z-10
              flex w-full items-center gap-3
              px-4 py-2
              transition-all
              hover:bg-[#F6132D] hover:text-white
              hover:translate-x-1 hover:shadow-md hover:shadow-[#091540]/40
            "
          >
            <LogOut className="size-[23px] text-[#F6132D] transition-colors group-hover:text-white" />
            <span className="transition-colors text-[#F6132D] group-hover:text-white">Cerrar sesión</span>
          </button>
        {/*<a
          href="#"
          className="flex items-center gap-3 text-sm text-[#F6132D] hover:text-red-800"
        >
          <LogOut size={23} /> Cerrar sesión
        </a>*/}
      </div>
    </div>
  );
};

export default AsideDashboard;