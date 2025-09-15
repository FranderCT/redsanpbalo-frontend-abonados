import { createRoute } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";
import ListProjects from "../Pages/ListProjects";


export const projectRoute = createRoute ({
    getParentRoute : () => dashboardRoute,
    path: 'projects',
    component: ListProjects,
})