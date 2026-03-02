import { createRoute } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";
import ListPhysicalSuppliers from "../../PhysicalSupplier/Pages/ListPhysicalSuppliers";
import ListLegalSuppliers from "../../LegalSupplier/Pages/ListLegalSuppliers";

/**
 * Ruta padre de Proveedores (agrupa físicos y jurídicos).
 * URLs: /dashboard/suppliers/physical, /dashboard/suppliers/legal
 */
export const suppliersRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "suppliers",
});

export const physicalSuppliersRoute = createRoute({
  getParentRoute: () => suppliersRoute,
  path: "physical",
  component: ListPhysicalSuppliers,
});

export const legalSuppliersRoute = createRoute({
  getParentRoute: () => suppliersRoute,
  path: "legal",
  component: ListLegalSuppliers,
});
