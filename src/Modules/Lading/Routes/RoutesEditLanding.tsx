import { createRoute } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";
import EditLanding from "../Components/EditLanding";

export const editLandingRoute = createRoute ({
    getParentRoute : () => dashboardRoute,
    path: 'edit-landing',
    component: EditLanding
})