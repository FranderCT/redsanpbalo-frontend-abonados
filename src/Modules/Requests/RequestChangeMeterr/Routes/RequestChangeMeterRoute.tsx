import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { requestsRoute } from "../../Routes/RequestRoutes";

export const requestUserChangeMeterRoute = createRoute({
  getParentRoute: () => requestsRoute,
  path: "change-meter",
  component: lazyRouteComponent(
    () => import("../Pages/UserRequestChangeMeter"),
    "UserRequestChangeMeter"
  ),
});

export const requestListChangeMeterRoute = createRoute({
  getParentRoute: () => requestsRoute,
  path: "change-meter/admin",
  component: lazyRouteComponent(() => import("../Pages/ListRequestChangeMeter")),
});
