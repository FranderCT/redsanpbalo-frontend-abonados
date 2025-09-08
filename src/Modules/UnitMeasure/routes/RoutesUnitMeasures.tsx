import { createRoute } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";
import UnitMeasures from "../Pages/UnitMeasures";

export const uniteMeasureRoute = createRoute ({
    getParentRoute : () => dashboardRoute,
    path: 'units-measure',
    component: UnitMeasures
})