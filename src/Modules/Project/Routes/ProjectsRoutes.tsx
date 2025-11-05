import { createRoute } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";
import ListProjects from "../Pages/ListProjects";
import NewProject from "../Pages/NewProject";
import UpdateProjectContainer from "../components/UpdateProject/UpdateProjectContainer";
import ViewProjectById from "../components/ViewProject/ViewProjectById";



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
  component: ViewProjectById,
});

export const updateProjectRoute = createRoute({
    getParentRoute: () => projectRoute,
    path: '$projectId/edit',
    component: UpdateProjectContainer
})