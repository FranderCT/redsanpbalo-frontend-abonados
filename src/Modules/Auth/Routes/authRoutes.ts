
import { createRoute } from "@tanstack/react-router";
import RegisterAbonados from "../Components/RegisterAbonados";
import AuthLayout from "../Layouts/AuthLayout";
import { rootRoute } from "../../../routes";
import RegisterUser from "../Components/RegisterUser";


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
// /auth/register-user
export const registerUserRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "register-user", 
  component: RegisterUser,
});