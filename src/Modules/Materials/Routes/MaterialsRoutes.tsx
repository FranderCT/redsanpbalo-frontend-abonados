import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";

export const materialRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "materials",
  component: lazyRouteComponent(() => import("../Pages/ListMaterials")),
});
