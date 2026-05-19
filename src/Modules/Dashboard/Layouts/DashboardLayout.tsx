import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import LiveReports from "../../../Sockets/LiveReports";
import { Can } from "../../Auth/Components/Can";
import { useRole } from "../../Auth/Components/RolesContext";
import HeaderDashboard from "../../Dashboard/Components/Header/HeaderDashboard";
import AsideDashboard from "../../Dashboard/Components/Sidebar/AsideDashboard";
import { useGetUserProfile } from "../../Users/Hooks/UsersHooks";
import type { Role } from "../../Users/Models/Roles";
import {
  canAccessDashboardPath,
  getDashboardHomeByRole,
  getDefaultActiveRole,
  isDashboardIndexPath,
  LIVE_REPORTS_ROLES,
} from "../utils/role-dashboard.utils";

const DashboardLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { activeRole, setActiveRole, setAvailableRoles } = useRole();
  const { UserProfile } = useGetUserProfile();

  const profileRoles = useMemo(
    () => (UserProfile?.Roles?.map((role) => role.Rolname) ?? []) as Role[],
    [UserProfile],
  );

  useEffect(() => {
    if (profileRoles.length === 0) {
      return;
    }

    setAvailableRoles((currentRoles) => {
      const sameLength = currentRoles.length === profileRoles.length;
      const sameValues = sameLength && currentRoles.every((role, index) => role === profileRoles[index]);
      return sameValues ? currentRoles : profileRoles;
    });

    const nextActiveRole =
      activeRole && profileRoles.includes(activeRole)
        ? activeRole
        : getDefaultActiveRole(profileRoles);

    if (nextActiveRole && nextActiveRole !== activeRole) {
      setActiveRole(nextActiveRole);
    }
  }, [activeRole, profileRoles, setActiveRole, setAvailableRoles]);

  useEffect(() => {
    if (!activeRole) {
      return;
    }

    const homePath = getDashboardHomeByRole(activeRole);

    if (isDashboardIndexPath(pathname)) {
      navigate({ to: homePath, replace: true });
      return;
    }

    if (!canAccessDashboardPath(activeRole, pathname)) {
      navigate({ to: homePath, replace: true });
    }
  }, [activeRole, navigate, pathname]);

  return (
    <div className="relative flex h-screen overflow-x-clip bg-background">
      <aside className="hidden md:flex flex-col shrink-0 bg-sidebar border-r border-sidebar-border text-sidebar-foreground">
        <AsideDashboard />
      </aside>

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border text-sidebar-foreground transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <AsideDashboard />
      </aside>

      {menuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setMenuOpen(false)}
          aria-hidden
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <HeaderDashboard menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <main className="min-w-0 flex-1 overflow-x-clip overflow-y-auto bg-background">
          <Outlet />
          <Can rule={{ any: [...LIVE_REPORTS_ROLES] }}>
            <LiveReports />
          </Can>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
