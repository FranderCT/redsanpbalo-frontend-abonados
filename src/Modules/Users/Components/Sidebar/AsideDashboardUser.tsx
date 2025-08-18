import {
  Home,
  OctagonAlert,
  Settings,
  LogOut,
  FileText,
  Hammer,
  Bell,
} from "lucide-react";

const AsideDashboardUser = () => {
  return (
    <div className="flex flex-col h-dvh justify-between p-4">
      
      {/* Branding o logo */}
      <div className="flex flex-col justify-center h-1/4">
        <img></img>
        <h1 className="text-2xl font-bold mb-10 ">RedSanpablo</h1>
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
          className="flex items-center gap-3 text-sm text-red-600 hover:text-red-800"
        >
          <LogOut size={23} /> Cerrar sesión
        </a>
      </div>
    </div>
  );
};

export default AsideDashboardUser;