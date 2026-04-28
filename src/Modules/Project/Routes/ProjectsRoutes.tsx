import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";

export const projectRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "projects",
});

export const listProjectRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: "/",
  component: lazyRouteComponent(() => import("../Pages/ListProjects")),
});

export const createProjectRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: "new-project",
  component: lazyRouteComponent(() => import("../Pages/NewProject")),
});

export const viewProjectRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: "$projectId",
  component: lazyRouteComponent(() => import("../Pages/ViewProject")),
});

export const updateProjectRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: "$projectId/edit",
  component: lazyRouteComponent(
    () => import("../components/UpdateProject/UpdateProjectContainer")
  ),
});
