import { createRoute } from "@tanstack/react-router"
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes"
import ListLegalSuppliers from "../Pages/ListLegalSuppliers"

export const legalSupplierRoute = createRoute({
    getParentRoute: () => dashboardRoute,
    path: 'legal-suppliers'
})

export const listLegalSuppliers = createRoute({
    getParentRoute: () => legalSupplierRoute,
    path : '/',
    component: ListLegalSuppliers
})