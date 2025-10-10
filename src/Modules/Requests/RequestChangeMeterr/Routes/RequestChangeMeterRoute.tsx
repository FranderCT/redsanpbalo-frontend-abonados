import { createRoute } from "@tanstack/react-router";
import { dashboardRoute } from "../../../Dashboard/Routes/DashboardRoutes";
import ListReqChangeMeter from "../Pages/ListRequestChangeMeter";


export const requestChangeMeterRoute = createRoute({
    getParentRoute: ()=> dashboardRoute,
    path: 'ChangeMeter',
    component: ListReqChangeMeter
})