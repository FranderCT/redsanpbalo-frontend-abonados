import { createRoute } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";
import ListMaterials from "../Pages/ListMaterials";

export const materialRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "materials", 
  component: ListMaterials
});
