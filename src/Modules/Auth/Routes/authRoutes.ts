
import { createRoute } from "@tanstack/react-router";

import AuthLayout from "../Layouts/AuthLayout";
import { rootRoute } from "../../../routes";

import RegisterPrueba from "../Components/RegisterPrueba";
import LoginPrueba from "../Components/Login";


export const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "auth", 
  component: AuthLayout,
});

// /auth/register-abonado
export const registerAbonadoRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "register-abonado", 
  component: RegisterPrueba,
});

export const loginRoute = createRoute({
   getParentRoute: () => authRoute,
   path: "login",
   component: LoginPrueba,
})

// /auth/register-user
// export const registerUserRoute = createRoute({
//   getParentRoute: () => authRoute,
//   path: "register-user", 
//   component: RegisterUser,
// });