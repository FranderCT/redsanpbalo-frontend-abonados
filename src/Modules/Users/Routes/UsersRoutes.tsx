import { createRoute, Outlet, lazyRouteComponent } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";

export const usersRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "users",
  component: Outlet,
});

export const listUsersRoute = createRoute({
  getParentRoute: () => usersRoute,
  path: "/",
  component: lazyRouteComponent(() => import("../Pages/ListUsers")),
});

export const userProfilewRoute = createRoute({
  getParentRoute: () => usersRoute,
  path: "profile",
  component: lazyRouteComponent(() => import("../Pages/UserProfile/UserProfile")),
});

export const userProfileEditRoute = createRoute({
  getParentRoute: () => usersRoute,
  path: "edit",
  component: lazyRouteComponent(
    () => import("../Components/ProfileUser/EditProfileUser/EditProfile")
  ),
});

export const userDetailRoute = createRoute({
  getParentRoute: () => usersRoute,
  path: "$userId",
  component: lazyRouteComponent(() => import("../Pages/UserDetail/UserDetailPage")),
});
