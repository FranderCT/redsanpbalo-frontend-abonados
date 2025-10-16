import { createRoute } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";
import ListProducts from "../Pages/ListProducts";

export const productsRoutes = createRoute({
    getParentRoute: ()=> dashboardRoute,
    path: 'products',
    component: ListProducts
})

