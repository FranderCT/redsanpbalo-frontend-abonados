import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './Routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { Toaster } from './Components/ui/sonner';
import { RoleProvider } from './Modules/Auth/Components/RolesContext';




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
        <Toaster
          theme="light"
          position="top-center"
          toastOptions={{
            classNames: {
              toast: "bg-white text-slate-900 border-slate-200 shadow-lg",
              description: "text-slate-600",
            },
          }}
        />
        <ToastContainer />
      </RoleProvider>
    </QueryClientProvider>
  );
}

export default App;
