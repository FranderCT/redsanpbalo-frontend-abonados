import { createRoute } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";
import ListCategories from "../Pages/ListCategories";


export const categoryRoute = createRoute ({
    getParentRoute : () => dashboardRoute,
    path: 'categories',
    component: ListCategories
})