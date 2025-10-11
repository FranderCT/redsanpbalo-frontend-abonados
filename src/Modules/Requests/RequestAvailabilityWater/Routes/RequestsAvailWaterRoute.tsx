import { createRoute } from "@tanstack/react-router";
import { requestsRoute } from "../../Routes/RequestRoutes";
import ListReqAvailWater from "../Pages/ListRequestAvailWater";
import UserRequestAvailWater from "../Pages/UserRequestAvailWater";

export const requestUserAvailWaterRoute = createRoute({
    getParentRoute : () => requestsRoute,
    path : 'availability-water',
    component:  UserRequestAvailWater,
})

export const requestListAvailWaterRoute = createRoute({
    getParentRoute : () => requestsRoute,
    path : 'availability-water/admin',
    component:  ListReqAvailWater,
})