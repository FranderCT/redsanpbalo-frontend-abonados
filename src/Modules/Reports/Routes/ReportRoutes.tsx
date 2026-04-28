import { createRoute, Outlet, lazyRouteComponent } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";

export const reportRoutes = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "reports",
  component: Outlet,
});

export const reportIndexRoute = createRoute({
  getParentRoute: () => reportRoutes,
  path: "/",
  component: lazyRouteComponent(() => import("../Pages/ListReports")),
});

export const reportDetailRoute = createRoute({
  getParentRoute: () => reportRoutes,
  path: "$reportId",
  component: lazyRouteComponent(() => import("../Pages/ReportDetail/ReportDetailPage")),
});
