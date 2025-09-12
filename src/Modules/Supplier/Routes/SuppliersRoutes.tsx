import { createRoute } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";
import ListSuppliers from "../Pages/ListSuppliers";

export const supplierRoute = createRoute({
    getParentRoute:() => dashboardRoute,
    path: 'suppliers',
    component: ListSuppliers
})