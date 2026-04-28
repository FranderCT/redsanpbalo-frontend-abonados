import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";

export const commentRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "comments",
  component: lazyRouteComponent(() => import("../Pages/ListComments")),
});
