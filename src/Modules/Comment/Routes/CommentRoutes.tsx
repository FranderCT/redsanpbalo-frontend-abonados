import { createRoute } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";
import CommentsList from "../Components/ListComments/CommentList";

export const commentRoute = createRoute({
    getParentRoute: () => dashboardRoute,
    path: "comments", 
    component: CommentsList
});