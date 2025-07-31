import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../../routes";

export const dashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'dashboard',

})