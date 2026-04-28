import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";

export const supplierRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "supplier",
});

export const listSupplierRoute = createRoute({
  getParentRoute: () => supplierRoute,
  path: "/",
  component: lazyRouteComponent(() => import("../Pages/ListSuppliers")),
});

export const newSupplierRoute = createRoute({
  getParentRoute: () => supplierRoute,
  path: "new-supplier",
  component: lazyRouteComponent(() => import("../Pages/NewSupplier")),
});

export const viewSuppliertRoute = createRoute({
  getParentRoute: () => supplierRoute,
  path: "$supplierId",
  component: lazyRouteComponent(() => import("../Pages/ViewSuppliers")),
});
