import { createRoute } from "@tanstack/react-router";
import { dashboardRoute } from "../../../Dashboard/Routes/DashboardRoutes";
import ListReqAvailWater from "../Pages/ListRequestAvailWater";

export const requestAvailWaterRoute = createRoute({
    getParentRoute: ()=> dashboardRoute,
    path: 'requestsAvailWater',
    component: ListReqAvailWater
})


