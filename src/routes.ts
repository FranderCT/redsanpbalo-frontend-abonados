import { createRootRoute, createRoute } from "@tanstack/react-router";
import { authRoute, loginRoute, registerAbonadoRoute,  } from "./Modules/Auth/Routes/authRoutes";
import HeroPage from "./Modules/Lading/HeroPage";

export const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HeroPage
})

export const routeTree = rootRoute.addChildren([
  indexRoute,
  authRoute.addChildren([
    registerAbonadoRoute,
    loginRoute
  ]),
]);
