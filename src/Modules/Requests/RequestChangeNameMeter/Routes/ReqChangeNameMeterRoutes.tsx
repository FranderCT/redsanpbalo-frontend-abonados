import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { requestsRoute } from "../../Routes/RequestRoutes";

export const requestUserChangeNameMeterRoute = createRoute({
  getParentRoute: () => requestsRoute,
  path: "change-name-meter",
  component: lazyRouteComponent(() => import("../Pages/UserRequestChangeNameMeter")),
});

export const requestListChangeNameMeter = createRoute({
  getParentRoute: () => requestsRoute,
  path: "change-name-meter/admin",
  component: lazyRouteComponent(() => import("../Pages/ListReqChangeNameMeter")),
});
