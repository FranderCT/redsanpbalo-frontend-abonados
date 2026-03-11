import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './Routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { Toaster as SonnerToaster } from 'sonner';
import { RoleProvider } from './Modules/Auth/Components/RolesContext';

const sonnerToastOptions = {
  classNames: {
    toast: "bg-white text-slate-900 border-slate-200 shadow-lg",
    description: "text-slate-600",
  },
} as const;

const queryClient = new QueryClient();


const router = createRouter({
  routeTree,
  context: {
    queryClient, 
  },
});


declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RoleProvider>
        <RouterProvider router={router} />
        <SonnerToaster
          theme="light"
          position="top-center"
          toastOptions={sonnerToastOptions}
        />
        <ToastContainer />
      </RoleProvider>
    </QueryClientProvider>
  );
}

export default App;
