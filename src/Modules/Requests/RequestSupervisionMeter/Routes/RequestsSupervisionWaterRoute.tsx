import { createRoute } from "@tanstack/react-router";
import { dashboardRoute } from "../../../Dashboard/Routes/DashboardRoutes";
import ListReqSupervisionMeter from "../Pages/ListReqSupervisionMeter";

export const requestSupervisionRoute = createRoute({
    getParentRoute: ()=> dashboardRoute,
    path: 'requestsSupervisionMeter',
    component: ListReqSupervisionMeter
})