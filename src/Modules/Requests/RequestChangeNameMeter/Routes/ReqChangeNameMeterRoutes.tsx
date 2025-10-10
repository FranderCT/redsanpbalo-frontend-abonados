import { createRoute } from "@tanstack/react-router";
import ListReqChangeNameMeter from "../../RequestChangeNameMeter/Pages/ListReqChangeNameMeter";
import { requestsRoute } from "../../Routes/RequestRoutes";


export const requestChangeNameMeterRoute = createRoute({
    getParentRoute: ()=> requestsRoute,
    path: 'change-name-meter',
    component: ListReqChangeNameMeter
})
