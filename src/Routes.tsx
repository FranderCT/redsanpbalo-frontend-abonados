import { createRootRoute, createRoute } from "@tanstack/react-router";
import { authRoute, loginRoute, registerAbonadoRoute, resetPasswordRoute,  } from "./Modules/Auth/Routes/authRoutes";
import { dashboardIndexRoute, dashboardRoute } from "./Modules/Dashboard/Routes/DashboardRoutes";
import { userProfileEditRoute, userProfileRoute, userProfileShowRoute, usersIndexRoute, usersRoute } from "./Modules/Users/Routes/UsersRoutes";

export const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  //component: HeroPage
})

export const routeTree = rootRoute.addChildren([
  indexRoute,
  authRoute.addChildren([
    registerAbonadoRoute,
    loginRoute,
    resetPasswordRoute
  ]),
  dashboardRoute.addChildren([
    usersRoute.addChildren([
      usersIndexRoute,
      userProfileRoute,
      userProfileEditRoute,
      userProfileShowRoute
    ]),
    dashboardIndexRoute,
  ]),
]);
