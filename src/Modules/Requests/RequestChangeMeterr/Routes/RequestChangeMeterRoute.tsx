import { createRoute } from "@tanstack/react-router";
import ListReqChangeMeter from "../Pages/ListRequestChangeMeter";
import { requestsRoute } from "../../Routes/RequestRoutes";


export const requestChangeMeterRoute = createRoute({
    getParentRoute: ()=> requestsRoute,
    path: 'change-meter',
    component: ListReqChangeMeter
})


