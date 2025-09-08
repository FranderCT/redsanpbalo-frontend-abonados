import { createRoute } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";
import ListUnitMeasures from "../Pages/ListUnitMeasures";


export const uniteMeasureRoute = createRoute ({
    getParentRoute : () => dashboardRoute,
    path: 'units-measure',
    component: ListUnitMeasures
})