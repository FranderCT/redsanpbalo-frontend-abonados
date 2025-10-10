import { useNavigate } from "@tanstack/react-router";
import g28 from "../../../Auth/Assets/g28.png";
import { Home, OctagonAlert, Settings, LogOut, FileText, Hammer, Bell, UserCog, Forklift } from "lucide-react";
import { Can } from "../../../Auth/Components/Can";
import SidebarDropdown from "./SidebarDropdown";

const AsideDashboard = () => {
  const navigate = useNavigate();

  const goLogin = () => {
    localStorage.removeItem('token')
    navigate({ to: "/login" });
  };

  return (
    // min-h-0 permite que overflow-y-auto funcione dentro del flex container
    <div className="bg-[#F9F5FF] h-dvh min-h-0 flex flex-col">
      {/* Branding */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4 flex-col">
        <img src={g28} alt="Logo ASADA" className="w-20 h-20 object-contain" />
        <h1 className="text-3xl text-[#091540] font-bold leading-tight font">RedSanPablo</h1>
      </div>

      {/* Línea separadora */}
      <div className="h-px bg-black/10 mx-4 mb-2" />

      {/* Navegación con scroll + scrollbar estilizado */}
      <nav className="flex-1 min-h-0 px-2 py-2 flex flex-col gap-2 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <Can rule={{ any: ["ADMIN", "GUEST", "ABONADO"] }}>
          <button
            onClick={() => navigate({ to: "/dashboard" })}
            className="group relative z-10 flex w-full items-center gap-3 px-4 py-2 transition-all hover:bg-[#091540] hover:text-white hover:translate-x-1 hover:shadow-md hover:shadow-[#091540]/40"
          >
            <Home className="size-[23px] transition-colors group-hover:text-white" />
            <span className="transition-colors">Principal</span>
          </button>
        </Can>

        <Can rule={{ any: ["ADMIN", "ABONADO"] }}>
          <SidebarDropdown
            icon={<FileText className="size-[23px] transition-colors group-hover:text-white" />}
            label="Solicitudes"
            items={[
              { label: "Disponibilidad de Agua", onClick: () => navigate({ to: "/dashboard/requests/availability-water" }) },
              { label: "Revisión de Medidor", onClick: () => navigate({ to: "/dashboard/requests/supervision-meter" }) },
              { label: "Cambio de Medidor", onClick: () => navigate({ to: "/dashboard/requests/change-meter" }) },
              { label: "Cambio Nombre de Medidor", onClick: () => navigate({ to: "/dashboard/requests/change-name-meter" }) },
              //{ label: "Asociado", onClick: () => navigate({ to: "/dashboard/requests" }) },
            ]}
          />
          {/* <button 
            onClick={() => navigate({ to: "/dashboard/requests" })}
            className="group relative z-10 flex w-full items-center gap-3 px-4 py-2 transition-all hover:bg-[#091540] hover:text-white hover:translate-x-1 hover:shadow-md hover:shadow-[#091540]/40"
          >
            <FileText className="size-[23px] transition-colors group-hover:text-white" />
            <span className="transition-colors">Solicitudes</span>
          </button> */}
        </Can>

        <Can rule={{ all: ["ADMIN"] }}>
          <button
            onClick={() => navigate({ to: "/dashboard/users" })}
            className="group relative z-10 flex w-full items-center gap-3 px-4 py-2 transition-all hover:bg-[#091540] hover:text-white hover:translate-x-1 hover:shadow-md hover:shadow-[#091540]/40"
          >
            <UserCog className="size-[23px] transition-colors group-hover:text-white" />
            <span className="transition-colors">Usuarios</span>
          </button>
        </Can>

        {/* Dropdown Productos */}
        <Can rule={{ all: ["ADMIN"] }}>
          <SidebarDropdown
            icon={<Forklift className="size-[23px] transition-colors group-hover:text-white" />}
            label="Productos"
            items={[
              { label: "Productos", onClick: () => navigate({ to: "/dashboard/products" }) },
              { label: "Materiales", onClick: () => navigate({ to: "/dashboard/materials" }) },
              { label: "Categorías", onClick: () => navigate({ to: "/dashboard/categories" }) },
              { label: "Unidad de medidas", onClick: () => navigate({ to: "/dashboard/units-measure" }) },
              { label: "Proveedor", onClick: () => navigate({ to: "/dashboard/legal-suppliers" }) },
            ]}
          />
        </Can>

        <Can rule={{ any: ["ADMIN", "ABONADO"] }}>
          <button className="group relative z-10 flex w-full items-center gap-3 px-4 py-2 transition-all hover:bg-[#091540] hover:text-white hover:translate-x-1 hover:shadow-md hover:shadow-[#091540]/40">
            <Bell className="size-[23px] transition-colors group-hover:text-white" />
            <span className="transition-colors">Notificaciones</span>
          </button>
        </Can>

        <Can rule={{ any: ["ADMIN", "ABONADO"] }}>
          <button className="group relative z-10 flex w-full items-center gap-3 px-4 py-2 transition-all hover:bg-[#091540] hover:text-white hover:translate-x-1 hover:shadow-md hover:shadow-[#091540]/40">
            <OctagonAlert className="size-[23px] transition-colors group-hover:text-white" />
            <span className="transition-colors">Reportes</span>
          </button>
        </Can>

        <Can rule={{ any: ["ADMIN", "ABONADO"] }}>
          <button className="group relative z-10 flex w-full items-center gap-3 px-4 py-2 transition-all hover:bg-[#091540] hover:text-white hover:translate-x-1 hover:shadow-md hover:shadow-[#091540]/40"
            onClick={() => navigate({ to: "/dashboard/projects" })}>
            <Hammer className="size-[23px] transition-colors group-hover:text-white" />
            <span className="transition-colors">Proyectos</span>
          </button>
        </Can>

        {/* Dropdown Ajustes */}
        <Can rule={{ any: ["ADMIN", "GUEST", "ABONADO"] }}>
          <SidebarDropdown
            icon={<Settings className="size-[23px] transition-colors group-hover:text-white" />}
            label="Ajustes"
            items={[
              { label: "Cambio de contraseña", onClick: () => navigate({ to: "/dashboard/settings/change-password" }) },
              { label: "Cambio de correo", onClick: () => navigate({ to: "/dashboard/settings/change-email" }) },
              { label: "Editar perfil", onClick: () => navigate({ to: "/dashboard/users/edit" }) },
            ]}
          />
        </Can>
      </nav>

      {/* Cerrar sesión siempre visible */}
      <div className="px-2 pb-4 pt-2 shrink-0">
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
