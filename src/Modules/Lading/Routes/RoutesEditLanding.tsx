import { createRoute, Outlet } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";
import EditLanding from "../Components/EditLanding";
import ListFAQs from "../FAQ/Pages/ListFAQs";
import ListServices from "../Services/Pages/ListServices";

export const editLandingRoute = createRoute ({
    getParentRoute : () => dashboardRoute,
    path: 'edit-landing',
    component: () => (
      <EditLanding>
        <Outlet />
      </EditLanding>
    ),
})

export const editLandingIndexRoute = createRoute({
    getParentRoute: () => editLandingRoute,
    path: "/",
    component: ListFAQs,
})

export const editLandingFaqRoute = createRoute({
    getParentRoute: () => editLandingRoute,
    path: "faq",
    component: ListFAQs,
})

export const editLandingServicesRoute = createRoute({
    getParentRoute: () => editLandingRoute,
    path: "services",
    component: ListServices,
})
