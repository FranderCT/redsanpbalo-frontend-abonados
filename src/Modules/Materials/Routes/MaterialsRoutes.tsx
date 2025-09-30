import { createRoute } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";
import CreateMaterialForm from "../Pages/CreateMaterialForm";
import ListMaterials from "../Pages/ListMaterials";

export const materialRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "materials", 
  component: ListMaterials
});

export const createMaterialRoute = createRoute({
    getParentRoute: () => materialRoute,
    path : '/',
    component: CreateMaterialForm,
})

