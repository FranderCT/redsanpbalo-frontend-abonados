import apiAxios from "../../../api/apiConfig";
import type { auth } from "../Models/Auth";
import type { AuthResponse } from "../Models/AuthResponse";
import type { RegisterUser } from "../Models/RegisterUser";
import type { ResetPassword } from "../Models/ResetPassword";


export async function createUser(user: RegisterUser): Promise<RegisterUser> {
  const response = await apiAxios.post<RegisterUser>(`/auth/register`, user);
  return response.data;
}

export async function Login (Auth: auth): Promise<AuthResponse> {
  const response = await apiAxios.post<AuthResponse>(`/auth/login`, Auth);
  return response.data;
}

export async function ResetPasswd(Reset : ResetPassword): Promise<ResetPassword> {
  const res = await apiAxios.put<ResetPassword>(`/auth/reset-password`, Reset);
  return res.data;
}