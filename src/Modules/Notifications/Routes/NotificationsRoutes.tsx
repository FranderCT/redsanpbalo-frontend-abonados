import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";

export const notificationsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "notifications",
  component: lazyRouteComponent(() => import("../Pages/NotificationsPage")),
});
