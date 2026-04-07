import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from "../../../Routes";
import { ValidateToken } from "../../Auth/Services/AuthServices";
import PrincipalAdminDashboard from "../../DashboardPrincipal-Admin/Pages/PrincipalAdminDashboard";
import PrincipalUserDashboard from "../../DashboardPrincipal-Abonado/Pages/PrincipalUserDashboard";
import DashboardLayout from "../Layouts/DashboardLayout";
import { disconnectAppSocket } from "@/Sockets/appSocket";

export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "dashboard",
  component: DashboardLayout,
  beforeLoad: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      disconnectAppSocket();
      throw redirect({ to: "/login" });
    }

    try {
      await ValidateToken(token);
    } catch {
      disconnectAppSocket();
      localStorage.removeItem("token");
      throw redirect({ to: "/login" });
    }
  },
});

export const dashboardIndexRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/",
  component: () => null,
});

export const dashboardAdminPrincipalRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "principal-admin",
  component: PrincipalAdminDashboard,
});

export const dashboardUserPrincipalRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "principal-user",
  component: PrincipalUserDashboard,
});
