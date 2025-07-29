import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routes' // ajusta si está en otra carpeta

const router = createRouter({
  routeTree
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
