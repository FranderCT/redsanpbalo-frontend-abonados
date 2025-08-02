
import { createRoute } from "@tanstack/react-router";

import AuthLayout from "../Layouts/AuthLayout";
import { rootRoute } from "../../../routes";
import RegisterAbonados from "../Pages/RegisterAbonados";
import LoginUser from "../Pages/LoginUser";
import ForgotPassword from "../Pages/ForgotPassword";


export const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "auth", 
  component: AuthLayout,
});

// /auth/register-abonado
export const registerAbonadoRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "register-abonado", 
  component: RegisterAbonados,
});

export const loginRoute = createRoute({
   getParentRoute: () => authRoute,
   path: "login",
   component: LoginUser,
})

// /auth/register-user
// export const registerUserRoute = createRoute({
//   getParentRoute: () => authRoute,
//   path: "register-user", 
//   component: RegisterUser,
// });

export const forgotPasswordRoute = createRoute({
   getParentRoute: () => authRoute,
   path: "forgotPassword",
   component: ForgotPassword,
})