import { createRoute, Outlet, lazyRouteComponent } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";

export const settingsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "settings",
  component: Outlet,
});

export const changePasswordRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: "change-password",
  component: lazyRouteComponent(() => import("../Components/EditPasswordUser")),
});

export const changeEmailRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: "change-email",
  component: lazyRouteComponent(() => import("../Components/EditEmailUser")),
});
