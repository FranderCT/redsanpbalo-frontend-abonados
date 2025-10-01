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
import { createProjectRoute, listProjectRoute, projectRoute, viewProjectRoute } from "./Modules/Project/Routes/ProjectsRoutes";
import { listPhysicalSuppliers, PhysicalSupplierRoute } from "./Modules/PhysicalSupplier/Routes/PhysicalSupplierRoutes";
import { legalSupplierRoute, listLegalSuppliers } from "./Modules/LegalSupplier/Routes/LegalSupplierRoutes";
import HeroPage from "./Modules/Lading/HeroPage";
import { requestRoute } from "./Modules/Requests/Routes/RequestsRoutes";

export const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  //component: HeroPage
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
    requestRoute,
    supplierRoute.addChildren([
      listSupplierRoute,
      newSupplierRoute,
      viewSuppliertRoute
    ]),
    projectRoute.addChildren([
      listProjectRoute,
      createProjectRoute,
      viewProjectRoute
    ])
  ]),
  PhysicalSupplierRoute.addChildren([
    listPhysicalSuppliers
  ]),
  legalSupplierRoute.addChildren([
    listLegalSuppliers
  ])
  
]);
