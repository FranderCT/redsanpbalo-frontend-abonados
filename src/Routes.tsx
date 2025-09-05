import { createRootRoute, createRoute } from "@tanstack/react-router";
import { authRoute, changePasswordRoute, forgotPasswordRoute, loginRoute, registerAbonadoRoute, resetPasswordRoute,  } from "./Modules/Auth/Routes/authRoutes";
import { dashboardIndexRoute, dashboardRoute } from "./Modules/Dashboard/Routes/DashboardRoutes";



export const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
})

export const routeTree = rootRoute.addChildren([
  indexRoute,
  registerAbonadoRoute,
  loginRoute,
  authRoute.addChildren([
    resetPasswordRoute,
    forgotPasswordRoute,
    changePasswordRoute
  ]),
  dashboardRoute.addChildren([
    usersRoute.addChildren([
      userProfilewRoute,
      userProfileEditRoute,
      listUsersRoute,
      changeEmailRoute
    ]),
    dashboardIndexRoute,
    materialRoute.addChildren([
      createMaterialRoute,
      materialTableRoute
    ])
  ]),
]);
