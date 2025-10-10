import { createRootRoute, createRoute } from "@tanstack/react-router";
import { registerRoute, loginRoute, resetPasswordRoute, forgotPasswordRoute } from "./Modules/Auth/Routes/authRoutes";
import { dashboardRoute, dashboardIndexRoute } from "./Modules/Dashboard/Routes/DashboardRoutes";
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
import {  requestAvailWaterRoute } from "./Modules/Requests/RequestAvailabilityWater/Routes/RequestsAvailWaterRoute";
import { requestSupervisionRoute } from "./Modules/Requests/RequestSupervisionMeter/Routes/RequestsSupervisionWaterRoute";
import { requestChangeMeterRoute } from "./Modules/Requests/RequestChangeMeterr/Routes/RequestChangeMeterRoute";
import { requestChangeNameMeterRoute } from "./Modules/Requests/RequestChangeNameMeter/Routes/ReqChangeNameMeterRoutes";
import { requestsRoute } from "./Modules/Requests/Routes/RequestRoutes";
import { requestAssociatedRoute } from "./Modules/Requests/RequestAssociated/Routes/ReqAssociatedRoutes";
import HeroPage from "./Modules/Lading/HeroPage";

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
      requestAvailWaterRoute,
      requestSupervisionRoute,
      requestChangeMeterRoute,
      requestChangeNameMeterRoute,
      requestAssociatedRoute
    ])
  ]),
  PhysicalSupplierRoute.addChildren([
    listPhysicalSuppliers
  ]),
  legalSupplierRoute.addChildren([
    listLegalSuppliers
  ])
  
]);
