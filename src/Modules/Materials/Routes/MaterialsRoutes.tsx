import { createRoute } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";
import CreateMaterialForm from "../Pages/CreateMaterialForm";
import ListMaterials from "../Pages/ListMaterials";

export const materialRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "materials", 
});

export const createMaterialRoute = createRoute({
    getParentRoute: () => materialRoute,
    path : '/',
    component: CreateMaterialForm,
})

export const materialTableRoute = createRoute({
  getParentRoute : () => materialRoute,
  path : 'table',
  component: ListMaterials
})