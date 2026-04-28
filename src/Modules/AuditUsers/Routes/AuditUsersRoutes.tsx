import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";

export const auditUsersRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "user-audit",
  component: lazyRouteComponent(() => import("../Pages/UserAuditPage")),
});
