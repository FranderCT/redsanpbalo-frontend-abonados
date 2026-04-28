import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";

export const suppliersRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "suppliers",
});

export const physicalSuppliersRoute = createRoute({
  getParentRoute: () => suppliersRoute,
  path: "physical",
  component: lazyRouteComponent(
    () => import("../../PhysicalSupplier/Pages/ListPhysicalSuppliers")
  ),
});

export const legalSuppliersRoute = createRoute({
  getParentRoute: () => suppliersRoute,
  path: "legal",
  component: lazyRouteComponent(
    () => import("../../LegalSupplier/Pages/ListLegalSuppliers")
  ),
});
