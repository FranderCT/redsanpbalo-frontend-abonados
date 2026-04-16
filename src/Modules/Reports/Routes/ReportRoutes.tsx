import { createRoute, Outlet } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";
import ListReports from "../Pages/ListReports";
import ReportDetailPage from "../Pages/ReportDetail/ReportDetailPage";

// creemos la ruta con tasntack router
export const reportRoutes = createRoute({
    getParentRoute: () =>  dashboardRoute,
    path: "reports",
    component: () => <Outlet />,
})

export const reportIndexRoute = createRoute({
    getParentRoute: () => reportRoutes,
    path: "/",
    component: ListReports,
})

export const reportDetailRoute = createRoute({
    getParentRoute: () => reportRoutes,
    path: "$reportId",
    component: ReportDetailPage,
})
