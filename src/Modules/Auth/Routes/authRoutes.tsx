
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../../Routes";
import LoginUser from "../Pages/LoginUser";
import ForgotPassword from "../Pages/ForgotPassword";
import RegisterAbonados from "../Pages/RegisterAbonados";
import ResetPassword from "../Pages/ResetPassword";


export const loginRoute = createRoute({
  getParentRoute : () => rootRoute,
  path : 'login',
  component: LoginUser
})

export const registerRoute = createRoute({
  getParentRoute:() => rootRoute,
  path: 'register',
  component: RegisterAbonados
})

export const forgotPasswordRoute = createRoute({
  getParentRoute: ()=> rootRoute,
  path : 'forgot-password',
  component: ForgotPassword
})

export const resetPasswordRoute = createRoute({
  getParentRoute: ()=> rootRoute,
  path: 'reset-password',
  component: ResetPassword
})


