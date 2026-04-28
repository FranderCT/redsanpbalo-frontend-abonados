import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";

export const productsRoutes = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "products",
  component: lazyRouteComponent(() => import("../Pages/ListProducts")),
});
