import { createRoute } from "@tanstack/react-router";
import ListReqSupervisionMeter from "../Pages/ListReqSupervisionMeter";
import { requestsRoute } from "../../Routes/RequestRoutes";
import CreateRequestSupervisionMeter from "../../../Request-Abonados/Components/Supervision-Meter/CreateRequestSupervisionMeter";

export const requestSupervisionUserRoute = createRoute({
    getParentRoute: ()=> requestsRoute,
    path: 'supervision-meter',
    component: CreateRequestSupervisionMeter
})

export const requestListSupervisionRoute = createRoute({
    getParentRoute : () => requestsRoute,
    path : 'supervision-meter/admin',
    component: ListReqSupervisionMeter,
})