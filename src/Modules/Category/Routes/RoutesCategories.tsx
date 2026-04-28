import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";

export const categoryRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "categories",
  component: lazyRouteComponent(() => import("../Pages/ListCategories")),
});
