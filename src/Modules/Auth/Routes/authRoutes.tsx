
// import { createRoute } from "@tanstack/react-router";
// import { rootRoute } from "../../../Routes";
// import RegisterAbonados from "../Pages/RegisterAbonados";
// import LoginUser from "../Pages/LoginUser";
// import ForgotPassword from "../Pages/ForgotPassword";
// import ResetPassword from "../Pages/ResetPassword";
// import AuthLayout from "../Layouts/AuthLayout";
// import ChangePassword from "../Pages/ChangePassword";
// import EditEmailUser from "../../SettingsUser/Components/EditEmailUser";

import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../../Routes";
import { ForgotPasswd, Login } from "../Services/AuthServices";
import LoginUser from "../Pages/LoginUser";
import ForgotPassword from "../Pages/ForgotPassword";


// export const authRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: "auth", 
//   component: AuthLayout
// });

// // /auth/register-abonado
// export const registerAbonadoRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: "register", 
//   component: RegisterAbonados,
// });

// export const loginRoute = createRoute({
//    getParentRoute: () => rootRoute,
//    path: "login",
//    component: LoginUser,
// })

// // /auth/register-user
// // export const registerUserRoute = createRoute({
// //   getParentRoute: () => authRoute,
// //   path: "register-user", 
// //   component: RegisterUser,
// // });

// export const forgotPasswordRoute = createRoute({
//   getParentRoute: () => authRoute,
//   path: "forgot-password",
//   component: ForgotPassword,
// })

// export const resetPasswordRoute = createRoute({
//   getParentRoute: () => authRoute,
//   path : 'reset-password',
//   component: ResetPassword
// })

// export const changePasswordRoute = createRoute({
//   getParentRoute: () => authRoute,
//   path : 'change-password',
//   component: ChangePassword
// })


export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path : 'login',
  component: LoginUser
})

export const registerRoute = createRoute({
  getParentRoute:()=>rooRoute

  path:})

export const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path : 'forgot-password',
  component: ForgotPassword
})

