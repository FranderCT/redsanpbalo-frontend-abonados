import { createRoute } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";
import SettingsLayout from "../Layouts/SettingsLayout";
import EditEmailUser from "../Components/EditEmailUser";
import EditPasswordUser from "../Components/EditPasswordUser";

    export const settingsRoute = createRoute({
    getParentRoute: () => dashboardRoute,
    path: "settings",
    component: SettingsLayout,
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
