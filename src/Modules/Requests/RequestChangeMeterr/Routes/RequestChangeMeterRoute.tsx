import { createRoute } from "@tanstack/react-router";
import ListReqChangeMeter from "../Pages/ListRequestChangeMeter";
import { requestsRoute } from "../../Routes/RequestRoutes";
import { UserRequestChangeMeter } from "../Pages/UserRequestChangeMeter";


export const requestUserChangeMeterRoute = createRoute({
    getParentRoute: ()=> requestsRoute,
    path: 'change-meter',
    component: UserRequestChangeMeter
})

export const requestListChangeMeterRoute = createRoute({
    getParentRoute : () => requestsRoute,
    path : 'change-meter/admin',
    component:  ListReqChangeMeter,
})