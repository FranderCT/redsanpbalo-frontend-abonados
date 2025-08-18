import { createRoute } from "@tanstack/react-router"
import { rootRoute } from "../../../routes"
import Profile from "../Components/ProfileUser/Profile"
import EditProfile from "../Components/EditProfile"
import DashboardUserLayout from "../Layouts/DashboardUserLayout"

export const dashboardUserRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'dashboardUser',
    component: DashboardUserLayout
})

export const profileRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'profile',
    component: Profile
})

export const editProfileRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'editprofile',
    component: EditProfile
})