import { createRootRoute } from "@tanstack/react-router";
import { authRoute, loginRoute, registerAbonadoRoute,  } from "./Modules/Auth/Routes/authRoutes";

export const rootRoute = createRootRoute();

export const routeTree = rootRoute.addChildren([
  authRoute.addChildren([
    registerAbonadoRoute,
    loginRoute
  ]),
]);
