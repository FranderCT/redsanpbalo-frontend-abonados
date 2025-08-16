import { createRootRoute, createRoute } from "@tanstack/react-router";
import { authRoute, forgotPasswordRoute, loginRoute, registerAbonadoRoute,  } from "./Modules/Auth/Routes/authRoutes";
import HeroPage from "./Modules/Lading/HeroPage";
import { dashboardRoute } from "./Modules/Dashboard/Routes/DashboardRoutes";
import { dashboardUserRoute, editProfileRoute, profileRoute } from "./Modules/Users/Routes/DashboardUserRoutes";

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
    loginRoute,
    forgotPasswordRoute
  ]),
  dashboardRoute.addChildren({
    
  }),
  dashboardUserRoute.addChildren({
    profileRoute,
    editProfileRoute
  })
]);
