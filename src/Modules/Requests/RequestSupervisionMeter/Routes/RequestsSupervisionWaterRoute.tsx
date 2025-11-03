import { createRoute } from "@tanstack/react-router";
import ListReqSupervisionMeter from "../Pages/ListReqSupervisionMeter";
import { requestsRoute } from "../../Routes/RequestRoutes";
import UserRequestSupervisionMeter from "../Pages/UserRequestSupervisionMeter";

export const requestSupervisionUserRoute = createRoute({
    getParentRoute: ()=> requestsRoute,
    path: 'supervision-meter',
    component: UserRequestSupervisionMeter
})

export const requestListSupervisionRoute = createRoute({
    getParentRoute : () => requestsRoute,
    path : 'supervision-meter/admin',
    component: ListReqSupervisionMeter,
})