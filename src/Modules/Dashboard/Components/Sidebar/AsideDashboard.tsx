import { useNavigate } from "@tanstack/react-router";
import {
  Bell,
  FileText,
  Forklift,
  Hammer,
  Home,
  LogOut,
  MessageSquare,
  OctagonAlert,
  PencilOff,
  Settings,
  UserCog,
} from "lucide-react";
import g28 from "../../../Auth/Assets/g28.png";
import { Can } from "../../../Auth/Components/Can";
import { useRole } from "../../../Auth/Components/RolesContext";
import { useGetUserProfile } from "../../../Users/Hooks/UsersHooks";
import { Role } from "../../../Users/Models/Roles";
import {
  getDashboardHomeByRole,
  normalizeRole,
} from "../../utils/role-dashboard.utils";
import SidebarDropdown from "./SidebarDropdown";

const AsideDashboard = () => {
  const navigate = useNavigate();
  const { activeRole, setActiveRole, availableRoles } = useRole();
  const { UserProfile } = useGetUserProfile();

  const goLogin = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("activeRole");
    navigate({ to: "/login" });
  };

  const profileRoles = UserProfile?.Roles?.map((role) => role.Rolname) ?? [];
  const roleOptions = availableRoles.length > 0 ? availableRoles : profileRoles;
  const showRoleSelector = roleOptions.length > 1;

  return (
    <div className="bg-sidebar h-dvh min-h-0 flex flex-col text-sidebar-foreground">
      <div className="flex items-center gap-3 px-4 pt-6 pb-4 flex-col">
        <img src={g28} alt="Logo ASADA" className="w-16 h-16 object-contain" />
        <h1 className="text-2xl text-sidebar-foreground font-bold leading-tight">RedSanPablo</h1>
      </div>

      <div className="h-px bg-sidebar-border mx-4 mb-2" />

      <nav className="flex-1 min-h-0 px-2 py-2 flex flex-col gap-2 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <Can rule={{ any: [Role.ADMIN, Role.SUB, Role.GUEST, Role.BOD, Role.PLMBR, Role.ASSOS] }}>
          <button
            onClick={() => navigate({ to: getDashboardHomeByRole(activeRole) })}
            className="group relative z-10 flex w-full items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring outline-none"
          >
            <Home className="size-[20px] transition-colors group-hover:text-sidebar-accent-foreground" />
            <span className="transition-colors">Principal</span>
          </button>
        </Can>

        <Can rule={{ any: [Role.ADMIN] }}>
          <button
            onClick={() => navigate({ to: "/dashboard/edit-landing" })}
            className="group relative z-10 flex w-full items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring outline-none"
          >
            <PencilOff className="size-[20px] transition-colors group-hover:text-sidebar-accent-foreground" />
            <span className="transition-colors">Página Informativa</span>
          </button>
        </Can>

        <Can rule={{ any: [Role.GUEST] }}>
          <SidebarDropdown
            icon={<FileText className="size-[20px] transition-colors group-hover:text-sidebar-accent-foreground" />}
            label="Solicitudes"
            items={[
              { label: "Disponibilidad de Agua", onClick: () => navigate({ to: "/dashboard/requests/availability-water" }) },
            ]}
          />
        </Can>

        <Can rule={{ any: [Role.SUB] }}>
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

        <Can rule={{ any: [Role.ADMIN, Role.BOD] }}>
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

        <Can rule={{ any: [Role.ADMIN, Role.BOD] }}>
          <button
            onClick={() => navigate({ to: "/dashboard/users" })}
            className="group relative z-10 flex w-full items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring outline-none"
          >
            <UserCog className="size-[20px] transition-colors group-hover:text-sidebar-accent-foreground" />
            <span className="transition-colors">Usuarios</span>
          </button>
        </Can>

        <Can rule={{ all: [Role.ADMIN] }}>
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

        <Can rule={{ any: [Role.ADMIN, Role.SUB, Role.GUEST] }}>
          <button className="group relative z-10 flex w-full items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring outline-none">
            <Bell className="size-[20px] transition-colors group-hover:text-sidebar-accent-foreground" />
            <span className="transition-colors">Notificaciones</span>
          </button>
        </Can>

        <Can rule={{ none: [Role.GUEST, Role.SUB, Role.BOD] }}>
          <button
            className="group relative z-10 flex w-full items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring outline-none"
            onClick={() => navigate({ to: "/dashboard/reports" })}
          >
            <OctagonAlert className="size-[20px] transition-colors group-hover:text-sidebar-accent-foreground" />
            <span className="transition-colors">Reportes</span>
          </button>
        </Can>

        <Can rule={{ any: [Role.ADMIN, Role.BOD] }}>
          <button
            className="group relative z-10 flex w-full items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring outline-none"
            onClick={() => navigate({ to: "/dashboard/projects" })}
          >
            <Hammer className="size-[20px] transition-colors group-hover:text-sidebar-accent-foreground" />
            <span className="transition-colors">Proyectos</span>
          </button>
        </Can>

        <Can rule={{ any: [Role.ADMIN, Role.BOD] }}>
          <button
            className="group relative z-10 flex w-full items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring outline-none"
            onClick={() => navigate({ to: "/dashboard/comments" })}
          >
            <MessageSquare className="size-[20px] transition-colors group-hover:text-sidebar-accent-foreground" />
            <span className="transition-colors">Comentarios</span>
          </button>
        </Can>

        <Can rule={{ any: [Role.ADMIN, Role.GUEST, Role.SUB] }}>
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

      {showRoleSelector && (
        <div className="w-full mt-3">
          <label className="block text-xs text-muted-foreground mb-1 text-center">
            Rol activo
          </label>

          <div className="relative">
            <select
              value={activeRole ?? ""}
              onChange={(event) => {
                const nextRole = normalizeRole(event.target.value);
                if (nextRole) {
                  setActiveRole(nextRole);
                }
              }}
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
              {roleOptions.map((role) => (
                <option key={role} value={role} className="text-sidebar-foreground bg-sidebar">
                  {role}
                </option>
              ))}
            </select>

            <span className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
              v
            </span>
          </div>
        </div>
      )}

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
