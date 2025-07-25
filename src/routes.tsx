import { createRootRoute, createRoute } from "@tanstack/react-router";
import { Root } from "./components/root";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";

const rootRoute = createRootRoute({
    component: Root, // ✅ FIX: no usar función aquí
  });
  

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: Home,
});

const dashboardRoute = createRoute ({
    getParentRoute: () => rootRoute,
    path: "/dashboard",
    component: Dashboard,
})

export const routeTree = rootRoute.addChildren([indexRoute, dashboardRoute]);

