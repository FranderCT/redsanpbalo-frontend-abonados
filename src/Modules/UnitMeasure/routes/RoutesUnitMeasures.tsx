import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";

export const uniteMeasureRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "units-measure",
  component: lazyRouteComponent(() => import("../Pages/ListUnitMeasures")),
});
