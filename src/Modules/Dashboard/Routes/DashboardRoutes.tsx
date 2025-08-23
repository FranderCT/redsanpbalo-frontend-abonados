import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../../Routes";
import DashboardLayout from "../Layouts/DashboardLayout";

export const dashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'dashboard',
    component: DashboardLayout,
    beforeLoad: () => {
    const token = localStorage.getItem('token');
    if (!token) throw redirect({ to: '/auth/login' });
  },
})

export const dashboardIndexRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/",                    
  component: () => <h1>Dashboard</h1>,
});