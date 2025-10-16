import { createRoute } from "@tanstack/react-router";
import ListReqSupervisionMeter from "../Pages/ListReqSupervisionMeter";
import { requestsRoute } from "../../Routes/RequestRoutes";

export const requestSupervisionRoute = createRoute({
    getParentRoute: ()=> requestsRoute,
    path: 'supervision-meter',
    component: ListReqSupervisionMeter
})