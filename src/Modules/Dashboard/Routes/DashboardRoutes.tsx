import { createRoute, lazyRouteComponent, redirect } from "@tanstack/react-router";
import { rootRoute } from "../../../Routes";
import { ValidateToken } from "../../Auth/Services/AuthServices";
import { disconnectAppSocket } from "@/Sockets/appSocket";

export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "dashboard",
  component: lazyRouteComponent(() => import("../Layouts/DashboardLayout")),
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
  component: lazyRouteComponent(
    () => import("../../DashboardPrincipal-Admin/Pages/PrincipalAdminDashboard")
  ),
});

export const dashboardBodPrincipalRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "principal-junta-directiva",
  component: lazyRouteComponent(
    () => import("../../DashboardPrincipal-Admin/Pages/PrincipalAdminDashboard")
  ),
});

export const dashboardPlumberPrincipalRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "principal-fontanero",
  component: lazyRouteComponent(
    () => import("../../DashboardPrincipal-Abonado/Pages/PrincipalPlumberDashboard")
  ),
});

export const dashboardUserPrincipalRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "principal-user",
  component: lazyRouteComponent(
    () => import("../../DashboardPrincipal-Abonado/Pages/PrincipalUserDashboard")
  ),
});
