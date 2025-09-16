import { createRoute } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";
import ListProjects from "../Pages/ListProjects";
import NewProject from "../Pages/NewProject";


export const projectRoute = createRoute ({
    getParentRoute : () => dashboardRoute,
    path: 'projects',
    component: ListProjects,
})

export const createProjectRoute = createRoute({
    getParentRoute: () => dashboardRoute,
    path: 'new-project',
    component: NewProject
})