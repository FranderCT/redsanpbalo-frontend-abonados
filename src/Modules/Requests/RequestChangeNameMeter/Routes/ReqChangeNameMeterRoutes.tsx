import { createRoute } from "@tanstack/react-router";
import { requestsRoute } from "../../Routes/RequestRoutes";
import UserRequestChangeNameMeter from "../Pages/UserRequestChangeNameMeter";
import ListReqChangeNameMeter from "../Pages/ListReqChangeNameMeter";


export const requestUserChangeNameMeterRoute = createRoute({
    getParentRoute: ()=> requestsRoute,
    path: 'change-name-meter',
    component: UserRequestChangeNameMeter,
})

export const requestListChangeNameMeter= createRoute({
    getParentRoute : () => requestsRoute,
    path : 'change-name-meter/admin',
    component:  ListReqChangeNameMeter,
})
