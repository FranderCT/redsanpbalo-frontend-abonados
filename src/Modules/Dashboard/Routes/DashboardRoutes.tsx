import React from "react";
import { createRoute, redirect } from "@tanstack/react-router";
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
  component: () => {
    const [userComponent, setUserComponent] = React.useState<React.ComponentType | null>(null);
    
    React.useEffect(() => {
      const checkUserRole = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;
          
          const data = await ValidateToken(token);
          const user = data.user;
          
          // Verificar si el usuario tiene rol de admin
          const isAdmin = user.Roles?.some(role => 
            role.Rolname.toLowerCase().includes('admin') || 
            role.Rolname.toLowerCase().includes('administrador')
          );
          
          // Renderizar el componente correspondiente
          if (isAdmin) {
            setUserComponent(() => PrincipalAdminDashboard);
          } else {
            setUserComponent(() => PrincipalUserDashboard);
          }
        } catch (error) {
          console.error('Error validating user role:', error);
        }
      };
      
      checkUserRole();
    }, []);
    
    // Mostrar loading mientras se determina el rol
    if (!userComponent) {
      return (
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando dashboard...</p>
          </div>
        </div>
      );
    }
    
    const ComponentToRender = userComponent;
    return <ComponentToRender />;
  },
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

