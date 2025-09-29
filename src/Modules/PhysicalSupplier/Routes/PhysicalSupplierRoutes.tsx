import { createRoute } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";
import ListPhysicalSuppliers from "../Pages/ListPhysicalSuppliers";

export const PhysicalSupplierRoute = createRoute({
    getParentRoute: () => dashboardRoute,
    path: 'physical-suppliers'
})

export const listPhysicalSuppliers = createRoute({
    getParentRoute: () => PhysicalSupplierRoute,
    path : '/',
    component: ListPhysicalSuppliers
})