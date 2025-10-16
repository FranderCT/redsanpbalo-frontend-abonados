import apiAxios from "../../../api/apiConfig";
import type { User } from "../../Users/Models/User";
import type { auth } from "../Models/Auth";
import type { AuthResponse } from "../Models/AuthResponse";
import type { changePassword } from "../Models/changePassword";
import type { ForgotPassword, ForgotPasswordResponse } from "../Models/ForgotPassword";
import type { createAdminUser, RegisterUser } from "../Models/RegisterUser";
import type { ResetPassword } from "../Models/ResetPassword";

const BASE = "/auth";

export async function createUser(user: RegisterUser): Promise<RegisterUser> {
  const response = await apiAxios.post<RegisterUser>(`${BASE}/register`, user);
  return response.data;
}

export async function createAdminUser(user: createAdminUser): Promise<User> {
  const response = await apiAxios.post<User>(`${BASE}/admin/create-user`, user);
  return response.data;
}

export async function Login (Auth: auth): Promise<AuthResponse> {
  const response = await apiAxios.post<AuthResponse>(`${BASE}/login`, Auth);
  return response.data;
}

export async function ResetPasswd(payload: ResetPassword, token: string): Promise<void> {
  await apiAxios.put(`${BASE}/reset-password`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function ChangePasswd (payload: changePassword, token: string): Promise<void>{
  await apiAxios.put(`${BASE}/change-password`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function ForgotPasswd(payload : ForgotPassword) : Promise<ForgotPasswordResponse>{
  const res = await apiAxios.post<ForgotPasswordResponse>(`${BASE}/forgot-password`, payload);
  return res.data;
}

export type ValidateResponse = {
  valid: boolean,
  user: User
};

export async function ValidateToken(token: string): Promise<ValidateResponse> {
  const { data } = await apiAxios.get<ValidateResponse>(`/auth/validate`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}