
/*export const dashboardUserRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'dashboardUser',
    component: DashboardLayout
})

export const profileRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'profile',
    component: UserProfile
})

export const editProfileRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'editprofile',
    component: EditProfile
})*/

import { createRoute, Outlet } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";
import UserProfile from "../Pages/UserProfile/UserProfile";
import EditProfile from "../Components/ProfileUser/EditProfileUser/EditProfile";

export const usersRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "users",
  component: () => <Outlet />,
});

export const usersIndexRoute = createRoute({
  getParentRoute: () => usersRoute,
  path: "/",
  component: () => <h1>hola</h1>,
});

export const userProfileRoute = createRoute({
  getParentRoute: () => usersRoute,
  path: "profile",
  component: () => <Outlet />,
});

export const userProfileShowRoute = createRoute({
  getParentRoute: () => userProfileRoute,
  path: "/",
  component: UserProfile,
});

export const userProfileEditRoute = createRoute({
  getParentRoute: () => userProfileRoute,
  path: "edit",
  component: EditProfile
});
