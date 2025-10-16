import { createRoute, Outlet, redirect } from "@tanstack/react-router";
import { rootRoute } from "../../../Routes";
import DashboardLayout from "../Layouts/DashboardLayout";
import { ValidateToken } from "../../Auth/Services/AuthServices";
import PrincipalAdminDashboard from "../../DashboardPrincipal-Admin/Pages/PrincipalAdminDashboard";
import PrincipalUserDashboard from "../../DashboardPrincipal-Abonado/Pages/PrincipalUserDashboard";

export const dashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'dashboard',
    component: DashboardLayout,
    beforeLoad: async () => {
    const token = localStorage.getItem('token');
    if (!token) throw redirect({ to: '/login' });

    try {
      const data = await ValidateToken(token);
      console.log('Usuario:', data.user);
    } catch {
      localStorage.removeItem('token');
      throw redirect({ to: '/login' });
    }
  },
})

export const dashboardIndexRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/",                    
  component: Outlet,
});

export const dashboardAdminPrincipalRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "principal-admin", 
  component: PrincipalAdminDashboard,
});

  export const dashboardUserPrincipalRoute = createRoute({
  getParentRoute : () => dashboardRoute,
  path : 'principal-user',
  component:  PrincipalUserDashboard,
})

