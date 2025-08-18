import { createRoute } from "@tanstack/react-router"
import { rootRoute } from "../../../routes"
import DashboardLayout from "../../Dashboard/Layouts/DashboardLayout"
import EditProfile from "../Components/ProfileUser/EditProfile"
import UserProfile from "../Pages/UserProfile/UserProfile"

export const dashboardUserRoute = createRoute({
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
})