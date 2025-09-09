import { createRootRoute, createRoute } from "@tanstack/react-router";
import { registerRoute, loginRoute, resetPasswordRoute, forgotPasswordRoute } from "./Modules/Auth/Routes/authRoutes";
import { dashboardRoute, dashboardIndexRoute } from "./Modules/Dashboard/Routes/DashboardRoutes";
import { materialRoute, createMaterialRoute } from "./Modules/Materials/Routes/MaterialsRoutes";
import { settingsRoute, changeEmailRoute, changePasswordRoute } from "./Modules/SettingsUser/Routes/SettingsRoute";
import { usersRoute, userProfilewRoute, userProfileEditRoute } from "./Modules/Users/Routes/UsersRoutes";
import { categoryRoute } from "./Modules/Category/Routes/RoutesCategories";
import { uniteMeasureRoute } from "./Modules/UnitMeasure/routes/RoutesUnitMeasures";

export const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
})

export const routeTree = rootRoute.addChildren([
  indexRoute,
  registerRoute,
  loginRoute,
  resetPasswordRoute,
  forgotPasswordRoute,
  dashboardRoute.addChildren([
    usersRoute.addChildren([
      userProfilewRoute,
      userProfileEditRoute,
    ]),
    dashboardIndexRoute,
    materialRoute.addChildren([
      createMaterialRoute,
    ]),
    settingsRoute.addChildren([
      changePasswordRoute,
      changeEmailRoute
    ]),
    categoryRoute,
    uniteMeasureRoute
  ]),
]);
