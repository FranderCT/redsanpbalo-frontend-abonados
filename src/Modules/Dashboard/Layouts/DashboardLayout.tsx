import { useEffect, useState } from "react";
import AsideDashboard from "../../Dashboard/Components/Sidebar/AsideDashboard";
import HeaderDashboard from "../../Dashboard/Components/Header/HeaderDashboard";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import LiveReports from "../../../Sockets/LiveReports";
import { Can } from "../../Auth/Components/Can";
import { useRole } from "../../Auth/Components/RolesContext";

const DashboardLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { activeRole } = useRole();

  useEffect(() => {
    if (!activeRole) return;

    const isAdmin = activeRole === "ADMIN" || activeRole === "JUNTA";

    // define cuál es el "home" por rol
    const home = isAdmin ? "/dashboard/principal-admin" : "/dashboard/principal-user";

    // si estás en una ruta que no corresponde a tu rol activo -> redirect
    // (esto es básico, luego lo puedes refinar por secciones)
    const isInAdminArea = pathname.includes("/dashboard/principal-admin") || pathname.includes("/dashboard/users");
    const isInUserArea = pathname.includes("/dashboard/principal-user");

    if (isAdmin && isInUserArea) {
      navigate({ to: home, replace: true });
    } else if (!isAdmin && isInAdminArea) {
      navigate({ to: home, replace: true });
    }

    // Si estás en /dashboard (index) también te manda al home correcto
    if (pathname === "/dashboard" || pathname === "/dashboard/") {
      navigate({ to: home, replace: true });
    }
  }, [activeRole, pathname, navigate]);

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      <aside className="hidden md:flex flex-col shrink-0 bg-sidebar border-r border-sidebar-border text-sidebar-foreground">
        <AsideDashboard />
      </aside>

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border text-sidebar-foreground transform transition-transform duration-300 
        ${menuOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}
      >
        <AsideDashboard />
      </aside>

      {(menuOpen || profileOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setMenuOpen(false);
            setProfileOpen(false);
          }}
        />
      )}

      <div className="flex flex-col flex-1">
        <HeaderDashboard
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          profileOpen={profileOpen}
          setProfileOpen={setProfileOpen}
        />
        <main className="flex-1 overflow-y-auto bg-background">
          <Outlet />
          <Can rule={{ any: ["ADMIN", "FONTANERO"] }}>
            <LiveReports />
          </Can>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
