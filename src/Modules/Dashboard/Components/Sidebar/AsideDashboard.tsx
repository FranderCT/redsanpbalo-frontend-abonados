import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import g28 from "../../../Auth/Assets/g28.png";
import { Home, OctagonAlert, Settings, LogOut, FileText, Hammer, Bell, UserCog, Forklift, MessageSquare, UserCircle } from "lucide-react";
import { Can } from "../../../Auth/Components/Can";

import SidebarDropdown from "./SidebarDropdown";
import { useRole } from "../../../Auth/Components/RolesContext";
import { useGetUserProfile } from "../../../Users/Hooks/UsersHooks";

const AsideDashboard = () => {
  const navigate = useNavigate();
  const { activeRole, setActiveRole, setAvailableRoles } = useRole();
  const { UserProfile } = useGetUserProfile();

  // Configurar roles disponibles cuando se carga el perfil
useEffect(() => {
  // 1️⃣ Evita recalcular si UserProfile no tiene roles
  if (!UserProfile?.Roles) return;

  const newRoles = UserProfile.Roles.map(r => r.Rolname);

  // 2️⃣ Solo actualiza availableRoles si realmente cambió
  setAvailableRoles(prev => {
    const isSame =
      prev.length === newRoles.length &&
      prev.every((r, i) => r === newRoles[i]);
    return isSame ? prev : newRoles;
  });

  // 3️⃣ Solo cambia el rol activo si aún no hay uno válido
  if (!activeRole || !newRoles.includes(activeRole)) {
    const defaultRole =
      newRoles.includes("ADMIN")
        ? "ADMIN"
        : newRoles.includes("ABONADO")
        ? "ABONADO"
        : newRoles[0];

    // ⚠️ Evita setear el mismo valor repetidamente
    if (activeRole !== defaultRole) {
      setActiveRole(defaultRole);
    }
  }
}, [UserProfile, activeRole]);

  const goLogin = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('activeRole');
    navigate({ to: "/login" });
  };

  const availableRoles = UserProfile?.Roles?.map(r => r.Rolname) ?? [];
  const showRoleSelector = availableRoles.length > 1;

  return (
    <div className="bg-[#F9F5FF] h-dvh min-h-0 flex flex-col">
      {/* Branding */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4 flex-col">
        <img src={g28} alt="Logo ASADA" className="w-16 h-16 object-contain" />
        <h1 className="text-2xl text-[#091540] font-bold leading-tight">RedSanPablo</h1>
      </div>

      {/* Línea separadora */}
      <div className="h-px bg-black/10 mx-4 mb-2" />

      {/* Navegación con scroll + scrollbar estilizado */}
      <nav className="flex-1 min-h-0 px-2 py-2 flex flex-col gap-2 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <Can rule={{ any: ["ADMIN"] }}>
          <button
            onClick={() => navigate({ to: "/dashboard/principal-admin" })}
            className="group relative z-10 flex w-full items-center gap-3 px-4 py-2 transition-all hover:bg-[#091540] hover:text-white hover:translate-x-1 hover:shadow-md hover:shadow-[#091540]/40"
          >
            <Home className="size-[20px] transition-colors group-hover:text-white" />
            <span className="transition-colors">Principal</span>
          </button>
        </Can>
        
        <Can rule={{ any: ["ABONADO", "GUEST"] }}>
          <button
            onClick={() => navigate({ to: "/dashboard/principal-user" })}
            className="group relative z-10 flex w-full items-center gap-3 px-4 py-2 transition-all hover:bg-[#091540] hover:text-white hover:translate-x-1 hover:shadow-md hover:shadow-[#091540]/40"
          >
            <Home className="size-[20px] transition-colors group-hover:text-white" />
            <span className="transition-colors">Principal</span>
          </button>
        </Can>

        <Can rule={{ any: ["GUEST"] }}>
          <SidebarDropdown
            icon={<FileText className="size-[20px] transition-colors group-hover:text-white" />}
            label="Solicitudes"
            items={[
              { label: "Disponibilidad de Agua", onClick: () => navigate({ to: "/dashboard/requests/availability-water" }) },
            ]}
          />
        </Can>

        <Can rule={{ any: ["ABONADO"] }}>
          <SidebarDropdown
            icon={<FileText className="size-[20px] transition-colors group-hover:text-white" />}
            label="Solicitudes"
            items={[
              { label: "Disponibilidad de Agua", onClick: () => navigate({ to: "/dashboard/requests/availability-water" }) },
              { label: "Revisión de Medidor", onClick: () => navigate({ to: "/dashboard/requests/supervision-meter" }) },
              { label: "Cambio de Medidor", onClick: () => navigate({ to: "/dashboard/requests/change-meter" }) },
              { label: "Cambio Nombre de Medidor", onClick: () => navigate({ to: "/dashboard/requests/change-meter" }) },
              { label: "Asociado", onClick: () => navigate({ to: "/dashboard/requests/associated" }) },
            ]}
          />
        </Can>

        <Can rule={{ any: ["ADMIN"] }}>
          <SidebarDropdown
            icon={<FileText className="size-[20px] transition-colors group-hover:text-white" />}
            label="Solicitudes"
            items={[
              { label: "Disponibilidad de Agua", onClick: () => navigate({ to: "/dashboard/requests/availability-water/admin" }) },
              { label: "Revisión de Medidor", onClick: () => navigate({ to: "/dashboard/requests/supervision-meter/admin" }) },
              { label: "Cambio de Medidor", onClick: () => navigate({ to: "/dashboard/requests/change-meter/admin" }) },
              { label: "Cambio Nombre de Medidor", onClick: () => navigate({ to: "/dashboard/requests/change-meter/admin" }) },
              { label: "Asociado", onClick: () => navigate({ to: "/dashboard/requests/associated/admin" }) },
            ]}
          />
        </Can>

        <Can rule={{ all: ["ADMIN"] }}>
          <button
            onClick={() => navigate({ to: "/dashboard/users" })}
            className="group relative z-10 flex w-full items-center gap-3 px-4 py-2 transition-all hover:bg-[#091540] hover:text-white hover:translate-x-1 hover:shadow-md hover:shadow-[#091540]/40"
          >
            <UserCog className="size-[20px] transition-colors group-hover:text-white" />
            <span className="transition-colors">Usuarios</span>
          </button>
        </Can>

        <Can rule={{ all: ["ADMIN"] }}>
          <SidebarDropdown
            icon={<Forklift className="size-[20px] transition-colors group-hover:text-white" />}
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

        <Can rule={{ any: ["ADMIN", "ABONADO", "GUEST"] }}>
          <button className="group relative z-10 flex w-full items-center gap-3 px-4 py-2 transition-all hover:bg-[#091540] hover:text-white hover:translate-x-1 hover:shadow-md hover:shadow-[#091540]/40">
            <Bell className="size-[20px] transition-colors group-hover:text-white" />
            <span className="transition-colors">Notificaciones</span>
          </button>
        </Can>

        <Can rule={{ any: ["ADMIN", "ABONADO", "GUEST"] }}>
          <button 
            className="group relative z-10 flex w-full items-center gap-3 px-4 py-2 transition-all hover:bg-[#091540] hover:text-white hover:translate-x-1 hover:shadow-md hover:shadow-[#091540]/40"
            onClick={() => navigate({ to: "/dashboard/reports" })}
          >
            <OctagonAlert className="size-[20px] transition-colors group-hover:text-white" />
            <span className="transition-colors">Reportes</span>
          </button>
        </Can>

        <Can rule={{ any: ["ADMIN", "ABONADO"] }}>
          <button 
            className="group relative z-10 flex w-full items-center gap-3 px-4 py-2 transition-all hover:bg-[#091540] hover:text-white hover:translate-x-1 hover:shadow-md hover:shadow-[#091540]/40"
            onClick={() => navigate({ to: "/dashboard/projects" })}
          >
            <Hammer className="size-[20px] transition-colors group-hover:text-white" />
            <span className="transition-colors">Proyectos</span>
          </button>
        </Can>

        <Can rule={{ all: ["ADMIN"] }}>
          <button 
            className="group relative z-10 flex w-full items-center gap-3 px-4 py-2 transition-all hover:bg-[#091540] hover:text-white hover:translate-x-1 hover:shadow-md hover:shadow-[#091540]/40"
            onClick={() => navigate({ to: "/dashboard/comments" })}
          >
            <MessageSquare className="size-[20px] transition-colors group-hover:text-white" />
            <span className="transition-colors">Comentarios</span>
          </button>
        </Can>

        <Can rule={{ any: ["ADMIN", "GUEST", "ABONADO"] }}>
          <SidebarDropdown
            icon={<Settings className="size-[20px] transition-colors group-hover:text-white" />}
            label="Ajustes"
            items={[
              { label: "Cambio de contraseña", onClick: () => navigate({ to: "/dashboard/settings/change-password" }) },
              { label: "Cambio de correo", onClick: () => navigate({ to: "/dashboard/settings/change-email" }) },
              { label: "Editar perfil", onClick: () => navigate({ to: "/dashboard/users/edit" }) },
            ]}
          />
        </Can>
      </nav>

{/* Selector de Rol */}
{showRoleSelector && (
  <div className="w-full mt-3">
    <label className="block text-xs text-[#091540]/70 mb-1 text-center">
      Rol activo
    </label>

    <div className="relative">
      <select
        value={activeRole || ''}
        onChange={(e) => setActiveRole(e.target.value)}
        className="
          w-full text-center
          bg-transparent
          text-[#091540] font-medium
          border-none
          focus:outline-none
          focus:ring-0
          appearance-none
          cursor-pointer
          hover:text-[#1789FC]
          transition-colors
        "
      >
        {availableRoles.map((role) => (
          <option key={role} value={role} className="text-[#091540]">
            {role}
          </option>
        ))}
      </select>

      {/* Flecha hacia abajo */}
      <span className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 text-[#091540]/60 text-xs">
        ▼
      </span>
    </div>
  </div>
)}



      {/* Cerrar sesión siempre visible */}
      <div className="px-2 pb-4 pt-2 shrink-0">
        <button
          onClick={goLogin}
          type="button"
          className="group flex w-full items-center gap-3 px-4 py-2 transition-all hover:bg-[#F6132D] hover:text-white"
        >
          <LogOut className="size-[20px] text-[#F6132D] group-hover:text-white" />
          <span className="text-[#F6132D] group-hover:text-white">Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
};

export default AsideDashboard;