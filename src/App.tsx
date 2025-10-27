import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './Routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
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
        <ToastContainer />
      </RoleProvider>
    </QueryClientProvider>
  );
}

export default App;
