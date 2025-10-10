import { createRoute } from "@tanstack/react-router";
import { requestsRoute } from "../../Routes/RequestRoutes";
import ListReqAvailWater from "../Pages/ListRequestAvailWater";


// export const requestAvailWaterRoute = createRoute({
//     getParentRoute: ()=> dashboardRoute,
//     path: 'AvailabilityWater',
//     component: ListReqAvailWater
// })

export const requestAvailWaterRoute = createRoute({
    getParentRoute : () => requestsRoute,
    path : 'availability-water',
    component:  ListReqAvailWater,
    })



