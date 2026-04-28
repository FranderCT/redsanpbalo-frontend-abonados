import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { requestsRoute } from "../../Routes/RequestRoutes";

export const requestSupervisionUserRoute = createRoute({
  getParentRoute: () => requestsRoute,
  path: "supervision-meter",
  component: lazyRouteComponent(() => import("../Pages/UserRequestSupervisionMeter")),
});

export const requestListSupervisionRoute = createRoute({
  getParentRoute: () => requestsRoute,
  path: "supervision-meter/admin",
  component: lazyRouteComponent(() => import("../Pages/ListReqSupervisionMeter")),
});
