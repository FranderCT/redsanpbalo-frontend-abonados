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
  return (
    <div className="bg-[#F9F5FF] flex flex-col w-50 h-dvh justify-between p-4">
      
      {/* Branding o logo */}
      <div className="flex flex-col justify-center h-1/4">
        <img></img>
        <h1 className="text-2xl text-[#091540] font-bold mb-10 ">RedSanPablo</h1>
      </div>
            {/* Navegación */}
      
        <nav className="flex flex-col justify-around h-1/2 text-sm text-gray-700">
          <a href="#" className="flex items-center gap-3 hover:text-black">
            <Home size={23} /> Principal
          </a>
          <a href="#" className="flex items-center gap-3 hover:text-black">
            <FileText size={23} /> Solicitudes
          </a>
          <a href="#" className="flex items-center gap-3 hover:text-black">
            <Bell size={23} /> Notificaciones
          </a>
          <a href="#" className="flex items-center gap-3 hover:text-black">
            <OctagonAlert size={23} /> Reportes
          </a>
          <a href="#" className="flex items-center gap-3 hover:text-black">
            <Hammer size={23} /> Proyectos
          </a>
          <a href="#" className="flex items-center gap-3 hover:text-black">
            <Settings size={23} /> Ajustes
          </a>
        </nav>
    

      {/* Opción de cerrar sesión abajo */}
      <div>
        <a
          href="#"
          className="flex items-center gap-3 text-sm text-[#F6132D] hover:text-red-800"
        >
          <LogOut size={23} /> Cerrar sesión
        </a>
      </div>
    </div>
  );
};

export default AsideDashboard;