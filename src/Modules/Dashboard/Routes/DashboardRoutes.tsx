import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from "../../../Routes";
import DashboardLayout from "../Layouts/DashboardLayout";
import { ValidateToken } from "../../Auth/Services/AuthServices";
import PrincipalAdminDashboard from "../../DashboardPrincipal-Admin/Pages/PrincipalAdminDashboard";
import PrincipalUserDashboard from "../../DashboardPrincipal-Abonado/Pages/PrincipalUserDashboard";
import { useGetUserProfile } from "../../Users/Hooks/UsersHooks";

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
    const { UserProfile, isLoading, error } = useGetUserProfile();
    
    // Mostrar loading mientras se carga el perfil
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-lg">Cargando dashboard...</p>
          </div>
        </div>
      );
    }
    
    // Mostrar error si algo salió mal
    if (error) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
            <p className="text-red-600">Error al cargar tu perfil. Por favor, intenta nuevamente.</p>
            <button 
              onClick={() => window.location.href = '/login'}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Volver al login
            </button>
          </div>
        </div>
      );
    }
    
    // Verificar que el usuario tenga roles
    if (!UserProfile || !UserProfile.Roles || UserProfile.Roles.length === 0) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md">
            <svg className="w-12 h-12 text-yellow-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Usuario sin roles</h3>
            <p className="text-yellow-700">Tu cuenta no tiene roles asignados. Por favor contacta al administrador.</p>
          </div>
        </div>
      );
    }
    
    // Obtener el rol del usuario (primer rol si tiene múltiples)
    const userRole = UserProfile.Roles[0].Rolname.toUpperCase();
    
    console.log('Usuario:', UserProfile.Name);
    console.log('Rol:', userRole);
    
    // Renderizar el componente según el rol
    switch (userRole) {
      case 'ADMIN':
      case 'ADMIN':
        return <PrincipalAdminDashboard />;
        
      case 'ABONADO':
        return <PrincipalUserDashboard />;
        
      case 'FONTANERO':
        return <PrincipalUserDashboard />;
        
      default:
        console.warn(`Rol no reconocido: ${userRole}. Usando dashboard por defecto.`);
        return <PrincipalUserDashboard />;
    }
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

