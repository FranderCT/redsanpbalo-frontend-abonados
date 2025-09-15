import { createRoute } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";


export const projectRoute = createRoute ({
    getParentRoute : () => dashboardRoute,
    path: 'projects',
    // component: ListProjects,
})