import { createRoute, Outlet } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";


    export const requestsRoute = createRoute({
    getParentRoute: () => dashboardRoute,
    path: "requests", 
    component: Outlet,
    });

    
