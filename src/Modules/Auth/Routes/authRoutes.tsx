import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { rootRoute } from "../../../Routes";

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "login",
  component: lazyRouteComponent(() => import("../Pages/LoginUser")),
});

export const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "register",
  component: lazyRouteComponent(() => import("../Pages/RegisterAbonados")),
});

export const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "forgot-password",
  component: lazyRouteComponent(() => import("../Pages/ForgotPassword")),
});

export const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "reset-password",
  component: lazyRouteComponent(() => import("../Pages/ResetPassword")),
});
