import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './Routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';




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
      <RouterProvider router={router} />
      <ToastContainer /> 
    </QueryClientProvider>
  );
}

export default App;
