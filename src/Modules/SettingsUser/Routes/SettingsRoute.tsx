// import { createRoute, Outlet, redirect } from "@tanstack/react-router";
// import { rootRoute } from "../../../Routes";
// import DashboardLayout from "../../Dashboard/Layouts/DashboardLayout";
// import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";
// import EditEmailUser from "../Components/EditEmailUser";

// export const settingsRoute = createRoute({
//   getParentRoute: () => dashboardRoute,
//   path: "settings",
//   component: () => <Outlet />,
// });

// export const changeEmailRoute = createRoute({
//   getParentRoute : () => settingsRoute,
//   path : 'change-email',
//   component: EditEmailUser,
// })

// // export const settingsIndexRoute = createRoute({
// //   getParentRoute: () => settingsRoute,
// //   path: "/",                    
// //   component: () => <h1>Ajustes</h1>,
// // });