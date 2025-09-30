import { createRoute, Outlet } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";
import EditEmailUser from "../Components/EditEmailUser";
import EditPasswordUser from "../Components/EditPasswordUser";

    export const settingsRoute = createRoute({
    getParentRoute: () => dashboardRoute,
    path: "settings", 
    component: Outlet,
    });

    export const changePasswordRoute = createRoute({
    getParentRoute : () => settingsRoute,
    path : 'change-password',
    component:  EditPasswordUser,
    })

    export const changeEmailRoute = createRoute({
    getParentRoute : () => settingsRoute,
    path : 'change-email',
    component: EditEmailUser,
    })
