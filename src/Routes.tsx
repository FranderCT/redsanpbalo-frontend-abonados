import { createRootRoute, createRoute } from "@tanstack/react-router";
import { registerRoute, loginRoute, resetPasswordRoute, forgotPasswordRoute } from "./Modules/Auth/Routes/authRoutes";
import { dashboardRoute, dashboardIndexRoute, dashboardAdminPrincipalRoute, dashboardUserPrincipalRoute } from "./Modules/Dashboard/Routes/DashboardRoutes";
import { materialRoute, createMaterialRoute } from "./Modules/Materials/Routes/MaterialsRoutes";
import { settingsRoute, changeEmailRoute, changePasswordRoute } from "./Modules/SettingsUser/Routes/SettingsRoute";
import { usersRoute, userProfilewRoute, userProfileEditRoute, listUsersRoute } from "./Modules/Users/Routes/UsersRoutes";
import { categoryRoute } from "./Modules/Category/Routes/RoutesCategories";
import { uniteMeasureRoute } from "./Modules/UnitMeasure/routes/RoutesUnitMeasures";
import { productsRoutes } from "./Modules/Products/routes/ProductsRoutes";
import { listSupplierRoute, newSupplierRoute, supplierRoute, viewSuppliertRoute } from "./Modules/Supplier/Routes/SuppliersRoutes";
import { createProjectRoute, listProjectRoute, projectRoute, updateProjectRoute, viewProjectRoute } from "./Modules/Project/Routes/ProjectsRoutes";
import { listPhysicalSuppliers, PhysicalSupplierRoute } from "./Modules/PhysicalSupplier/Routes/PhysicalSupplierRoutes";
import { legalSupplierRoute, listLegalSuppliers } from "./Modules/LegalSupplier/Routes/LegalSupplierRoutes";
import {requestListSupervisionRoute, requestSupervisionUserRoute } from "./Modules/Requests/RequestSupervisionMeter/Routes/RequestsSupervisionWaterRoute";
import { requestsRoute } from "./Modules/Requests/Routes/RequestRoutes";
import { requestListAvailWaterRoute, requestUserAvailWaterRoute } from "./Modules/Requests/RequestAvailabilityWater/Routes/RequestsAvailWaterRoute";
import { requestListAssociatedRoute, requestUserAssociatedRoute } from "./Modules/Requests/RequestAssociated/Routes/ReqAssociatedRoutes";
import { requestListChangeMeterRoute, requestUserChangeMeterRoute } from "./Modules/Requests/RequestChangeMeterr/Routes/RequestChangeMeterRoute";
import { commentRoute } from "./Modules/Comment/Routes/CommentRoutes";
import { reportIndexRoute, reportRoutes } from "./Modules/Reports/Routes/ReportRoutes";
import { requestListChangeNameMeter, requestUserChangeNameMeterRoute } from "./Modules/Requests/RequestChangeNameMeter/Routes/ReqChangeNameMeterRoutes";
import HeroPage from "./Modules/Lading/HeroPage";
import { editLandingRoute } from "./Modules/Lading/Routes/RoutesEditLanding";


export const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HeroPage
})

export const routeTree = rootRoute.addChildren([
  indexRoute,
  registerRoute,
  loginRoute,
  resetPasswordRoute,
  forgotPasswordRoute,
  dashboardRoute.addChildren([
    dashboardAdminPrincipalRoute,
    dashboardUserPrincipalRoute,
    usersRoute.addChildren([
      userProfilewRoute,
      userProfileEditRoute,
      listUsersRoute
    ]),
    dashboardIndexRoute,
    materialRoute.addChildren([
      createMaterialRoute,
    ]),
    settingsRoute.addChildren([
      changePasswordRoute,
      changeEmailRoute
    ]),
    categoryRoute,
    uniteMeasureRoute,
    productsRoutes,
    supplierRoute.addChildren([
      listSupplierRoute,
      newSupplierRoute,
      viewSuppliertRoute
    ]),
    projectRoute.addChildren([
      listProjectRoute,
      createProjectRoute,
      viewProjectRoute,
      updateProjectRoute
    ]),
    requestsRoute.addChildren([
      requestUserAvailWaterRoute,
      requestListAvailWaterRoute,
      requestSupervisionUserRoute,
      requestListSupervisionRoute,
      requestUserChangeMeterRoute,
      requestListChangeMeterRoute,
      requestUserChangeNameMeterRoute,
      requestListChangeNameMeter,
      requestUserAssociatedRoute,
      requestListAssociatedRoute
    ]),
    commentRoute,
    editLandingRoute
  ]),
  PhysicalSupplierRoute.addChildren([
    listPhysicalSuppliers
  ]),
  legalSupplierRoute.addChildren([
    listLegalSuppliers
  ]),
  reportRoutes.addChildren([
    reportIndexRoute
  ])
]);
