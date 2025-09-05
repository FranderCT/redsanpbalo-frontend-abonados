import { createRootRoute, createRoute } from "@tanstack/react-router";
import { authRoute, forgotPasswordRoute, loginRoute, registerAbonadoRoute, resetPasswordRoute,  } from "./Modules/Auth/Routes/authRoutes";
import { dashboardIndexRoute, dashboardRoute } from "./Modules/Dashboard/Routes/DashboardRoutes";
import { materialRoute, createMaterialRoute, materialTableRoute } from "./Modules/Materials/Routes/MaterialsRoutes";
import { usersRoute, userProfilewRoute, userProfileEditRoute, listUsersRoute, changeEmailRoute } from "./Modules/Users/Routes/UsersRoutes";
import { changePasswordRoute, settingsRoute } from "./Modules/SettingsUser/Routes/SettingsRoute";



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
    forgotPasswordRoute
  ]),
  dashboardRoute.addChildren([
    usersRoute.addChildren([
      userProfilewRoute,
      userProfileEditRoute,
      listUsersRoute,
    ]),
    dashboardIndexRoute,
    materialRoute.addChildren([
      createMaterialRoute,
      materialTableRoute
    ]),
    settingsRoute.addChildren([
      changePasswordRoute,
      changeEmailRoute
    ]),
  ]),
]);
