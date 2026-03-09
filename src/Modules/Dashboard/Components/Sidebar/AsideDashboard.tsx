import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import g28 from "../../../Auth/Assets/g28.png";
import { Home, Settings, LogOut, FileText, Hammer, Bell, UserCog, Forklift, MessageSquare, PencilOff } from "lucide-react";
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
    <div className="bg-sidebar h-dvh min-h-0 flex flex-col text-sidebar-foreground">
      {/* Branding */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4 flex-col">
        <img src={g28} alt="Logo ASADA" className="w-16 h-16 object-contain" />
        <h1 className="text-2xl text-sidebar-foreground font-bold leading-tight">RedSanPablo</h1>
      </div>

      {/* Línea separadora */}
      <div className="h-px bg-sidebar-border mx-4 mb-2" />

      {/* Navegación con scroll + scrollbar estilizado */}
      <nav className="flex-1 min-h-0 px-2 py-2 flex flex-col gap-2 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <Can rule={{ any: ["ADMIN","ABONADO", "GUEST", "JUNTA", "FONTANERO"] }}>
          <button
            onClick={() => navigate({ to: "/dashboard" })}
            className="group relative z-10 flex w-full items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring outline-none"
          >
            <Home className="size-[20px] transition-colors group-hover:text-sidebar-accent-foreground" />
            <span className="transition-colors">Principal</span>
          </button>
        </Can>
        
        {/* <Can rule={{ any: ["ABONADO", "GUEST"] }}>
          <button
            onClick={() => navigate({ to: "/dashboard/principal-user" })}
            className="group relative z-10 flex w-full items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring outline-none"
          >
            <Home className="size-[20px] transition-colors group-hover:text-sidebar-accent-foreground" />
            <span className="transition-colors">Principal</span>
          </button>
        </Can> */}
        
        <Can rule={{ any: ["ADMIN"] }}>
          <button
            onClick={() => navigate({ to: "/dashboard/edit-landing" })}
            className="group relative z-10 flex w-full items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring outline-none"
          >
            <PencilOff  className="size-[20px] transition-colors group-hover:text-sidebar-accent-foreground" />
            <span className="transition-colors">Pagina Informativa</span>
          </button>
        </Can>

        <Can rule={{ any: ["GUEST"] }}>
          <SidebarDropdown
            icon={<FileText className="size-[20px] transition-colors group-hover:text-sidebar-accent-foreground" />}
            label="Solicitudes"
            items={[
              { label: "Disponibilidad de Agua", onClick: () => navigate({ to: "/dashboard/requests/availability-water" }) },
            ]}
          />
        </Can>

        <Can rule={{ any: ["ABONADO"] }}>
          <SidebarDropdown
            icon={<FileText className="size-[20px] transition-colors group-hover:text-sidebar-accent-foreground" />}
            label="Solicitudes"
            items={[
              { label: "Disponibilidad de Agua", onClick: () => navigate({ to: "/dashboard/requests/availability-water" }) },
              { label: "Revisión de Medidor", onClick: () => navigate({ to: "/dashboard/requests/supervision-meter" }) },
              { label: "Cambio de Medidor", onClick: () => navigate({ to: "/dashboard/requests/change-meter" }) },
              { label: "Cambio Nombre de Medidor", onClick: () => navigate({ to: "/dashboard/requests/change-name-meter" }) },
              { label: "Asociado", onClick: () => navigate({ to: "/dashboard/requests/associated" }) },
            ]}
          />
        </Can>

        <Can rule={{ any: ["ADMIN", "JUNTA"] }}>
          <SidebarDropdown
            icon={<FileText className="size-[20px] transition-colors group-hover:text-sidebar-accent-foreground" />}
            label="Solicitudes"
            items={[
              { label: "Disponibilidad de Agua", onClick: () => navigate({ to: "/dashboard/requests/availability-water/admin" }) },
              { label: "Revisión de Medidor", onClick: () => navigate({ to: "/dashboard/requests/supervision-meter/admin" }) },
              { label: "Cambio de Medidor", onClick: () => navigate({ to: "/dashboard/requests/change-meter/admin" }) },
              { label: "Cambio Nombre de Medidor", onClick: () => navigate({ to: "/dashboard/requests/change-name-meter/admin" }) },
              { label: "Asociado", onClick: () => navigate({ to: "/dashboard/requests/associated/admin" }) },
            ]}
          />
        </Can>

        <Can rule={{ any: ["ADMIN", "JUNTA"] }}>
          <button
            onClick={() => navigate({ to: "/dashboard/users" })}
            className="group relative z-10 flex w-full items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring outline-none"
          >
            <UserCog className="size-[20px] transition-colors group-hover:text-sidebar-accent-foreground" />
            <span className="transition-colors">Usuarios</span>
          </button>
        </Can>

        <Can rule={{ all: ["ADMIN"] }}>
          <SidebarDropdown
            icon={<Forklift className="size-[20px] transition-colors group-hover:text-sidebar-accent-foreground" />}
            label="Productos"
            items={[
              { label: "Productos", onClick: () => navigate({ to: "/dashboard/products" }) },
              { label: "Materiales", onClick: () => navigate({ to: "/dashboard/materials" }) },
              { label: "Categorías", onClick: () => navigate({ to: "/dashboard/categories" }) },
              { label: "Unidad de medidas", onClick: () => navigate({ to: "/dashboard/units-measure" }) },
              { label: "Proveedores físicos", onClick: () => navigate({ to: "/dashboard/suppliers/physical" }) },
              { label: "Proveedores jurídicos", onClick: () => navigate({ to: "/dashboard/suppliers/legal" }) },
            ]}
          />
        </Can>

        <Can rule={{ any: ["ADMIN", "ABONADO", "GUEST"] }}>
          <button className="group relative z-10 flex w-full items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring outline-none">
            <Bell className="size-[20px] transition-colors group-hover:text-sidebar-accent-foreground" />
            <span className="transition-colors">Notificaciones</span>
          </button>
        </Can>

        <Can rule={{ any: ["ADMIN", "JUNTA"] }}>
          <button 
            className="group relative z-10 flex w-full items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring outline-none"
            onClick={() => navigate({ to: "/dashboard/projects" })}
          >
            <Hammer className="size-[20px] transition-colors group-hover:text-sidebar-accent-foreground" />
            <span className="transition-colors">Proyectos</span>
          </button>
        </Can>

        <Can rule={{ any: ["ADMIN", "JUNTA"] }}>
          <button 
            className="group relative z-10 flex w-full items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring outline-none"
            onClick={() => navigate({ to: "/dashboard/comments" })}
          >
            <MessageSquare className="size-[20px] transition-colors group-hover:text-sidebar-accent-foreground" />
            <span className="transition-colors">Comentarios</span>
          </button>
        </Can>

        <Can rule={{ any: ["ADMIN", "GUEST", "ABONADO"] }}>
          <SidebarDropdown
            icon={<Settings className="size-[20px] transition-colors group-hover:text-sidebar-accent-foreground" />}
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
    <label className="block text-xs text-muted-foreground mb-1 text-center">
      Rol activo
    </label>

    <div className="relative">
      <select
        value={activeRole || ''}
        onChange={(e) => setActiveRole(e.target.value)}
        className="
          w-full text-center
          bg-transparent
          text-sidebar-foreground font-medium
          border-none
          focus:outline-none
          focus:ring-0
          appearance-none
          cursor-pointer
          hover:text-sidebar-primary
          transition-colors
        "
      >
        {availableRoles.map((role) => (
          <option key={role} value={role} className="text-sidebar-foreground bg-sidebar">
            {role}
          </option>
        ))}
      </select>

      {/* Flecha hacia abajo */}
      <span className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
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
          className="group flex w-full items-center gap-3 px-4 py-2 rounded-md text-sm text-destructive transition-colors hover:bg-destructive hover:text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <LogOut className="size-[20px] transition-colors group-hover:text-primary-foreground" />
          <span className="transition-colors group-hover:text-primary-foreground">Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
};

export default AsideDashboard;