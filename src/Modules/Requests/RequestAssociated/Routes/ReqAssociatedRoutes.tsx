import { createRoute } from "@tanstack/react-router";
import { requestsRoute } from "../../Routes/RequestRoutes";
import ListReqAssociated from "../Pages/ListReqAssociated";


export const requestAssociatedRoute = createRoute({
    getParentRoute: ()=> requestsRoute,
    path: 'associated',
    component: ListReqAssociated
})


