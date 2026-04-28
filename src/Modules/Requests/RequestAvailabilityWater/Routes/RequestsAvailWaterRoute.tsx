import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { requestsRoute } from "../../Routes/RequestRoutes";

export const requestUserAvailWaterRoute = createRoute({
  getParentRoute: () => requestsRoute,
  path: "availability-water",
  component: lazyRouteComponent(
    () => import("../../../Request-Abonados/Pages/UserRequestAvailWater")
  ),
});

export const requestListAvailWaterRoute = createRoute({
  getParentRoute: () => requestsRoute,
  path: "availability-water/admin",
  component: lazyRouteComponent(() => import("../Pages/ListRequestAvailWater")),
});
