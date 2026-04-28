import { createRoute, Outlet, lazyRouteComponent } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";
import { lazy, Suspense } from "react";

const EditLanding = lazy(() => import("../Components/EditLanding"));

const EditLandingWrapper = () => (
  <Suspense fallback={null}>
    <EditLanding>
      <Outlet />
    </EditLanding>
  </Suspense>
);

export const editLandingRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "edit-landing",
  component: EditLandingWrapper,
});

export const editLandingIndexRoute = createRoute({
  getParentRoute: () => editLandingRoute,
  path: "/",
  component: lazyRouteComponent(() => import("../FAQ/Pages/ListFAQs")),
});

export const editLandingFaqRoute = createRoute({
  getParentRoute: () => editLandingRoute,
  path: "faq",
  component: lazyRouteComponent(() => import("../FAQ/Pages/ListFAQs")),
});

export const editLandingServicesRoute = createRoute({
  getParentRoute: () => editLandingRoute,
  path: "services",
  component: lazyRouteComponent(() => import("../Services/Pages/ListServices")),
});
