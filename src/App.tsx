import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css'
import RegisterUser from './components/RegisterUser';

const queryClient = new QueryClient();

export function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <RegisterUser></RegisterUser>
    </QueryClientProvider>
  )
}

export default App
