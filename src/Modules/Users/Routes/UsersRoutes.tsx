
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
import ListUsers from "../Pages/ListUsers";


export const usersRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "users",
  component: () => <Outlet />,
});

export const listUsersRoute = createRoute({
  getParentRoute : () => usersRoute,
  path : 'table',
  component: ListUsers,
})

export const userProfilewRoute = createRoute({
  getParentRoute: () => usersRoute,
  path: "profile",
  component: UserProfile,
});

export const userProfileEditRoute = createRoute({
  getParentRoute: () => usersRoute,
  path: "edit",
  component: EditProfile,
});
