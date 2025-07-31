
import { createRoute } from "@tanstack/react-router";

import AuthLayout from "../Layouts/AuthLayout";
import { rootRoute } from "../../../routes";
import RegisterAbonados from "../Components/RegisterAbonados";
import LoginUser from "../Components/LoginUser";


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