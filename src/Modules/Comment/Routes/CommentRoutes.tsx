import { createRoute } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";
import ListComments from "../Pages/ListComments";

export const commentRoute = createRoute({
    getParentRoute: () => dashboardRoute,
    path: "comments", 
    component: ListComments
});
