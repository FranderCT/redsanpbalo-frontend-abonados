import { createRoute } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";
import ListSuppliers from "../Pages/ListSuppliers";
import NewSupplier from "../Pages/NewSupplier";
import ViewSuppliers from "../Pages/ViewSuppliers";


export const supplierRoute = createRoute({
    getParentRoute:() => dashboardRoute,
    path: 'supplier',
})

export const listSupplierRoute = createRoute({
    getParentRoute: () => supplierRoute,
    path: '/',
    component: ListSuppliers
})

export const newSupplierRoute = createRoute({
    getParentRoute: () => supplierRoute,
    path: 'new-supplier',
    component: NewSupplier
})


export const viewSuppliertRoute = createRoute({
  getParentRoute: () => supplierRoute,
  path: "$supplierId",
  component: ViewSuppliers,
});