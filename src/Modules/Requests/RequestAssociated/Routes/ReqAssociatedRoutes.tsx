import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { requestsRoute } from "../../Routes/RequestRoutes";

export const requestUserAssociatedRoute = createRoute({
  getParentRoute: () => requestsRoute,
  path: "associated",
  component: lazyRouteComponent(
    () => import("../Pages/UserRequestAssociated"),
    "UserRequestAssociated"
  ),
});

export const requestListAssociatedRoute = createRoute({
  getParentRoute: () => requestsRoute,
  path: "associated/admin",
  component: lazyRouteComponent(() => import("../Pages/ListReqAssociated")),
});
