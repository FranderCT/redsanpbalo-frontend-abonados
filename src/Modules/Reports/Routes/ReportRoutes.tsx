import { createRoute } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";
import ListReports from "../Pages/ListReports";

// creemos la ruta con tasntack router 
export const reportRoutes = createRoute({
    getParentRoute: () =>  dashboardRoute,
    path: "reports",
})

export const reportIndexRoute = createRoute({
    getParentRoute: () => reportRoutes,
    path: "/",
    component: ListReports,
})
