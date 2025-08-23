
import { createRoute, Outlet } from "@tanstack/react-router";
import { rootRoute } from "../../../Routes";
import RegisterAbonados from "../Pages/RegisterAbonados";
import LoginUser from "../Pages/LoginUser";
import ForgotPassword from "../Pages/ForgotPassword";
import ResetPassword from "../Pages/ResetPassword";
import AuthLayout from "../Layouts/AuthLayout";


export const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "auth", 
  component: AuthLayout
});

export const indexAuthRoute = createRoute({
  getParentRoute : () => authRoute,
  path : '/',
  component : () => <div>hola mundo</div>
})

// /auth/register-abonado
export const registerAbonadoRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "register", 
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

export const resetPasswordRoute = createRoute({
  getParentRoute: () => authRoute,
  path : 'reset-password',
  component: ResetPassword
})