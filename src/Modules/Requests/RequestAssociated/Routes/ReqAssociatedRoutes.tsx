import { createRoute } from "@tanstack/react-router";
import { requestsRoute } from "../../Routes/RequestRoutes";
import ListReqAssociated from "../Pages/ListReqAssociated";
import { UserRequestAssociated } from "../Pages/UserRequestAssociated";


export const requestUserAssociatedRoute = createRoute({
    getParentRoute: ()=> requestsRoute,
    path: 'associated',
    component: UserRequestAssociated,
})

export const requestListAssociatedRoute = createRoute({
    getParentRoute : () => requestsRoute,
    path : 'associated/admin',
    component:  ListReqAssociated,
})