import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../../routes";
import DashboardLayout from "../Layouts/DashboardLayout";

export const dashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'dashboard',
    component: DashboardLayout
})