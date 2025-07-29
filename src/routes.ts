import { createRootRoute } from "@tanstack/react-router";
import { authRoute, registerAbonadoRoute, registerUserRoute } from "./Modules/Auth/Routes/authRoutes";

export const rootRoute = createRootRoute();

export const routeTree = rootRoute.addChildren([
  authRoute.addChildren([
    registerAbonadoRoute,
    registerUserRoute
  ]),
]);
