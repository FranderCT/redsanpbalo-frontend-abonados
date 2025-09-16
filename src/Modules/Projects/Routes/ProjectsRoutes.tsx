import { createRoute } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";
import ListProjects from "../Pages/ListProjects";
import NewProject from "../Pages/NewProject";
import ViewProject from "../components/ViewProject";


export const projectRoute = createRoute ({
    getParentRoute : () => dashboardRoute,
    path: 'projects',
})

export const listProjectRoute = createRoute({
    getParentRoute: ()=> projectRoute,
    path : '/',
    component: ListProjects
})

export const createProjectRoute = createRoute({
    getParentRoute: () => projectRoute,
    path: 'new-project',
    component: NewProject
})

// /dashboard/projects/$projectId
export const viewProjectRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: "$projectId",
  component: ViewProject,
});