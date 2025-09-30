import { createRoute } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";
import ListRequestAvailWater from "../RequestAvailabilityWater/Pages/ListRequestAvailWater";

export const requestRoute = createRoute({
    getParentRoute: ()=> dashboardRoute,
    path: 'requests',
    component: ListRequestAvailWater
})